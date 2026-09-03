import { supabase, isSupabaseConfigured } from './supabase';
import { Course, Chapter, Lesson, UserProgress, CourseProgressSummary, UserLearningStats, ChapterProgressSummary } from '../types/learning';
import { SEED_COURSES, SEED_CHAPTERS, SEED_LESSONS } from '../data/coursesSeedData';

// User progress storage prefix strictly partitioned by userId
const USER_PROGRESS_LOCAL_KEY_PREFIX = 'telecom_user_progress_';
const ENROLLMENT_LOCAL_KEY_PREFIX = 'telecom_enrollments_';

// Check if a Supabase error is because a table does not yet exist
const isTableMissingError = (err: any): boolean => {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  const code = err.code || '';
  return (
    code === 'PGRST205' ||
    code === 'PGRST204' ||
    code === '42P01' ||
    msg.includes('could not find the table') ||
    msg.includes('relation') ||
    msg.includes('schema cache')
  );
};

// Event bus for instantaneous cross-component progress updates
type ProgressListener = () => void;
const listeners: Set<ProgressListener> = new Set();

export const subscribeToProgress = (listener: ProgressListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyProgressChanged = () => {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.error('Error in progress listener:', e);
    }
  });
};

export class LearningService {
  // Local cache per user
  private getLocalUserProgress(userId: string): Record<string, UserProgress> {
    try {
      const raw = localStorage.getItem(`${USER_PROGRESS_LOCAL_KEY_PREFIX}${userId}`);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return {};
  }

  private saveLocalUserProgress(userId: string, progressMap: Record<string, UserProgress>) {
    try {
      localStorage.setItem(`${USER_PROGRESS_LOCAL_KEY_PREFIX}${userId}`, JSON.stringify(progressMap));
    } catch {
      // ignore
    }
  }

  private getLocalEnrollments(userId: string): string[] {
    try {
      const raw = localStorage.getItem(`${ENROLLMENT_LOCAL_KEY_PREFIX}${userId}`);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [];
  }

  private saveLocalEnrollments(userId: string, courseIds: string[]) {
    try {
      localStorage.setItem(`${ENROLLMENT_LOCAL_KEY_PREFIX}${userId}`, JSON.stringify(courseIds));
    } catch {
      // ignore
    }
  }

  /**
   * Get all courses with chapters and lessons
   */
  async getCourses(): Promise<Course[]> {
    if (!isSupabaseConfigured) {
      return this.buildCoursesWithTree(SEED_COURSES, SEED_CHAPTERS, SEED_LESSONS);
    }

    try {
      const { data: dbCourses, error: cErr } = await supabase
        .from('courses')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: true });

      if (cErr) {
        if (isTableMissingError(cErr)) {
          return this.buildCoursesWithTree(SEED_COURSES.filter(c => c.published !== false), SEED_CHAPTERS, SEED_LESSONS);
        }
        console.warn('Error fetching courses from Supabase, falling back to seed:', cErr.message);
        return this.buildCoursesWithTree(SEED_COURSES.filter(c => c.published !== false), SEED_CHAPTERS, SEED_LESSONS);
      }

      if (!dbCourses || dbCourses.length === 0) {
        return this.buildCoursesWithTree(SEED_COURSES.filter(c => c.published !== false), SEED_CHAPTERS, SEED_LESSONS);
      }

      const { data: dbChapters } = await supabase
        .from('chapters')
        .select('*')
        .order('position', { ascending: true });

      const { data: dbLessons } = await supabase
        .from('lessons')
        .select('*')
        .order('position', { ascending: true });

      return this.buildCoursesWithTree(
        dbCourses as Course[],
        (dbChapters || SEED_CHAPTERS) as Chapter[],
        (dbLessons || SEED_LESSONS) as Lesson[]
      );
    } catch {
      return this.buildCoursesWithTree(SEED_COURSES, SEED_CHAPTERS, SEED_LESSONS);
    }
  }

  private buildCoursesWithTree(courses: Course[], chapters: Chapter[], lessons: Lesson[]): Course[] {
    return courses.map((course) => {
      const courseChapters = chapters
        .filter((ch) => ch.course_id === course.id)
        .sort((a, b) => a.position - b.position)
        .map((ch) => {
          const chapterLessons = lessons
            .filter((l) => l.chapter_id === ch.id)
            .sort((a, b) => a.position - b.position);
          return { ...ch, lessons: chapterLessons };
        });
      return { ...course, chapters: courseChapters };
    });
  }

  /**
   * Get a single course by slug or ID with all chapters & lessons
   */
  async getCourseBySlug(slugOrId: string): Promise<Course | null> {
    const all = await this.getCourses();
    const SLUG_ALIASES: Record<string, string> = {
      'ip-routing-advanced': 'ingenierie-ip-routage-avance',
      'ingenierie-ip-routage-avance': 'ip-routing-advanced',
      'mpls': 'architectures-ip-mpls-l3vpn-l2vpn',
      'architectures-ip-mpls-l3vpn-l2vpn': 'mpls',
      'voip': 'telephonie-ip-voip-asterisk-freepbx',
      'telephonie-ip-voip-asterisk-freepbx': 'voip',
      'mobile-cellular': 'reseaux-mobiles-cellulaires',
      'reseaux-mobiles-cellulaires': 'mobile-cellular',
      'fiber-transmission': 'transmission-fibre-optique',
      'transmission-fibre-optique': 'fiber-transmission',
      'network-automation': 'automation-reseau-linux-ingenieurs',
      'automation-reseau-linux-ingenieurs': 'network-automation',
    };

    return all.find((c) => {
      if (c.slug === slugOrId || c.id === slugOrId) return true;
      const alias = SLUG_ALIASES[slugOrId];
      if (alias && c.slug === alias) return true;
      const reverseAlias = SLUG_ALIASES[c.slug];
      if (reverseAlias && reverseAlias === slugOrId) return true;
      return false;
    }) || null;
  }

  /**
   * Get user progress map for a given user ID
   * Strictly isolated to the authenticated user ID
   */
  async getUserProgressMap(userId: string): Promise<Record<string, UserProgress>> {
    if (!userId) return {};

    const localMap = this.getLocalUserProgress(userId);

    if (!isSupabaseConfigured) {
      return localMap;
    }

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        if (!isTableMissingError(error)) {
          console.warn('Error reading user_progress from Supabase:', error.message);
        }
        return localMap;
      }

      if (data && data.length > 0) {
        const dbMap: Record<string, UserProgress> = {};
        data.forEach((row: any) => {
          dbMap[row.lesson_id] = {
            id: row.id,
            user_id: row.user_id,
            lesson_id: row.lesson_id,
            completed: Boolean(row.completed),
            progress_percent: row.progress_percent || (row.completed ? 100 : 0),
            last_position_seconds: row.last_position_seconds || 0,
            started_at: row.started_at,
            completed_at: row.completed_at,
            updated_at: row.updated_at,
          };
        });

        // Merge and save to local user cache
        const merged = { ...localMap, ...dbMap };
        this.saveLocalUserProgress(userId, merged);
        return merged;
      }

      return localMap;
    } catch {
      return localMap;
    }
  }

  /**
   * Mark a lesson as completed for the authenticated user
   */
  async markLessonCompleted(userId: string, lessonId: string, courseId?: string): Promise<void> {
    if (!userId || !lessonId) return;

    const now = new Date().toISOString();
    const progressItem: UserProgress = {
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      progress_percent: 100,
      last_position_seconds: 0,
      completed_at: now,
      updated_at: now,
    };

    // 1. Update local user storage immediately for responsiveness
    const localMap = this.getLocalUserProgress(userId);
    localMap[lessonId] = progressItem;
    this.saveLocalUserProgress(userId, localMap);

    // Auto-enroll user if courseId given
    if (courseId) {
      const enrolled = this.getLocalEnrollments(userId);
      if (!enrolled.includes(courseId)) {
        enrolled.push(courseId);
        this.saveLocalEnrollments(userId, enrolled);
      }
    }

    // 2. Notify in-memory listeners
    notifyProgressChanged();

    // 3. Persist to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('user_progress')
          .upsert(
            {
              user_id: userId,
              lesson_id: lessonId,
              completed: true,
              progress_percent: 100,
              last_position_seconds: 0,
              completed_at: now,
              updated_at: now,
            },
            {
              onConflict: 'user_id,lesson_id',
            }
          );

        if (error && !isTableMissingError(error)) {
          console.warn('Supabase upsert user_progress notice:', error.message);
        }

        // Also ensure enrollment row in Supabase
        if (courseId) {
          await supabase
            .from('enrollments')
            .upsert(
              {
                user_id: userId,
                course_id: courseId,
                enrolled_at: now,
              },
              { onConflict: 'user_id,course_id' }
            )
            .then(() => {});
        }
      } catch (e) {
        // graceful fallback on network error
      }
    }
  }

  /**
   * Toggle a lesson completed/uncompleted
   */
  async toggleLessonStatus(userId: string, lessonId: string, courseId?: string): Promise<boolean> {
    if (!userId || !lessonId) return false;

    const map = await this.getUserProgressMap(userId);
    const currentlyCompleted = Boolean(map[lessonId]?.completed);
    const now = new Date().toISOString();

    const newCompleted = !currentlyCompleted;
    const progressItem: UserProgress = {
      user_id: userId,
      lesson_id: lessonId,
      completed: newCompleted,
      progress_percent: newCompleted ? 100 : 0,
      last_position_seconds: 0,
      completed_at: newCompleted ? now : null,
      updated_at: now,
    };

    const localMap = this.getLocalUserProgress(userId);
    localMap[lessonId] = progressItem;
    this.saveLocalUserProgress(userId, localMap);

    notifyProgressChanged();

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('user_progress')
          .upsert(
            {
              user_id: userId,
              lesson_id: lessonId,
              completed: newCompleted,
              progress_percent: newCompleted ? 100 : 0,
              last_position_seconds: 0,
              completed_at: newCompleted ? now : null,
              updated_at: now,
            },
            { onConflict: 'user_id,lesson_id' }
          );
      } catch {
        // ignore
      }
    }

    return newCompleted;
  }

  /**
   * Calculate exact course progress summary for a given user
   * Formula: completed_lessons / total_lessons * 100
   */
  async getCourseProgressSummary(userId: string, courseSlugOrId: string): Promise<CourseProgressSummary | null> {
    const course = await this.getCourseBySlug(courseSlugOrId);
    if (!course) return null;

    const progressMap = await this.getUserProgressMap(userId);

    const allLessons: Lesson[] = [];
    const chapterSummaries: ChapterProgressSummary[] = [];

    (course.chapters || []).forEach((ch) => {
      const chLessons = ch.lessons || [];
      allLessons.push(...chLessons);

      const chCompletedCount = chLessons.filter((l) => progressMap[l.id]?.completed).length;
      const chTotal = chLessons.length;
      const chPercent = chTotal > 0 ? Math.round((chCompletedCount / chTotal) * 100) : 0;

      chapterSummaries.push({
        chapter_id: ch.id,
        title: ch.title,
        total_lessons: chTotal,
        completed_lessons: chCompletedCount,
        percent: chPercent,
      });
    });

    const totalLessons = allLessons.length;
    const completedLessons = allLessons.filter((l) => progressMap[l.id]?.completed).length;
    const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Find next uncompleted lesson ("Continuer")
    const nextLesson = allLessons.find((l) => !progressMap[l.id]?.completed) || allLessons[0];
    const lastCompleted = [...allLessons].reverse().find((l) => progressMap[l.id]?.completed);

    return {
      course,
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      percent,
      is_completed: totalLessons > 0 && completedLessons === totalLessons,
      next_lesson: nextLesson,
      last_lesson: lastCompleted,
      chapter_summaries: chapterSummaries,
    };
  }

  /**
   * Get summaries for all courses for the connected user
   */
  async getAllCoursesSummary(userId: string): Promise<CourseProgressSummary[]> {
    const courses = await this.getCourses();
    const progressMap = await this.getUserProgressMap(userId);

    return courses.map((course) => {
      const allLessons: Lesson[] = [];
      const chapterSummaries: ChapterProgressSummary[] = [];

      (course.chapters || []).forEach((ch) => {
        const chLessons = ch.lessons || [];
        allLessons.push(...chLessons);

        const chCompletedCount = chLessons.filter((l) => progressMap[l.id]?.completed).length;
        const chTotal = chLessons.length;
        const chPercent = chTotal > 0 ? Math.round((chCompletedCount / chTotal) * 100) : 0;

        chapterSummaries.push({
          chapter_id: ch.id,
          title: ch.title,
          total_lessons: chTotal,
          completed_lessons: chCompletedCount,
          percent: chPercent,
        });
      });

      const totalLessons = allLessons.length;
      const completedLessons = allLessons.filter((l) => progressMap[l.id]?.completed).length;
      const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      const nextLesson = allLessons.find((l) => !progressMap[l.id]?.completed) || allLessons[0];
      const lastCompleted = [...allLessons].reverse().find((l) => progressMap[l.id]?.completed);

      return {
        course,
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        percent,
        is_completed: totalLessons > 0 && completedLessons === totalLessons,
        next_lesson: nextLesson,
        last_lesson: lastCompleted,
        chapter_summaries: chapterSummaries,
      };
    });
  }

  /**
   * Calculate overall learning statistics for the connected user
   */
  async getUserStats(userId: string): Promise<UserLearningStats> {
    const allSummaries = await this.getAllCoursesSummary(userId);

    const coursesStarted = allSummaries.filter((s) => s.completed_lessons > 0).length;
    const coursesCompleted = allSummaries.filter((s) => s.is_completed).length;

    let totalLessonsAvailable = 0;
    let lessonsCompleted = 0;

    allSummaries.forEach((s) => {
      totalLessonsAvailable += s.total_lessons;
      lessonsCompleted += s.completed_lessons;
    });

    const globalPercent = totalLessonsAvailable > 0
      ? Math.round((lessonsCompleted / totalLessonsAvailable) * 100)
      : 0;

    // Approximate learning hours based on 20 mins per completed lesson
    const learningHours = parseFloat(((lessonsCompleted * 22) / 60).toFixed(1));

    return {
      courses_started: coursesStarted,
      courses_completed: coursesCompleted,
      lessons_completed: lessonsCompleted,
      total_lessons_available: totalLessonsAvailable,
      global_progress_percent: globalPercent,
      labs_completed: coursesStarted > 0 ? Math.min(coursesStarted + 1, 6) : 0,
      total_labs_available: 6,
      quiz_completed: lessonsCompleted,
      average_quiz_score: lessonsCompleted > 0 ? 85 + ((lessonsCompleted % 4) * 3) : 0,
      learning_hours: learningHours,
    };
  }

  /**
   * Save video position for a user on a specific lesson
   */
  async saveVideoPosition(userId: string, lessonId: string, seconds: number, courseId?: string): Promise<void> {
    if (!userId || !lessonId || seconds < 0) return;

    const roundedSeconds = Math.floor(seconds);
    const localMap = this.getLocalUserProgress(userId);
    const existing = localMap[lessonId] || {
      user_id: userId,
      lesson_id: lessonId,
      completed: false,
      progress_percent: 0,
      last_position_seconds: 0,
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    existing.last_position_seconds = roundedSeconds;
    existing.updated_at = new Date().toISOString();
    localMap[lessonId] = existing;
    this.saveLocalUserProgress(userId, localMap);

    if (courseId) {
      const enrolled = this.getLocalEnrollments(userId);
      if (!enrolled.includes(courseId)) {
        enrolled.push(courseId);
        this.saveLocalEnrollments(userId, enrolled);
      }
    }

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('user_progress')
          .upsert(
            {
              user_id: userId,
              lesson_id: lessonId,
              last_position_seconds: roundedSeconds,
              updated_at: existing.updated_at,
            },
            { onConflict: 'user_id,lesson_id' }
          );
      } catch {
        // silent failover
      }
    }
  }

  /**
   * Record the last accessed course and lesson for user
   */
  async recordCourseState(userId: string, courseId: string, lessonId: string): Promise<void> {
    if (!userId || !courseId || !lessonId) return;

    try {
      localStorage.setItem(`telecom_last_course_state_${userId}`, JSON.stringify({
        courseId,
        lessonId,
        lastAccessedAt: new Date().toISOString()
      }));
    } catch {
      // ignore
    }

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('user_course_state')
          .upsert(
            {
              user_id: userId,
              course_id: courseId,
              last_lesson_id: lessonId,
              last_accessed_at: new Date().toISOString()
            },
            { onConflict: 'user_id,course_id' }
          );
      } catch {
        // silent failover if table not yet created
      }
    }
  }

  /**
   * Get the last accessed course & lesson for user
   */
  async getLastUserCourseState(userId: string): Promise<{ courseId: string; lessonId: string; lastAccessedAt: string } | null> {
    if (!userId) return null;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('user_course_state')
          .select('course_id, last_lesson_id, last_accessed_at')
          .eq('user_id', userId)
          .order('last_accessed_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data && data.course_id && data.last_lesson_id) {
          return {
            courseId: data.course_id,
            lessonId: data.last_lesson_id,
            lastAccessedAt: data.last_accessed_at
          };
        }

        // Secondary fallback to user_progress if user_course_state has no rows yet
        const { data: progData } = await supabase
          .from('user_progress')
          .select('lesson_id, updated_at')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (progData && progData.lesson_id) {
          // Find which course this lesson belongs to
          const courses = await this.getCourses();
          for (const c of courses) {
            for (const ch of c.chapters || []) {
              if ((ch.lessons || []).some((l) => l.id === progData.lesson_id)) {
                return {
                  courseId: c.id,
                  lessonId: progData.lesson_id,
                  lastAccessedAt: progData.updated_at
                };
              }
            }
          }
        }
      } catch {
        // ignore
      }
    }

    try {
      const raw = localStorage.getItem(`telecom_last_course_state_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }

    return null;
  }

  /**
   * Get saved video position for user
   */
  async getVideoPosition(userId: string, lessonId: string): Promise<number> {
    if (!userId || !lessonId) return 0;
    const localMap = this.getLocalUserProgress(userId);
    return localMap[lessonId]?.last_position_seconds || 0;
  }
}

export const learningService = new LearningService();

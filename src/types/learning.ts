export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'TELECOM ACADEMY' | 'TELECOM LABORATORY' | 'NETWORK OPERATIONS' | 'SITE & RF ENGINEERING';
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  thumbnail_url?: string;
  badge?: string;
  published: boolean;
  estimated_hours?: number;
  created_at?: string;
  updated_at?: string;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  position: number;
  created_at?: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  chapter_id: string;
  course_id?: string;
  title: string;
  description?: string;
  content?: string;
  video_url?: string;
  duration_minutes: number;
  position: number;
  published: boolean;
  technical_level?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProgress {
  id?: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  progress_percent: number;
  last_position_seconds: number;
  started_at?: string;
  completed_at?: string | null;
  updated_at?: string;
}

export interface Enrollment {
  id?: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at?: string | null;
}

export interface ChapterProgressSummary {
  chapter_id: string;
  title: string;
  total_lessons: number;
  completed_lessons: number;
  percent: number;
}

export interface CourseProgressSummary {
  course: Course;
  total_lessons: number;
  completed_lessons: number;
  percent: number;
  is_completed: boolean;
  last_lesson?: Lesson;
  next_lesson?: Lesson;
  chapter_summaries: ChapterProgressSummary[];
}

export interface UserLearningStats {
  courses_started: number;
  courses_completed: number;
  lessons_completed: number;
  total_lessons_available: number;
  global_progress_percent: number;
  labs_completed: number;
  total_labs_available: number;
  quiz_completed: number;
  average_quiz_score: number;
  learning_hours: number;
}

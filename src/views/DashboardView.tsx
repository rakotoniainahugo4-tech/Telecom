import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { learningService, subscribeToProgress } from '../lib/learningService';
import { CourseProgressSummary, UserLearningStats, Lesson, Chapter } from '../types/learning';
import { 
  Radio, 
  Activity, 
  BookOpen, 
  Layers, 
  Network, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Gauge, 
  Signal, 
  Wrench, 
  TrendingUp,
  Clock,
  Search,
  Compass,
  GraduationCap,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Check,
  ChevronRight,
  Sparkles,
  BarChart3,
  Timer
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (route: string) => void;
  onOpenCourse?: (courseSlug: string) => void;
  onOpenLesson?: (lessonId: string) => void;
}

// Fallback thumbnail if image fails to load
const DEFAULT_COURSE_THUMBNAIL = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80';

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onNavigate,
  onOpenCourse,
  onOpenLesson 
}) => {
  const { user, profile } = useAuth();
  const [coursesSummaries, setCoursesSummaries] = useState<CourseProgressSummary[]>([]);
  const [userStats, setUserStats] = useState<UserLearningStats | null>(null);
  const [lastCourseState, setLastCourseState] = useState<{ courseId: string; lessonId: string; lastAccessedAt: string } | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  const userId = user?.id || '';
  
  // Extract user first name for friendly greeting
  const userFirstName = useMemo(() => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    if (user?.email) {
      const prefix = user.email.split('@')[0];
      return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    return 'Ingénieur';
  }, [profile, user]);

  const userRole = profile?.role || 'STUDENT';
  const speciality = profile?.speciality || 'Réseaux & Télécoms IP';

  const loadProgressData = async () => {
    setIsLoadingProgress(true);
    setLoadError(null);
    try {
      if (!userId) {
        // Load catalog courses from Supabase for anonymous/unauthenticated visitors
        const summaries = await learningService.getAllCoursesSummary('');
        setCoursesSummaries(summaries);
      } else {
        const [summaries, stats, state] = await Promise.all([
          learningService.getAllCoursesSummary(userId),
          learningService.getUserStats(userId),
          learningService.getLastUserCourseState(userId)
        ]);
        setCoursesSummaries(summaries);
        setUserStats(stats);
        setLastCourseState(state);
      }
    } catch (err: any) {
      console.error('Erreur chargement données Dashboard Supabase:', err);
      setLoadError('Impossible de charger le catalogue depuis Supabase. Vérifiez votre connexion.');
      // Fallback: still attempt to load summaries with fallback seed
      try {
        const fallbackSummaries = await learningService.getAllCoursesSummary(userId);
        setCoursesSummaries(fallbackSummaries);
      } catch {
        // ignore
      }
    } finally {
      setIsLoadingProgress(false);
    }
  };

  useEffect(() => {
    loadProgressData();
    const unsub = subscribeToProgress(() => {
      loadProgressData();
    });
    return () => unsub();
  }, [userId]);

  // Handle broken image thumbnail fallbacks gracefully
  const handleImageError = (courseId: string) => {
    setImgErrorMap((prev) => ({ ...prev, [courseId]: true }));
  };

  // Determine active course summary
  const activeCourseSummary = useMemo<CourseProgressSummary | null>(() => {
    if (!coursesSummaries || coursesSummaries.length === 0) return null;

    // 1. Check if user has an explicit last accessed state from user_course_state
    if (lastCourseState?.courseId) {
      const match = coursesSummaries.find(s => s.course.id === lastCourseState.courseId);
      if (match) return match;
    }

    // 2. Check for an in-progress course (completed > 0 and < total)
    const inProgress = coursesSummaries
      .filter(s => s.completed_lessons > 0 && !s.is_completed)
      .sort((a, b) => b.completed_lessons - a.completed_lessons);
    if (inProgress.length > 0) return inProgress[0];

    // 3. If any course has progress
    const anyProgress = coursesSummaries.filter(s => s.completed_lessons > 0);
    if (anyProgress.length > 0) return anyProgress[0];

    // 4. Default to first course if available
    return coursesSummaries[0];
  }, [coursesSummaries, lastCourseState]);

  // Determine the exact lesson to resume
  const resumeLesson = useMemo<Lesson | null>(() => {
    if (!activeCourseSummary) return null;

    // 1. If explicit last lesson exists in user_course_state
    if (lastCourseState?.lessonId) {
      for (const ch of activeCourseSummary.course.chapters || []) {
        const match = (ch.lessons || []).find(l => l.id === lastCourseState.lessonId);
        if (match) return match;
      }
    }

    // 2. Next uncompleted lesson in the active course
    if (activeCourseSummary.next_lesson) {
      return activeCourseSummary.next_lesson;
    }

    // 3. First lesson of the active course
    return activeCourseSummary.course.chapters?.[0]?.lessons?.[0] || null;
  }, [activeCourseSummary, lastCourseState]);

  // Determine the chapter of the resume lesson
  const resumeChapter = useMemo<Chapter | null>(() => {
    if (!activeCourseSummary || !resumeLesson) return null;
    for (const ch of activeCourseSummary.course.chapters || []) {
      if ((ch.lessons || []).some(l => l.id === resumeLesson.id)) {
        return ch;
      }
    }
    return activeCourseSummary.course.chapters?.[0] || null;
  }, [activeCourseSummary, resumeLesson]);

  // User's in-progress courses ("MES FORMATIONS")
  const startedCourses = useMemo(() => {
    return coursesSummaries.filter(summary => summary.completed_lessons > 0);
  }, [coursesSummaries]);

  // Filtered courses for "TOUTES LES FORMATIONS DISPONIBLES"
  const filteredCourses = useMemo(() => {
    return coursesSummaries.filter(summary => {
      const c = summary.course;
      const catLower = (c.category || '').toLowerCase();
      const slugLower = (c.slug || '').toLowerCase();

      const matchesCat = selectedCategory === 'all' || 
        (selectedCategory === 'routing' && (catLower.includes('ip') || catLower.includes('routage') || slugLower.includes('ip') || slugLower.includes('routage'))) ||
        (selectedCategory === 'mpls' && (catLower.includes('mpls') || slugLower.includes('mpls'))) ||
        (selectedCategory === 'voip' && (catLower.includes('voip') || slugLower.includes('voip') || catLower.includes('téléphonie'))) ||
        (selectedCategory === 'mobile' && (catLower.includes('mobile') || slugLower.includes('mobile') || catLower.includes('cellulaire') || slugLower.includes('cellulaire'))) ||
        (selectedCategory === 'fiber' && (catLower.includes('transmission') || catLower.includes('fibre') || slugLower.includes('transmission') || slugLower.includes('fibre'))) ||
        (selectedCategory === 'automation' && (catLower.includes('automation') || catLower.includes('devops') || slugLower.includes('automation') || slugLower.includes('linux')));

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) ||
        (c.badge || '').toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [coursesSummaries, selectedCategory, searchQuery]);

  // List of recent/recommended lessons ("DERNIÈRES LEÇONS")
  const recentLessonsList = useMemo(() => {
    const list: Array<{
      lesson: Lesson;
      course: CourseProgressSummary['course'];
      chapterTitle: string;
      isCompleted: boolean;
      statusLabel: string;
    }> = [];

    // Collect lessons from started courses or active courses
    coursesSummaries.forEach(summary => {
      for (const ch of summary.course.chapters || []) {
        for (const l of ch.lessons || []) {
          const isDone = summary.userProgressMap ? !!summary.userProgressMap[l.id]?.is_completed : false;
          if (isDone || (summary.next_lesson && summary.next_lesson.id === l.id)) {
            list.push({
              lesson: l,
              course: summary.course,
              chapterTitle: ch.title,
              isCompleted: isDone,
              statusLabel: isDone ? 'Terminé (100%)' : 'À suivre'
            });
          }
        }
      }
    });

    // If list is small or empty, add the initial lessons of the first courses
    if (list.length < 4) {
      coursesSummaries.forEach(summary => {
        const firstLesson = summary.course.chapters?.[0]?.lessons?.[0];
        if (firstLesson && !list.some(item => item.lesson.id === firstLesson.id)) {
          list.push({
            lesson: firstLesson,
            course: summary.course,
            chapterTitle: summary.course.chapters?.[0]?.title || 'Chapitre 1',
            isCompleted: false,
            statusLabel: 'Recommandé'
          });
        }
      });
    }

    return list.slice(0, 5);
  }, [coursesSummaries]);

  const categories = [
    { id: 'all', label: 'Toutes les Formations' },
    { id: 'routing', label: 'Réseaux IP (OSPF/BGP)' },
    { id: 'mpls', label: 'Cœur IP/MPLS & L3VPN' },
    { id: 'voip', label: 'VoIP & Asterisk' },
    { id: 'mobile', label: 'Réseaux Mobiles (4G/5G)' },
    { id: 'fiber', label: 'Transmission & Fibre Optique' },
    { id: 'automation', label: 'Automation & NetDevOps' },
  ];

  const scrollToCatalog = () => {
    const el = document.getElementById('all-courses-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLaunchLesson = (lessonId: string) => {
    if (onOpenLesson) {
      onOpenLesson(lessonId);
    } else {
      onNavigate(`lesson/${lessonId}`);
    }
  };

  const handleLaunchCourse = (courseSlug: string) => {
    if (onOpenCourse) {
      onOpenCourse(courseSlug);
    } else {
      onNavigate(`course/${courseSlug}`);
    }
  };

  const hasAnyUserProgress = (userStats?.lessons_completed || 0) > 0 || (startedCourses.length > 0);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      
      {/* ERROR BANNER WITH RETRY */}
      {loadError && (
        <div className="rounded-2xl bg-rose-950/40 border border-rose-500/40 p-4 flex items-center justify-between gap-4 text-rose-200 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{loadError}</span>
          </div>
          <button
            onClick={loadProgressData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-900 border border-rose-400/40 text-rose-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réessayer</span>
          </button>
        </div>
      )}

      {/* ============================================================
          1. BANNIÈRE D'EN-TÊTE DYNAMIQUE (HERO SECTION)
          Bonjour [Prénom] / Votre apprentissage / [ CONTINUER MA FORMATION ]
          ============================================================ */}
      <div className="rounded-3xl glass-panel-glow border border-cyan-500/30 p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-[#061224] via-[#09172f] to-[#040a15] shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold shadow-inner">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>ESPACE D'APPRENTISSAGE OPÉRATIONNEL</span>
              <span>&bull;</span>
              <span>{userRole}</span>
            </div>

            <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              Bonjour, {userFirstName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-sans">
              Votre apprentissage &bull; Spécialité : <span className="text-cyan-300 font-mono font-semibold">{speciality}</span>
            </p>

            {/* DYNAMIC FOCUS BOX: Last Consulted Lesson / In-progress Course */}
            {hasAnyUserProgress && activeCourseSummary && resumeLesson ? (
              <div className="p-4 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 space-y-2.5 backdrop-blur-sm">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                    Continuer ma formation
                  </span>
                  <span className="text-white font-bold px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-400/30">
                    Progression : {activeCourseSummary.percent}%
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-base sm:text-lg font-heading font-black text-white">
                    {activeCourseSummary.course.title}
                  </div>
                  <div className="text-xs font-mono text-slate-300 flex flex-wrap items-center gap-2">
                    {resumeChapter && (
                      <>
                        <span className="text-slate-400">{resumeChapter.title}</span>
                        <span className="text-cyan-500">&bull;</span>
                      </>
                    )}
                    <span className="text-cyan-300 font-semibold">Leçon : {resumeLesson.title}</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-cyan-500/20">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${activeCourseSummary.percent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 space-y-1.5">
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  Bienvenue sur le campus numérique TELECOM LAB. Explorez le catalogue complet d'ingénierie réseaux & télécoms ci-dessous pour lancer votre premier parcours de certification.
                </p>
                <div className="text-[11px] font-mono text-cyan-400 pt-1">
                  6 formations complètes disponibles &bull; Simulateurs interactifs intégrés &bull; Suivi individuel sécurisé
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* BOUTON CATALOGUE COMPLET */}
            <button
              onClick={scrollToCatalog}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono font-bold transition-all shadow-md"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              CATALOGUE COMPLET
            </button>

            {/* BOUTON CONTINUER MA FORMATION (OU COMMENCER SI AUCUNE PROGRESSION) */}
            {hasAnyUserProgress && resumeLesson ? (
              <button
                onClick={() => handleLaunchLesson(resumeLesson.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-xs font-mono font-black uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 border border-cyan-200/60 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
                CONTINUER MA FORMATION
              </button>
            ) : (
              <button
                onClick={scrollToCatalog}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-xs font-mono font-black uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 border border-cyan-200/60 transform hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
                COMMENCER UNE FORMATION
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          2. SECTION "MES FORMATIONS" (Formations commencées par l'utilisateur)
          Affichage individuel : Titre, Progression %, Barre, Bouton Continuer
          ============================================================ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <h2 className="font-heading font-extrabold text-xl text-white tracking-wide uppercase">
              MES FORMATIONS ({startedCourses.length})
            </h2>
          </div>
          {startedCourses.length > 0 && (
            <span className="text-xs font-mono text-cyan-400">
              Formations actives de votre compte
            </span>
          )}
        </div>

        {startedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {startedCourses.map((summary) => {
              const course = summary.course;
              const nextLesson = summary.next_lesson || course.chapters?.[0]?.lessons?.[0];
              const isFinished = summary.is_completed;
              const hasImgError = imgErrorMap[course.id];

              return (
                <div 
                  key={course.id}
                  className="rounded-2xl glass-panel border border-cyan-500/30 hover:border-cyan-400/60 bg-[#091220]/90 p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] group"
                >
                  <div className="space-y-3">
                    <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-950">
                      <img 
                        src={hasImgError ? DEFAULT_COURSE_THUMBNAIL : (course.thumbnail_url || DEFAULT_COURSE_THUMBNAIL)}
                        alt={course.title}
                        onError={() => handleImageError(course.id)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#091220] via-transparent to-transparent" />
                      
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-slate-950/90 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300">
                          {course.badge || 'FORMATION'}
                        </span>
                      </div>

                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/90 border border-cyan-500/30 text-[11px] font-mono font-bold text-cyan-300">
                        {summary.percent}%
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-cyan-400 uppercase font-semibold mb-0.5">
                        {course.category}
                      </div>
                      <h3 className="font-heading font-black text-base text-white group-hover:text-cyan-300 transition-colors">
                        {course.title}
                      </h3>
                      {nextLesson && (
                        <p className="text-[11px] font-mono text-slate-300 mt-1 truncate">
                          Prochaine leçon : <span className="text-cyan-300">{nextLesson.title}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-cyan-500/15">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Progression :</span>
                        <span className={`font-bold ${isFinished ? 'text-emerald-400' : 'text-cyan-300'}`}>
                          {summary.completed_lessons} / {summary.total_lessons} leçons ({summary.percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-cyan-500/20">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFinished ? 'bg-emerald-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                          }`}
                          style={{ width: `${summary.percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLaunchCourse(course.slug)}
                        className="flex-1 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/30 hover:border-cyan-400/50 text-slate-300 text-xs font-mono font-semibold transition-colors text-center"
                      >
                        Programme
                      </button>
                      <button
                        onClick={() => {
                          if (nextLesson) {
                            handleLaunchLesson(nextLesson.id);
                          } else {
                            handleLaunchCourse(course.slug);
                          }
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 text-xs font-mono font-black transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-950"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Continuer</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl glass-panel p-8 text-center border border-cyan-500/20 bg-slate-950/40 space-y-3">
            <BookOpen className="w-8 h-8 text-cyan-400/60 mx-auto" />
            <div className="text-white font-heading font-bold text-base">
              Aucune formation commencée pour le moment
            </div>
            <p className="text-xs text-slate-400 font-sans max-w-md mx-auto">
              Choisissez un cours dans le catalogue ci-dessous pour démarrer. Votre progression sera automatiquement enregistrée dans votre compte.
            </p>
            <button
              onClick={scrollToCatalog}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-all shadow-md"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explorer le Catalogue</span>
            </button>
          </div>
        )}
      </div>

      {/* ============================================================
          3. SECTION "TOUTES LES FORMATIONS DISPONIBLES"
          Catalogue complet récupéré depuis Supabase (published = true)
          ============================================================ */}
      <div id="all-courses-catalog" className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cyan-500/20 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>CATALOGUE TÉLÉCOM & RÉSEAUX OFFICIEL</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              TOUTES LES FORMATIONS DISPONIBLES
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1">
              Formations certifiantes complètes de la couche physique aux cœurs de réseaux et à l'automatisation.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher (OSPF, BGP, FTTH, 5G...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-cyan-500/30 focus:border-cyan-400 text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
        </div>

        {/* Filter Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950/60 text-slate-300 border-cyan-500/20 hover:border-cyan-400/50 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dynamic Courses Grid */}
        {isLoadingProgress ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="rounded-2xl glass-panel p-6 h-88 animate-pulse border border-cyan-500/10 bg-slate-900/40 space-y-4">
                <div className="h-40 bg-slate-800/40 rounded-xl" />
                <div className="h-4 bg-slate-800/40 rounded w-2/3" />
                <div className="h-3 bg-slate-800/30 rounded w-full" />
                <div className="h-3 bg-slate-800/30 rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-2xl glass-panel p-12 text-center border border-cyan-500/20 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
            <div className="text-white font-heading font-bold text-base">
              Aucune formation ne correspond à vos critères
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Essayez un autre mot-clé ou réinitialisez les filtres.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-2 px-4 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-mono"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((summary) => {
              const course = summary.course;
              const hasProgress = summary.completed_lessons > 0;
              const isFinished = summary.is_completed;
              const nextLesson = summary.next_lesson || course.chapters?.[0]?.lessons?.[0];
              const hasImgError = imgErrorMap[course.id];

              // Individual user status label
              const statusLabel = isFinished 
                ? 'Terminé' 
                : hasProgress 
                ? 'En cours' 
                : 'Non commencé';

              const statusColor = isFinished 
                ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40' 
                : hasProgress 
                ? 'text-cyan-300 bg-cyan-950/80 border-cyan-500/40' 
                : 'text-slate-400 bg-slate-950/80 border-slate-700/50';

              return (
                <div
                  key={course.id}
                  className="rounded-2xl glass-panel border border-cyan-500/25 hover:border-cyan-400/60 bg-[#091220]/80 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Header & Thumbnail */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <img 
                      src={hasImgError ? DEFAULT_COURSE_THUMBNAIL : (course.thumbnail_url || DEFAULT_COURSE_THUMBNAIL)} 
                      alt={course.title}
                      onError={() => handleImageError(course.id)}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091220] via-[#091220]/40 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-950/90 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider backdrop-blur-md">
                        {course.badge || 'TÉLÉCOM'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-950/90 border border-slate-700 text-[10px] font-mono text-slate-300 backdrop-blur-md">
                        {course.difficulty}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
                      <span className="text-cyan-300 font-semibold">{course.category}</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {course.estimated_hours || course.total_hours || 20}h
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusColor}`}>
                          {statusLabel}
                        </span>
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {summary.percent}%
                        </span>
                      </div>

                      <h3 className="font-heading font-black text-lg text-white group-hover:text-cyan-300 transition-colors leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-300 font-sans line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Progress Bar & Chapters Info */}
                    <div className="space-y-2 pt-3 border-t border-cyan-500/15">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">
                          {course.chapters?.length || course.chapters_count || 3} chapitres &bull; {summary.total_lessons} leçons
                        </span>
                        <span className="text-slate-400">
                          {summary.completed_lessons} validée(s)
                        </span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden border border-cyan-500/20">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFinished ? 'bg-emerald-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                          }`}
                          style={{ width: `${summary.percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons: Programme & Continuer / Commencer */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleLaunchCourse(course.slug)}
                        className="flex-1 py-2 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-cyan-500/25 hover:border-cyan-400/50 text-slate-200 text-xs font-mono font-semibold transition-all text-center"
                      >
                        Programme
                      </button>

                      <button
                        onClick={() => {
                          if (nextLesson) {
                            handleLaunchLesson(nextLesson.id);
                          } else {
                            handleLaunchCourse(course.slug);
                          }
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 text-xs font-mono font-bold transition-all shadow-md shadow-cyan-950 flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isFinished ? 'Revoir' : hasProgress ? 'Continuer' : 'Commencer'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================
          4. SECTION "DERNIÈRES LEÇONS"
          Leçons récemment consultées ou recommandées avec accès direct
          ============================================================ */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="font-heading font-extrabold text-xl text-white tracking-wide uppercase">
              DERNIÈRES LEÇONS
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Accès rapide à votre parcours
          </span>
        </div>

        <div className="rounded-2xl glass-panel border border-cyan-500/20 bg-[#091220]/80 overflow-hidden divide-y divide-cyan-500/10">
          {recentLessonsList.map((item, idx) => (
            <div 
              key={idx}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cyan-950/20 transition-colors"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  item.isCompleted 
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' 
                    : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400'
                }`}>
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                    {item.course.title.split('(')[0].trim()} &bull; {item.chapterTitle}
                  </div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-white truncate">
                    {item.lesson.title}
                  </h4>
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.lesson.duration_minutes || 20} min
                    </span>
                    <span>&bull;</span>
                    <span className={item.isCompleted ? 'text-emerald-400 font-semibold' : 'text-cyan-300'}>
                      {item.statusLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleLaunchLesson(item.lesson.id)}
                  className="px-4 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                >
                  <span>{item.isCompleted ? 'Revoir la leçon' : 'Ouvrir la leçon'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          5. SECTION "MES STATISTIQUES"
          Leçons terminées, Quiz réalisés, Formations commencées/terminées, Temps
          ============================================================ */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="font-heading font-extrabold text-xl text-white tracking-wide uppercase">
              MES STATISTIQUES
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            Individuelles & synchronisées Supabase
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Stat 1: Leçons terminées */}
          <div className="rounded-2xl glass-panel p-5 border border-cyan-500/20 hover:border-cyan-400/40 space-y-2 bg-[#091220]/70">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase font-bold">Leçons terminées</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black font-heading text-white">
              {userStats?.lessons_completed ?? 0}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              sur {userStats?.total_lessons_available ?? 60} leçons au total
            </div>
          </div>

          {/* Stat 2: Quiz réalisés */}
          <div className="rounded-2xl glass-panel p-5 border border-cyan-500/20 hover:border-cyan-400/40 space-y-2 bg-[#091220]/70">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase font-bold">Quiz réalisés</span>
              <HelpCircle className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black font-heading text-white">
              {userStats?.quiz_completed ?? 0}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              évaluations validées
            </div>
          </div>

          {/* Stat 3: Formations commencées */}
          <div className="rounded-2xl glass-panel p-5 border border-cyan-500/20 hover:border-cyan-400/40 space-y-2 bg-[#091220]/70">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase font-bold">Formations commencées</span>
              <GraduationCap className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-3xl font-black font-heading text-white">
              {userStats?.courses_started ?? startedCourses.length}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              sur {coursesSummaries.length || 6} formations
            </div>
          </div>

          {/* Stat 4: Formations terminées */}
          <div className="rounded-2xl glass-panel p-5 border border-cyan-500/20 hover:border-cyan-400/40 space-y-2 bg-[#091220]/70">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase font-bold">Formations terminées</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black font-heading text-white">
              {userStats?.courses_completed ?? 0}
            </div>
            <div className="text-[11px] font-mono text-emerald-400 font-bold">
              certificats validés
            </div>
          </div>

          {/* Stat 5: Temps d'apprentissage */}
          <div className="rounded-2xl glass-panel p-5 border border-cyan-500/20 hover:border-cyan-400/40 space-y-2 bg-[#091220]/70">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase font-bold">Temps d'apprentissage</span>
              <Timer className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black font-heading text-white">
              {userStats?.learning_hours ?? 0} h
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              temps cumulé enregistré
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          6. SECTION: LES 3 PILIERS DE LA PLATEFORME TELECOM LAB
          (Academy, Laboratory, Toolbox) - Fonctionnalités existantes préservées
          ============================================================ */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h2 className="font-heading font-extrabold text-lg text-white tracking-wide uppercase">
              LES 3 PILIERS DE LA PLATEFORME TELECOM LAB
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pilier 1: ACADEMY */}
          <div className="rounded-2xl glass-panel p-6 border border-cyan-500/25 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                1. TELECOM ACADEMY
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Parcours théoriques et architecturaux progressifs : couches physiques, protocoles IP, commutation d'étiquettes MPLS, téléphonie SIP et transmission mobile 5G.
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-cyan-500/15">
              <button
                onClick={scrollToCatalog}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 text-xs font-mono transition-colors border border-cyan-500/15"
              >
                <span>Accéder au Catalogue Complet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('network-topology')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 text-slate-300 text-xs font-mono transition-colors border border-cyan-500/15"
              >
                <span>Topologie End-to-End en 7 Étapes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pilier 2: LABORATORY */}
          <div className="rounded-2xl glass-panel p-6 border border-cyan-500/25 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                2. TELECOM LABORATORY
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Simulateurs et bancs d'essai virtuels : bac à sable MPLS Push/Pop/Swap, console NOC temps réel et analyseur de paquets Wireshark.
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-cyan-500/15">
              <button
                onClick={() => onNavigate('mpls-lab')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 text-xs font-mono transition-colors border border-purple-500/15"
              >
                <span>Laboratoire IP/MPLS & L3VPN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('noc-dashboard')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 text-slate-300 text-xs font-mono transition-colors border border-purple-500/15"
              >
                <span>Console de Supervision NOC</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pilier 3: ENGINEERING TOOLBOX */}
          <div className="rounded-2xl glass-panel p-6 border border-cyan-500/25 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                3. TELECOM ENGINEERING
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Boîte à outils de calculs normalisés pour ingénieurs terrain : bilans de liaison RF, budgets optiques fibre, calculs de sous-réseaux et baies racks.
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-cyan-500/15">
              <button
                onClick={() => onNavigate('toolbox')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-mono transition-colors border border-emerald-500/15"
              >
                <span>Boîte à Outils (20+ Calculateurs)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('troubleshooting')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-slate-300 text-xs font-mono transition-colors border border-emerald-500/15"
              >
                <span>Arbres de Dépannage Réseau</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

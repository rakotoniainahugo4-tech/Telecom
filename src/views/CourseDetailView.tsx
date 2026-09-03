import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { learningService, subscribeToProgress } from '../lib/learningService';
import { Course, CourseProgressSummary, Lesson, UserProgress } from '../types/learning';
import { 
  BookOpen, 
  CheckCircle2, 
  Play, 
  Circle, 
  Clock, 
  ChevronRight, 
  Award, 
  ArrowLeft,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Badge } from '../components/Badge';

interface CourseDetailViewProps {
  courseSlug: string;
  onNavigate: (route: string) => void;
  onOpenLesson: (lessonId: string) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({ 
  courseSlug, 
  onNavigate, 
  onOpenLesson 
}) => {
  const { user } = useAuth();
  const [courseSummary, setCourseSummary] = useState<CourseProgressSummary | null>(null);
  const [userProgressMap, setUserProgressMap] = useState<Record<string, UserProgress>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  const userId = user?.id || '';

  const loadData = async () => {
    setIsLoading(true);
    try {
      const summary = await learningService.getCourseProgressSummary(userId, courseSlug);
      setCourseSummary(summary);

      if (userId) {
        const progressMap = await learningService.getUserProgressMap(userId);
        setUserProgressMap(progressMap);
      }

      // Expand all chapters by default
      if (summary?.course.chapters) {
        const initialExpand: Record<string, boolean> = {};
        summary.course.chapters.forEach((ch) => {
          initialExpand[ch.id] = true;
        });
        setExpandedChapters(initialExpand);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToProgress(() => {
      loadData();
    });
    return () => unsubscribe();
  }, [userId, courseSlug]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const handleToggleLesson = async (e: React.MouseEvent, lessonId: string, courseId: string) => {
    e.stopPropagation();
    if (!userId) {
      onNavigate('login');
      return;
    }
    await learningService.toggleLessonStatus(userId, lessonId, courseId);
    await loadData();
  };

  if (isLoading && !courseSummary) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 max-w-5xl mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-cyan-300">Chargement de la formation...</p>
        </div>
      </div>
    );
  }

  if (!courseSummary) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 max-w-5xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-heading font-bold text-white">Formation introuvable</h2>
        <p className="text-slate-400 text-sm">Le cours demandé n'existe pas ou n'est plus disponible.</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2 rounded-xl bg-cyan-600 text-slate-950 font-bold text-xs"
        >
          Retour au Dashboard
        </button>
      </div>
    );
  }

  const { course, percent, completed_lessons, total_lessons, is_completed, next_lesson } = courseSummary;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au Dashboard
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>{course.category}</span>
          <span>/</span>
          <span className="text-white font-bold">{course.title}</span>
        </div>
      </div>

      {/* Course Hero Banner */}
      <div className="rounded-3xl glass-panel-glow border border-cyan-500/30 p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                {course.badge || 'FORMATION'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 font-mono text-xs">
                {course.difficulty}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                ~{course.estimated_hours}h de cours
              </span>
            </div>

            {/* Resume button */}
            {next_lesson && (
              <button
                onClick={() => onOpenLesson(next_lesson.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-950/60 border border-cyan-300/40 hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
                {completed_lessons === 0 ? 'Commencer la formation' : 'Continuer le cours'}
              </button>
            )}
          </div>

          <div>
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
              {course.title}
            </h1>
            <p className="text-slate-300 font-sans text-sm sm:text-base leading-relaxed mt-2 max-w-4xl">
              {course.description}
            </p>
          </div>

          {/* Personal Progression Bar */}
          <div className="rounded-2xl bg-[#09101e]/90 border border-cyan-500/25 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 uppercase font-bold">Progression Personnelle :</span>
                <span className="text-cyan-300 font-bold">{completed_lessons} / {total_lessons} leçons terminées</span>
              </div>
              <span className={`font-black text-sm ${is_completed ? 'text-emerald-400' : 'text-cyan-300'}`}>
                {percent}%
              </span>
            </div>

            {/* Progress bar line */}
            <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-cyan-500/20">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  is_completed
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                    : 'bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>

            {next_lesson && !is_completed && (
              <p className="text-[11px] font-mono text-slate-400">
                Prochaine leçon recommandée : <span className="text-cyan-300 font-semibold">{next_lesson.title}</span>
              </p>
            )}

            {is_completed && (
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Félicitations ! Vous avez complété 100% de cette formation.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chapters and Lessons Tree */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg sm:text-xl text-white tracking-wide uppercase">
                Sommaire du Cours & Chapitres
              </h2>
              <p className="text-xs font-mono text-slate-400">
                {(course.chapters || []).length} chapitres &bull; {total_lessons} leçons au total
              </p>
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <div className="space-y-4">
          {(course.chapters || []).map((chapter, chIdx) => {
            const chapterLessons = chapter.lessons || [];
            const completedCount = chapterLessons.filter(l => userProgressMap[l.id]?.completed).length;
            const chTotal = chapterLessons.length;
            const chPercent = chTotal > 0 ? Math.round((completedCount / chTotal) * 100) : 0;
            const isExpanded = expandedChapters[chapter.id] ?? true;

            return (
              <div 
                key={chapter.id} 
                className="rounded-2xl glass-panel border border-cyan-500/20 overflow-hidden transition-all"
              >
                {/* Chapter Header */}
                <div 
                  onClick={() => toggleChapter(chapter.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-cyan-950/20 transition-colors border-b border-cyan-500/10"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                        CHAPITRE {chIdx + 1}
                      </span>
                      <h3 className="font-heading font-bold text-base text-white">
                        {chapter.title}
                      </h3>
                    </div>
                    {chapter.description && (
                      <p className="text-xs text-slate-400 font-sans">
                        {chapter.description}
                      </p>
                    )}
                  </div>

                  {/* Chapter progress indicator & expand icon */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-cyan-300">
                        {completedCount} / {chTotal} terminées
                      </span>
                      <div className="w-24 h-1.5 rounded-full bg-slate-900 mt-1 overflow-hidden border border-cyan-500/20">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            chPercent === 100 ? 'bg-emerald-400' : 'bg-cyan-400'
                          }`}
                          style={{ width: `${chPercent}%` }}
                        />
                      </div>
                    </div>

                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900/50">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Chapter Lessons */}
                {isExpanded && (
                  <div className="divide-y divide-cyan-500/10 bg-[#070d18]/60">
                    {chapterLessons.map((lesson) => {
                      const isCompleted = Boolean(userProgressMap[lesson.id]?.completed);
                      const isNext = next_lesson?.id === lesson.id;

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => onOpenLesson(lesson.id)}
                          className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors group ${
                            isNext 
                              ? 'bg-cyan-950/30 hover:bg-cyan-950/50' 
                              : 'hover:bg-cyan-950/20'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Status Icon */}
                            <button
                              onClick={(e) => handleToggleLesson(e, lesson.id, course.id)}
                              title={isCompleted ? "Marqué comme terminé (cliquer pour inverser)" : "Cliquer pour marquer comme terminé"}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                isCompleted
                                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                                  : isNext
                                  ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30'
                                  : 'bg-slate-900 border border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="w-4 h-4 stroke-[3]" />
                              ) : isNext ? (
                                <Play className="w-3.5 h-3.5 fill-current" />
                              ) : (
                                <Circle className="w-3 h-3" />
                              )}
                            </button>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-heading font-bold text-sm text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                                  {lesson.title}
                                </span>
                                {isNext && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold shrink-0">
                                    ▶ EN COURS
                                  </span>
                                )}
                                {isCompleted && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold shrink-0">
                                    ✓ TERMINÉ
                                  </span>
                                )}
                              </div>
                              {lesson.description && (
                                <p className="text-xs text-slate-400 truncate mt-0.5">
                                  {lesson.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
                              {lesson.duration_minutes} min
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { learningService, subscribeToProgress } from '../lib/learningService';
import { Course, Lesson, Chapter, UserProgress } from '../types/learning';
import { 
  BookOpen, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Circle, 
  Clock, 
  Layers, 
  Sparkles, 
  Terminal, 
  AlertCircle,
  Copy,
  ListOrdered,
  Lightbulb,
  HelpCircle,
  Play
} from 'lucide-react';
import { VideoPlayer } from '../components/learning/VideoPlayer';
import { CourseSidebar } from '../components/learning/CourseSidebar';

interface LessonViewProps {
  lessonId: string;
  onNavigate: (route: string) => void;
  onSelectLesson: (lessonId: string) => void;
  onBackToCourse: (courseSlug: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lessonId,
  onNavigate,
  onSelectLesson,
  onBackToCourse,
}) => {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [userProgressMap, setUserProgressMap] = useState<Record<string, UserProgress>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const userId = user?.id || '';

  const loadLessonData = async () => {
    const courses = await learningService.getCourses();
    let foundCourse: Course | null = null;
    let foundChapter: Chapter | null = null;
    let foundLesson: Lesson | null = null;
    const flatLessons: Lesson[] = [];

    for (const c of courses) {
      for (const ch of c.chapters || []) {
        for (const l of ch.lessons || []) {
          flatLessons.push(l);
          if (l.id === lessonId) {
            foundCourse = c;
            foundChapter = ch;
            foundLesson = l;
          }
        }
      }
    }

    setCourse(foundCourse);
    setCurrentChapter(foundChapter);
    setCurrentLesson(foundLesson);
    setAllLessons(flatLessons);

    if (userId && foundLesson) {
      const progressMap = await learningService.getUserProgressMap(userId);
      setUserProgressMap(progressMap);
      setIsCompleted(Boolean(progressMap[foundLesson.id]?.completed));
      if (foundCourse) {
        learningService.recordCourseState(userId, foundCourse.id, foundLesson.id);
      }
    }
  };

  useEffect(() => {
    loadLessonData();
    const unsub = subscribeToProgress(() => {
      loadLessonData();
    });
    return () => unsub();
  }, [lessonId, userId]);

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleToggleCompletion = async () => {
    if (!userId) {
      onNavigate('login');
      return;
    }

    if (!currentLesson || !course) return;

    setIsSaving(true);
    try {
      const newStatus = await learningService.toggleLessonStatus(userId, currentLesson.id, course.id);
      setIsCompleted(newStatus);
      setSyncNotice(newStatus ? 'Leçon validée et synchronisée avec votre profil !' : 'Statut réinitialisé.');
      setTimeout(() => setSyncNotice(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  if (!currentLesson || !course) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 max-w-5xl mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-cyan-300">Chargement de la leçon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
      {/* Top Breadcrumb & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 min-w-0">
          <button
            onClick={() => onBackToCourse(course.slug)}
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-bold shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {course.title}
          </button>
          <span>/</span>
          <span className="text-slate-300 truncate max-w-[160px] sm:max-w-none">{currentChapter?.title}</span>
          <span>/</span>
          <span className="text-white font-bold truncate max-w-[160px] sm:max-w-none">{currentLesson.title}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-950 border border-cyan-500/30 text-xs font-mono text-cyan-300 transition-colors flex items-center gap-2"
          >
            <Layers className="w-3.5 h-3.5" />
            Sommaire du Cours
          </button>
        </div>
      </div>

      {/* Sync notification banner */}
      {syncNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Video Player */}
      <div className="space-y-3">
        <VideoPlayer
          userId={userId}
          lessonId={currentLesson.id}
          courseId={course.id}
          videoUrl={currentLesson.video_url}
          videoDuration={currentLesson.video_duration || '20:00'}
          title={currentLesson.title}
          onEnded={() => {
            if (!isCompleted && userId) {
              handleToggleCompletion();
            }
          }}
        />
      </div>

      {/* Lesson Header Card */}
      <div className="rounded-3xl glass-panel-glow border border-cyan-500/30 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
              LEÇON {currentLesson.position}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300">
              {currentChapter?.title}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {currentLesson.duration_minutes} min
            </span>
          </div>

          {/* Primary Action: Mark as Completed */}
          <button
            onClick={handleToggleCompletion}
            disabled={isSaving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg cursor-pointer ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30'
                : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 border border-cyan-300/50 shadow-cyan-950/60'
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                ✓ Leçon Validée (Cliquer pour annuler)
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                Marquer comme terminée
              </>
            )}
          </button>
        </div>

        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            {currentLesson.title}
          </h1>
          {currentLesson.description && (
            <p className="text-slate-300 font-sans text-sm mt-2 leading-relaxed">
              {currentLesson.description}
            </p>
          )}
        </div>
      </div>

      {/* Key Points Card (Points Clés de la leçon) */}
      {currentLesson.key_points && currentLesson.key_points.length > 0 && (
        <div className="rounded-2xl glass-panel border border-cyan-500/25 p-5 space-y-3 bg-[#081220]/80">
          <div className="flex items-center gap-2 text-cyan-300">
            <Lightbulb className="w-4 h-4 text-cyan-400" />
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Points Clés à Retenir
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 font-sans">
            {currentLesson.key_points.map((pt, pIdx) => (
              <div key={pIdx} className="flex items-start gap-2 bg-[#040811]/60 p-2.5 rounded-xl border border-cyan-500/10">
                <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLI & Terminal Commands Examples */}
      {currentLesson.cli_examples && currentLesson.cli_examples.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider">
              Commandes Pratiques & Configuration CLI
            </h4>
          </div>

          <div className="space-y-3">
            {currentLesson.cli_examples.map((ex, exIdx) => (
              <div key={exIdx} className="rounded-2xl bg-[#040811] border border-cyan-500/30 overflow-hidden shadow-lg">
                <div className="px-4 py-2 bg-[#091222] border-b border-cyan-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                      {ex.os || 'CLI'}
                    </span>
                    <span className="text-slate-300 font-bold">{ex.title}</span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(ex.command, exIdx)}
                    className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {copiedIndex === exIdx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 font-mono text-xs text-cyan-200 overflow-x-auto">
                  <pre>{ex.command}</pre>
                </div>

                {ex.outputDescription && (
                  <div className="px-4 py-2 bg-[#070e1a] border-t border-cyan-500/10 text-[11px] font-mono text-slate-400">
                    ℹ {ex.outputDescription}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lesson Content Body */}
      <div className="rounded-2xl glass-panel border border-cyan-500/20 p-6 sm:p-8 space-y-6">
        <div className="prose prose-invert max-w-none font-sans text-sm sm:text-base leading-relaxed text-slate-300 space-y-4">
          {currentLesson.content?.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="font-heading font-black text-xl text-white pt-4 pb-2 border-b border-cyan-500/15">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('#### ')) {
              return (
                <h4 key={idx} className="font-heading font-bold text-base text-cyan-300 pt-2">
                  {paragraph.replace('#### ', '')}
                </h4>
              );
            }
            if (paragraph.startsWith('```')) {
              const codeBlock = paragraph.replace(/```[a-z]*\n/, '').replace(/\n```$/, '');
              return (
                <div key={idx} className="my-4 rounded-xl bg-[#040811] border border-cyan-500/30 p-4 font-mono text-xs overflow-x-auto text-cyan-200">
                  <pre>{codeBlock}</pre>
                </div>
              );
            }
            if (paragraph.startsWith('|')) {
              const rows = paragraph.split('\n').filter(r => !r.includes('---'));
              return (
                <div key={idx} className="overflow-x-auto my-4 rounded-xl border border-cyan-500/20">
                  <table className="min-w-full text-xs font-mono text-left divide-y divide-cyan-500/20">
                    <tbody className="divide-y divide-cyan-500/10 bg-[#070d18]">
                      {rows.map((row, rIdx) => {
                        const cells = row.split('|').filter(c => c.trim() !== '');
                        return (
                          <tr key={rIdx} className={rIdx === 0 ? 'bg-cyan-950/40 text-cyan-300 font-bold' : 'hover:bg-cyan-950/20'}>
                            {cells.map((cell, cIdx) => (
                              <td key={cIdx} className="px-3 py-2 border-r border-cyan-500/10">
                                {cell.trim()}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            }
            return (
              <p key={idx} className="text-slate-300 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Completion Callout */}
        <div className="pt-6 border-t border-cyan-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-heading font-bold text-sm text-white">
              Vous avez terminé l'étude de cette leçon ?
            </h4>
            <p className="text-xs text-slate-400 font-sans">
              Validez la leçon pour enregistrer votre progression personnelle et passer à la leçon suivante.
            </p>
          </div>

          <button
            onClick={handleToggleCompletion}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400'
            }`}
          >
            {isCompleted ? '✓ Leçon Validée' : 'Marquer comme terminée'}
          </button>
        </div>
      </div>

      {/* Bottom Prev / Next Navigation */}
      <div className="flex items-center justify-between pt-2">
        {prevLesson ? (
          <button
            onClick={() => onSelectLesson(prevLesson.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/20 text-slate-200 text-xs font-mono font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Précédente :</span> {prevLesson.title}
          </button>
        ) : <div />}

        {nextLesson ? (
          <button
            onClick={() => onSelectLesson(nextLesson.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold transition-all ml-auto"
          >
            <span className="hidden sm:inline">Suivante :</span> {nextLesson.title}
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        ) : (
          <button
            onClick={() => onBackToCourse(course.slug)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold ml-auto"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Formation complétée ! Revenir au sommaire
          </button>
        )}
      </div>

      {/* Sidebar Drawer */}
      <CourseSidebar
        course={course}
        currentLessonId={currentLesson.id}
        userProgressMap={userProgressMap}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectLesson={onSelectLesson}
      />
    </div>
  );
};

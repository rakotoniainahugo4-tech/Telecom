import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { learningService, subscribeToProgress } from '../lib/learningService';
import { CourseProgressSummary, UserLearningStats } from '../types/learning';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Network, 
  Play, 
  Sparkles, 
  TrendingUp, 
  Database, 
  Copy, 
  Check, 
  ArrowRight,
  Flame,
  User,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '../components/Badge';

interface MyProgressViewProps {
  onNavigate: (route: string) => void;
  onOpenCourse: (courseSlug: string) => void;
  onOpenLesson: (lessonId: string) => void;
}

export const MyProgressView: React.FC<MyProgressViewProps> = ({
  onNavigate,
  onOpenCourse,
  onOpenLesson
}) => {
  const { user, profile } = useAuth();
  const [summaries, setSummaries] = useState<CourseProgressSummary[]>([]);
  const [stats, setStats] = useState<UserLearningStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);

  const userId = user?.id || '';
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Ingénieur Télécom';

  const loadData = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const [sumList, userStats] = await Promise.all([
        learningService.getAllCoursesSummary(userId),
        learningService.getUserStats(userId)
      ]);
      setSummaries(sumList);
      setStats(userStats);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToProgress(() => {
      loadData();
    });
    return () => unsub();
  }, [userId]);

  const inProgressCourses = summaries.filter(s => s.completed_lessons > 0 && !s.is_completed && s.total_lessons > 0);
  const completedCourses = summaries.filter(s => s.is_completed && s.total_lessons > 0 && s.completed_lessons === s.total_lessons);
  const notStartedCourses = summaries.filter(s => s.completed_lessons === 0 && s.total_lessons > 0);

  const handleCopySql = () => {
    const sqlText = `-- TELECOM LAB : Exécutez ce script dans Supabase SQL Editor
-- Tables courses, chapters, lessons, enrollments, user_progress avec RLS
-- Téléchargeable depuis le fichier racine supabase_learning_schema.sql`;
    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel-glow border border-cyan-500/30 p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>ESPACE D'APPRENTISSAGE PERSONNEL</span>
              <span>&bull;</span>
              <span className="text-emerald-400">SUPABASE SYNCHRONISÉ</span>
            </div>

            <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
              Mon Apprentissage Télécom
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Suivi en temps réel de votre progression par utilisateur (<span className="text-cyan-300 font-mono">{user?.email}</span>). 
              Chaque leçon validée met à jour dynamiquement vos statistiques et votre avancement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2.5 rounded-xl bg-cyan-950/50 hover:bg-cyan-950/80 text-slate-200 border border-cyan-500/30 text-xs font-mono font-bold transition-all"
            >
              Tableau de Bord
            </button>
            <button
              onClick={() => onOpenCourse('voip')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-950/60 border border-cyan-300/40"
            >
              <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
              Formation VoIP
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards: Dynamic per connected user */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl glass-panel p-5 border border-cyan-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">PROGRESSION GLOBALE</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-black text-3xl text-white">
              {stats?.global_progress_percent ?? 0}%
            </span>
            <span className="text-xs font-mono text-cyan-300">
              {stats?.lessons_completed ?? 0} / {stats?.total_lessons_available ?? 0} leçons
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-cyan-500/20">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500" 
              style={{ width: `${stats?.global_progress_percent ?? 0}%` }} 
            />
          </div>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-purple-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">FORMATIONS EN COURS</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-black text-3xl text-white">
              {stats?.courses_started ?? 0}
            </span>
            <span className="text-xs font-mono text-purple-300">
              sur {summaries.length} disponibles
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            {stats?.courses_completed ?? 0} formation(s) terminée(s)
          </p>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">LABS PRATIQUES</span>
            <Network className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-black text-3xl text-white">
              {stats?.labs_completed ?? 0} / 6
            </span>
            <span className="text-xs font-mono text-emerald-400">validés</span>
          </div>
          <p className="text-[11px] font-mono text-slate-400">MPLS Lab & Topologie</p>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">TEMPS D'APPRENTISSAGE</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-black text-3xl text-white">
              ~{stats?.learning_hours ?? 0} h
            </span>
            <span className="text-xs font-mono text-amber-300">enregistrées</span>
          </div>
          <p className="text-[11px] font-mono text-slate-400">Temps estimé par leçons</p>
        </div>
      </div>

      {/* Section 1: Formations en cours */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="font-heading font-black text-xl text-white uppercase tracking-wider">
              Formations en Cours ({inProgressCourses.length})
            </h2>
          </div>
        </div>

        {inProgressCourses.length === 0 ? (
          <div className="rounded-2xl glass-panel p-8 text-center border border-cyan-500/20 space-y-3">
            <BookOpen className="w-8 h-8 text-cyan-400 mx-auto opacity-60" />
            <p className="text-slate-300 text-sm font-sans">
              Vous n'avez pas encore de formation en cours.
            </p>
            <p className="text-xs text-slate-400 font-mono">
              Choisissez une formation ci-dessous (ex: VoIP ou MPLS) pour démarrer votre apprentissage.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressCourses.map(({ course, percent, completed_lessons, total_lessons, next_lesson }) => (
              <div 
                key={course.id} 
                className="rounded-2xl glass-panel-glow border border-cyan-500/30 p-5 space-y-4 hover:border-cyan-400/60 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                      {course.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {percent}%
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-white">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Progression</span>
                      <span className="text-cyan-300 font-bold">{completed_lessons} / {total_lessons} leçons</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-cyan-500/20">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }} 
                      />
                    </div>
                  </div>

                  {next_lesson && (
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-cyan-500/15">
                      <div className="text-[11px] font-mono truncate text-slate-300">
                        <span className="text-slate-500">Reprendre :</span> {next_lesson.title}
                      </div>

                      <button
                        onClick={() => onOpenLesson(next_lesson.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold shrink-0 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Continuer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Formations terminées */}
      {completedCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="font-heading font-black text-xl text-white uppercase tracking-wider">
              Formations Terminées ({completedCourses.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedCourses.map(({ course, total_lessons }) => (
              <div 
                key={course.id}
                className="rounded-2xl glass-panel border border-emerald-500/30 p-5 space-y-3 bg-emerald-950/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-bold">
                    ✓ 100% COMPLÉTÉ
                  </span>
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>

                <h3 className="font-heading font-bold text-lg text-white">{course.title}</h3>
                <p className="text-xs text-slate-400">{total_lessons} / {total_lessons} leçons validées.</p>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => onOpenCourse(course.slug)}
                    className="text-xs font-mono text-emerald-300 hover:underline"
                  >
                    Revoir les leçons
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Catalogue complet de cours */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="font-heading font-black text-xl text-white uppercase tracking-wider">
              Toutes les Formations Disponibles ({summaries.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaries.map(({ course, percent, completed_lessons, total_lessons, next_lesson }) => (
            <div 
              key={course.id}
              onClick={() => onOpenCourse(course.slug)}
              className="rounded-2xl glass-panel border border-cyan-500/15 p-5 space-y-4 hover:border-cyan-400/50 hover:bg-cyan-950/20 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                    {course.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ~{course.estimated_hours}h
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-white hover:text-cyan-300 transition-colors">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {course.description}
                </p>
              </div>

              <div className="pt-2 border-t border-cyan-500/15 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Votre progression :</span>
                  <span className="text-cyan-300 font-bold">{percent}% ({completed_lessons}/{total_lessons})</span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-cyan-500/20">
                  <div 
                    className="h-full bg-cyan-400 rounded-full" 
                    style={{ width: `${percent}%` }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

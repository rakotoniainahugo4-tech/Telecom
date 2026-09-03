import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { learningService, subscribeToProgress } from '../lib/learningService';
import { CourseProgressSummary, UserLearningStats } from '../types/learning';
import { 
  Radio, 
  Activity, 
  BookOpen, 
  Layers, 
  Network, 
  Award, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Gauge, 
  Signal, 
  Wrench, 
  FolderGit2, 
  User, 
  Cpu, 
  Sparkles,
  TrendingUp,
  Clock,
  ExternalLink,
  Check
} from 'lucide-react';
import { Badge } from '../components/Badge';

interface DashboardViewProps {
  onNavigate: (route: string) => void;
  onOpenCourse?: (courseSlug: string) => void;
  onOpenLesson?: (lessonId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onNavigate,
  onOpenCourse,
  onOpenLesson 
}) => {
  const { user, profile } = useAuth();
  const [coursesSummaries, setCoursesSummaries] = useState<CourseProgressSummary[]>([]);
  const [userStats, setUserStats] = useState<UserLearningStats | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(true);

  const userId = user?.id || '';
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Ingénieur Télécom';
  const userRole = profile?.role || 'STUDENT';
  const speciality = profile?.speciality || 'Réseaux & Télécoms IP';

  const loadProgressData = async () => {
    if (!userId) {
      setIsLoadingProgress(false);
      return;
    }
    try {
      const [summaries, stats] = await Promise.all([
        learningService.getAllCoursesSummary(userId),
        learningService.getUserStats(userId)
      ]);
      setCoursesSummaries(summaries);
      setUserStats(stats);
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

  const voipSummary = coursesSummaries.find(s => s.course.slug === 'voip') || coursesSummaries[0];

  // Dynamic stats calculated specifically for this authenticated user
  const stats = [
    { 
      label: 'PROGRESSION GLOBALE', 
      value: `${userStats?.global_progress_percent ?? 0}%`, 
      change: `${userStats?.lessons_completed ?? 0} / ${userStats?.total_lessons_available ?? 10} leçons`, 
      icon: TrendingUp, 
      color: 'text-cyan-400' 
    },
    { 
      label: 'COURS EN COURS', 
      value: `${userStats?.courses_started ?? 0} / ${coursesSummaries.length || 2}`, 
      change: `${userStats?.courses_completed ?? 0} terminé(s)`, 
      icon: BookOpen, 
      color: 'text-purple-400' 
    },
    { 
      label: 'LABS PRATIQUES', 
      value: `${userStats?.labs_completed ?? 0} / 6 validés`, 
      change: 'MPLS Lab actif', 
      icon: Network, 
      color: 'text-emerald-400' 
    },
    { 
      label: 'TEMPS ENREGISTRÉ', 
      value: `~${userStats?.learning_hours ?? 0} h`, 
      change: 'Progression Supabase', 
      icon: Award, 
      color: 'text-amber-400' 
    },
  ];

  const quickTracks = [
    {
      title: 'Topologie de Transport Télécom',
      category: 'TELECOM ACADEMY',
      description: 'Parcours complet en 7 étapes : de l\'accès PON au Cloud Datacenter via le cœur IP/MPLS.',
      route: 'network-topology',
      progress: 85,
      badge: 'COURS CLÉ',
      icon: BookOpen,
      color: 'border-purple-500/40 bg-purple-950/20'
    },
    {
      title: 'Laboratoire Interactif IP/MPLS & L3VPN',
      category: 'TELECOM LABORATORY',
      description: 'Simulateur de commutation par étiquettes : Push, Swap, PHP, Pop et tables VRF.',
      route: 'mpls-lab',
      progress: 60,
      badge: 'LAB ACTIF',
      icon: Layers,
      color: 'border-cyan-500/40 bg-cyan-950/20'
    },
    {
      title: 'Console de Supervision NOC & Télémesure',
      category: 'NETWORK OPERATIONS',
      description: 'Supervision temps réel des liens optiques, table globale BGP DFZ et alarmes ITU-T.',
      route: 'noc-dashboard',
      progress: 100,
      badge: 'LIVE MONITOR',
      icon: Gauge,
      color: 'border-emerald-500/40 bg-emerald-950/20'
    },
    {
      title: 'Ingénierie de Site BTS & Faisceaux FH',
      category: 'SITE & RF ENGINEERING',
      description: 'Calculs de bilans de liaison RF, zones de Fresnel, budgets optiques et autonomie -48V.',
      route: 'cell-site',
      progress: 40,
      badge: 'OUTIL TERRAIN',
      icon: Signal,
      color: 'border-amber-500/40 bg-amber-950/20'
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Top Welcome Banner */}
      <div className="rounded-3xl glass-panel-glow border border-cyan-500/30 p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
              <span>TABLEAU DE BORD PERSONNEL</span>
              <span>&bull;</span>
              <span>{userRole}</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              Bienvenue, {userName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-sans">
              Spécialité active : <span className="text-cyan-300 font-mono font-semibold">{speciality}</span>
            </p>
            <p className="text-xs text-slate-400 font-sans leading-relaxed pt-1">
              Reprenez vos travaux pratiques, explorez les leçons d'architecture télécom ou utilisez les calculateurs professionnels d'ingénierie.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('progress')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950/50 hover:bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold transition-all shadow-md"
            >
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Mon Apprentissage
            </button>
            <button
              onClick={() => {
                if (voipSummary?.next_lesson && onOpenLesson) {
                  onOpenLesson(voipSummary.next_lesson.id);
                } else if (onOpenCourse) {
                  onOpenCourse('voip');
                } else {
                  onNavigate('progress');
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-950/60 border border-cyan-300/40"
            >
              <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
              {voipSummary?.completed_lessons === 0 ? 'Démarrer VoIP' : 'Continuer VoIP'}
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-2xl glass-panel p-5 border border-cyan-500/15 hover:border-cyan-400/40 space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                  {stat.label}
                </span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-black font-heading text-white">
                {stat.value}
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-1 border-t border-cyan-500/10">
                <span className="text-emerald-400 font-bold">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Personal Learning Focus Card */}
      {voipSummary && (
        <div className="rounded-2xl glass-panel-glow border border-cyan-500/30 p-6 space-y-4 bg-gradient-to-r from-[#091326] to-[#0b172a]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                  {voipSummary.course.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Formation Personnalisée
                </span>
              </div>
              <h3 className="font-heading font-black text-xl text-white">
                {voipSummary.course.title}
              </h3>
              {voipSummary.next_lesson && (
                <p className="text-xs font-mono text-slate-300">
                  Prochaine étape : <span className="text-cyan-300 font-bold">{voipSummary.next_lesson.title}</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onOpenCourse ? onOpenCourse(voipSummary.course.slug) : onNavigate('progress')}
                className="px-4 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-950 border border-cyan-500/20 text-xs font-mono text-slate-300 transition-colors"
              >
                Sommaire du Cours
              </button>
              {voipSummary.next_lesson && (
                <button
                  onClick={() => onOpenLesson ? onOpenLesson(voipSummary.next_lesson!.id) : (onOpenCourse ? onOpenCourse(voipSummary.course.slug) : onNavigate('progress'))}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Continuer la leçon
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-cyan-500/15">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Votre avancement personnel :</span>
              <span className="text-cyan-300 font-bold">
                {voipSummary.completed_lessons} / {voipSummary.total_lessons} leçons validées ({voipSummary.percent}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-cyan-500/20">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500" 
                style={{ width: `${voipSummary.percent}%` }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* 3 Main Pillars Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h2 className="font-heading font-extrabold text-lg text-white tracking-wide uppercase">
              LES 3 PILIERS DE LA PLATEFORME TELECOM LAB
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: ACADEMY */}
          <div className="rounded-2xl glass-panel p-6 border border-cyan-500/25 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                1. TELECOM ACADEMY
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Apprentissage méthodique des normes et protocoles : routage IP (BGP, OSPF), réseaux mobiles (LTE, 5G), transmission optique et VoIP.
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-cyan-500/15">
              <button
                onClick={() => onNavigate('network-topology')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 text-xs font-mono transition-colors border border-cyan-500/15"
              >
                <span>Topologie Réseau de Bout en Bout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('docs')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 text-slate-300 text-xs font-mono transition-colors border border-cyan-500/15"
              >
                <span>Documentation & Guides RFC</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pillar 2: LABORATORY */}
          <div className="rounded-2xl glass-panel p-6 border border-sky-500/25 hover:border-sky-400/50 hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-500/40 flex items-center justify-center text-sky-300">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                2. TELECOM LABORATORY
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Pratique et simulation de protocoles en temps réel : manipulation de tables LFIB, commutation de labels MPLS et diagnostics de paquets.
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-cyan-500/15">
              <button
                onClick={() => onNavigate('mpls-lab')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-sky-950/40 hover:bg-sky-900/50 text-sky-300 text-xs font-mono transition-colors border border-sky-500/15"
              >
                <span>Laboratoire IP/MPLS L3VPN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('noc-dashboard')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-sky-950/40 hover:bg-sky-900/50 text-slate-300 text-xs font-mono transition-colors border border-sky-500/15"
              >
                <span>Simulateur NOC & Alarmes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pillar 3: ENGINEERING */}
          <div className="rounded-2xl glass-panel p-6 border border-emerald-500/25 hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all flex flex-col justify-between space-y-5">
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

      {/* Learning Tracks & Labs in Progress */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-lg text-white">
          Modules Recommandés & Travaux en Cours
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickTracks.map((track, idx) => {
            const Icon = track.icon;
            return (
              <div 
                key={idx} 
                onClick={() => onNavigate(track.route)}
                className={`p-6 rounded-2xl glass-panel border border-cyan-500/20 hover:border-cyan-400/50 bg-[#091220]/70 cursor-pointer group hover:scale-[1.01] transition-all space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-cyan-300">
                    {track.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-500/20 text-[10px] font-mono text-cyan-300">
                    {track.badge}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/25 text-cyan-300 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                      {track.title}
                    </h4>
                    <p className="text-xs text-slate-300 font-sans mt-1">
                      {track.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-cyan-500/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>Avancement :</span>
                    <span className="text-white font-bold">{track.progress}%</span>
                  </div>
                  <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Ouvrir <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

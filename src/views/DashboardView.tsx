import React from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  ExternalLink
} from 'lucide-react';
import { Badge } from '../components/Badge';

interface DashboardViewProps {
  onNavigate: (route: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Ingénieur Télécom';
  const userRole = profile?.role || 'STUDENT';
  const speciality = profile?.speciality || 'Réseaux & Télécoms IP';

  // Stats for the user dashboard overview
  const stats = [
    { label: 'PROGRESSION GLOBALE', value: '68%', change: '+12% ce mois', icon: TrendingUp, color: 'text-purple-400' },
    { label: 'COURS ACADEMY', value: '4 / 7 terminés', change: 'Topologie 100%', icon: BookOpen, color: 'text-cyan-400' },
    { label: 'LABS PRATIQUES', value: '3 / 6 validés', change: 'MPLS Lab actif', icon: Network, color: 'text-emerald-400' },
    { label: 'SCORE MOYEN QUIZ', value: '88%', change: 'Niveau Avancé', icon: Award, color: 'text-amber-400' },
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
      <div className="rounded-3xl glass-panel-glow border border-purple-500/30 p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
              <span>TABLEAU DE BORD PERSONNEL</span>
              <span>&bull;</span>
              <span>{userRole}</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              Bienvenue, {userName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-sans">
              Spécialité active : <span className="text-purple-300 font-mono font-semibold">{speciality}</span>
            </p>
            <p className="text-xs text-slate-400 font-sans leading-relaxed pt-1">
              Reprenez vos travaux pratiques, explorez les leçons d'architecture télécom ou utilisez les calculateurs professionnels d'ingénierie.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-bold transition-all"
            >
              <User className="w-4 h-4 text-purple-400" />
              Éditer mon Profil
            </button>
            <button
              onClick={() => onNavigate('network-topology')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-950"
            >
              <Play className="w-4 h-4" />
              Reprendre le Cours
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-2xl glass-panel p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                  {stat.label}
                </span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-black font-heading text-white">
                {stat.value}
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-1 border-t border-white/5">
                <span className="text-emerald-400 font-bold">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3 Main Pillars Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-400" />
            <h2 className="font-heading font-extrabold text-lg text-white tracking-wide uppercase">
              LES 3 PILIERS DE LA PLATEFORME TELECOM LAB
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: ACADEMY */}
          <div className="rounded-2xl glass-panel p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                1. TELECOM ACADEMY
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Apprentissage méthodique des normes et protocoles : routage IP (BGP, OSPF), réseaux mobiles (LTE, 5G), transmission optique et VoIP.
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-white/10">
              <button
                onClick={() => onNavigate('network-topology')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 text-xs font-mono transition-colors"
              >
                <span>Topologie Réseau de Bout en Bout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('docs')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors"
              >
                <span>Documentation & Guides RFC</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pillar 2: LABORATORY */}
          <div className="rounded-2xl glass-panel p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                2. TELECOM LABORATORY
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Pratique et simulation de protocoles en temps réel : manipulation de tables LFIB, commutation de labels MPLS et diagnostics de paquets.
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-white/10">
              <button
                onClick={() => onNavigate('mpls-lab')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-mono transition-colors"
              >
                <span>Laboratoire IP/MPLS L3VPN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('noc-dashboard')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors"
              >
                <span>Simulateur NOC & Alarmes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pillar 3: ENGINEERING */}
          <div className="rounded-2xl glass-panel p-6 border border-emerald-500/30 hover:border-emerald-400/50 transition-all flex flex-col justify-between space-y-5">
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
            <div className="space-y-2 pt-2 border-t border-white/10">
              <button
                onClick={() => onNavigate('toolbox')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-300 text-xs font-mono transition-colors"
              >
                <span>Boîte à Outils (20+ Calculateurs)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('troubleshooting')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors"
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
                className={`p-6 rounded-2xl glass-panel border ${track.color} cursor-pointer group hover:scale-[1.01] transition-all space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-purple-300">
                    {track.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                    {track.badge}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-purple-300 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                      {track.title}
                    </h4>
                    <p className="text-xs text-slate-300 font-sans mt-1">
                      {track.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>Avancement :</span>
                    <span className="text-white font-bold">{track.progress}%</span>
                  </div>
                  <span className="text-purple-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
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

import React, { useState } from 'react';
import { 
  Radio, 
  Zap, 
  Layers, 
  Network, 
  PhoneCall, 
  Server, 
  Cpu, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Terminal, 
  Boxes, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight,
  Sparkles,
  Info,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';
import { TELECOM_LESSONS_DATA, TelecomLessonStage } from '../data/telecomLessonsData';

export const NetworkTopologyView: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TECH' | 'ENCAP' | 'HARDWARE' | 'CLI' | 'QUIZ'>('OVERVIEW');
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Quiz state: map of questionId -> selectedOptionIndex
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});

  const currentLesson: TelecomLessonStage = TELECOM_LESSONS_DATA[activeStepIndex];

  // Helper icons map
  const getIcon = (name: string) => {
    switch (name) {
      case 'Radio': return Radio;
      case 'Zap': return Zap;
      case 'Layers': return Layers;
      case 'Network': return Network;
      case 'PhoneCall': return PhoneCall;
      case 'Server': return Server;
      case 'Cpu': return Cpu;
      default: return Network;
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submittedQuestions[questionId]) return; // locked once checked
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleValidateQuestion = (questionId: string) => {
    setSubmittedQuestions(prev => ({ ...prev, [questionId]: true }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmittedQuestions({});
  };

  const calculateQuizScore = () => {
    let score = 0;
    currentLesson.quiz.forEach(q => {
      if (submittedQuestions[q.id] && selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const generateLessonSummaryText = () => {
    return `# FICHE DE RÉVISION TÉLÉCOM : TOPOLOGIE DE TRANSPORT DE BOUT EN BOUT\n` +
      `Date : ${new Date().toLocaleDateString('fr-FR')}\n\n` +
      TELECOM_LESSONS_DATA.map(l => (
        `## Étape ${l.stepNumber} : ${l.title} (${l.subtitle})\n` +
        `Rôle : ${l.architecturalRole.description}\n` +
        `Technologies clés :\n` +
        l.technologies.map(t => `  - ${t.name} (${t.acronym}) : ${t.description}`).join('\n') +
        `\nEncapsulation : ${l.encapsulation.layer} -> ${l.encapsulation.explanation}\n\n`
      )).join('\n---\n\n');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// MODULE DE FORMATION TÉLÉCOM</span>
            <span>&bull;</span>
            <Badge type="COURS / LEÇON" size="sm" />
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            TOPOLOGIE DU TRANSPORT TÉLÉCOM DE BOUT EN BOUT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-4xl">
            Leçon complète en français : comprenez pas-à-pas le cheminement réel d'un paquet de données, 
            depuis le terminal utilisateur (CPE/ONT/UE) jusqu'au Datacenter Cloud via l'accès PON, 
            l'agrégation métropolitaine, le cœur IP/MPLS, les passerelles de services et le transit BGP mondial.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Télécharger Fiche de Cours
          </button>
        </div>
      </div>

      {/* Interactive Topology Pipeline Navigation (The visual chain requested) */}
      <div className="relative rounded-2xl glass-panel-glow border border-purple-500/30 p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
                PARCOURS DU SIGNAL : SÉLECTIONNEZ UNE ÉTAPE DE LA TOPOLOGIE
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Progression du cours : Étape {activeStepIndex + 1} sur {TELECOM_LESSONS_DATA.length} &bull; {currentLesson.title}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              {Math.round(((activeStepIndex + 1) / TELECOM_LESSONS_DATA.length) * 100)}% complété
            </span>
          </div>
        </div>

        {/* Pipeline Nodes Row */}
        <div className="relative overflow-x-auto py-4">
          <div className="min-w-[860px] flex items-center justify-between relative px-6">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-10 right-10 h-1 bg-gradient-to-r from-purple-500 via-indigo-400 via-cyan-400 via-emerald-400 via-amber-400 to-rose-400 -translate-y-1/2 z-0 opacity-40" />

            {/* Topology Step Nodes */}
            {TELECOM_LESSONS_DATA.map((step, idx) => {
              const Icon = getIcon(step.iconName);
              const isActive = idx === activeStepIndex;
              const isPassed = idx < activeStepIndex;

              return (
                <div
                  key={step.id}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setActiveTab('OVERVIEW');
                  }}
                  className="relative z-10 flex flex-col items-center group cursor-pointer transition-transform"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                      isActive
                        ? `${step.colorScheme.bg} border-2 border-white scale-115 ring-4 ring-purple-500/40 shadow-purple-500/30`
                        : isPassed
                        ? `${step.colorScheme.bg} border ${step.colorScheme.border} opacity-90 group-hover:scale-105 group-hover:border-white`
                        : `${step.colorScheme.bg} border ${step.colorScheme.border} opacity-75 group-hover:scale-105 group-hover:opacity-100`
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${step.colorScheme.text}`} />
                  </div>

                  <div className="mt-3 flex flex-col items-center">
                    <span className={`font-heading font-bold text-xs text-center transition-colors ${
                      isActive ? 'text-white font-extrabold underline decoration-purple-400 decoration-2 underline-offset-4' : 'text-slate-300 group-hover:text-white'
                    }`}>
                      {step.stepNumber}. {step.title.split('&')[0].trim()}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 text-center line-clamp-1 max-w-[110px]">
                      {step.subtitle.split('/')[0].trim()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4 text-xs font-mono">
          <button
            onClick={() => {
              if (activeStepIndex > 0) {
                setActiveStepIndex(activeStepIndex - 1);
                setActiveTab('OVERVIEW');
              }
            }}
            disabled={activeStepIndex === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              activeStepIndex === 0
                ? 'opacity-40 cursor-not-allowed border-white/5 text-slate-600'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Étape précédente
          </button>

          <span className="text-slate-400">
            Étape <span className="text-white font-bold">{activeStepIndex + 1}</span> / {TELECOM_LESSONS_DATA.length}
          </span>

          <button
            onClick={() => {
              if (activeStepIndex < TELECOM_LESSONS_DATA.length - 1) {
                setActiveStepIndex(activeStepIndex + 1);
                setActiveTab('OVERVIEW');
              }
            }}
            disabled={activeStepIndex === TELECOM_LESSONS_DATA.length - 1}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              activeStepIndex === TELECOM_LESSONS_DATA.length - 1
                ? 'opacity-40 cursor-not-allowed border-white/5 text-slate-600'
                : 'bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border-purple-500/40'
            }`}
          >
            Étape suivante <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lesson Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'OVERVIEW', label: '1. Rôle & Architecture', icon: BookOpen },
          { id: 'TECH', label: '2. Technologies & Standards', icon: Zap },
          { id: 'ENCAP', label: '3. Encapsulation & Trame', icon: Layers },
          { id: 'HARDWARE', label: '4. Équipements Réels', icon: Boxes },
          { id: 'CLI', label: '5. Commandes & Diagnostics CLI', icon: Terminal },
          { id: 'QUIZ', label: `6. Quiz d'Auto-Évaluation (${currentLesson.quiz.length} QCM)`, icon: HelpCircle }
        ].map(tab => {
          const TabIcon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & ARCHITECTURAL ROLE */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Hero Banner for this Stage */}
          <div className={`rounded-2xl glass-panel p-6 sm:p-8 border ${currentLesson.colorScheme.border} relative overflow-hidden`}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border border-purple-500/30 bg-purple-950/40 text-purple-300">
                  <span>ÉTAPE {currentLesson.stepNumber} / 7</span>
                  <span>&bull;</span>
                  <span>{currentLesson.badge}</span>
                </div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                  {currentLesson.title}
                </h2>
                <p className="text-sm font-mono text-purple-300 font-semibold">
                  Sous-titre : {currentLesson.subtitle}
                </p>
                <p className="text-sm text-slate-300 font-sans leading-relaxed pt-2">
                  {currentLesson.summary}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center min-w-[160px] text-center">
                <span className="text-[10px] font-mono uppercase text-slate-400">Position Réseau</span>
                <span className="text-lg font-bold font-heading text-white mt-1">Étage {currentLesson.stepNumber}</span>
                <span className="text-xs font-mono text-purple-400 mt-1">
                  {currentLesson.stepNumber === 1 ? 'Source Émettrice' : currentLesson.stepNumber === 7 ? 'Destination Finale' : 'Nœud de Transit'}
                </span>
              </div>
            </div>
          </div>

          {/* Architectural Deep-Dive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-sm font-mono font-bold text-purple-400 uppercase">
                  <Info className="w-4 h-4" />
                  <h3>Rôle Fondamental dans la Chaîne de Transport</h3>
                </div>
                <p className="text-sm text-slate-200 font-sans leading-relaxed">
                  {currentLesson.architecturalRole.description}
                </p>
                
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Fonctions Clés Exécutées à cette Couche :
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentLesson.architecturalRole.keyPoints.map((point, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl glass-panel p-6 border border-purple-500/20 bg-purple-950/20 space-y-4">
                <div className="flex items-center gap-2 text-sm font-mono font-bold text-purple-300 uppercase">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <h3>Importance Stratégique</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {currentLesson.architecturalRole.importance}
                </p>
              </div>

              <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Accès Rapide aux Modules de cette Leçon :
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <button 
                    onClick={() => setActiveTab('TECH')}
                    className="w-full text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 flex items-center justify-between transition-colors"
                  >
                    <span>Explorer les Technologies</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('ENCAP')}
                    className="w-full text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 flex items-center justify-between transition-colors"
                  >
                    <span>Voir l'En-tête de Trame</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('QUIZ')}
                    className="w-full text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-300 flex items-center justify-between transition-colors"
                  >
                    <span>Passer le Test d'Auto-Évaluation</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TECHNOLOGIES & STANDARDS */}
      {activeTab === 'TECH' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-xl text-white">
                Technologies & Normes Normalisées
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Standards ITU-T, IEEE, 3GPP et IETF appliqués à l'étape {currentLesson.stepNumber} ({currentLesson.title}).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentLesson.technologies.map((tech, i) => (
              <div key={i} className="rounded-2xl glass-panel p-6 border border-white/10 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-900/40 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold">
                      {tech.acronym}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Norme Télécom</span>
                  </div>
                  <h4 className="font-heading font-bold text-lg text-white">
                    {tech.name}
                  </h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {tech.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                    Spécifications Clés :
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                    {tech.specifications.map((spec, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ENCAPSULATION & FRAME STRUCTURE */}
      {activeTab === 'ENCAP' && (
        <div className="space-y-6">
          <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest mb-1">
                <Layers className="w-4 h-4" />
                <span>Niveau d'Encapsulation : {currentLesson.encapsulation.layer}</span>
              </div>
              <h3 className="font-heading font-bold text-2xl text-white">
                Structure de la Trame / du Paquet à cette Étape
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans mt-2 leading-relaxed">
                {currentLesson.encapsulation.explanation}
              </p>
            </div>

            {/* Visual Frame Block Layout */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono uppercase font-bold text-slate-400">
                Représentation de l'En-tête & des Champs de Données (De Gauche à Droite) :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                {currentLesson.encapsulation.frameStructure.map((field, fIdx) => (
                  <div 
                    key={fIdx} 
                    className={`rounded-xl p-4 border border-white/10 ${field.color} shadow-lg flex flex-col justify-between space-y-2`}
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase opacity-75 font-semibold block">
                        Champ {fIdx + 1} &bull; {field.bytes}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-white mt-1">
                        {field.name}
                      </h4>
                    </div>
                    <p className="text-[11px] font-sans text-slate-200/90 leading-tight">
                      {field.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REAL HARDWARE EQUIPMENT */}
      {activeTab === 'HARDWARE' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-bold text-xl text-white">
              Équipements Réels Déployés par les Opérateurs
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Matériels de référence des constructeurs (Nokia, Cisco, Huawei, Juniper, Arista, Ericsson).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentLesson.realEquipment.map((eq, eIdx) => (
              <div key={eIdx} className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                    {eq.vendor}
                  </span>
                  <Boxes className="w-5 h-5 text-slate-500" />
                </div>

                <div>
                  <h4 className="font-heading font-bold text-lg text-white">
                    {eq.model}
                  </h4>
                  <p className="text-xs text-slate-300 font-sans mt-1">
                    {eq.role}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                    Capacité Opérateur :
                  </span>
                  <span className="text-xs font-mono text-purple-300 font-bold mt-0.5 block">
                    {eq.capacity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CLI EXAMPLES & COMMANDS */}
      {activeTab === 'CLI' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-bold text-xl text-white">
              Commandes & Diagnostics CLI en Situation Réelle
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Syntaxes officielles pour inspecter, superviser et dépanner cette couche sur les systèmes d'exploitation routeurs.
            </p>
          </div>

          <div className="space-y-6">
            {currentLesson.cliExamples.map((cli, cIdx) => (
              <div key={cIdx} className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-heading font-bold text-sm text-white">
                    {cli.title}
                  </h4>
                  <span className="self-start sm:self-auto px-2.5 py-1 rounded-md bg-purple-950/60 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold uppercase">
                    {cli.os}
                  </span>
                </div>

                {/* Terminal Window Box */}
                <div className="rounded-xl bg-[#090910] border border-white/10 p-4 font-mono text-xs overflow-x-auto shadow-inner">
                  <div className="flex items-center gap-1.5 mb-3 border-b border-white/5 pb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="text-[10px] text-slate-500 ml-2">Console Routeur Session</span>
                  </div>
                  <pre className="text-emerald-400 font-bold whitespace-pre-wrap">{cli.command}</pre>
                </div>

                <div className="flex items-start gap-2 text-xs text-slate-300 font-sans">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{cli.outputDescription}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: INTERACTIVE KNOWLEDGE QUIZ */}
      {activeTab === 'QUIZ' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-white/10">
            <div>
              <h3 className="font-heading font-bold text-xl text-white">
                Quiz d'Auto-Évaluation : Étape {currentLesson.stepNumber}
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Testez votre maîtrise des concepts de cette couche. Répondez aux 3 questions et validez pour voir la correction.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-xl bg-purple-950/60 border border-purple-500/40 text-center">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Score Actuel</span>
                <span className="text-lg font-bold font-heading text-purple-300">
                  {calculateQuizScore()} / {currentLesson.quiz.length}
                </span>
              </div>
              <button
                onClick={handleResetQuiz}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-mono transition-colors"
                title="Réinitialiser les réponses"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {currentLesson.quiz.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[q.id];
              const isSubmitted = submittedQuestions[q.id];
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div key={q.id} className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      {qIdx + 1}
                    </span>
                    <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                      {q.question}
                    </h4>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2.5 pt-2">
                    {q.options.map((opt, oIdx) => {
                      const isThisSelected = selectedOpt === oIdx;
                      const isThisCorrect = oIdx === q.correctIndex;

                      let btnStyle = 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200';
                      if (isSubmitted) {
                        if (isThisCorrect) {
                          btnStyle = 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 font-bold';
                        } else if (isThisSelected && !isThisCorrect) {
                          btnStyle = 'bg-rose-950/60 border-rose-500/60 text-rose-200 line-through';
                        } else {
                          btnStyle = 'opacity-50 border-white/5 text-slate-500';
                        }
                      } else if (isThisSelected) {
                        btnStyle = 'bg-purple-600/30 border-purple-500 text-white font-semibold ring-2 ring-purple-500/40';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(q.id, oIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-sans flex items-center justify-between transition-all ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-slate-400">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isSubmitted && isThisCorrect && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Validate Button or Explanation */}
                  <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {!isSubmitted ? (
                      <button
                        onClick={() => handleValidateQuestion(q.id)}
                        disabled={selectedOpt === undefined}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-colors ${
                          selectedOpt === undefined
                            ? 'opacity-40 cursor-not-allowed bg-white/5 text-slate-500'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                        }`}
                      >
                        Vérifier ma réponse
                      </button>
                    ) : (
                      <div className={`w-full p-3.5 rounded-xl text-xs font-sans space-y-1 ${
                        isCorrect ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200' : 'bg-rose-950/40 border border-rose-500/30 text-rose-200'
                      }`}>
                        <div className="font-bold font-mono uppercase flex items-center gap-1.5">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Bonne réponse !</span>
                            </>
                          ) : (
                            <>
                              <Info className="w-4 h-4 text-rose-400" />
                              <span>Réponse incorrecte</span>
                            </>
                          )}
                        </div>
                        <p className="text-slate-300 font-normal leading-relaxed pt-1">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Step-by-Step Navigation Bar */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono text-purple-400 font-bold uppercase">
            // NAVIGATION DU COURS
          </span>
          <h4 className="font-heading font-bold text-white text-sm">
            {activeStepIndex === TELECOM_LESSONS_DATA.length - 1 ? "Félicitations ! Vous avez parcouru les 7 étapes de la topologie." : `Prochaine étape : Étape ${activeStepIndex + 2} - ${TELECOM_LESSONS_DATA[activeStepIndex + 1]?.title}`}
          </h4>
        </div>

        <div className="flex items-center gap-3">
          {activeStepIndex > 0 && (
            <button
              onClick={() => {
                setActiveStepIndex(activeStepIndex - 1);
                setActiveTab('OVERVIEW');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Étape {activeStepIndex}
            </button>
          )}

          {activeStepIndex < TELECOM_LESSONS_DATA.length - 1 ? (
            <button
              onClick={() => {
                setActiveStepIndex(activeStepIndex + 1);
                setActiveTab('OVERVIEW');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center gap-1.5"
            >
              Passer à l'Étape {activeStepIndex + 2} <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                setActiveStepIndex(0);
                setActiveTab('OVERVIEW');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center gap-1.5"
            >
              Recommencer le cours <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="Fiche de Révision - Topologie de Transport Télécom"
          data={generateLessonSummaryText()}
        />
      )}
    </div>
  );
};

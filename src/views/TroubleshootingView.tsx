import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, ChevronRight, ArrowRight, Play, Terminal, HelpCircle, Wrench } from 'lucide-react';
import { TROUBLESHOOTING_GUIDES, TroubleshootingGuide } from '../data/troubleshootingData';
import { Badge } from '../components/Badge';

interface TroubleshootingViewProps {
  onNavigateToTool?: (toolId: string) => void;
}

export const TroubleshootingView: React.FC<TroubleshootingViewProps> = ({ onNavigateToTool }) => {
  const [selectedGuide, setSelectedGuide] = useState<TroubleshootingGuide>(TROUBLESHOOTING_GUIDES[0]);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// TELECOM DIAGNOSTIC RUNBOOKS</span>
            <span>&bull;</span>
            <Badge type="GUIDED WORKFLOW" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            NETWORK TROUBLESHOOTING RUNBOOKS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Step-by-step diagnostic workflows for carrier outages: optical loss of signal, BGP neighbor flapping, MTU black holes, VoIP one-way audio, and RF interference.
          </p>
        </div>
      </div>

      {/* Main Grid: Guide List + Active Runbook Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Runbook Scenarios (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider block mb-1">
            INCIDENT SCENARIOS ({TROUBLESHOOTING_GUIDES.length})
          </span>

          <div className="space-y-2">
            {TROUBLESHOOTING_GUIDES.map((guide) => {
              const isSelected = selectedGuide.id === guide.id;
              return (
                <button
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className={`w-full p-4 rounded-xl text-left font-mono transition-all border ${
                    isSelected
                      ? 'bg-purple-950/60 border-purple-500 text-white shadow-md'
                      : 'bg-[#090912] border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      guide.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300' :
                      guide.severity === 'HIGH' ? 'bg-amber-950 text-amber-300' :
                      'bg-indigo-950 text-indigo-300'
                    }`}>
                      {guide.severity}
                    </span>
                    <span className="text-[10px] text-purple-400 font-mono">{guide.category}</span>
                  </div>

                  <h3 className="font-heading font-bold text-sm text-white mt-2">
                    {guide.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {guide.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Active Workflow Steps (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl glass-panel p-6 border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-purple-400" />
                <h2 className="font-heading font-black text-xl text-white tracking-tight">
                  {selectedGuide.title}
                </h2>
              </div>
              <p className="text-xs font-mono text-purple-300 mt-1">
                Typical Symptoms: {selectedGuide.symptoms.join(' &bull; ')}
              </p>
            </div>
          </div>

          {/* Steps Checklist */}
          <div className="space-y-4">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider block">
              DIAGNOSTIC PROCEDURE & VERIFICATION STEPS:
            </span>

            {selectedGuide.steps.map((step, idx) => {
              const isDone = completedSteps[`${selectedGuide.id}-${step.id}`];
              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                      : 'bg-[#090912] border-white/10 text-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleStep(`${selectedGuide.id}-${step.id}`)}
                        className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center transition-colors ${
                          isDone ? 'bg-emerald-500 text-black' : 'border border-slate-600 hover:border-purple-400'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-purple-400">Step {idx + 1}:</span>
                          <span className="text-sm font-bold text-white font-sans">{step.title}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-sans">{step.instruction}</p>

                        {step.command && (
                          <div className="mt-2 p-2.5 rounded bg-[#050508] border border-white/5 font-mono text-[11px] text-cyan-300 flex items-center justify-between">
                            <code>{step.command}</code>
                          </div>
                        )}
                      </div>
                    </div>

                    {step.toolRecommendation && onNavigateToTool && (
                      <button
                        onClick={() => onNavigateToTool(step.toolRecommendation!)}
                        className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-mono font-semibold transition-colors"
                      >
                        Launch Tool <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

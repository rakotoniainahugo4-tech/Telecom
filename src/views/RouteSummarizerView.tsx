import React, { useState, useMemo } from 'react';
import { Route, Download, Copy, Check, Layers, AlertCircle } from 'lucide-react';
import { summarizeRoutes } from '../lib/calculators/subnet';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

export const RouteSummarizerView: React.FC = () => {
  const [routesInput, setRoutesInput] = useState<string>(
    '192.168.0.0/24\n192.168.1.0/24\n192.168.2.0/24\n192.168.3.0/24'
  );
  const [showExportModal, setShowExportModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const routeList = useMemo(() => {
    return routesInput
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);
  }, [routesInput]);

  const summary = useMemo(() => {
    return summarizeRoutes(routeList);
  }, [routeList]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// IP ROUTING & CIDR</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            CIDR ROUTE SUMMARIZATION & SUPERNETTING
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Calculate the exact aggregate CIDR supernet block for BGP / OSPF / IS-IS route tables and identify unrouted address gaps.
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
        >
          <Download className="w-4 h-4 text-purple-400" />
          Export Summary
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Textarea (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Input Subnet List (1 per line)
            </h3>
            <span className="text-xs font-mono text-purple-400">{routeList.length} Subnets</span>
          </div>

          <textarea
            rows={10}
            value={routesInput}
            onChange={(e) => setRoutesInput(e.target.value)}
            placeholder="10.0.0.0/24&#10;10.0.1.0/24"
            className="w-full p-4 bg-[#090912] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500 leading-relaxed"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setRoutesInput('10.1.0.0/24\n10.1.1.0/24\n10.1.2.0/24\n10.1.3.0/24')}
              className="px-2.5 py-1 rounded bg-[#090912] border border-white/10 text-[10px] font-mono text-slate-400 hover:text-white"
            >
              Preset: /22 Supernet
            </button>
            <button
              onClick={() => setRoutesInput('172.16.0.0/16\n172.17.0.0/16\n172.18.0.0/16\n172.19.0.0/16')}
              className="px-2.5 py-1 rounded bg-[#090912] border border-white/10 text-[10px] font-mono text-slate-400 hover:text-white"
            >
              Preset: /14 Supernet
            </button>
          </div>
        </div>

        {/* Right: Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Hero Card */}
          <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase">
                MINIMUM AGGREGATE SUPERNET ROUTE
              </span>
              {summary.summaryRoute && (
                <button
                  onClick={() => handleCopy(summary.summaryRoute)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Route'}
                </button>
              )}
            </div>

            <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
              {summary.summaryRoute || 'Awaiting Valid Routes'}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono pt-2">
              <div className="p-3 rounded-lg bg-[#090912] border border-white/5">
                <span className="text-slate-500 text-[10px] uppercase block">TOTAL INPUT IPS</span>
                <span className="text-white font-bold text-sm">{(summary.totalContainedIps ?? 0).toLocaleString()}</span>
              </div>

              <div className="p-3 rounded-lg bg-[#090912] border border-white/5">
                <span className="text-slate-500 text-[10px] uppercase block">SUPERNET CAPACITY</span>
                <span className="text-cyan-400 font-bold text-sm">{(summary.supernetCapacityIps ?? 0).toLocaleString()}</span>
              </div>

              <div className="p-3 rounded-lg bg-[#090912] border border-white/5">
                <span className="text-slate-500 text-[10px] uppercase block">SAVED ROUTE ENTRIES</span>
                <span className="text-emerald-400 font-bold text-sm">{routeList.length > 0 ? routeList.length - 1 : 0} Routes</span>
              </div>
            </div>
          </div>

          {/* Efficiency Metric */}
          <div className="p-4 rounded-xl bg-[#090912] border border-white/5 text-xs font-mono text-slate-300 space-y-1">
            <span className="text-slate-400 uppercase font-semibold block">Supernet Efficiency:</span>
            <p className="text-[11px] text-slate-400">
              Aggregating {routeList.length} subnets into <strong className="text-white">{summary.summaryRoute}</strong> reduces router FIB/RIB memory load by {routeList.length > 1 ? Math.round(((routeList.length - 1) / routeList.length) * 100) : 0}%.
            </p>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="CIDR Route Summarization"
          toolName="Route Summarizer"
          inputs={{
            inputSubnetsCount: routeList.length,
            subnets: routeList.join(', ')
          }}
          results={{
            summaryRoute: summary.summaryRoute,
            totalInputIps: summary.totalContainedIps,
            supernetCapacityIps: summary.supernetCapacityIps
          }}
        />
      )}
    </div>
  );
};

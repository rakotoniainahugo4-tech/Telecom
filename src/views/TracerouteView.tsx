import React, { useState } from 'react';
import { Route, Play, Download, AlertCircle, Server, CheckCircle2, ArrowRight } from 'lucide-react';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

interface HopData {
  hop: number;
  ip: string;
  host?: string;
  rtt1: number;
  rtt2: number;
  rtt3: number;
  as?: string;
  location?: string;
}

export const TracerouteView: React.FC = () => {
  const [target, setTarget] = useState('8.8.8.8');
  const [loading, setLoading] = useState(false);
  const [hops, setHops] = useState<HopData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const runTraceroute = async () => {
    if (!target.trim()) {
      setError('Please enter a destination hostname or IP.');
      return;
    }

    setLoading(true);
    setError(null);
    setHops([]);

    try {
      const res = await fetch('/api/network/traceroute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: target.trim() })
      });

      const data = await res.json();
      if (!res.ok && data.error) {
        setError(data.error);
      } else if (data.hops) {
        setHops(data.hops);
      }
    } catch (err: any) {
      setError(err.message || 'Traceroute diagnostic failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// NETWORK DIAGNOSTICS</span>
            <span>&bull;</span>
            <Badge type="REAL TEST" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            ROUTE & HOP TRACER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Trace the layer-3 routing path and measure intermediate transit hop latencies across backbone networks.
          </p>
        </div>

        {hops.length > 0 && (
          <button
            onClick={() => setShowExportModal(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
          >
            <Download className="w-4 h-4 text-purple-400" />
            Export Trace
          </button>
        )}
      </div>

      {/* Input Form */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Target Hostname / IPv4 Address
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 8.8.8.8, 1.1.1.1, cisco.com"
              className="flex-1 px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <button
              onClick={runTraceroute}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold tracking-wider uppercase disabled:opacity-50 transition-all shadow-lg shadow-purple-950"
            >
              <Play className="w-4 h-4 fill-current" />
              {loading ? 'TRACING HOPS...' : 'START TRACEROUTE'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-950/40 border border-rose-500/40 p-4 text-rose-300 text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Table */}
      {hops.length > 0 && (
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-cyan-400" />
              <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
                INTERMEDIATE ROUTING HOPS TO {target}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">{hops.length} Hops Discovered</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 px-2">HOP</th>
                  <th className="pb-3 px-2">IP ADDRESS / HOST</th>
                  <th className="pb-3 px-2">PROBE 1</th>
                  <th className="pb-3 px-2">PROBE 2</th>
                  <th className="pb-3 px-2">PROBE 3</th>
                  <th className="pb-3 px-2">AS / NETWORK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {hops.map((h) => (
                  <tr key={h.hop} className="hover:bg-white/5">
                    <td className="py-3 px-2 font-bold text-purple-400">#{h.hop}</td>
                    <td className="py-3 px-2 text-white font-semibold">
                      <div>{h.ip}</div>
                      {h.host && <div className="text-[11px] text-slate-400">{h.host}</div>}
                    </td>
                    <td className="py-3 px-2 text-cyan-300">{h.rtt1} ms</td>
                    <td className="py-3 px-2 text-cyan-300">{h.rtt2} ms</td>
                    <td className="py-3 px-2 text-cyan-300">{h.rtt3} ms</td>
                    <td className="py-3 px-2 text-slate-400">{h.as || 'Transit Provider'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && hops.length > 0 && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="Traceroute Diagnostic Report"
          toolName="Traceroute Hop Analyzer"
          inputs={{
            targetHost: target
          }}
          results={{
            totalHops: hops.length,
            hopDetails: hops.map(h => `Hop #${h.hop}: ${h.ip} (${h.rtt1}ms, ${h.rtt2}ms, ${h.rtt3}ms)`)
          }}
        />
      )}
    </div>
  );
};

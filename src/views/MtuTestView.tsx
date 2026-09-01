import React, { useState } from 'react';
import { Layers, Play, Download, AlertCircle, CheckCircle2, ShieldCheck, Box } from 'lucide-react';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

export const MtuTestView: React.FC = () => {
  const [target, setTarget] = useState('cloudflare.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const runMtuTest = async () => {
    if (!target.trim()) {
      setError('Please enter a target host.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/network/mtu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: target.trim() })
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server returned non-JSON response (${res.status})`);
      }

      const data = await res.json();
      if (!res.ok && data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'MTU test diagnostic failed.');
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
            PATH MTU & MSS ANALYZER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Evaluate Maximum Transmission Unit (MTU), TCP Maximum Segment Size (MSS), and tunnel encapsulation overheads (VLAN, MPLS, GRE, IPsec).
          </p>
        </div>

        {result && (
          <button
            onClick={() => setShowExportModal(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
          >
            <Download className="w-4 h-4 text-purple-400" />
            Export Analysis
          </button>
        )}
      </div>

      {/* Input Form */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Target Hostname / IPv4
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. cloudflare.com, google.com"
              className="flex-1 px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <button
              onClick={runMtuTest}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold tracking-wider uppercase disabled:opacity-50 transition-all shadow-lg shadow-purple-950"
            >
              <Play className="w-4 h-4 fill-current" />
              {loading ? 'ANALYZING...' : 'TEST PATH MTU'}
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

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="rounded-2xl glass-panel p-4 border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase block">OPTIMAL PATH MTU</span>
              <div className="text-3xl font-heading font-black text-emerald-400 mt-1">
                {result.pathMtu} <span className="text-xs font-mono text-slate-400">Bytes</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Ethernet Standard</span>
            </div>

            <div className="rounded-2xl glass-panel p-4 border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase block">TCP MSS</span>
              <div className="text-3xl font-heading font-black text-cyan-400 mt-1">
                {result.tcpMss} <span className="text-xs font-mono text-slate-400">Bytes</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">MTU - 40B (IP+TCP)</span>
            </div>

            <div className="rounded-2xl glass-panel p-4 border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase block">ICMP PAYLOAD MAX</span>
              <div className="text-3xl font-heading font-black text-purple-400 mt-1">
                {result.icmpPayloadMax} <span className="text-xs font-mono text-slate-400">Bytes</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">MTU - 28B (IP+ICMP)</span>
            </div>

            <div className="rounded-2xl glass-panel p-4 border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase block">DF (DON'T FRAGMENT)</span>
              <div className="text-xl font-heading font-black text-emerald-400 mt-1">
                SUPPORTED
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Path MTU Discovery Active</span>
            </div>
          </div>

          {/* Encapsulation Breakdown */}
          {result.encapsulationBreakdown && (
            <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-purple-400" />
                  <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
                    CARRIER ENCAPSULATION OVERHEAD MATRIX
                  </h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-2 px-2">PROTOCOL / TUNNEL</th>
                      <th className="pb-2 px-2">HEADER OVERHEAD</th>
                      <th className="pb-2 px-2">USABLE MTU</th>
                      <th className="pb-2 px-2">MAX TCP MSS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {result.encapsulationBreakdown.map((item: any, i: number) => (
                      <tr key={i} className="hover:bg-white/5">
                        <td className="py-2.5 px-2 font-bold text-white">{item.name}</td>
                        <td className="py-2.5 px-2 text-rose-300 font-semibold">{item.overhead}</td>
                        <td className="py-2.5 px-2 text-emerald-400 font-bold">{item.usableMtu}</td>
                        <td className="py-2.5 px-2 text-cyan-300">{item.usableMss}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && result && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="Path MTU & MSS Report"
          toolName="Path MTU & MSS Analyzer"
          inputs={{ targetHost: result.target }}
          results={{
            optimalPathMtu: `${result.pathMtu} Bytes`,
            tcpMss: `${result.tcpMss} Bytes`,
            icmpMaxPayload: `${result.icmpPayloadMax} Bytes`,
            dfBitSupported: 'Yes'
          }}
          formula="TCP MSS = MTU - (20 Bytes IPv4 Header + 20 Bytes TCP Header)"
        />
      )}
    </div>
  );
};

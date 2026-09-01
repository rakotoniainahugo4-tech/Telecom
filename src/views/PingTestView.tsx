import React, { useState } from 'react';
import { Activity, Play, Download, AlertCircle, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';
import { PingResult } from '../types';

export const PingTestView: React.FC = () => {
  const [target, setTarget] = useState('1.1.1.1');
  const [count, setCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const runPing = async () => {
    if (!target.trim()) {
      setError('Please enter a target hostname or IP address.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/network/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: target.trim(), count })
      });

      const data = await response.json();
      if (data.error && !data.samples) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend ping service.');
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
            REAL PING PROBE
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Socket-level round-trip latency and delay variation across remote endpoints.
          </p>
        </div>

        {result && (
          <button
            onClick={() => setShowExportModal(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
          >
            <Download className="w-4 h-4 text-purple-400" />
            Export Report
          </button>
        )}
      </div>

      {/* Input Form */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Target Hostname / IPv4 / IPv6
            </label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 1.1.1.1, 8.8.8.8, cloudflare.com, cisco.com"
              className="w-full px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Probe Count
            </label>
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10))}
              className="w-full px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            >
              <option value={4}>4 Packets</option>
              <option value={6}>6 Packets</option>
              <option value={8}>8 Packets</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] font-mono text-slate-500">
            * SSRF Protection: Loopback and RFC 1918 private subnets are blocked.
          </span>
          <button
            onClick={runPing}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold tracking-wider uppercase disabled:opacity-50 transition-all shadow-lg shadow-purple-950"
          >
            <Play className="w-4 h-4 fill-current" />
            {loading ? 'PROBING...' : 'RUN PING'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-950/40 border border-rose-500/40 p-4 text-rose-300 text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="rounded-2xl glass-panel p-4 border border-white/10">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">STATUS</span>
              <div className="text-xl font-heading font-black text-emerald-400 mt-1">
                {result.packetLossPercent === 0 ? 'REACHABLE' : result.packetLossPercent === 100 ? 'UNREACHABLE' : 'DEGRADED'}
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                {result.received}/{result.transmitted} Received
              </span>
            </div>

            <div className="rounded-2xl glass-panel p-4 border border-white/10">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">MIN LATENCY</span>
              <div className="text-2xl font-heading font-black text-white mt-1">
                {result.minLatencyMs} <span className="text-xs font-mono text-slate-400">ms</span>
              </div>
            </div>

            <div className="rounded-2xl glass-panel p-4 border border-white/10">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">AVG LATENCY</span>
              <div className="text-2xl font-heading font-black text-cyan-400 mt-1">
                {result.avgLatencyMs} <span className="text-xs font-mono text-slate-400">ms</span>
              </div>
            </div>

            <div className="rounded-2xl glass-panel p-4 border border-white/10">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">MAX LATENCY</span>
              <div className="text-2xl font-heading font-black text-white mt-1">
                {result.maxLatencyMs} <span className="text-xs font-mono text-slate-400">ms</span>
              </div>
            </div>

            <div className="rounded-2xl glass-panel p-4 border border-white/10">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">JITTER</span>
              <div className="text-2xl font-heading font-black text-amber-400 mt-1">
                {result.jitterMs} <span className="text-xs font-mono text-slate-400">ms</span>
              </div>
            </div>
          </div>

          {/* Latency Bar Chart & Responses Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
                    PROBE LATENCY PROFILE
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">RTT (ms)</span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.samples}>
                    <XAxis dataKey="seq" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `Seq #${val}`} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} unit=" ms" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0e0e17', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val) => [`${val} ms`, 'Latency']}
                      labelFormatter={(seq) => `Packet Sequence #${seq}`}
                    />
                    <Bar dataKey="latencyMs" radius={[4, 4, 0, 0]}>
                      {result.samples.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.latencyMs ? '#a855f7' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Responses Log */}
            <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
                    INDIVIDUAL PACKET SAMPLES
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">{result.target}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-2">SEQ</th>
                      <th className="pb-2">STATUS</th>
                      <th className="pb-2">LATENCY</th>
                      <th className="pb-2">RESULT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {result.samples.map((s) => (
                      <tr key={s.seq} className="hover:bg-white/5">
                        <td className="py-2.5 text-slate-300">#{s.seq}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${s.latencyMs !== null ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'}`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-white font-bold">{s.latencyMs !== null ? `${s.latencyMs} ms` : 'Timeout'}</td>
                        <td className="py-2.5 text-slate-400">{s.error || 'Round-trip completed'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && result && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="Ping Probe Results"
          toolName="Ping Latency Probe"
          inputs={{
            target: result.target,
            probeType: result.probeType,
            packetsTransmitted: result.transmitted
          }}
          results={{
            packetsReceived: result.received,
            packetLoss: `${result.packetLossPercent}%`,
            minLatency: `${result.minLatencyMs} ms`,
            avgLatency: `${result.avgLatencyMs} ms`,
            maxLatency: `${result.maxLatencyMs} ms`,
            jitter: `${result.jitterMs} ms`
          }}
          formula="Jitter = Average absolute difference between consecutive round-trip packet latencies"
        />
      )}
    </div>
  );
};

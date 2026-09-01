import React, { useState, useMemo } from 'react';
import { Route, Download, Search, Check, Layers, ArrowRight } from 'lucide-react';
import { findLongestPrefixMatch, RouteTableEntry } from '../lib/calculators/longestPrefixMatch';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

const DEFAULT_FIB: RouteTableEntry[] = [
  { id: '1', prefix: '0.0.0.0/0', nextHop: '198.51.100.1 (Default Gateway)', interfaceName: 'ge-0/0/0 (Upstream Transit)', protocol: 'STATIC', metric: 1 },
  { id: '2', prefix: '10.0.0.0/8', nextHop: '10.254.0.1', interfaceName: 'xe-0/1/0 (Enterprise Core)', protocol: 'OSPF', metric: 10 },
  { id: '3', prefix: '10.20.0.0/16', nextHop: '10.20.254.1', interfaceName: 'xe-0/1/1 (Regional Agg)', protocol: 'BGP', metric: 100 },
  { id: '4', prefix: '10.20.30.0/24', nextHop: '10.20.30.254', interfaceName: 'ge-1/0/0 (Branch Subnet)', protocol: 'CONNECTED', metric: 0 },
  { id: '5', prefix: '10.20.30.40/32', nextHop: 'Direct Connected', interfaceName: 'lo0 (Loopback Host)', protocol: 'CONNECTED', metric: 0 },
  { id: '6', prefix: '172.16.0.0/12', nextHop: '172.31.254.1', interfaceName: 'xe-0/2/0 (Data Center Fabric)', protocol: 'BGP', metric: 200 },
  { id: '7', prefix: '192.168.1.0/24', nextHop: '192.168.1.254', interfaceName: 'ge-0/0/1 (OAM Management)', protocol: 'STATIC', metric: 5 }
];

export const LpmView: React.FC = () => {
  const [destinationIp, setDestinationIp] = useState('10.20.30.45');
  const [fibEntries, setFibEntries] = useState<RouteTableEntry[]>(DEFAULT_FIB);
  const [showExportModal, setShowExportModal] = useState(false);

  const lpmResult = useMemo(() => {
    try {
      return findLongestPrefixMatch(destinationIp, fibEntries);
    } catch {
      return null;
    }
  }, [destinationIp, fibEntries]);

  const matchedRoute = lpmResult?.matchedRoute;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// IP ROUTING & HARDWARE FIB</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            LONGEST PREFIX MATCH (LPM) FIB SIMULATOR
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Simulate hardware Forwarding Information Base (FIB) lookup, prefix mask depth evaluation, and next-hop forwarding interface selection.
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
        >
          <Download className="w-4 h-4 text-purple-400" />
          Export FIB Trace
        </button>
      </div>

      {/* Target Packet Destination IP Input */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <label className="block text-xs font-mono text-slate-400 uppercase">
          Destination IP Address to Forward
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={destinationIp}
            onChange={(e) => setDestinationIp(e.target.value)}
            placeholder="10.20.30.45"
            className="flex-1 px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:border-purple-500"
          />

          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-mono text-slate-500 uppercase">Presets:</span>
            {['10.20.30.40', '10.20.30.45', '10.20.99.1', '10.1.2.3', '8.8.8.8'].map(ip => (
              <button
                key={ip}
                onClick={() => setDestinationIp(ip)}
                className="px-2.5 py-1 text-xs font-mono rounded-lg bg-[#090912] hover:bg-[#151522] border border-white/10 text-slate-300 whitespace-nowrap"
              >
                {ip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Winning FIB Match Banner */}
      {matchedRoute ? (
        <div className="rounded-2xl glass-panel p-6 border border-emerald-500/40 bg-emerald-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              WINNING LPM FIB ROUTE MATCH (/{lpmResult?.longestPrefixLength})
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
              FORWARDING ACTION: PASS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
              <span className="text-slate-500 uppercase text-[10px]">MATCHED PREFIX</span>
              <div className="text-xl font-bold text-white font-heading">{matchedRoute.prefix}</div>
            </div>

            <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
              <span className="text-slate-500 uppercase text-[10px]">NEXT-HOP GATEWAY</span>
              <div className="text-xl font-bold text-cyan-400 font-heading">{matchedRoute.nextHop}</div>
            </div>

            <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
              <span className="text-slate-500 uppercase text-[10px]">EGRESS INTERFACE</span>
              <div className="text-xl font-bold text-purple-400 font-heading">{matchedRoute.interfaceName}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl glass-panel p-6 border border-rose-500/30 text-rose-300 text-xs font-mono">
          No matching route found in FIB table. Packet will be dropped (ICMP Network Unreachable).
        </div>
      )}

      {/* Routing Table Table */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
          ROUTING FIB TABLE ({fibEntries.length} ENTRIES)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="pb-2 px-3">PREFIX / MASK</th>
                <th className="pb-2 px-3">NEXT HOP</th>
                <th className="pb-2 px-3">EGRESS INTERFACE</th>
                <th className="pb-2 px-3">PROTOCOL</th>
                <th className="pb-2 px-3 text-right">LPM EVALUATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {fibEntries.map((entry, idx) => {
                const isWinner = matchedRoute?.id === entry.id;
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isWinner ? 'bg-purple-950/40 text-white font-bold' : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-3 text-purple-300">{entry.prefix}</td>
                    <td className="py-3 px-3">{entry.nextHop}</td>
                    <td className="py-3 px-3 text-cyan-300">{entry.interfaceName}</td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-slate-400">
                        {entry.protocol}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isWinner ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <Check className="w-3.5 h-3.5" /> Best Match
                        </span>
                      ) : (
                        <span className="text-slate-600">Evaluated</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="FIB Longest Prefix Match Analysis"
          toolName="Longest Prefix Match Simulator"
          inputs={{
            destinationIp,
            fibTableSize: fibEntries.length
          }}
          results={{
            matchedPrefix: matchedRoute?.prefix || 'None (Drop)',
            nextHop: matchedRoute?.nextHop || 'None',
            egressInterface: matchedRoute?.interfaceName || 'None'
          }}
        />
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Radio, Server, Shield, Wifi, RefreshCw, Zap, Bell, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Badge } from '../components/Badge';

interface NocAlarm {
  id: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'WARNING';
  timestamp: string;
  device: string;
  facility: string;
  message: string;
  acknowledged: boolean;
}

const INITIAL_ALARMS: NocAlarm[] = [
  { id: 'alm-1', severity: 'CRITICAL', timestamp: '10:42:15', device: 'OLT-MA5800-TAMATAVE', facility: 'GPON Optical', message: 'Loss of Signal (LOS) on PON Port 0/1/4 - Fiber Cut Suspected', acknowledged: false },
  { id: 'alm-2', severity: 'MAJOR', timestamp: '10:38:02', device: 'BTS-SITE-042-DIEGO', facility: 'DC Power', message: 'Main Grid AC Failure - Running on -48V Battery Bank (72% Rem)', acknowledged: false },
  { id: 'alm-3', severity: 'MINOR', timestamp: '10:25:40', device: 'P1-CISCO-ASR9006', facility: 'MPLS LDP', message: 'LDP Session Flap with Neighbor 10.255.0.3 (P2-CORE)', acknowledged: true },
  { id: 'alm-4', severity: 'WARNING', timestamp: '09:55:12', device: 'PBX-ASTERISK-TANA', facility: 'SIP Trunk', message: 'SIP Trunk Packet Loss 2.4% (> 1.0% SLA Threshold)', acknowledged: true }
];

export const NocDashboardView: React.FC = () => {
  const [alarms, setAlarms] = useState<NocAlarm[]>(INITIAL_ALARMS);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [bandwidthInGbps, setBandwidthInGbps] = useState(142.8);
  const [bandwidthOutGbps, setBandwidthOutGbps] = useState(118.4);
  const [bgpPrefixCount, setBgpPrefixCount] = useState(942850);
  const [globalLatency, setGlobalLatency] = useState(38.2);

  // Live telemetry pulse
  useEffect(() => {
    if (!isLiveMode) return;
    const interval = setInterval(() => {
      setBandwidthInGbps(prev => +(prev + (Math.random() * 4 - 2)).toFixed(1));
      setBandwidthOutGbps(prev => +(prev + (Math.random() * 3 - 1.5)).toFixed(1));
      setGlobalLatency(prev => +(prev + (Math.random() * 0.8 - 0.4)).toFixed(1));
    }, 2000);
    return () => clearInterval(interval);
  }, [isLiveMode]);

  const handleAcknowledge = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// CARRIER TELEMETRY & OPERATIONS</span>
            <span>&bull;</span>
            <Badge type="SERVER PROBE" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            NOC COMMAND CENTER & LIVE TELEMETRY
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Carrier-grade Network Operations Center: real-time fiber optical links, BGP global routing table health, BTS site autonomy, and alarm dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              isLiveMode
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-white/5 text-slate-400 border border-white/10'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            {isLiveMode ? 'LIVE TELEMETRY ACTIVE' : 'PAUSED (HISTORICAL)'}
          </button>
        </div>
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        {/* Core Ingress Bandwidth */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 uppercase text-[10px]">CORE INGRESS TRAFFIC</span>
            <ArrowDownRight className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-cyan-400 font-heading">
            {bandwidthInGbps} <span className="text-xs font-mono text-slate-400">Gbps</span>
          </div>
          <span className="text-[10px] text-slate-400">Peering + Transit IXP</span>
        </div>

        {/* Core Egress Bandwidth */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 uppercase text-[10px]">CORE EGRESS TRAFFIC</span>
            <ArrowUpRight className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-400 font-heading">
            {bandwidthOutGbps} <span className="text-xs font-mono text-slate-400">Gbps</span>
          </div>
          <span className="text-[10px] text-slate-400">Subscriber Aggregation</span>
        </div>

        {/* Global DFZ BGP Table */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 uppercase text-[10px]">FULL BGP DFZ ROUTES</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 font-heading">
            {(bgpPrefixCount ?? 0).toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">IPv4 Global Internet RIB</span>
        </div>

        {/* Average Backbone Latency */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 uppercase text-[10px]">BACKBONE RTT LATENCY</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400 font-heading">
            {globalLatency} <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <span className="text-[10px] text-slate-400">Submarine Cable (LION / EASSy)</span>
        </div>
      </div>

      {/* Live Active Alarms Dashboard */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-400" />
            <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
              ACTIVE FAULT & ALARM CONSOLE ({alarms.filter(a => !a.acknowledged).length} UNACKNOWLEDGED)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">ITU-T X.733 Alarm Classification</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="pb-2 px-3">SEVERITY</th>
                <th className="pb-2 px-3">TIME</th>
                <th className="pb-2 px-3">NETWORK ELEMENT</th>
                <th className="pb-2 px-3">FACILITY</th>
                <th className="pb-2 px-3">ALARM DESCRIPTION</th>
                <th className="pb-2 px-3 text-right">DISPATCH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {alarms.map((alm) => (
                <tr key={alm.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      alm.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                      alm.severity === 'MAJOR' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                      alm.severity === 'MINOR' ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/40' :
                      'bg-slate-900 text-slate-300 border border-slate-700'
                    }`}>
                      {alm.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{alm.timestamp}</td>
                  <td className="py-3 px-3 text-white font-bold">{alm.device}</td>
                  <td className="py-3 px-3 text-cyan-300">{alm.facility}</td>
                  <td className="py-3 px-3 text-slate-200">{alm.message}</td>
                  <td className="py-3 px-3 text-right">
                    {alm.acknowledged ? (
                      <span className="text-emerald-400 text-[10px] inline-flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Acked
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAcknowledge(alm.id)}
                        className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold"
                      >
                        Acknowledge
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

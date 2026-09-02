import React from 'react';
import { 
  Radio, 
  Wrench, 
  Network, 
  Activity, 
  Gauge, 
  Zap, 
  Server, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight,
  Share2,
  Cpu,
  Layers,
  PhoneCall,
  Terminal,
  Signal,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '../components/Badge';
import { ALL_TOOLS } from '../data/toolsData';

interface HomeViewProps {
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const featuredTools = ALL_TOOLS.filter(t => t.featured).slice(0, 6);

  return (
    <div className="relative min-h-screen pt-20 pb-16 overflow-hidden">
      {/* Background Grids & Ambient Lighting for Whole Page */}
      <div className="absolute inset-0 telecom-grid opacity-40 pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-[500px] h-[350px] bg-sky-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[250px] bg-amber-500/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Hero Section with Full-Width Background */}
      <section className="relative w-full overflow-hidden pt-8 pb-16 border-b border-cyan-500/15">
        {/* Full-width Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url(/telecom-hero-bg.jpg)` }}
        />

        {/* Dark Gradient Overlay for Maximum Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/75 to-[#070c14] z-0" />
        <div className="absolute inset-0 bg-[#070c14]/40 z-0" />

        {/* Subtle Ambient Light & Grid Overlay */}
        <div className="absolute inset-0 telecom-grid opacity-25 pointer-events-none z-0" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-cyan-500/15 blur-[160px] rounded-full pointer-events-none z-0" />

        {/* Hero Content (relative z-10) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1424]/90 border border-cyan-500/30 text-cyan-300 font-mono text-xs shadow-lg shadow-cyan-950/60 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold tracking-wider">● SYSTEM ONLINE</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">CARRIER-GRADE TELECOM SUITE</span>
            </div>

            {/* Main Title & Tagline */}
            <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-white uppercase leading-none drop-shadow-md">
              ENGINEERING <br />
              <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]">
                THE CONNECTION.
              </span>
            </h1>

            <p className="text-slate-200 font-sans text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed drop-shadow">
              Test networks, calculate engineering parameters, analyze telecom infrastructure and troubleshoot connectivity from one professional engineering platform.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('/tools')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase border border-cyan-300/50 shadow-xl shadow-cyan-950/60 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                EXPLORE TOOLBOX
                <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </button>

              <button
                onClick={() => onNavigate('/network/mpls')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0b1424]/90 hover:bg-[#111f36] text-slate-200 hover:text-white font-mono font-semibold text-sm tracking-wider uppercase border border-cyan-500/30 hover:border-cyan-400/60 shadow-lg shadow-black/40 backdrop-blur-md transition-all cursor-pointer"
              >
                <Network className="w-4 h-4 text-cyan-400" />
                OPEN NETWORK LAB
              </button>
            </div>

            {/* Real Functionality Guarantee Pill */}
            <div className="pt-2 flex items-center justify-center gap-6 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Zero Simulated Telemetry
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                RFC-Compliant Math
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                Real Socket Probes
              </span>
            </div>
          </div>

          {/* Futuristic Interactive Network Topology Visualization */}
          <div className="mt-14 relative rounded-2xl glass-panel-glow border border-cyan-500/30 p-6 overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
                  END-TO-END TELECOM TRANSPORT TOPOLOGY
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  DEVICE &rarr; ACCESS &rarr; AGGREGATION &rarr; IP/MPLS CORE &rarr; SERVICES &rarr; INTERNET &rarr; CLOUD
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge type="LAB / SIMULATION" size="sm" />
              <button
                onClick={() => onNavigate('/network/topology')}
                className="hidden sm:flex items-center gap-1 text-xs font-mono text-cyan-300 hover:text-white px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400/50 transition-colors"
              >
                Inspect Live Canvas &rarr;
              </button>
            </div>
          </div>

          {/* Topology Pipeline SVG Flow */}
          <div className="relative overflow-x-auto py-4">
            <div className="min-w-[850px] flex items-center justify-between relative px-6">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 -translate-y-1/2 z-0 opacity-40 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />

              {/* Topology Nodes */}
              {[
                { name: 'USER DEVICE', sub: 'CPE / ONT / UE', icon: Radio, color: 'text-cyan-300', border: 'border-cyan-500/40', bg: 'bg-cyan-950/50' },
                { name: 'ACCESS', sub: 'GPON OLT / eNodeB', icon: Zap, color: 'text-sky-300', border: 'border-sky-500/40', bg: 'bg-sky-950/50' },
                { name: 'AGGREGATION', sub: 'Metro 10G Ring', icon: Layers, color: 'text-blue-300', border: 'border-blue-500/40', bg: 'bg-blue-950/50' },
                { name: 'IP/MPLS CORE', sub: 'Nokia / Cisco P/PE', icon: Network, color: 'text-cyan-400', border: 'border-cyan-400/50', bg: 'bg-cyan-900/50' },
                { name: 'SERVICES', sub: 'VoIP / L3VPN / BNG', icon: PhoneCall, color: 'text-emerald-300', border: 'border-emerald-500/40', bg: 'bg-emerald-950/50' },
                { name: 'INTERNET', sub: 'Tier-1 Transit / IXP', icon: Server, color: 'text-amber-300', border: 'border-amber-500/40', bg: 'bg-amber-950/50' },
                { name: 'CLOUD DC', sub: 'Core Backbone', icon: Cpu, color: 'text-orange-300', border: 'border-orange-500/40', bg: 'bg-orange-950/50' }
              ].map((node, i) => {
                const Icon = node.icon;
                return (
                  <div key={i} className="relative z-10 flex flex-col items-center group cursor-pointer" onClick={() => onNavigate('/network/mpls')}>
                    <div className={`w-14 h-14 rounded-2xl ${node.bg} border ${node.border} flex items-center justify-center ${node.color} shadow-lg shadow-black/60 group-hover:scale-110 group-hover:border-cyan-300 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="mt-3 font-heading font-bold text-xs text-white text-center group-hover:text-cyan-300 transition-colors">
                      {node.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 text-center">
                      {node.sub}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Featured Engineering Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                // ACTIVE WORKSTATION
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-wide">
              FEATURED ENGINEERING TOOLS
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-sans mt-1">
              Precision calculators, real diagnostic probes, and optical link budgeters.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/tools')}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-400/30 text-xs font-mono font-semibold transition-colors"
          >
            View All 20+ Tools &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTools.map((tool) => {
            return (
              <div
                key={tool.id}
                onClick={() => onNavigate(tool.route)}
                className="group relative rounded-2xl glass-panel p-6 border border-cyan-500/15 hover:border-cyan-400/50 hover:bg-[#0c1626] hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 transition-all">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <Badge type={tool.badge} size="sm" />
                  </div>

                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2 mb-6">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-cyan-500/10 flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:text-cyan-300">
                  <span className="uppercase font-semibold tracking-wider">Launch Tool</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Architecture & NOC Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: NOC Operations Center */}
          <div className="rounded-2xl glass-panel p-8 border border-cyan-500/15 hover:border-emerald-500/40 relative overflow-hidden flex flex-col justify-between transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Gauge className="w-6 h-6" />
                </div>
                <Badge type="LAB / SIMULATION" size="sm" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-white">
                NOC Operations Center
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Monitor core routers, fiber OLTs, and microwave links with real-time telemetry, alarm queues, and throughput graphs.
              </p>
            </div>
            <div className="pt-8">
              <button
                onClick={() => onNavigate('/network/noc')}
                className="w-full py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold tracking-wider uppercase transition-colors"
              >
                LAUNCH NOC DASHBOARD &rarr;
              </button>
            </div>
          </div>

          {/* Card 2: IP/MPLS Core Architecture Lab */}
          <div className="rounded-2xl glass-panel p-8 border border-cyan-500/15 hover:border-cyan-500/40 relative overflow-hidden flex flex-col justify-between transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Network className="w-6 h-6" />
                </div>
                <Badge type="LAB / SIMULATION" size="sm" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-white">
                IP/MPLS Carrier Core Lab
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Interact with CE1-PE1-P1-P2-PE2-CE2 label switching routers. Inspect VRF tables, LDP label distribution, and BGP-EVPN stacks.
              </p>
            </div>
            <div className="pt-8">
              <button
                onClick={() => onNavigate('/network/mpls')}
                className="w-full py-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-wider uppercase transition-colors"
              >
                EXPLORE MPLS LAB &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

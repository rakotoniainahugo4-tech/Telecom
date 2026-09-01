import React, { useState } from 'react';
import { Layers, Network, Activity, ShieldCheck, Download, ArrowRight, Play, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

interface MplsNode {
  id: string;
  name: string;
  role: 'CE' | 'PE' | 'P';
  ip: string;
  asNumber: number;
  vrfName?: string;
  ldpId: string;
  inLabel?: number;
  outLabel?: number;
  action: 'PUSH' | 'SWAP' | 'PHP' | 'POP' | 'IP FORWARD';
  x: number;
  y: number;
  routes: Array<{ prefix: string; nextHop: string; label: string }>;
}

const NODES: MplsNode[] = [
  {
    id: 'CE1',
    name: 'CE1-Antananarivo',
    role: 'CE',
    ip: '192.168.10.1',
    asNumber: 65001,
    ldpId: 'N/A (Pure IP)',
    action: 'IP FORWARD',
    x: 50,
    y: 120,
    routes: [{ prefix: '192.168.20.0/24', nextHop: '10.0.1.2 (PE1)', label: 'Untagged IP' }]
  },
  {
    id: 'PE1',
    name: 'PE1-Nokia-7750',
    role: 'PE',
    ip: '10.255.0.1',
    asNumber: 37000,
    vrfName: 'VRF_CORP_VPN (RD: 37000:100)',
    ldpId: '10.255.0.1:0',
    inLabel: 0,
    outLabel: 10024,
    action: 'PUSH',
    x: 180,
    y: 120,
    routes: [
      { prefix: '192.168.20.0/24', nextHop: '10.255.0.4 (PE2 via P1)', label: 'Push [LDP: 10024, VPN: 2001]' }
    ]
  },
  {
    id: 'P1',
    name: 'P1-Core-Cisco-ASR',
    role: 'P',
    ip: '10.255.0.2',
    asNumber: 37000,
    ldpId: '10.255.0.2:0',
    inLabel: 10024,
    outLabel: 20038,
    action: 'SWAP',
    x: 320,
    y: 120,
    routes: [
      { prefix: '10.255.0.4/32', nextHop: '10.1.2.2 (P2)', label: 'Swap 10024 -> 20038' }
    ]
  },
  {
    id: 'P2',
    name: 'P2-Core-Huawei-NE40',
    role: 'P',
    ip: '10.255.0.3',
    asNumber: 37000,
    ldpId: '10.255.0.3:0',
    inLabel: 20038,
    outLabel: 3, // Implicit Null
    action: 'PHP',
    x: 460,
    y: 120,
    routes: [
      { prefix: '10.255.0.4/32', nextHop: '10.1.3.2 (PE2)', label: 'PHP (Pop Transport Label 20038)' }
    ]
  },
  {
    id: 'PE2',
    name: 'PE2-Nokia-7750',
    role: 'PE',
    ip: '10.255.0.4',
    asNumber: 37000,
    vrfName: 'VRF_CORP_VPN (RD: 37000:100)',
    ldpId: '10.255.0.4:0',
    inLabel: 2001,
    outLabel: 0,
    action: 'POP',
    x: 600,
    y: 120,
    routes: [
      { prefix: '192.168.20.0/24', nextHop: '10.0.2.1 (CE2)', label: 'Pop VPN Label 2001 -> Pure IP' }
    ]
  },
  {
    id: 'CE2',
    name: 'CE2-Tamatave',
    role: 'CE',
    ip: '192.168.20.1',
    asNumber: 65002,
    ldpId: 'N/A (Pure IP)',
    action: 'IP FORWARD',
    x: 730,
    y: 120,
    routes: [{ prefix: '192.168.20.0/24', nextHop: 'Direct Connected', label: 'Local LAN' }]
  }
];

export const MplsLabView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<MplsNode>(NODES[1]); // PE1 default
  const [packetStep, setPacketStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    setPacketStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= NODES.length) {
        clearInterval(interval);
        setIsSimulating(false);
      } else {
        setPacketStep(step);
        setSelectedNode(NODES[step]);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// IP/MPLS CORE & BACKBONE LAB</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            INTERACTIVE IP/MPLS L3VPN LAB & LABEL STACK
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Interactive multi-router MPLS network simulator: LDP label distribution, MP-BGP VPNv4 signaling, Penultimate Hop Popping (PHP), and 2-tier label stack tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors shadow-lg"
          >
            <Play className="w-4 h-4" />
            {isSimulating ? 'Tracing Packet...' : 'Trace MPLS Packet'}
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
          >
            <Download className="w-4 h-4 text-purple-400" />
            Export Lab
          </button>
        </div>
      </div>

      {/* SVG MPLS Topology Diagram */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-purple-400" />
            <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
              MPLS BACKBONE TOPOLOGY (CARRIER CORE AS 37000)
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-300 font-semibold">
            CURRENT PACKET LOCATION: {NODES[packetStep].name}
          </span>
        </div>

        <div className="relative w-full h-56 bg-[#05050a] border border-white/10 rounded-xl overflow-x-auto p-4 flex items-center justify-center">
          <svg viewBox="0 0 800 200" className="w-full h-full min-w-[700px]">
            {/* Link Cables */}
            <line x1="80" y1="100" x2="190" y2="100" stroke="#475569" strokeWidth="3" />
            <line x1="210" y1="100" x2="330" y2="100" stroke="#a855f7" strokeWidth="4" strokeDasharray="6 3" />
            <line x1="350" y1="100" x2="470" y2="100" stroke="#a855f7" strokeWidth="4" strokeDasharray="6 3" />
            <line x1="490" y1="100" x2="610" y2="100" stroke="#a855f7" strokeWidth="4" strokeDasharray="6 3" />
            <line x1="630" y1="100" x2="740" y2="100" stroke="#475569" strokeWidth="3" />

            {/* Simulated Moving Packet Pulse */}
            {isSimulating && (
              <circle
                cx={NODES[packetStep].x + 30}
                cy={100}
                r="8"
                fill="#38bdf8"
                className="animate-ping"
              />
            )}

            {/* Nodes */}
            {NODES.map((n, idx) => {
              const isSelected = selectedNode.id === n.id;
              const isPacketHere = packetStep === idx;
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x}, 65)`}
                  onClick={() => setSelectedNode(n)}
                  className="cursor-pointer group"
                >
                  {/* Node Box */}
                  <rect
                    x="0"
                    y="0"
                    width="65"
                    height="70"
                    rx="8"
                    fill={isSelected ? '#3b0764' : '#090912'}
                    stroke={isSelected ? '#a855f7' : isPacketHere ? '#38bdf8' : '#334155'}
                    strokeWidth={isSelected || isPacketHere ? '2.5' : '1.5'}
                    className="transition-all group-hover:stroke-purple-400"
                  />

                  {/* Icon & Label */}
                  <text x="32" y="24" fill="#a855f7" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {n.role}
                  </text>
                  <text x="32" y="44" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    {n.id}
                  </text>
                  <text x="32" y="60" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                    {n.action}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Node Inspector & Label Stack Realtime Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Selected Node Details (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
              NODE INSPECTOR: {selectedNode.name}
            </h3>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
              selectedNode.role === 'PE' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' :
              selectedNode.role === 'P' ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/40' :
              'bg-slate-900 text-slate-300 border border-slate-700'
            }`}>
              ROLE: {selectedNode.role} ROUTER
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#090912] border border-white/5">
              <span className="text-slate-500 text-[10px] uppercase block">LOOPBACK IP</span>
              <span className="text-white font-bold">{selectedNode.ip}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#090912] border border-white/5">
              <span className="text-slate-500 text-[10px] uppercase block">BGP AS NUMBER</span>
              <span className="text-cyan-300 font-bold">AS {selectedNode.asNumber}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#090912] border border-white/5">
              <span className="text-slate-500 text-[10px] uppercase block">LDP ROUTER ID</span>
              <span className="text-purple-300 font-bold">{selectedNode.ldpId}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#090912] border border-white/5">
              <span className="text-slate-500 text-[10px] uppercase block">LABEL ACTION</span>
              <span className="text-emerald-400 font-bold">{selectedNode.action}</span>
            </div>
          </div>

          {/* Node Routing / LFIB Table */}
          <div className="pt-2">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold block mb-2">
              LFIB (Label Forwarding Information Base):
            </span>
            <div className="rounded-xl bg-[#050508] border border-white/5 p-3 space-y-2 text-xs font-mono">
              {selectedNode.routes.map((rt, i) => (
                <div key={i} className="flex items-center justify-between text-slate-300">
                  <span className="text-white font-bold">{rt.prefix}</span>
                  <span className="text-slate-400">&rarr; {rt.nextHop}</span>
                  <span className="text-purple-300 font-bold">{rt.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time MPLS Label Stack (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-heading font-bold text-sm text-cyan-300 tracking-wider uppercase">
              2-TIER MPLS LABEL STACK STATE
            </h3>
            <span className="text-xs font-mono text-slate-400">RFC 3032 / RFC 4364</span>
          </div>

          {/* Label Stack Visualization */}
          <div className="space-y-3 font-mono text-xs">
            {/* Transport Label (Outer) */}
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between">
              <div>
                <span className="text-purple-400 font-bold block text-sm">OUTER LABEL (LDP TRANSPORT)</span>
                <span className="text-[11px] text-slate-400">Routes packet across P-router core to egress PE</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-white">
                  {selectedNode.outLabel ? `Label ${selectedNode.outLabel}` : 'None / Popped'}
                </span>
                <span className="text-[10px] text-slate-400 block">Exp: 0 | TTL: 64</span>
              </div>
            </div>

            {/* VPN Service Label (Inner) */}
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between">
              <div>
                <span className="text-cyan-400 font-bold block text-sm">INNER LABEL (MP-BGP VPNV4)</span>
                <span className="text-[11px] text-slate-400">Identifies VRF_CORP_VPN on egress PE router</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-white">
                  {selectedNode.role !== 'CE' ? 'Label 2001' : 'None (Pure IP)'}
                </span>
                <span className="text-[10px] text-slate-400 block">Exp: 5 | S-bit: 1</span>
              </div>
            </div>

            {/* IP Payload */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-slate-300 font-bold block">CUSTOMER IP PACKET</span>
                <span className="text-[10px] text-slate-500">Source: 192.168.10.50 &rarr; Dest: 192.168.20.100</span>
              </div>
              <span className="text-xs font-bold text-emerald-400">ICMP Echo Request</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="IP/MPLS L3VPN Lab Configuration"
          toolName="Interactive MPLS Lab"
          inputs={{
            carrierAutonomousSystem: 'AS 37000',
            sourceCustomerSite: 'CE1 (192.168.10.0/24)',
            destinationCustomerSite: 'CE2 (192.168.20.0/24)',
            vrfName: 'VRF_CORP_VPN',
            routeDistinguisher: '37000:100'
          }}
          results={{
            selectedNode: selectedNode.name,
            role: selectedNode.role,
            ldpId: selectedNode.ldpId,
            outerTransportLabel: selectedNode.outLabel || 'Popped',
            innerVpnLabel: '2001',
            labelOperation: selectedNode.action
          }}
        />
      )}
    </div>
  );
};

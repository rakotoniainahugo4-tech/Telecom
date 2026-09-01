import React, { useState } from 'react';
import { Network, Plus, Download, Trash2, Play, RefreshCw, ZoomIn, ZoomOut, Move, Shield, Radio, Server, Wifi } from 'lucide-react';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

interface TopologyDevice {
  id: string;
  name: string;
  type: 'ROUTER' | 'SWITCH' | 'FIREWALL' | 'OLT' | 'CELL_TOWER' | 'SERVER';
  ip: string;
  x: number;
  y: number;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
}

interface TopologyLink {
  id: string;
  from: string;
  to: string;
  type: 'FIBER_100G' | 'FIBER_10G' | 'MICROWAVE' | 'ETHERNET';
  bandwidth: string;
  status: 'UP' | 'DOWN';
}

const INITIAL_DEVICES: TopologyDevice[] = [
  { id: 'dev-1', name: 'Nokia 7750 Core-1', type: 'ROUTER', ip: '10.255.0.1', x: 200, y: 150, status: 'ONLINE' },
  { id: 'dev-2', name: 'Nokia 7750 Core-2', type: 'ROUTER', ip: '10.255.0.2', x: 450, y: 150, status: 'ONLINE' },
  { id: 'dev-3', name: 'Huawei MA5800 OLT', type: 'OLT', ip: '10.20.1.1', x: 120, y: 320, status: 'ONLINE' },
  { id: 'dev-4', name: 'Macro BTS Site #42', type: 'CELL_TOWER', ip: '10.30.1.1', x: 550, y: 320, status: 'ONLINE' },
  { id: 'dev-5', name: 'FortiGate Edge-FW', type: 'FIREWALL', ip: '198.51.100.1', x: 325, y: 50, status: 'ONLINE' },
  { id: 'dev-6', name: 'VoIP PBX Asterisk', type: 'SERVER', ip: '192.168.10.20', x: 325, y: 340, status: 'ONLINE' }
];

const INITIAL_LINKS: TopologyLink[] = [
  { id: 'link-1', from: 'dev-1', to: 'dev-2', type: 'FIBER_100G', bandwidth: '100 Gbps DWDM', status: 'UP' },
  { id: 'link-2', from: 'dev-5', to: 'dev-1', type: 'FIBER_10G', bandwidth: '10 Gbps 10GBASE-LR', status: 'UP' },
  { id: 'link-3', from: 'dev-5', to: 'dev-2', type: 'FIBER_10G', bandwidth: '10 Gbps 10GBASE-LR', status: 'UP' },
  { id: 'link-4', from: 'dev-1', to: 'dev-3', type: 'FIBER_10G', bandwidth: '10G GPON Uplink', status: 'UP' },
  { id: 'link-5', from: 'dev-2', to: 'dev-4', type: 'MICROWAVE', bandwidth: '1 Gbps 18GHz MW', status: 'UP' },
  { id: 'link-6', from: 'dev-1', to: 'dev-6', type: 'ETHERNET', bandwidth: '1 Gbps Cat6', status: 'UP' }
];

export const NetworkTopologyView: React.FC = () => {
  const [devices, setDevices] = useState<TopologyDevice[]>(INITIAL_DEVICES);
  const [links, setLinks] = useState<TopologyLink[]>(INITIAL_LINKS);
  const [selectedDevice, setSelectedDevice] = useState<TopologyDevice | null>(INITIAL_DEVICES[0]);
  const [isSimulatingTraffic, setIsSimulatingTraffic] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Dragging state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, dev: TopologyDevice) => {
    e.stopPropagation();
    setDraggingId(dev.id);
    setSelectedDevice(dev);
    setDragOffset({
      x: e.clientX - dev.x,
      y: e.clientY - dev.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    setDevices(prev =>
      prev.map(d => {
        if (d.id === draggingId) {
          return {
            ...d,
            x: Math.max(40, Math.min(650, e.clientX - dragOffset.x)),
            y: Math.max(40, Math.min(380, e.clientY - dragOffset.y))
          };
        }
        return d;
      })
    );
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const handleAddDevice = (type: TopologyDevice['type']) => {
    const newDev: TopologyDevice = {
      id: `dev-${Date.now()}`,
      name: `New ${type}`,
      type,
      ip: `10.0.${devices.length + 1}.1`,
      x: 200 + Math.random() * 200,
      y: 150 + Math.random() * 150,
      status: 'ONLINE'
    };
    setDevices([...devices, newDev]);
    setSelectedDevice(newDev);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// NETWORK TOPOLOGY & DESIGN</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            INTERACTIVE TELECOM NETWORK TOPOLOGY BUILDER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Drag-and-drop network topology canvas: IP/MPLS core routers, optical OLTs, macro cell towers, microwave radio links, and animated packet flows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimulatingTraffic(!isSimulatingTraffic)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-lg ${
              isSimulatingTraffic
                ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            <Play className="w-4 h-4" />
            {isSimulatingTraffic ? 'Traffic Streaming' : 'Simulate Traffic'}
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
          >
            <Download className="w-4 h-4 text-purple-400" />
            Export Diagram
          </button>
        </div>
      </div>

      {/* Palette Toolbar */}
      <div className="rounded-2xl glass-panel p-4 border border-white/10 flex flex-wrap items-center gap-3 text-xs font-mono">
        <span className="text-slate-500 uppercase font-bold text-[10px] mr-2">ADD NODE TO CANVAS:</span>
        <button
          onClick={() => handleAddDevice('ROUTER')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090912] hover:bg-purple-950/60 border border-white/10 hover:border-purple-500/50 text-white transition-colors"
        >
          <Network className="w-3.5 h-3.5 text-purple-400" /> + Core Router
        </button>
        <button
          onClick={() => handleAddDevice('OLT')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090912] hover:bg-cyan-950/60 border border-white/10 hover:border-cyan-500/50 text-white transition-colors"
        >
          <Wifi className="w-3.5 h-3.5 text-cyan-400" /> + GPON OLT
        </button>
        <button
          onClick={() => handleAddDevice('CELL_TOWER')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090912] hover:bg-emerald-950/60 border border-white/10 hover:border-emerald-500/50 text-white transition-colors"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400" /> + Cell Tower
        </button>
        <button
          onClick={() => handleAddDevice('FIREWALL')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090912] hover:bg-rose-950/60 border border-white/10 hover:border-rose-500/50 text-white transition-colors"
        >
          <Shield className="w-3.5 h-3.5 text-rose-400" /> + Firewall
        </button>
        <button
          onClick={() => handleAddDevice('SERVER')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090912] hover:bg-amber-950/60 border border-white/10 hover:border-amber-500/50 text-white transition-colors"
        >
          <Server className="w-3.5 h-3.5 text-amber-400" /> + Server / PBX
        </button>
      </div>

      {/* SVG Interactive Canvas & Device Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SVG Canvas (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl glass-panel p-4 border border-white/10 bg-[#05050a] min-h-[460px] relative overflow-hidden select-none">
          <svg viewBox="0 0 700 420" className="w-full h-full">
            {/* Draw Links */}
            {links.map((link) => {
              const fromDev = devices.find(d => d.id === link.from);
              const toDev = devices.find(d => d.id === link.to);
              if (!fromDev || !toDev) return null;

              const isMw = link.type === 'MICROWAVE';
              const is100G = link.type === 'FIBER_100G';

              return (
                <g key={link.id}>
                  <line
                    x1={fromDev.x + 25}
                    y1={fromDev.y + 25}
                    x2={toDev.x + 25}
                    y2={toDev.y + 25}
                    stroke={is100G ? '#a855f7' : isMw ? '#f59e0b' : '#38bdf8'}
                    strokeWidth={is100G ? '4' : '2.5'}
                    strokeDasharray={isMw ? '6 4' : undefined}
                    strokeOpacity="0.8"
                  />
                  {/* Bandwidth Label */}
                  <text
                    x={(fromDev.x + toDev.x) / 2 + 25}
                    y={(fromDev.y + toDev.y) / 2 + 20}
                    fill="#94a3b8"
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {link.bandwidth}
                  </text>

                  {/* Animated Traffic Particles */}
                  {isSimulatingTraffic && (
                    <circle
                      cx={(fromDev.x + toDev.x) / 2 + 25}
                      y={(fromDev.y + toDev.y) / 2 + 25}
                      r="4"
                      fill="#38bdf8"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}

            {/* Draw Nodes */}
            {devices.map((dev) => {
              const isSelected = selectedDevice?.id === dev.id;
              return (
                <g
                  key={dev.id}
                  transform={`translate(${dev.x}, ${dev.y})`}
                  onMouseDown={(e) => handleMouseDown(e, dev)}
                  className="cursor-move group"
                >
                  <rect
                    x="0"
                    y="0"
                    width="50"
                    height="50"
                    rx="10"
                    fill={isSelected ? '#3b0764' : '#0c0c16'}
                    stroke={isSelected ? '#a855f7' : '#334155'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    className="transition-all group-hover:stroke-purple-400 shadow-lg"
                  />

                  {/* Type Icon Text */}
                  <text x="25" y="24" fill="#a855f7" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    {dev.type === 'ROUTER' ? '⌖' : dev.type === 'OLT' ? '⚡' : dev.type === 'CELL_TOWER' ? '📶' : dev.type === 'FIREWALL' ? '🛡' : '🖧'}
                  </text>

                  {/* Device Name */}
                  <text x="25" y="40" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    {dev.name.slice(0, 10)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Device Inspector (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
              NODE INSPECTOR
            </h3>
            {selectedDevice && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                {selectedDevice.status}
              </span>
            )}
          </div>

          {selectedDevice ? (
            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 uppercase text-[10px] block mb-1">Device Name</label>
                <input
                  type="text"
                  value={selectedDevice.name}
                  onChange={(e) => {
                    const updated = { ...selectedDevice, name: e.target.value };
                    setSelectedDevice(updated);
                    setDevices(devices.map(d => d.id === updated.id ? updated : d));
                  }}
                  className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase text-[10px] block mb-1">Management IP</label>
                <input
                  type="text"
                  value={selectedDevice.ip}
                  onChange={(e) => {
                    const updated = { ...selectedDevice, ip: e.target.value };
                    setSelectedDevice(updated);
                    setDevices(devices.map(d => d.id === updated.id ? updated : d));
                  }}
                  className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-cyan-300 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase text-[10px] block mb-1">Device Category</label>
                <span className="text-purple-300 font-bold block p-2 bg-[#090912] rounded-lg border border-white/5">
                  {selectedDevice.type}
                </span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setDevices(devices.filter(d => d.id !== selectedDevice.id));
                    setLinks(links.filter(l => l.from !== selectedDevice.id && l.to !== selectedDevice.id));
                    setSelectedDevice(null);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Device
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs font-mono text-slate-500 py-8 text-center">
              Click any node on the canvas to inspect and configure parameters.
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="Network Topology Architecture"
          toolName="Network Topology Builder"
          inputs={{
            nodesCount: devices.length,
            linksCount: links.length,
            simulatingTraffic: isSimulatingTraffic ? 'Yes' : 'No'
          }}
          results={{
            nodes: devices.map(d => `${d.name} (${d.ip})`).join(', '),
            links: links.map(l => `${l.from} -> ${l.to} [${l.bandwidth}]`).join(', ')
          }}
        />
      )}
    </div>
  );
};

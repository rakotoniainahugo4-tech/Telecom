import React, { useState, useMemo } from 'react';
import { Zap, Download, Layers, ShieldCheck, AlertCircle } from 'lucide-react';
import { calculatePoeBudget } from '../lib/calculators/telecomPower';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

export const PoeCalculatorView: React.FC = () => {
  const [switchBudget, setSwitchBudget] = useState(370);
  const [portsAf, setPortsAf] = useState(8);
  const [portsAt, setPortsAt] = useState(4);
  const [portsBt60, setPortsBt60] = useState(2);
  const [portsBt90, setPortsBt90] = useState(0);
  const [cableLengthM, setCableLengthM] = useState(40);
  const [showExportModal, setShowExportModal] = useState(false);

  const poe = useMemo(() => {
    return calculatePoeBudget({
      switchTotalBudgetWatts: switchBudget,
      devices: [
        { type: '802.3af (PoE - 15.4W)', count: portsAf, maxPowerPerPortWatts: 15.4 },
        { type: '802.3at (PoE+ - 30W)', count: portsAt, maxPowerPerPortWatts: 30.0 },
        { type: '802.3bt Type 3 (60W)', count: portsBt60, maxPowerPerPortWatts: 60.0 },
        { type: '802.3bt Type 4 (90W)', count: portsBt90, maxPowerPerPortWatts: 90.0 }
      ],
      cableLengthMeters: cableLengthM
    });
  }, [switchBudget, portsAf, portsAt, portsBt60, portsBt90, cableLengthM]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// POWER & INFRASTRUCTURE</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            POE POWER BUDGET CALCULATOR (802.3AF/AT/BT)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Compute total PoE switch supply utilization, copper cable loop resistance power loss, and available headroom.
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
        >
          <Download className="w-4 h-4 text-purple-400" />
          Export PoE Budget
        </button>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Switch Budget & Cable */}
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-sm text-purple-300 uppercase tracking-wider">
            1. Switch PoE Supply & Cable Run
          </h3>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Switch Dedicated PoE Power Budget: {switchBudget}W
            </label>
            <input
              type="number"
              value={switchBudget}
              onChange={(e) => setSwitchBudget(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
            <div className="flex gap-2 mt-2">
              {[120, 370, 740, 1440].map((w) => (
                <button
                  key={w}
                  onClick={() => setSwitchBudget(w)}
                  className="px-2.5 py-1 rounded bg-[#090912] hover:bg-[#151522] border border-white/10 text-[10px] font-mono text-slate-300"
                >
                  {w}W
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Average Cat6 Cable Distance: {cableLengthM} meters
            </label>
            <input
              type="range"
              min={5}
              max={100}
              value={cableLengthM}
              onChange={(e) => setCableLengthM(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded accent-purple-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>5m (Patch panel)</span>
              <span>100m (Max 802.3 limit)</span>
            </div>
          </div>
        </div>

        {/* Powered Devices Allocation */}
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-sm text-cyan-300 uppercase tracking-wider">
            2. Connected Powered Devices (PD)
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                802.3af (15.4W - IP Phone)
              </label>
              <input
                type="number"
                min={0}
                value={portsAf}
                onChange={(e) => setPortsAf(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                802.3at (30.0W - PTZ / AP)
              </label>
              <input
                type="number"
                min={0}
                value={portsAt}
                onChange={(e) => setPortsAt(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                802.3bt Type 3 (60.0W - 5G)
              </label>
              <input
                type="number"
                min={0}
                value={portsBt60}
                onChange={(e) => setPortsBt60(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                802.3bt Type 4 (90.0W - High)
              </label>
              <input
                type="number"
                min={0}
                value={portsBt90}
                onChange={(e) => setPortsBt90(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <span className="text-slate-500 uppercase text-[10px]">TOTAL POWER DRAW</span>
          <div className="text-3xl font-bold text-cyan-400 font-heading">
            {poe.totalPowerDrawWatts} <span className="text-xs font-mono text-slate-400">W</span>
          </div>
          <span className="text-[10px] text-slate-400">At switch output</span>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <span className="text-slate-500 uppercase text-[10px]">BUDGET UTILIZATION</span>
          <div className={`text-3xl font-bold font-heading ${poe.utilizationPercent > 100 ? 'text-rose-400' : poe.utilizationPercent > 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {poe.utilizationPercent}%
          </div>
          <span className="text-[10px] text-slate-400">{switchBudget}W total switch capacity</span>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <span className="text-slate-500 uppercase text-[10px]">REMAINING HEADROOM</span>
          <div className={`text-3xl font-bold font-heading ${poe.remainingBudgetWatts >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {poe.remainingBudgetWatts} <span className="text-xs font-mono text-slate-400">W</span>
          </div>
          <span className="text-[10px] text-slate-400">Available for expansion</span>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <span className="text-slate-500 uppercase text-[10px]">CABLE RESISTANCE LOSS</span>
          <div className="text-3xl font-bold text-purple-400 font-heading">
            {poe.estimatedCableLossWatts} <span className="text-xs font-mono text-slate-400">W</span>
          </div>
          <span className="text-[10px] text-slate-400">Thermal loss across {cableLengthM}m run</span>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="PoE Power Budget Report"
          toolName="PoE Power Budget Calculator"
          inputs={{
            switchBudgetWatts: `${switchBudget} W`,
            ports8023af: portsAf,
            ports8023at: portsAt,
            ports8023bt60W: portsBt60,
            ports8023bt90W: portsBt90,
            cableLengthMeters: `${cableLengthM} m`
          }}
          results={{
            totalPowerDraw: `${poe.totalPowerDrawWatts} W`,
            budgetUtilization: `${poe.utilizationPercent}%`,
            remainingHeadroom: `${poe.remainingBudgetWatts} W`,
            cableResistanceLoss: `${poe.estimatedCableLossWatts} W`,
            status: poe.isOverBudget ? 'Overloaded' : 'Safe'
          }}
        />
      )}
    </div>
  );
};

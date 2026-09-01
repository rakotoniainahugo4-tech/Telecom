import React, { useState, useMemo } from 'react';
import { BatteryCharging, Download, ShieldCheck, Zap, Activity } from 'lucide-react';
import { calculateBatteryAutonomy } from '../lib/calculators/telecomPower';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

export const BatteryAutonomyView: React.FC = () => {
  const [voltage, setVoltage] = useState<number>(48);
  const [loadWatts, setLoadWatts] = useState<number>(1800);
  const [capacityAh, setCapacityAh] = useState<number>(400);
  const [dod, setDod] = useState<number>(80);
  const [inverterEff, setInverterEff] = useState<number>(92);
  const [tempC, setTempC] = useState<number>(25);
  const [showExportModal, setShowExportModal] = useState(false);

  const autonomy = useMemo(() => {
    return calculateBatteryAutonomy({
      batteryVoltage: voltage,
      batteryCapacityAh: capacityAh,
      loadWatts,
      inverterEfficiencyPercent: inverterEff,
      depthOfDischargePercent: dod
    });
  }, [voltage, loadWatts, capacityAh, dod, inverterEff]);

  const totalKwh = ((voltage * capacityAh) / 1000).toFixed(2);
  const rechargeAmps = (capacityAh * 0.1).toFixed(1);

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
            TELECOM DC BATTERY AUTONOMY SIZER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Calculate backup runtime hours, depth of discharge, rectifier recharge current, and required Ah capacity for -48V telecom cell sites & POPs.
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
        >
          <Download className="w-4 h-4 text-purple-400" />
          Export Sizing
        </button>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section 1: Electrical Load */}
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-sm text-purple-300 uppercase tracking-wider">
            1. DC Plant System Voltage & Load
          </h3>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Nominal DC Bus Voltage
            </label>
            <select
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            >
              <option value={48}>-48 VDC (Standard Telecom / BTS)</option>
              <option value={24}>+24 VDC (Microwave / Radio Links)</option>
              <option value={12}>12 VDC (Small Remote CPE)</option>
              <option value={220}>220 VDC (Substation / Data Center UPS)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Total Equipment Power Load: {loadWatts} Watts
            </label>
            <input
              type="number"
              value={loadWatts}
              onChange={(e) => setLoadWatts(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
            <span className="text-[10px] text-slate-500 font-mono">Continuous draw of all active loads</span>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Conversion Efficiency: {inverterEff}%
            </label>
            <input
              type="range"
              min={80}
              max={99}
              value={inverterEff}
              onChange={(e) => setInverterEff(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded accent-purple-500"
            />
          </div>
        </div>

        {/* Section 2: Battery Bank */}
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-sm text-cyan-300 uppercase tracking-wider">
            2. Battery Bank Specification
          </h3>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Total Installed Capacity: {capacityAh} Ah
            </label>
            <input
              type="number"
              value={capacityAh}
              onChange={(e) => setCapacityAh(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
            <span className="text-[10px] text-slate-500 font-mono">e.g. 2 x 200Ah strings = 400Ah</span>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Depth of Discharge (DoD): {dod}%
            </label>
            <input
              type="range"
              min={50}
              max={95}
              value={dod}
              onChange={(e) => setDod(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>50% (Long Cycle Life)</span>
              <span>80% (VRLA Standard)</span>
            </div>
          </div>
        </div>

        {/* Section 3: Environmental Factors */}
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-sm text-emerald-300 uppercase tracking-wider">
            3. Environmental & Temperature
          </h3>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Ambient Temperature: {tempC}&deg;C
            </label>
            <input
              type="number"
              value={tempC}
              onChange={(e) => setTempC(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
            <span className="text-[10px] text-slate-500 font-mono">IEEE 485 temperature baseline 25&deg;C</span>
          </div>
        </div>
      </div>

      {/* Output Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <span className="text-slate-500 uppercase text-[10px]">AUTONOMY RUNTIME</span>
          <div className="text-3xl font-bold text-emerald-400 font-heading">
            {autonomy.autonomyHours.toFixed(1)} <span className="text-xs font-mono text-slate-400">Hours</span>
          </div>
          <span className="text-[10px] text-slate-400">({autonomy.autonomyFormatted})</span>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <span className="text-slate-500 uppercase text-[10px]">DC DISCHARGE CURRENT</span>
          <div className="text-3xl font-bold text-cyan-400 font-heading">
            {autonomy.loadCurrentAmps.toFixed(1)} <span className="text-xs font-mono text-slate-400">Amps</span>
          </div>
          <span className="text-[10px] text-slate-400">Continuous load current</span>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <span className="text-slate-500 uppercase text-[10px]">TOTAL ENERGY STORAGE</span>
          <div className="text-3xl font-bold text-purple-400 font-heading">
            {totalKwh} <span className="text-xs font-mono text-slate-400">kWh</span>
          </div>
          <span className="text-[10px] text-slate-400">At {voltage}V nominal bus</span>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <span className="text-slate-500 uppercase text-[10px]">RECHARGE CURRENT (0.1C)</span>
          <div className="text-3xl font-bold text-amber-400 font-heading">
            {rechargeAmps} <span className="text-xs font-mono text-slate-400">Amps</span>
          </div>
          <span className="text-[10px] text-slate-400">Rectifier 10-hour recharge rate</span>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="Telecom DC Battery Autonomy Sizing"
          toolName="Telecom Battery Autonomy Sizer"
          inputs={{
            systemVoltage: `${voltage} VDC`,
            loadWatts: `${loadWatts} W`,
            installedCapacityAh: `${capacityAh} Ah`,
            depthOfDischargePercent: `${dod}%`,
            inverterEfficiency: `${inverterEff}%`,
            ambientTemperature: `${tempC} °C`
          }}
          results={{
            autonomyRuntimeHours: `${autonomy.autonomyHours.toFixed(1)} Hours`,
            dischargeCurrentAmps: `${autonomy.loadCurrentAmps.toFixed(1)} A`,
            totalEnergyStorageKwh: `${totalKwh} kWh`,
            recommendedRechargeAmps: `${rechargeAmps} A`
          }}
          formula="Runtime = (Ah * Voltage * DoD% * Eff%) / Load Watts"
        />
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Zap, Download, Layers, ShieldCheck, ArrowRight, Activity, AlertCircle } from 'lucide-react';
import { calculateFiberBudget, FiberBudgetParams } from '../lib/calculators/fiberBudget';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

export const FiberBudgetView: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState(20);
  const [wavelength, setWavelength] = useState<1310 | 1490 | 1550 | 1625>(1550);
  const [connectors, setConnectors] = useState(4);
  const [splices, setSplices] = useState(6);
  const [splitterRatio, setSplitterRatio] = useState<'None' | '1:2' | '1:4' | '1:8' | '1:16' | '1:32' | '1:64'>('1:16');
  const [txPowerDbm, setTxPowerDbm] = useState(3.0);
  const [rxSensitivityDbm, setRxSensitivityDbm] = useState(-28.0);
  const [safetyMarginDb, setSafetyMarginDb] = useState(3.0);
  const [showExportModal, setShowExportModal] = useState(false);

  const budget = useMemo(() => {
    return calculateFiberBudget({
      wavelengthNm: wavelength,
      txPowerDbm,
      rxSensitivityDbm,
      fiberLengthKm: distanceKm,
      numSplices: splices,
      spliceLossDb: 0.05,
      numConnectors: connectors,
      connectorLossDb: 0.3,
      splitterRatio,
      engineeringMarginDb: safetyMarginDb
    });
  }, [distanceKm, wavelength, connectors, splices, splitterRatio, txPowerDbm, rxSensitivityDbm, safetyMarginDb]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// OPTICAL & TRANSMISSION ENGINEERING</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            FIBER OPTIC LINK POWER BUDGET (ITU-T G.984 / G.652)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Compute total optical attenuation, GPON ODN splitter insertion loss, connector/splice loss, and receiver power margin.
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
        >
          <Download className="w-4 h-4 text-purple-400" />
          Export Budget
        </button>
      </div>

      {/* Input Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section 1: Fiber Span */}
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-sm text-purple-300 uppercase tracking-wider">
            1. Optical Span & Wavelength
          </h3>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Wavelength Selection
            </label>
            <select
              value={wavelength}
              onChange={(e) => setWavelength(parseInt(e.target.value, 10) as any)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            >
              <option value={1310}>1310 nm (GPON Upstream / O-Band - 0.35 dB/km)</option>
              <option value={1490}>1490 nm (GPON Downstream - 0.25 dB/km)</option>
              <option value={1550}>1550 nm (DWDM / C-Band Lowest Loss - 0.20 dB/km)</option>
              <option value={1625}>1625 nm (OTDR Monitoring - 0.22 dB/km)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Fiber Distance: {distanceKm} km
            </label>
            <input
              type="number"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              ODN Splitter Ratio
            </label>
            <select
              value={splitterRatio}
              onChange={(e) => setSplitterRatio(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            >
              <option value="None">None (Point-to-Point 0 dB)</option>
              <option value="1:2">1:2 Splitter (3.5 dB)</option>
              <option value="1:4">1:4 Splitter (7.2 dB)</option>
              <option value="1:8">1:8 Splitter (10.5 dB)</option>
              <option value="1:16">1:16 Splitter (13.8 dB)</option>
              <option value="1:32">1:32 Splitter (17.0 dB)</option>
              <option value="1:64">1:64 Splitter (20.5 dB)</option>
            </select>
          </div>
        </div>

        {/* Section 2: Passive Elements */}
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-sm text-cyan-300 uppercase tracking-wider">
            2. Passives & Splicing Loss
          </h3>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Number of Connector Pairs: {connectors}
            </label>
            <input
              type="number"
              value={connectors}
              onChange={(e) => setConnectors(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
            <span className="text-[10px] text-slate-500 font-mono">0.3 dB per SC/APC or LC pair</span>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Number of Fusion Splices: {splices}
            </label>
            <input
              type="number"
              value={splices}
              onChange={(e) => setSplices(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
            <span className="text-[10px] text-slate-500 font-mono">0.05 dB per fusion splice</span>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Safety / Aging Margin: {safetyMarginDb} dB
            </label>
            <input
              type="number"
              value={safetyMarginDb}
              onChange={(e) => setSafetyMarginDb(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
          </div>
        </div>

        {/* Section 3: Transceiver Optics */}
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-sm text-emerald-300 uppercase tracking-wider">
            3. Transceiver Optical Levels
          </h3>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Transmitter Power (Tx): {txPowerDbm} dBm
            </label>
            <input
              type="number"
              value={txPowerDbm}
              onChange={(e) => setTxPowerDbm(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
            <span className="text-[10px] text-slate-500 font-mono">e.g. +3 dBm for GPON Class B+ OLT</span>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Receiver Sensitivity (Rx Sens): {rxSensitivityDbm} dBm
            </label>
            <input
              type="number"
              value={rxSensitivityDbm}
              onChange={(e) => setRxSensitivityDbm(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
            <span className="text-[10px] text-slate-500 font-mono">e.g. -28 dBm for ONT receiver</span>
          </div>
        </div>
      </div>

      {/* Output Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <span className="text-slate-500 uppercase text-[10px]">TOTAL FIBER LOSS</span>
          <div className="text-3xl font-bold text-purple-400 font-heading">
            {budget.totalLossDb.toFixed(2)} <span className="text-xs font-mono text-slate-400">dB</span>
          </div>
          <span className="text-[10px] text-slate-400">Span + Splitter + Passives</span>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <span className="text-slate-500 uppercase text-[10px]">RECEIVED OPTICAL POWER</span>
          <div className="text-3xl font-bold text-cyan-400 font-heading">
            {budget.rxPowerDbm.toFixed(2)} <span className="text-xs font-mono text-slate-400">dBm</span>
          </div>
          <span className="text-[10px] text-slate-400">({(budget.rxPowerMw * 1000).toFixed(2)} &micro;W)</span>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <span className="text-slate-500 uppercase text-[10px]">OPTICAL POWER MARGIN</span>
          <div className={`text-3xl font-bold font-heading ${
            budget.powerMarginDb >= 3 ? 'text-emerald-400' :
            budget.powerMarginDb >= 0 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {budget.powerMarginDb.toFixed(2)} <span className="text-xs font-mono text-slate-400">dB</span>
          </div>
          <span className="text-[10px] text-slate-400">Rx Level vs Receiver Sensitivity</span>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <span className="text-slate-500 uppercase text-[10px]">LINK STATUS</span>
          <div className="text-2xl font-bold font-heading">
            {budget.status === 'PASS' ? (
              <span className="text-emerald-400">PASS (READY)</span>
            ) : budget.status === 'WARNING' ? (
              <span className="text-amber-400">MARGINAL</span>
            ) : (
              <span className="text-rose-400">LINK FAILS</span>
            )}
          </div>
          <span className="text-[10px] text-slate-400">ITU-T G.984 ODN Compliance</span>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="Fiber Optic Link Power Budget"
          toolName="Fiber Optic Budget Calculator"
          inputs={{
            distanceKm: `${distanceKm} km`,
            wavelength: `${wavelength} nm`,
            connectorsCount: connectors,
            splicesCount: splices,
            splitterRatio,
            txPowerDbm: `${txPowerDbm} dBm`,
            rxSensitivityDbm: `${rxSensitivityDbm} dBm`,
            safetyMarginDb: `${safetyMarginDb} dB`
          }}
          results={{
            totalLossDb: `${budget.totalLossDb.toFixed(2)} dB`,
            receivedOpticalPower: `${budget.rxPowerDbm.toFixed(2)} dBm`,
            powerMarginDb: `${budget.powerMarginDb.toFixed(2)} dB`,
            status: budget.status
          }}
          formula="Total Loss (dB) = (km * α) + (splices * 0.05) + (connectors * 0.3) + Splitter + Margin"
        />
      )}
    </div>
  );
};

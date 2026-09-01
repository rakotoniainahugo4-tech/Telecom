import React, { useState, useMemo } from 'react';
import { Radio, Download, Activity, ArrowRight, ShieldCheck, Zap, Info } from 'lucide-react';
import { calculateRfLinkBudget, calculateFspl } from '../lib/calculators/rfCalculators';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

export const RfEngineeringView: React.FC = () => {
  const [freqMhz, setFreqMhz] = useState(5800);
  const [distKm, setDistKm] = useState(15);
  const [txPowerDbm, setTxPowerDbm] = useState(27);
  const [txGainDbi, setTxGainDbi] = useState(24);
  const [rxGainDbi, setRxGainDbi] = useState(24);
  const [txLossDb, setTxLossDb] = useState(1.5);
  const [rxLossDb, setRxLossDb] = useState(1.5);
  const [rxSensitivityDbm, setRxSensitivityDbm] = useState(-78);
  const [miscLossDb, setMiscLossDb] = useState(2.0);
  const [showExportModal, setShowExportModal] = useState(false);

  const budget = useMemo(() => {
    return calculateRfLinkBudget({
      frequencyMhz: freqMhz,
      distanceKm: distKm,
      txPowerDbm,
      txGainDbi,
      rxGainDbi,
      txCableLossDb: txLossDb,
      rxCableLossDb: rxLossDb,
      rxSensitivityDbm,
      miscLossDb
    });
  }, [freqMhz, distKm, txPowerDbm, txGainDbi, rxGainDbi, txLossDb, rxLossDb, rxSensitivityDbm, miscLossDb]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// RF & WIRELESS</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            RF MICROWAVE LINK BUDGET
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Full path budget analysis: FSPL, EIRP, RSSI received signal strength, and fade margin reliability for telecom radio links.
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
        >
          <Download className="w-4 h-4 text-purple-400" />
          Export Link Budget
        </button>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Transmitter Parameters */}
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-sm text-purple-300 uppercase tracking-wider">
            Site A: Transmitter (Tx)
          </h3>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Tx Power: {txPowerDbm} dBm ({Math.round(Math.pow(10, txPowerDbm / 10))} mW)
            </label>
            <input
              type="range"
              min={0}
              max={40}
              value={txPowerDbm}
              onChange={(e) => setTxPowerDbm(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded accent-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Tx Antenna Gain: {txGainDbi} dBi
            </label>
            <input
              type="number"
              value={txGainDbi}
              onChange={(e) => setTxGainDbi(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Tx Jumper/Cable Loss: {txLossDb} dB
            </label>
            <input
              type="number"
              step="0.1"
              value={txLossDb}
              onChange={(e) => setTxLossDb(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
          </div>
        </div>

        {/* Path Parameters */}
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-sm text-cyan-300 uppercase tracking-wider">
            Radio Path & Frequency
          </h3>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Frequency: {freqMhz} MHz ({(freqMhz / 1000).toFixed(2)} GHz)
            </label>
            <input
              type="number"
              value={freqMhz}
              onChange={(e) => setFreqMhz(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Link Distance: {distKm} km
            </label>
            <input
              type="number"
              step="0.5"
              value={distKm}
              onChange={(e) => setDistKm(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Misc/Atmospheric Loss: {miscLossDb} dB
            </label>
            <input
              type="number"
              step="0.5"
              value={miscLossDb}
              onChange={(e) => setMiscLossDb(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
          </div>
        </div>

        {/* Receiver Parameters */}
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-sm text-emerald-300 uppercase tracking-wider">
            Site B: Receiver (Rx)
          </h3>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Rx Antenna Gain: {rxGainDbi} dBi
            </label>
            <input
              type="number"
              value={rxGainDbi}
              onChange={(e) => setRxGainDbi(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Rx Jumper/Cable Loss: {rxLossDb} dB
            </label>
            <input
              type="number"
              step="0.1"
              value={rxLossDb}
              onChange={(e) => setRxLossDb(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
              Rx Threshold Sensitivity: {rxSensitivityDbm} dBm
            </label>
            <input
              type="number"
              value={rxSensitivityDbm}
              onChange={(e) => setRxSensitivityDbm(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
            />
          </div>
        </div>
      </div>

      {/* Graphical Radio Path Pipeline */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-400" />
            <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
              RADIO PATH POWER CASCADE DIAGRAM
            </h3>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
            budget.isViable ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
          }`}>
            LINK VIABILITY: {budget.isViable ? 'VIABLE' : 'UNVIABLE'}
          </span>
        </div>

        {/* Visual Cascade Stage Diagram */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono text-center">
          <div className="p-3 rounded-xl bg-[#090912] border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase">TX POWER</span>
            <div className="text-base font-bold text-white">+{txPowerDbm} dBm</div>
            <span className="text-[10px] text-purple-400">Transmitter Output</span>
          </div>

          <div className="p-3 rounded-xl bg-[#090912] border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase">EIRP</span>
            <div className="text-base font-bold text-purple-300">+{budget.eirpDbm} dBm</div>
            <span className="text-[10px] text-slate-400">Tx + Gain - Cable</span>
          </div>

          <div className="p-3 rounded-xl bg-[#090912] border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase">PATH LOSS (FSPL)</span>
            <div className="text-base font-bold text-rose-400">-{budget.fsplDb} dB</div>
            <span className="text-[10px] text-slate-400">Free Space Over {distKm}km</span>
          </div>

          <div className="p-3 rounded-xl bg-[#090912] border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase">RX SIGNAL (RSSI)</span>
            <div className="text-base font-bold text-cyan-400">{budget.rxPowerDbm} dBm</div>
            <span className="text-[10px] text-slate-400">Received at Receiver</span>
          </div>

          <div className="p-3 rounded-xl bg-[#090912] border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase">FADE MARGIN</span>
            <div className={`text-base font-bold ${budget.fadeMarginDb >= 20 ? 'text-emerald-400' : budget.fadeMarginDb >= 10 ? 'text-amber-400' : 'text-rose-400'}`}>
              {budget.fadeMarginDb} dB
            </div>
            <span className="text-[10px] text-slate-400">Safety Headroom</span>
          </div>
        </div>

        {/* Formulas Box */}
        <div className="p-3 rounded-lg bg-[#050508] border border-white/5 text-[11px] font-mono text-slate-400 space-y-1">
          <div>&bull; FSPL (dB) = 20 &times; log10(d_km) + 20 &times; log10(f_MHz) + 32.44</div>
          <div>&bull; Rx Power (dBm) = Tx Power - Tx Losses + Tx Gain - FSPL - Misc Losses + Rx Gain - Rx Losses</div>
          <div>&bull; Fade Margin (dB) = Rx Power (dBm) - Rx Sensitivity (dBm)</div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="RF Link Budget Report"
          toolName="RF Microwave Link Budget"
          inputs={{
            frequencyMhz: freqMhz,
            distanceKm: distKm,
            txPowerDbm,
            txGainDbi,
            rxGainDbi,
            txCableLossDb: txLossDb,
            rxCableLossDb: rxLossDb,
            rxSensitivityDbm,
            miscLossDb
          }}
          results={{
            eirpDbm: `${budget.eirpDbm} dBm`,
            fsplDb: `${budget.fsplDb} dB`,
            rxPowerDbm: `${budget.rxPowerDbm} dBm`,
            fadeMarginDb: `${budget.fadeMarginDb} dB`,
            isViable: budget.isViable ? 'Yes' : 'No'
          }}
          formula="FSPL = 20*log10(d) + 20*log10(f) + 32.44; Fade Margin = Rx Power - Rx Sensitivity"
        />
      )}
    </div>
  );
};

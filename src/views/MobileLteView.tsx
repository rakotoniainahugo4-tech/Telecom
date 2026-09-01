import React, { useState, useMemo } from 'react';
import { Radio, Download, Activity, Signal, Gauge, ShieldCheck } from 'lucide-react';
import { calculateEarfcn, evaluateRsrp, evaluateRsrq, evaluateSinr } from '../lib/calculators/mobileLte';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

export const MobileLteView: React.FC = () => {
  const [earfcn, setEarfcn] = useState('1650');
  const [rsrp, setRsrp] = useState<number>(-92);
  const [rsrq, setRsrq] = useState<number>(-11);
  const [sinr, setSinr] = useState<number>(14);
  const [rssi, setRssi] = useState<number>(-70);
  const [showExportModal, setShowExportModal] = useState(false);

  const freqResult = useMemo(() => {
    const num = parseInt(earfcn, 10);
    if (!isNaN(num)) {
      try {
        return calculateEarfcn(num);
      } catch {
        return null;
      }
    }
    return null;
  }, [earfcn]);

  const rsrpEval = useMemo(() => evaluateRsrp(rsrp), [rsrp]);
  const rsrqEval = useMemo(() => evaluateRsrq(rsrq), [rsrq]);
  const sinrEval = useMemo(() => evaluateSinr(sinr), [sinr]);

  const POPULAR_EARFCN = [
    { earfcn: 300, band: 'B1 (2100 MHz)' },
    { earfcn: 1650, band: 'B3 (1800 MHz DCS)' },
    { earfcn: 3100, band: 'B7 (2600 MHz)' },
    { earfcn: 3600, band: 'B8 (900 MHz)' },
    { earfcn: 6300, band: 'B20 (800 MHz)' },
    { earfcn: 9400, band: 'B28 (700 MHz)' },
    { earfcn: 38000, band: 'B38 (2600 TDD)' },
    { earfcn: 39150, band: 'B40 (2300 TDD)' },
    { earfcn: 40620, band: 'B41 (2500 TDD)' }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// 4G/5G CELLULAR & RAN</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            LTE EARFCN & RAN SIGNAL QUALITY MATRIX
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Convert 3GPP EARFCN to carrier uplink/downlink frequencies and diagnose RSRP, RSRQ, SINR, and RSSI RF levels.
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
        >
          <Download className="w-4 h-4 text-purple-400" />
          Export RF Analysis
        </button>
      </div>

      {/* Part 1: EARFCN Lookup */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-6">
        <h3 className="font-heading font-bold text-sm text-purple-300 uppercase tracking-wider">
          1. 3GPP EARFCN FREQUENCY DECODER
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
              Enter Downlink EARFCN Channel Number
            </label>
            <input
              type="number"
              value={earfcn}
              onChange={(e) => setEarfcn(e.target.value)}
              placeholder="1650"
              className="w-full px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
              Popular 4G/LTE Bands
            </label>
            <select
              onChange={(e) => setEarfcn(e.target.value)}
              className="w-full px-3 py-3 bg-[#090912] border border-white/10 rounded-xl text-xs font-mono text-white"
            >
              <option value="">Select Band Preset...</option>
              {POPULAR_EARFCN.map((b) => (
                <option key={b.earfcn} value={b.earfcn}>
                  {b.band} (EARFCN {b.earfcn})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Decoded Results */}
        {freqResult ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
              <span className="text-slate-500 uppercase text-[10px]">OPERATING BAND</span>
              <div className="text-xl font-bold text-purple-400 font-heading">
                Band {freqResult.band} ({freqResult.duplex})
              </div>
              <span className="text-[10px] text-slate-400">{freqResult.bandName}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
              <span className="text-slate-500 uppercase text-[10px]">DOWNLINK (TX) FREQ</span>
              <div className="text-xl font-bold text-cyan-400 font-heading">
                {freqResult.downlinkFrequencyMhz} <span className="text-xs font-mono text-slate-400">MHz</span>
              </div>
              <span className="text-[10px] text-slate-400">eNodeB to UE</span>
            </div>

            <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
              <span className="text-slate-500 uppercase text-[10px]">UPLINK (RX) FREQ</span>
              <div className="text-xl font-bold text-emerald-400 font-heading">
                {freqResult.uplinkFrequencyMhz ? `${freqResult.uplinkFrequencyMhz} MHz` : 'TDD Dynamic'}
              </div>
              <span className="text-[10px] text-slate-400">UE to eNodeB</span>
            </div>

            <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
              <span className="text-slate-500 uppercase text-[10px]">DEPLOYMENT CONTEXT</span>
              <div className="text-xs font-bold text-slate-200 mt-1">
                {freqResult.commonDeployment}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs font-mono">
            EARFCN not found in common 3GPP release tables.
          </div>
        )}
      </div>

      {/* Part 2: Signal Quality Diagnostic Sliders */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-6">
        <h3 className="font-heading font-bold text-sm text-cyan-300 uppercase tracking-wider">
          2. RAN RF SIGNAL QUALITY DIAGNOSTIC
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* RSRP */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase">RSRP (Power)</span>
              <span className="text-white font-bold">{rsrp} dBm</span>
            </div>
            <input
              type="range"
              min={-140}
              max={-44}
              value={rsrp}
              onChange={(e) => setRsrp(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded appearance-none accent-purple-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-140 (Dead)</span>
              <span>-44 (Strong)</span>
            </div>
            <div className="text-[11px] font-mono font-semibold pt-1" style={{ color: rsrpEval.color }}>
              Rating: {rsrpEval.rating}
            </div>
          </div>

          {/* RSRQ */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase">RSRQ (Quality)</span>
              <span className="text-white font-bold">{rsrq} dB</span>
            </div>
            <input
              type="range"
              min={-20}
              max={-3}
              value={rsrq}
              onChange={(e) => setRsrq(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded appearance-none accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-20 (Poor)</span>
              <span>-3 (Pristine)</span>
            </div>
            <div className="text-[11px] font-mono font-semibold pt-1" style={{ color: rsrqEval.color }}>
              Rating: {rsrqEval.rating}
            </div>
          </div>

          {/* SINR */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase">SINR (SNR)</span>
              <span className="text-white font-bold">{sinr} dB</span>
            </div>
            <input
              type="range"
              min={-10}
              max={30}
              value={sinr}
              onChange={(e) => setSinr(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded appearance-none accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-10 (No Signal)</span>
              <span>+30 (Peak QAM)</span>
            </div>
            <div className="text-[11px] font-mono font-semibold pt-1" style={{ color: sinrEval.color }}>
              Rating: {sinrEval.rating}
            </div>
          </div>

          {/* RSSI */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase">RSSI</span>
              <span className="text-white font-bold">{rssi} dBm</span>
            </div>
            <input
              type="range"
              min={-110}
              max={-30}
              value={rssi}
              onChange={(e) => setRssi(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded appearance-none accent-amber-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-110 (Low)</span>
              <span>-30 (High)</span>
            </div>
            <div className="text-[11px] font-mono text-amber-300 font-semibold pt-1">
              Total Broad Band Energy
            </div>
          </div>
        </div>

        {/* Expected CQI & Modulation Scheme */}
        <div className="p-4 rounded-xl bg-[#090912] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">PREDICTED DOWNLINK MODULATION & CQI</span>
            <span className="text-white font-bold text-sm">
              {sinr >= 20 ? '256-QAM (CQI 15 - Maximum Carrier Aggregation Throughput)' :
               sinr >= 13 ? '64-QAM (CQI 10-14 - High Speed Video/Data)' :
               sinr >= 5 ? '16-QAM (CQI 7-9 - Moderate Speed)' :
               'QPSK (CQI 1-6 - Robust Low Data Rate Transmission)'}
            </span>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="LTE Signal & Frequency Analysis"
          toolName="LTE EARFCN & Signal Analyzer"
          inputs={{
            earfcn,
            rsrpDbm: `${rsrp} dBm`,
            rsrqDb: `${rsrq} dB`,
            sinrDb: `${sinr} dB`,
            rssiDbm: `${rssi} dBm`
          }}
          results={{
            operatingBand: freqResult ? `Band ${freqResult.band} (${freqResult.duplex})` : 'N/A',
            downlinkFrequency: freqResult ? `${freqResult.downlinkFrequencyMhz} MHz` : 'N/A',
            uplinkFrequency: freqResult?.uplinkFrequencyMhz ? `${freqResult.uplinkFrequencyMhz} MHz` : 'N/A',
            rsrpRating: rsrpEval.rating,
            rsrqRating: rsrqEval.rating,
            sinrRating: sinrEval.rating
          }}
        />
      )}
    </div>
  );
};

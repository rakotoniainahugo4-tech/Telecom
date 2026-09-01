import React, { useState } from 'react';
import { Zap, Download, Copy, Check, Info } from 'lucide-react';
import { dbmToMilliwatts, milliwattsToDbm, dbwToWatts, wattsToDbw } from '../lib/calculators/telecomPower';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

export const PowerDbmView: React.FC = () => {
  const [dbm, setDbm] = useState<string>('30');
  const [mw, setMw] = useState<string>('1000');
  const [w, setW] = useState<string>('1');
  const [dbw, setDbw] = useState<string>('0');
  const [showExportModal, setShowExportModal] = useState(false);

  const handleDbmChange = (val: string) => {
    setDbm(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const milli = dbmToMilliwatts(num);
      const watts = milli / 1000;
      setMw(milli.toFixed(milli < 1 ? 4 : 2));
      setW(watts.toFixed(watts < 1 ? 6 : 3));
      setDbw((num - 30).toFixed(2));
    }
  };

  const handleMwChange = (val: string) => {
    setMw(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      const d = milliwattsToDbm(num);
      setDbm(d.toFixed(2));
      setW((num / 1000).toFixed(4));
      setDbw((d - 30).toFixed(2));
    }
  };

  const handleWattsChange = (val: string) => {
    setW(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      const milli = num * 1000;
      const d = milliwattsToDbm(milli);
      setMw(milli.toFixed(2));
      setDbm(d.toFixed(2));
      setDbw((d - 30).toFixed(2));
    }
  };

  const PRESETS = [
    { label: '0 dBm (1 mW - Optical 0dB)', val: '0' },
    { label: '10 dBm (10 mW)', val: '10' },
    { label: '20 dBm (100 mW - Wi-Fi AP)', val: '20' },
    { label: '27 dBm (500 mW - Microwave)', val: '27' },
    { label: '30 dBm (1 W - Base)', val: '30' },
    { label: '43 dBm (20 W - LTE RRU)', val: '43' },
    { label: '46 dBm (40 W - Macro Cell)', val: '46' }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// RF & POWER ENGINEERING</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            DBM &harr; MILLIWATT &harr; WATT &harr; DBW CONVERTER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Instant bidirectional logarithmic power conversions for optical, RF radio links, cellular transmitters, and power budgets.
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
        >
          <Download className="w-4 h-4 text-purple-400" />
          Export Values
        </button>
      </div>

      {/* 4 Interactive Converter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* DBM */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
          <label className="block text-xs font-mono text-purple-400 font-bold uppercase">
            Power in dBm (dB relative to 1 mW)
          </label>
          <input
            type="number"
            step="0.1"
            value={dbm}
            onChange={(e) => handleDbmChange(e.target.value)}
            className="w-full px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:border-purple-500"
          />
          <span className="text-[11px] font-mono text-slate-500 block">Common RF unit</span>
        </div>

        {/* MILLIWATTS */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
          <label className="block text-xs font-mono text-cyan-400 font-bold uppercase">
            Power in Milliwatts (mW)
          </label>
          <input
            type="number"
            step="any"
            value={mw}
            onChange={(e) => handleMwChange(e.target.value)}
            className="w-full px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:border-cyan-500"
          />
          <span className="text-[11px] font-mono text-slate-500 block">Linear optical power</span>
        </div>

        {/* WATTS */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
          <label className="block text-xs font-mono text-emerald-400 font-bold uppercase">
            Power in Watts (W)
          </label>
          <input
            type="number"
            step="any"
            value={w}
            onChange={(e) => handleWattsChange(e.target.value)}
            className="w-full px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
          />
          <span className="text-[11px] font-mono text-slate-500 block">Macro transmission power</span>
        </div>

        {/* DBW */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
          <label className="block text-xs font-mono text-amber-400 font-bold uppercase">
            Power in dBW (dB relative to 1 W)
          </label>
          <input
            type="number"
            step="0.1"
            value={dbw}
            readOnly
            className="w-full px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-lg font-mono font-bold text-slate-300 opacity-90 cursor-not-allowed"
          />
          <span className="text-[11px] font-mono text-slate-500 block">dBW = dBm - 30</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
          STANDARD CARRIER & TELECOM POWER PRESETS
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => handleDbmChange(p.val)}
              className="p-3 rounded-xl bg-[#090912] hover:bg-[#151522] border border-white/10 hover:border-purple-500/50 text-left text-xs font-mono transition-all"
            >
              <div className="font-bold text-white">{p.val} dBm</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{p.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Formulas */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-3 font-mono text-xs text-slate-300">
        <h4 className="text-white font-heading font-bold text-sm uppercase">CONVERSION MATHEMATICS</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1">
          <div className="p-3 rounded-lg bg-[#050508] border border-white/5">
            <span className="text-purple-400 block mb-1">dBm to Milliwatts (mW):</span>
            P(mW) = 10^( P(dBm) / 10 )
          </div>
          <div className="p-3 rounded-lg bg-[#050508] border border-white/5">
            <span className="text-cyan-400 block mb-1">Milliwatts (mW) to dBm:</span>
            P(dBm) = 10 &times; log10( P(mW) )
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="Power Conversion Report"
          toolName="dBm to Watt Power Converter"
          inputs={{
            powerDbm: `${dbm} dBm`
          }}
          results={{
            milliwatts: `${mw} mW`,
            watts: `${w} W`,
            dbw: `${dbw} dBW`
          }}
          formula="P(mW) = 10^(P(dBm)/10); P(dBm) = 10*log10(P(mW))"
        />
      )}
    </div>
  );
};

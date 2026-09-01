import React, { useState, useMemo } from 'react';
import { Radio, Download, Activity, ShieldCheck, Mountain } from 'lucide-react';
import { calculateFresnelZone } from '../lib/calculators/rfCalculators';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

export const FresnelZoneView: React.FC = () => {
  const [freqGhz, setFreqGhz] = useState(5.8);
  const [distKm, setDistKm] = useState(12);
  const [obstacleKm, setObstacleKm] = useState(6);
  const [obstacleHeightM, setObstacleHeightM] = useState(8);
  const [showExportModal, setShowExportModal] = useState(false);

  const fresnel = useMemo(() => {
    const d1 = Math.max(0.1, obstacleKm);
    const d2 = Math.max(0.1, distKm - obstacleKm);
    const res = calculateFresnelZone(Math.max(0.1, freqGhz), d1, d2);
    // Earth curvature bulge (k = 4/3): h_earth = (d1 * d2) / (12.74 * 1.333)
    const earthBulgeM = +((d1 * d2) / 17.0).toFixed(2);
    const totalObstacleRise = obstacleHeightM + earthBulgeM;
    const requiredAntennaHeight = +(totalObstacleRise + res.minClearance60PercentMeters).toFixed(1);
    const isClear = requiredAntennaHeight <= 30; // 30m standard tower benchmark

    return {
      radiusM: res.radiusAtObstacleMeters,
      clearance60M: res.minClearance60PercentMeters,
      clearance80M: res.recommendedClearance80PercentMeters,
      maxRadiusM: res.maxRadiusMeters,
      earthBulgeM,
      recommendedAntennaHeightM: requiredAntennaHeight,
      isClear
    };
  }, [freqGhz, distKm, obstacleKm, obstacleHeightM]);

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
            1ST FRESNEL ZONE & OBSTACLE CLEARANCE
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Calculate the 1st Fresnel zone ellipsoid radius, 60% clearance threshold, earth curvature bulge, and required antenna mast height for microwave & Wi-Fi links.
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
        >
          <Download className="w-4 h-4 text-purple-400" />
          Export Clearance Report
        </button>
      </div>

      {/* Input Parameters Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <label className="block text-xs font-mono text-slate-400 uppercase">
            Carrier Frequency (GHz)
          </label>
          <input
            type="number"
            step="0.1"
            value={freqGhz}
            onChange={(e) => setFreqGhz(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[2.4, 5.8, 11.0, 18.0, 23.0].map((f) => (
              <button
                key={f}
                onClick={() => setFreqGhz(f)}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#090912] hover:bg-[#151522] border border-white/10 text-slate-300"
              >
                {f} GHz
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <label className="block text-xs font-mono text-slate-400 uppercase">
            Total Path Distance (km)
          </label>
          <input
            type="number"
            value={distKm}
            onChange={(e) => setDistKm(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
          />
        </div>

        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <label className="block text-xs font-mono text-slate-400 uppercase">
            Obstacle Distance from Site A (km)
          </label>
          <input
            type="number"
            value={obstacleKm}
            onChange={(e) => setObstacleKm(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
          />
        </div>

        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <label className="block text-xs font-mono text-slate-400 uppercase">
            Obstacle Height (meters)
          </label>
          <input
            type="number"
            value={obstacleHeightM}
            onChange={(e) => setObstacleHeightM(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
          />
        </div>
      </div>

      {/* Visual Fresnel Ellipse & Clearance Diagram */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
            PATH GEOMETRY & ELLIPSOID VISUALIZATION
          </h3>
          <span className="text-xs font-mono text-cyan-300">
            Carrier Clearance: {fresnel.isClear ? 'CLEAR (>= 60%)' : 'MARGINAL'}
          </span>
        </div>

        {/* SVG Visualization */}
        <div className="relative w-full h-48 bg-[#05050a] border border-white/10 rounded-xl overflow-hidden flex items-center justify-center p-4">
          <svg viewBox="0 0 600 200" className="w-full h-full">
            {/* Ground Line */}
            <line x1="30" y1="170" x2="570" y2="170" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

            {/* Earth Curvature Arc */}
            <path
              d="M 30,170 Q 300,162 570,170"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />

            {/* Direct Line-of-Sight Beam */}
            <line x1="50" y1="90" x2="550" y2="90" stroke="#a855f7" strokeWidth="2" strokeDasharray="3 3" />

            {/* Fresnel Zone Ellipse (100%) */}
            <ellipse
              cx="300"
              cy="90"
              rx="250"
              ry="50"
              fill="url(#fresnelGrad)"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />

            {/* 60% Clearance Boundary */}
            <ellipse
              cx="300"
              cy="90"
              rx="250"
              ry="30"
              fill="none"
              stroke="#34d399"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              strokeOpacity="0.8"
            />

            {/* Site A Tower */}
            <line x1="50" y1="170" x2="50" y2="90" stroke="#ffffff" strokeWidth="3" />
            <circle cx="50" cy="90" r="4" fill="#a855f7" />
            <text x="35" y="80" fill="#a855f7" fontSize="10" fontFamily="monospace" fontWeight="bold">Site A</text>

            {/* Site B Tower */}
            <line x1="550" y1="170" x2="550" y2="90" stroke="#ffffff" strokeWidth="3" />
            <circle cx="550" cy="90" r="4" fill="#a855f7" />
            <text x="535" y="80" fill="#a855f7" fontSize="10" fontFamily="monospace" fontWeight="bold">Site B</text>

            {/* Obstacle Representation */}
            {distKm > 0 && (
              <g transform={`translate(${50 + (Math.min(distKm, Math.max(0, obstacleKm)) / distKm) * 500}, 0)`}>
                <line x1="0" y1="170" x2="0" y2={170 - Math.min(obstacleHeightM * 4, 100)} stroke="#ef4444" strokeWidth="4" />
                <circle cx="0" cy={170 - Math.min(obstacleHeightM * 4, 100)} r="4" fill="#ef4444" />
                <text x="-20" y="185" fill="#ef4444" fontSize="9" fontFamily="monospace">Obstacle</text>
              </g>
            )}

            <defs>
              <linearGradient id="fresnelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 4 Quantitative Result Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">100% FRESNEL RADIUS (F1)</span>
            <div className="text-2xl font-bold text-cyan-400 font-heading">
              {fresnel.radiusM} <span className="text-xs font-mono text-slate-400">m</span>
            </div>
            <span className="text-[10px] text-slate-400">At obstacle point</span>
          </div>

          <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">60% CLEARANCE REQUIRED</span>
            <div className="text-2xl font-bold text-emerald-400 font-heading">
              {fresnel.clearance60M} <span className="text-xs font-mono text-slate-400">m</span>
            </div>
            <span className="text-[10px] text-slate-400">Standard carrier minimum</span>
          </div>

          <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">EARTH CURVATURE BULGE</span>
            <div className="text-2xl font-bold text-amber-400 font-heading">
              {fresnel.earthBulgeM} <span className="text-xs font-mono text-slate-400">m</span>
            </div>
            <span className="text-[10px] text-slate-400">k = 4/3 standard refraction</span>
          </div>

          <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">RECOMMENDED TOWER HEIGHT</span>
            <div className="text-2xl font-bold text-purple-400 font-heading">
              {fresnel.recommendedAntennaHeightM} <span className="text-xs font-mono text-slate-400">m</span>
            </div>
            <span className="text-[10px] text-slate-400">To guarantee 60% clearance</span>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="Fresnel Zone Clearance Analysis"
          toolName="Fresnel Zone Clearance Calculator"
          inputs={{
            frequencyGhz: freqGhz,
            totalDistanceKm: distKm,
            obstacleDistanceKm: obstacleKm,
            obstacleHeightM
          }}
          results={{
            fresnelRadius100PercentM: `${fresnel.radiusM} m`,
            required60PercentClearanceM: `${fresnel.clearance60M} m`,
            earthCurvatureBulgeM: `${fresnel.earthBulgeM} m`,
            recommendedAntennaHeightM: `${fresnel.recommendedAntennaHeightM} m`,
            clearanceStatus: fresnel.isClear ? 'Clear' : 'Marginal'
          }}
          formula="F1 = 17.32 * sqrt((d1 * d2) / (f_GHz * d_total)); Earth Bulge = (d1 * d2) / 17.0"
        />
      )}
    </div>
  );
};

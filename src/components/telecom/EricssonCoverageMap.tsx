import React, { useState, useMemo } from 'react';
import { 
  Radio, 
  Layers, 
  Maximize2, 
  Eye, 
  Sliders, 
  MapPin, 
  Compass, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Navigation,
  Smartphone,
  Gauge,
  Info,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { TelecomSite, SectorConfig } from '../../data/telecomSites';

interface EricssonCoverageMapProps {
  site: TelecomSite;
  onUpdateSectorConfig?: (sectorIndex: number, newConfig: Partial<SectorConfig>) => void;
}

export const EricssonCoverageMap: React.FC<EricssonCoverageMapProps> = ({ site }) => {
  // Layer Selection: 2G, 3G, 4G, 5G, or All
  const [selectedTechLayer, setSelectedTechLayer] = useState<'ALL' | '5G' | '4G' | '3G' | '2G'>('4G');
  
  // 5G Active Beam index (for Massive MIMO beamforming visualization)
  const [selectedBeamIndex, setSelectedBeamIndex] = useState<number>(4);

  // Antenna Engineering Controls
  const [elecDowntiltDeg, setElecDowntiltDeg] = useState<number>(4);
  const [mechDowntiltDeg, setMechDowntiltDeg] = useState<number>(2);
  const [txPowerWatts, setTxPowerWatts] = useState<number>(40);
  const [antennaGainDbi, setAntennaGainDbi] = useState<number>(18.0);
  const [clutterType, setClutterType] = useState<'URBAN' | 'SUBURBAN' | 'RURAL'>('URBAN');

  // Interactive Probe / UE (User Equipment) Position on Map
  // (x, y coordinates relative to center (0,0) in simulated meters, range -3000m to +3000m)
  const [probePos, setProbePos] = useState<{ x: number; y: number }>({ x: 650, y: -450 });
  const [isDraggingProbe, setIsDraggingProbe] = useState<boolean>(false);

  // Map Zoom / Scale Level (1.0 = standard 3km view)
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // Toggle coverage contours vs heatmap
  const [showRays, setShowRays] = useState<boolean>(true);
  const [showAzimuthLabels, setShowAzimuthLabels] = useState<boolean>(true);
  const [showCoverageContours, setShowCoverageContours] = useState<boolean>(true);

  // Sectors setup (default 3-sector at 60°, 180°, 300°)
  const sectors = useMemo(() => {
    return site.sectorsData && site.sectorsData.length === 3 
      ? site.sectorsData 
      : [
          { sectorId: 1, azimuthDeg: 60, beamwidthDeg: 65, mechTiltDeg: mechDowntiltDeg, elecTiltDeg: elecDowntiltDeg, antennaHeightM: site.towerHeightM, antennaGainDbi, txPowerWatts, pci: site.fourGParams.pci, earfcn: 1650, frequencyMhz: 1800 },
          { sectorId: 2, azimuthDeg: 180, beamwidthDeg: 65, mechTiltDeg: mechDowntiltDeg, elecTiltDeg: elecDowntiltDeg, antennaHeightM: site.towerHeightM, antennaGainDbi, txPowerWatts, pci: site.fourGParams.pci + 1, earfcn: 1650, frequencyMhz: 1800 },
          { sectorId: 3, azimuthDeg: 300, beamwidthDeg: 65, mechTiltDeg: mechDowntiltDeg, elecTiltDeg: elecDowntiltDeg, antennaHeightM: site.towerHeightM, antennaGainDbi, txPowerWatts, pci: site.fourGParams.pci + 2, earfcn: 1650, frequencyMhz: 1800 }
        ];
  }, [site, mechDowntiltDeg, elecDowntiltDeg, antennaGainDbi, txPowerWatts]);

  // Calculate Probe Radio Metrics from Tower Center (0, 0)
  const probeMetrics = useMemo(() => {
    const distM = Math.sqrt(probePos.x * probePos.x + probePos.y * probePos.y);
    const distKm = Math.max(0.02, distM / 1000);
    
    // Compass Angle in degrees from North (0° = Top/North, 90° = East, 180° = South, 270° = West)
    let angleRad = Math.atan2(probePos.x, -probePos.y);
    let angleDeg = (angleRad * 180 / Math.PI + 360) % 360;

    // Determine Best Serving Sector based on angular proximity to azimuth
    let bestSector = sectors[0];
    let minAngleDiff = 360;

    sectors.forEach((sec) => {
      let diff = Math.abs(angleDeg - sec.azimuthDeg);
      if (diff > 180) diff = 360 - diff;
      if (diff < minAngleDiff) {
        minAngleDiff = diff;
        bestSector = sec;
      }
    });

    // Antenna horizontal pattern attenuation (Gaussian 3dB approximation with 65° HPBW)
    const hpbw = bestSector.beamwidthDeg || 65;
    const horizontalAttenDb = Math.min(28, 12 * Math.pow(minAngleDiff / hpbw, 2));

    // Propagation Path Loss (Okumura-Hata simplified for 1800MHz / 3500MHz)
    const freqMhz = selectedTechLayer === '5G' ? 3500 : selectedTechLayer === '2G' ? 900 : 1800;
    const totalTilt = mechDowntiltDeg + elecDowntiltDeg;
    
    // Clutter factor
    const clutterLoss = clutterType === 'URBAN' ? 6 : clutterType === 'SUBURBAN' ? 2 : 0;
    
    // Base path loss formula: PL = 32.4 + 20*log10(f) + 30*log10(d)
    const pathLossDb = 32.4 + 20 * Math.log10(freqMhz) + 33 * Math.log10(distKm) + clutterLoss;
    
    // Total EIRP (dBm) = 10*log10(txPower*1000) + AntennaGain - FeedLoss
    const eirpDbm = 10 * Math.log10(txPowerWatts * 1000) + antennaGainDbi - 2.5;

    // Calculated Received Power (RSRP / RSCP / RxLev)
    let calculatedRsrp = Math.round(eirpDbm - pathLossDb - horizontalAttenDb);
    // Clamp to realistic bounds (-45 dBm to -125 dBm)
    calculatedRsrp = Math.max(-128, Math.min(-45, calculatedRsrp));

    // SINR estimation
    let sinrDb = Math.round((calculatedRsrp + 115) * 0.8 - (minAngleDiff > 55 ? 6 : 0));
    sinrDb = Math.max(-8, Math.min(30, sinrDb));

    // Estimated Throughput based on SINR & technology
    let throughputMbps = 0;
    let modulation = 'QPSK';
    if (calculatedRsrp > -80) {
      modulation = selectedTechLayer === '5G' ? '256-QAM (64T64R)' : '256-QAM (4x4 MIMO)';
      throughputMbps = selectedTechLayer === '5G' ? 880 : selectedTechLayer === '4G' ? 260 : selectedTechLayer === '3G' ? 38 : 0.23;
    } else if (calculatedRsrp > -95) {
      modulation = '64-QAM (2x2 MIMO)';
      throughputMbps = selectedTechLayer === '5G' ? 450 : selectedTechLayer === '4G' ? 145 : selectedTechLayer === '3G' ? 18 : 0.18;
    } else if (calculatedRsrp > -108) {
      modulation = '16-QAM';
      throughputMbps = selectedTechLayer === '5G' ? 180 : selectedTechLayer === '4G' ? 45 : selectedTechLayer === '3G' ? 5.2 : 0.08;
    } else {
      modulation = 'QPSK (Robust)';
      throughputMbps = selectedTechLayer === '5G' ? 30 : selectedTechLayer === '4G' ? 8.5 : selectedTechLayer === '3G' ? 1.1 : 0.02;
    }

    // Quality Zone Classification
    let zoneCategory: 'VERY_STRONG' | 'GOOD' | 'EDGE' | 'HANDOVER_RISK' = 'GOOD';
    let zoneColor = '#84cc16';
    let zoneLabel = 'Zone Bonne Couverture';

    if (calculatedRsrp >= -80) {
      zoneCategory = 'VERY_STRONG';
      zoneColor = '#10b981';
      zoneLabel = 'Zone Très Forte Couverture (Indoor garanti)';
    } else if (calculatedRsrp >= -95) {
      zoneCategory = 'GOOD';
      zoneColor = '#84cc16';
      zoneLabel = 'Zone Bonne Couverture (Outdoor & Mobilité)';
    } else if (calculatedRsrp >= -108) {
      zoneCategory = 'EDGE';
      zoneColor = '#f97316';
      zoneLabel = 'Zone Couverture Limite (Cell Edge)';
    } else {
      zoneCategory = 'HANDOVER_RISK';
      zoneColor = '#ef4444';
      zoneLabel = 'Zone d\'Ombre / Seuil Handover Requis';
    }

    return {
      distM: Math.round(distM),
      distKm: distKm.toFixed(2),
      angleDeg: Math.round(angleDeg),
      servingSector: bestSector.sectorId,
      azimuthOffset: Math.round(minAngleDiff),
      rsrpDbm: calculatedRsrp,
      sinrDb,
      modulation,
      throughputMbps,
      zoneCategory,
      zoneColor,
      zoneLabel,
      totalTilt
    };
  }, [probePos, sectors, selectedTechLayer, clutterType, txPowerWatts, antennaGainDbi, mechDowntiltDeg, elecDowntiltDeg]);

  // Handle map click or drag to position probe
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgSize = rect.width;
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;

    // View radius in meters represented by SVG half-width
    const maxRadiusM = 3000 / zoomLevel;
    const scale = maxRadiusM / centerX;

    const clickX = (e.clientX - rect.left - centerX) * scale;
    const clickY = (e.clientY - rect.top - centerY) * scale;

    setProbePos({ x: Math.round(clickX), y: Math.round(clickY) });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar with Site Identification & Technology Layers */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 flex items-center gap-1">
                <Radio className="w-3 h-3" /> ERICSSON SRS &bull; SITE RADIO SURVEY & COVERAGE TOOL
              </span>
              <span className="text-xs font-mono text-slate-400">
                Site #{site.code}
              </span>
            </div>
            <h2 className="text-2xl font-heading font-black text-white tracking-tight flex items-center gap-2">
              <span>ZONES DE COUVERTURE & RAYONNEMENT RADIO</span>
              <span className="text-purple-400 font-mono text-lg font-bold">[{site.code}]</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Modélisation cartographique des 3 secteurs ({sectors.map(s => `Sec ${s.sectorId}: ${s.azimuthDeg}°`).join(' | ')}), lobes d'antennes et seuils de puissance RSRP (3GPP / Ericsson RBS).
            </p>
          </div>

          {/* Technology Layer Selector */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 px-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> Couche :
            </span>
            {(['5G', '4G', '3G', '2G', 'ALL'] as const).map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTechLayer(tech)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 ${
                  selectedTechLayer === tech
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tech === '5G' && <Sparkles className="w-3 h-3 text-cyan-300" />}
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Visual Canvas + Live Measurement Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Center: Interactive SVG Radar & Radiation Pattern (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl relative flex flex-col justify-between overflow-hidden">
          {/* Top Canvas Controls Bar */}
          <div className="flex items-center justify-between z-10 pb-3 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-purple-400" />
                VUE RADAR COUVERTURE 360°
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                (Échelle : Rayon {Math.round(3000 / zoomLevel)}m)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.3))}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono font-bold"
                title="Zoomer (+)"
              >
                +
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.3))}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono font-bold"
                title="Dézoomer (-)"
              >
                -
              </button>
              <button
                onClick={() => { setZoomLevel(1.0); setProbePos({ x: 650, y: -450 }); }}
                className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                title="Recentrer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive SVG Diagram */}
          <div className="relative my-3 flex items-center justify-center">
            <svg
              viewBox="-300 -300 600 600"
              className="w-full max-w-[560px] aspect-square select-none cursor-crosshair"
              onClick={handleMapClick}
            >
              <defs>
                {/* Background Grid Pattern */}
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2,2" />
                </pattern>

                {/* Sector 1 Radiation Lobe Gradient */}
                <radialGradient id="sec1Grad" cx="0" cy="0" r="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.5" />
                  <stop offset="75%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>

                {/* Probe Pulse Glow */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background Radar Rings */}
              <rect x="-300" y="-300" width="600" height="600" fill="url(#grid)" />
              
              {/* Distance Rings (500m, 1000m, 2000m, 3000m) */}
              {[50, 100, 180, 260].map((radius, idx) => {
                const distancesM = [500, 1000, 2000, 3000];
                const rScaled = radius * zoomLevel;
                return (
                  <g key={radius}>
                    <circle
                      cx="0"
                      cy="0"
                      r={rScaled}
                      fill="none"
                      stroke="#334155"
                      strokeWidth="1"
                      strokeDasharray="4,4"
                    />
                    <text
                      x="4"
                      y={-rScaled + 12}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {distancesM[idx]}m
                    </text>
                  </g>
                );
              })}

              {/* Crosshairs & North Compass */}
              <line x1="-280" y1="0" x2="280" y2="0" stroke="#1e293b" strokeWidth="1" />
              <line x1="0" y1="-280" x2="0" y2="280" stroke="#1e293b" strokeWidth="1" />
              
              {/* Compass Cardinal Points */}
              <text x="0" y="-285" fill="#a855f7" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">N (000°)</text>
              <text x="285" y="4" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="start" fontFamily="monospace">E (090°)</text>
              <text x="0" y="295" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">S (180°)</text>
              <text x="-285" y="4" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="end" fontFamily="monospace">O (270°)</text>

              {/* 3. Coverage Radiation Lobes (Sectors 1, 2, 3) */}
              {sectors.map((sec) => {
                const angle = sec.azimuthDeg;
                const lobeLength = 220 * zoomLevel;
                const lobeWidth = 85 * zoomLevel;

                return (
                  <g key={sec.sectorId} transform={`rotate(${angle})`}>
                    {/* Main Radiation Lobe Shape */}
                    <path
                      d={`M 0 0 C ${-lobeWidth * 0.7} ${-lobeLength * 0.4}, ${-lobeWidth} ${-lobeLength * 0.85}, 0 ${-lobeLength} C ${lobeWidth} ${-lobeLength * 0.85}, ${lobeWidth * 0.7} ${-lobeLength * 0.4}, 0 0 Z`}
                      fill={`url(#sec1Grad)`}
                      stroke="#8b5cf6"
                      strokeWidth="1.5"
                      strokeOpacity="0.7"
                    />

                    {/* Sidelobes (Minor radiation peaks) */}
                    <ellipse cx={-30 * zoomLevel} cy={-40 * zoomLevel} rx={12 * zoomLevel} ry={22 * zoomLevel} fill="#8b5cf6" fillOpacity="0.15" />
                    <ellipse cx={30 * zoomLevel} cy={-40 * zoomLevel} rx={12 * zoomLevel} ry={22 * zoomLevel} fill="#8b5cf6" fillOpacity="0.15" />
                    
                    {/* Back Lobe (-25dB front-to-back ratio) */}
                    <circle cx="0" cy={20 * zoomLevel} r={14 * zoomLevel} fill="#8b5cf6" fillOpacity="0.1" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2,2" />

                    {/* Sector Boresight / Azimuth Line */}
                    <line x1="0" y1="0" x2="0" y2={-270 * zoomLevel} stroke="#c084fc" strokeWidth="1.5" strokeDasharray="3,3" />

                    {/* Sector Label Pill */}
                    <g transform={`translate(0, ${-240 * zoomLevel})`}>
                      <rect x="-35" y="-10" width="70" height="20" rx="6" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.2" />
                      <text x="0" y="3" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        SEC {sec.sectorId} ({sec.azimuthDeg}°)
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* 5G Beamforming Beams (if 5G Layer selected) */}
              {selectedTechLayer === '5G' && (
                <g>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((beam) => {
                    const beamAngle = 60 + (beam - 4.5) * 12; // Beam spread across Sector 1
                    const isTargetBeam = beam === selectedBeamIndex;
                    return (
                      <g key={beam} transform={`rotate(${beamAngle})`}>
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2={-190 * zoomLevel}
                          stroke={isTargetBeam ? '#22d3ee' : '#0891b2'}
                          strokeWidth={isTargetBeam ? 3 : 1}
                          strokeDasharray={isTargetBeam ? 'none' : '2,2'}
                        />
                        {isTargetBeam && (
                          <circle cx="0" cy={-190 * zoomLevel} r="4" fill="#22d3ee" filter="url(#glow)" />
                        )}
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Center Tower Base Station Icon */}
              <g>
                <circle cx="0" cy="0" r="14" fill="#7e22ce" stroke="#f472b6" strokeWidth="2" filter="url(#glow)" />
                <circle cx="0" cy="0" r="6" fill="#ffffff" />
                <text x="0" y="24" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  {site.code}
                </text>
              </g>

              {/* Probe / Drive Test Measurement Vehicle Marker */}
              {(() => {
                // Convert probe meters to SVG coordinate space
                const maxRadiusM = 3000 / zoomLevel;
                const scale = 300 / maxRadiusM;
                const svgX = probePos.x * scale;
                const svgY = probePos.y * scale;

                return (
                  <g transform={`translate(${svgX}, ${svgY})`} filter="url(#glow)">
                    {/* Line connecting tower to probe */}
                    <line x1="0" y1="0" x2={-svgX} y2={-svgY} stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3,3" />

                    {/* Pulsing Probe Ring */}
                    <circle cx="0" cy="0" r="14" fill={probeMetrics.zoneColor} fillOpacity="0.25" stroke={probeMetrics.zoneColor} strokeWidth="1.5" className="animate-ping" />
                    <circle cx="0" cy="0" r="8" fill={probeMetrics.zoneColor} stroke="#ffffff" strokeWidth="2" />
                    
                    {/* Real-time Tooltip Badge attached to Probe */}
                    <g transform="translate(14, -18)">
                      <rect x="0" y="0" width="110" height="34" rx="6" fill="#020617" stroke={probeMetrics.zoneColor} strokeWidth="1.2" />
                      <text x="6" y="13" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        RSRP: {probeMetrics.rsrpDbm} dBm
                      </text>
                      <text x="6" y="26" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                        Sec {probeMetrics.servingSector} &bull; {probeMetrics.distM}m
                      </text>
                    </g>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Interactive Legend & Coverage Zones */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-900/60 border border-slate-800">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <div>
                <div className="font-bold text-emerald-400">&gt; -80 dBm</div>
                <div className="text-[9px] text-slate-400">Indoor Très Fort</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-900/60 border border-slate-800">
              <span className="w-3 h-3 rounded-full bg-lime-500 shrink-0" />
              <div>
                <div className="font-bold text-lime-400">-80 à -95 dBm</div>
                <div className="text-[9px] text-slate-400">Outdoor Bon</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-900/60 border border-slate-800">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <div>
                <div className="font-bold text-amber-400">-95 à -108 dBm</div>
                <div className="text-[9px] text-slate-400">Couverture Limite</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-900/60 border border-slate-800">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
              <div>
                <div className="font-bold text-rose-400">&lt; -108 dBm</div>
                <div className="text-[9px] text-slate-400">Seuil Handover</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Field Probe Telemetry & Ericsson RBS Engineering Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Probe Telemetry Card */}
          <div className="bg-slate-900/90 border border-purple-500/40 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <span className="text-[10px] font-mono font-bold uppercase text-purple-400 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                SONDE DE MESURE TERRAIN (UE PROBE)
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                Sec {probeMetrics.servingSector} Serveur
              </span>
            </div>

            {/* Big Signal Display */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Puissance Reçue RSRP</div>
                <div className="text-2xl font-heading font-black text-white font-mono flex items-baseline gap-1 mt-0.5">
                  <span style={{ color: probeMetrics.zoneColor }}>{probeMetrics.rsrpDbm}</span>
                  <span className="text-xs text-slate-400 font-normal">dBm</span>
                </div>
                <div className="text-[10px] font-mono mt-1" style={{ color: probeMetrics.zoneColor }}>
                  {probeMetrics.zoneLabel}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Rapport SINR & Débit</div>
                <div className="text-2xl font-heading font-black text-white font-mono flex items-baseline gap-1 mt-0.5">
                  <span className="text-cyan-400">+{probeMetrics.sinrDb}</span>
                  <span className="text-xs text-slate-400 font-normal">dB</span>
                </div>
                <div className="text-[10px] font-mono text-cyan-300 mt-1">
                  Débit : ~{probeMetrics.throughputMbps} Mbps ({probeMetrics.modulation})
                </div>
              </div>
            </div>

            {/* Geometry Details */}
            <div className="space-y-1.5 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Distance au Pylône :</span>
                <span className="font-bold text-white">{probeMetrics.distM} m ({probeMetrics.distKm} km)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Orientation Boussole :</span>
                <span className="font-bold text-purple-300">{probeMetrics.angleDeg}° (Azimuth offset: {probeMetrics.azimuthOffset}°)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Secteur Serveur Actif :</span>
                <span className="font-bold text-emerald-400">Secteur {probeMetrics.servingSector} (Azimuth {sectors[probeMetrics.servingSector - 1]?.azimuthDeg}°)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Downtilt Global (Méc+Élec) :</span>
                <span className="font-bold text-amber-300">{probeMetrics.totalTilt}° ({mechDowntiltDeg}° Méc + {elecDowntiltDeg}° RET)</span>
              </div>
            </div>

            {/* Interactive Coordinate Position Slider */}
            <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Déplacer la sonde (Distance X/Y) :</span>
                <span className="font-mono text-purple-300">X: {probePos.x}m, Y: {probePos.y}m</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="range"
                  min="-2500"
                  max="2500"
                  step="50"
                  value={probePos.x}
                  onChange={(e) => setProbePos(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                  className="w-full accent-purple-500"
                />
                <input
                  type="range"
                  min="-2500"
                  max="2500"
                  step="50"
                  value={probePos.y}
                  onChange={(e) => setProbePos(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Ericsson RBS / ERS Radio Antenna Parameters Tuning */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                PARAMÈTRES D'INGÉNIERIE RADIO (ERICSSON ERS)
              </span>
            </div>

            {/* Electrical Tilt RET */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Tilt Électrique RET :</span>
                <span className="font-mono font-bold text-purple-400">{elecDowntiltDeg}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={elecDowntiltDeg}
                onChange={(e) => setElecDowntiltDeg(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
              <p className="text-[10px] text-slate-500">Contrôle l'angle de pointage vertical via le moteur RET d'antenne.</p>
            </div>

            {/* Mechanical Tilt */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Tilt Mécanique :</span>
                <span className="font-mono font-bold text-indigo-400">{mechDowntiltDeg}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={mechDowntiltDeg}
                onChange={(e) => setMechDowntiltDeg(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Transmit Power */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Puissance d'Émission RRU (PA) :</span>
                <span className="font-mono font-bold text-emerald-400">{txPowerWatts} Watts ({Math.round(10 * Math.log10(txPowerWatts * 1000))} dBm)</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="10"
                value={txPowerWatts}
                onChange={(e) => setTxPowerWatts(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Environment Clutter Selection */}
            <div>
              <label className="text-xs text-slate-300 block mb-1.5">Modèle d'Environnement Terrain :</label>
              <div className="grid grid-cols-3 gap-2">
                {(['URBAN', 'SUBURBAN', 'RURAL'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setClutterType(type)}
                    className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition ${
                      clutterType === type
                        ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {type === 'URBAN' ? 'Urbain' : type === 'SUBURBAN' ? 'Suburbain' : 'Rural'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

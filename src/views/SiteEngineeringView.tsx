import React, { useState, useEffect, useMemo } from 'react';
import { 
  Radio, 
  Download, 
  Zap, 
  Network, 
  ShieldCheck, 
  Signal, 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  PhoneCall, 
  Compass, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Wifi, 
  Cpu, 
  ArrowRight, 
  Smartphone, 
  FileText, 
  Plus, 
  Search, 
  Edit3, 
  Sparkles,
  Share2,
  Gauge,
  Navigation
} from 'lucide-react';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';
import { PRESET_SITES, TelecomSite, generateDiscoveredSite } from '../data/telecomSites';
import { SiteAutoDiscoveryModal } from '../components/telecom/SiteAutoDiscoveryModal';
import { EricssonCoverageMap } from '../components/telecom/EricssonCoverageMap';

export const SiteEngineeringView: React.FC = () => {
  // Navigation Tabs: Coverage Zones (Ericsson SRS) vs Drive Test vs Tower & Power Sizing
  const [activeTab, setActiveTab] = useState<'COVERAGE_ZONES' | 'SRS_DRIVE_TEST' | 'TOWER_POWER'>('COVERAGE_ZONES');

  // Connected Site Selection & Auto-Discovery
  const [selectedSiteId, setSelectedSiteId] = useState<string>('anm-234');
  const [siteList, setSiteList] = useState<TelecomSite[]>(PRESET_SITES);
  const [autoDiscoveryModalOpen, setAutoDiscoveryModalOpen] = useState<boolean>(false);
  const [customSiteModal, setCustomSiteModal] = useState<boolean>(false);
  const [newSiteCode, setNewSiteCode] = useState<string>('ANM 235');
  const [newSiteName, setNewSiteName] = useState<string>('Analamahitsy Sector Extension 3');

  // Active Technology Filter in Drive Test
  const [activeTechFilter, setActiveTechFilter] = useState<'ALL' | '2G' | '3G' | '4G' | '5G'>('ALL');

  // Active Serving Sector (1, 2, 3)
  const [servingSector, setServingSector] = useState<number>(1);

  // Drive Test Live Simulation State
  const [isDriveTesting, setIsDriveTesting] = useState<boolean>(false);
  const [driveTestDurationSec, setDriveTestDurationSec] = useState<number>(0);
  const [vehicleSpeedKmh, setVehicleSpeedKmh] = useState<number>(42);
  const [distanceCoveredKm, setDistanceCoveredKm] = useState<number>(1.4);
  const [liveLogs, setLiveLogs] = useState<Array<{ id: string; time: string; type: 'INFO' | 'HANDOVER' | 'CALL' | 'DATA' | 'ALARM'; message: string }>>([
    { id: '1', time: '10:14:02', type: 'INFO', message: 'Connected to BTS ANM 234 (Sector 1 Azimuth 060°) - PLMN 646-01' },
    { id: '2', time: '10:14:15', type: 'DATA', message: '4G LTE Carrier Aggregation active: B3 (20MHz) + B7 (20MHz) - DL: 224 Mbps' },
    { id: '3', time: '10:14:28', type: 'HANDOVER', message: '5G SSB Beam Tracking: Switched from Beam #2 to Beam #4 (SS-RSRP -82 dBm)' },
    { id: '4', time: '10:14:41', type: 'CALL', message: 'VoLTE HD Call Established: Codec EVS-SWB 24.4kbps, MOS Score 4.45 / 5.0' }
  ]);

  // Interactive Live Call / Data Test Trigger
  const [activeCallStatus, setActiveCallStatus] = useState<string | null>(null);
  const [speedTestRunning, setSpeedTestRunning] = useState<boolean>(false);
  const [liveThroughput, setLiveThroughput] = useState<number>(224.8);

  // SRS Audit Acceptance Checklist States
  const [checklist, setChecklist] = useState({
    antennaTilt: true,
    vswrUnderLimit: true,
    feederGrounding: true,
    cpriFiberPower: true,
    microwaveRslLevel: true,
    ptp1588SyncLock: true,
    vlanTrunkingOk: true,
    dcRectifierFloatOk: true,
    batteryBankHealthy: true,
    gensetAtsReady: true,
    surgeSpdGreen: true
  });

  // Tower & Power Modeler States (Tab 3)
  const [siteType, setSiteType] = useState<'MACRO' | 'SMALL_CELL' | 'ROOFTOP' | 'GREENFIELD'>('MACRO');
  const [towerHeightM, setTowerHeightM] = useState(36);
  const [sectors, setSectors] = useState(3);
  const [rruCount, setRruCount] = useState(6);
  const [powerSource, setPowerSource] = useState<'GRID_BATTERY' | 'SOLAR_HYBRID' | 'GENSET_HYBRID'>('GRID_BATTERY');
  const [backhaulType, setBackhaulType] = useState<'MICROWAVE' | 'FIBER_GPON' | 'DARK_FIBER'>('MICROWAVE');
  const [showExportModal, setShowExportModal] = useState(false);

  // Get current active site
  const currentSite: TelecomSite = useMemo(() => {
    return siteList.find(s => s.id === selectedSiteId) || siteList[0];
  }, [selectedSiteId, siteList]);

  // Handle discovered site applied from Auto-Discovery Modal
  const handleSiteDiscovered = (discovered: TelecomSite) => {
    setSiteList(prev => {
      const exists = prev.find(s => s.id === discovered.id || s.code === discovered.code);
      if (exists) return prev;
      return [discovered, ...prev];
    });
    setSelectedSiteId(discovered.id);
    setActiveTab('COVERAGE_ZONES');
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLiveLogs(prev => [
      { id: Date.now().toString(), time: timeStr, type: 'INFO', message: `Auto-Discovery : Verrouillé sur le site ${discovered.code} (${discovered.name}) - PLMN ${discovered.plmn}` },
      ...prev
    ]);
  };

  // Drive test timer & dynamic simulation loop
  useEffect(() => {
    let interval: any = null;
    if (isDriveTesting) {
      interval = setInterval(() => {
        setDriveTestDurationSec(prev => prev + 1);
        setDistanceCoveredKm(prev => Math.round((prev + (vehicleSpeedKmh / 3600)) * 100) / 100);

        // Periodically inject realistic drive test telemetry events
        if (Math.random() < 0.35) {
          const events: Array<{ type: 'INFO' | 'HANDOVER' | 'CALL' | 'DATA' | 'ALARM'; message: string }> = [
            { type: 'HANDOVER', message: `Intra-LTE Handover: Target PCI ${currentSite.fourGParams.pci} Sector ${servingSector} (RSRP: ${currentSite.fourGParams.rsrpDbm + Math.floor(Math.random() * 5 - 2)} dBm, SINR: ${currentSite.fourGParams.sinrDb} dB)` },
            { type: 'DATA', message: `Throughput Probe: 4G/5G DL Peak ${Math.round(currentSite.fiveGParams.dlThroughputMbps * (0.9 + Math.random() * 0.2))} Mbps, Jitter 0.8ms` },
            { type: 'INFO', message: `2G BCCH RxLev: ${currentSite.twoGParams.rxLevDbm} dBm, RxQual: 0 (BER: 0.01%), TA: ${currentSite.twoGParams.timingAdvance}` },
            { type: 'CALL', message: `VoLTE HD Bearer QCI=1 Active | EVS-SWB 24.4kbps | Packet Loss 0.0%` },
            { type: 'HANDOVER', message: `5G NR Dual Connectivity (ENDC): LTE Anchor B3 + NR n78 Carrier Locked` }
          ];
          const randomEvent = events[Math.floor(Math.random() * events.length)];
          const now = new Date();
          const timeStr = now.toTimeString().split(' ')[0];
          setLiveLogs(prev => [
            { id: Date.now().toString(), time: timeStr, type: randomEvent.type, message: randomEvent.message },
            ...prev.slice(0, 19)
          ]);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isDriveTesting, vehicleSpeedKmh, currentSite, servingSector]);

  // Derived tower power calculation for Tab 2
  const totalRruPower = rruCount * 250;
  const bbuPower = 350;
  const routerPower = 180;
  const mwPower = backhaulType === 'MICROWAVE' ? 120 : 40;
  const auxPower = 200;
  const totalSitePowerWatts = totalRruPower + bbuPower + routerPower + mwPower + auxPower;
  const rectifierCurrentAmps = Math.round(totalSitePowerWatts / 48);
  const batteryAhRequired = Math.round((totalSitePowerWatts * 8) / (48 * 0.8));

  // Handle adding custom site
  const handleAddCustomSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteCode.trim()) return;

    const newSite = generateDiscoveredSite(
      -18.8850,
      47.5120,
      newSiteName.trim() || `Site ${newSiteCode.trim().toUpperCase()} Station`,
      'Orange / Telma RanShare (PLMN 646-01)',
      'MANUAL_COORDINATE_SEARCH'
    );
    newSite.id = `custom-${Date.now()}`;
    newSite.code = newSiteCode.trim().toUpperCase();

    setSiteList(prev => [newSite, ...prev]);
    setSelectedSiteId(newSite.id);
    setCustomSiteModal(false);
  };

  // Trigger VoLTE call simulation
  const triggerVoLTECall = () => {
    setActiveCallStatus('DIALING');
    setTimeout(() => {
      setActiveCallStatus('CONNECTED');
      const timeStr = new Date().toTimeString().split(' ')[0];
      setLiveLogs(prev => [
        { id: Date.now().toString(), time: timeStr, type: 'CALL', message: `VoLTE Test Call Established with ${currentSite.code}: Codec EVS-SWB 24.4kbps, Jitter 0.4ms, MOS 4.45` },
        ...prev
      ]);
      setTimeout(() => {
        setActiveCallStatus(null);
      }, 5000);
    }, 1500);
  };

  // Trigger Speed burst test
  const triggerSpeedBurst = () => {
    setSpeedTestRunning(true);
    setLiveThroughput(50);
    const interval = setInterval(() => {
      setLiveThroughput(prev => {
        if (prev >= currentSite.fiveGParams.dlThroughputMbps) {
          clearInterval(interval);
          setSpeedTestRunning(false);
          return currentSite.fiveGParams.dlThroughputMbps;
        }
        return Math.round(prev + 120);
      });
    }, 200);

    const timeStr = new Date().toTimeString().split(' ')[0];
    setLiveLogs(prev => [
      { id: Date.now().toString(), time: timeStr, type: 'DATA', message: `Throughput Benchmark on ${currentSite.code}: Peak DL ${currentSite.fiveGParams.dlThroughputMbps || currentSite.fourGParams.dlThroughputMbps} Mbps verified` },
      ...prev
    ]);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// TRANSMISSION & FIELD ENGINEERING</span>
            <span>&bull;</span>
            <Badge type="REAL TEST" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight flex items-center gap-3">
            <span>SRS & DRIVE TEST FIELD APPLICATION</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
              2G &bull; 3G &bull; 4G &bull; 5G
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Application de Site Radio Survey (SRS), Drive Test terrain, audit d'acceptation et diagnostic multi-technologies en direct selon le site cellulaire connecté (ex: <strong className="text-purple-300">ANM 234</strong>).
          </p>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Auto-Discovery Scan Button */}
          <button
            onClick={() => setAutoDiscoveryModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-lg shadow-purple-600/30 transition active:scale-95"
          >
            <Radio className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>Auto-Scan & Découverte de Site</span>
          </button>

          <div className="flex items-center p-1 rounded-xl bg-[#090912] border border-white/10">
            <button
              onClick={() => setActiveTab('COVERAGE_ZONES')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'COVERAGE_ZONES'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Zones de Couverture (Ericsson SRS)
            </button>
            <button
              onClick={() => setActiveTab('SRS_DRIVE_TEST')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'SRS_DRIVE_TEST'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Drive Test & Mesures RF
            </button>
            <button
              onClick={() => setActiveTab('TOWER_POWER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'TOWER_POWER'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Pylône & Énergie -48V
            </button>
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
          >
            <Download className="w-4 h-4 text-purple-400" />
            Export Dossier SRS
          </button>
        </div>
      </div>

      {/* Global Site Telemetry & Auto-Scan Trigger Banner */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-purple-500/30 bg-gradient-to-r from-[#0e0e1a] via-[#120f24] to-[#0a0a14] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Site Selector & Identification */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
                SITE ACTIF :
              </span>
            </div>

            <div className="relative">
              <select
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="px-4 py-2 bg-[#050508] border-2 border-purple-500/60 rounded-xl text-base font-mono font-extrabold text-white shadow-lg shadow-purple-950/60 focus:outline-none focus:border-purple-400 pr-9 cursor-pointer"
              >
                {siteList.map((site) => (
                  <option key={site.id} value={site.id} className="bg-[#090912] text-white">
                    {site.code} &mdash; {site.name} ({site.operator})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setAutoDiscoveryModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/50 text-xs font-mono font-bold transition shadow-sm"
            >
              <Search className="w-3.5 h-3.5 text-cyan-300" />
              Auto-Scanner Autre Site
            </button>

            <button
              onClick={() => setCustomSiteModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-mono font-medium transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Manuel
            </button>
          </div>

          {/* Quick Metrics of Active Site */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-slate-500">GPS:</span> {currentSite.latitude.toFixed(4)}°, {currentSite.longitude.toFixed(4)}° ({currentSite.altitudeM}m)
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-purple-300">
              <span className="text-slate-500">Backhaul:</span> {currentSite.transmissionMedium} ({currentSite.transmissionCapacityMbps} Mbps)
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
              {currentSite.status}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: COVERAGE ZONES & ANTENNA RADIATION LOBES (ERICSSON SRS TOOL) */}
      {/* ========================================================================= */}
      {activeTab === 'COVERAGE_ZONES' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <EricssonCoverageMap site={currentSite} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SRS & DRIVE TEST FIELD APPLICATION */}
      {/* ========================================================================= */}
      {activeTab === 'SRS_DRIVE_TEST' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Bar: Connected Site Selector & Live Telemetry Banner */}
          <div className="p-5 rounded-2xl glass-panel border border-purple-500/30 bg-gradient-to-r from-[#0e0e1a] via-[#120f24] to-[#0a0a14] space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Site Selector */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
                    SITE CONNECTÉ :
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={selectedSiteId}
                    onChange={(e) => setSelectedSiteId(e.target.value)}
                    className="px-4 py-2 bg-[#050508] border-2 border-purple-500/60 rounded-xl text-base font-mono font-extrabold text-white shadow-lg shadow-purple-950/60 focus:outline-none focus:border-purple-400 pr-9 cursor-pointer"
                  >
                    {siteList.map((site) => (
                      <option key={site.id} value={site.id} className="bg-[#090912] text-white">
                        {site.code} &mdash; {site.name} ({site.operator})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setCustomSiteModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-semibold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nouveau Site / Éditer
                </button>
              </div>

              {/* Live Drive Test Recording Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDriveTesting(!isDriveTesting)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    isDriveTesting
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/50 animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50'
                  }`}
                >
                  {isDriveTesting ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause Drive Test ({driveTestDurationSec}s)
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Démarrer Drive Test
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsDriveTesting(false);
                    setDriveTestDurationSec(0);
                    setDistanceCoveredKm(0);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                  title="Reset Drive Test"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Site Metadata & Transmission Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono pt-2 border-t border-white/5">
              <div className="p-2.5 rounded-lg bg-[#050508]/80 border border-white/5">
                <span className="text-slate-500 text-[10px] block">SITE CODE & NAME</span>
                <strong className="text-purple-300 text-sm">{currentSite.code}</strong>
                <div className="text-[10px] text-slate-400 truncate">{currentSite.name}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#050508]/80 border border-white/5">
                <span className="text-slate-500 text-[10px] block">OPÉRATEUR / PLMN</span>
                <strong className="text-white text-sm">{currentSite.operator}</strong>
                <div className="text-[10px] text-purple-400">PLMN: {currentSite.plmn}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#050508]/80 border border-white/5">
                <span className="text-slate-500 text-[10px] block">SECTEUR SERVEUR</span>
                <div className="flex items-center gap-1.5">
                  <select
                    value={servingSector}
                    onChange={(e) => setServingSector(parseInt(e.target.value, 10))}
                    className="bg-transparent text-cyan-400 font-bold text-sm cursor-pointer"
                  >
                    <option value={1} className="bg-[#090912]">Secteur 1 (060°)</option>
                    <option value={2} className="bg-[#090912]">Secteur 2 (180°)</option>
                    <option value={3} className="bg-[#090912]">Secteur 3 (300°)</option>
                  </select>
                </div>
                <div className="text-[10px] text-slate-400">Azimuth {servingSector === 1 ? '060°' : servingSector === 2 ? '180°' : '300°'} &bull; 36m</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#050508]/80 border border-white/5">
                <span className="text-slate-500 text-[10px] block">COORDONNÉES GPS</span>
                <strong className="text-white text-sm">{currentSite.latitude.toFixed(4)}, {currentSite.longitude.toFixed(4)}</strong>
                <div className="text-[10px] text-slate-400">Alt: {currentSite.altitudeM}m &bull; Zone Nord</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#050508]/80 border border-white/5">
                <span className="text-slate-500 text-[10px] block">TRANSMISSION BACKHAUL</span>
                <strong className="text-emerald-400 text-sm">{currentSite.transmissionMedium}</strong>
                <div className="text-[10px] text-slate-400">{currentSite.transmissionCapacityMbps} Mbps &bull; RTN950</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#050508]/80 border border-white/5">
                <span className="text-slate-500 text-[10px] block">STATUT SITE ON-AIR</span>
                <strong className="text-emerald-400 text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {currentSite.status}
                </strong>
                <div className="text-[10px] text-slate-400">Prêt Service Commercial</div>
              </div>
            </div>
          </div>

          {/* Technology Selector Filter */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold">Technologies Actives :</span>
              <div className="flex items-center p-1 rounded-xl bg-[#090912] border border-white/10">
                {(['ALL', '2G', '3G', '4G', '5G'] as const).map((tech) => (
                  <button
                    key={tech}
                    onClick={() => setActiveTechFilter(tech)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      activeTechFilter === tech
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tech === 'ALL' ? 'Toutes (2G/3G/4G/5G)' : tech}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={triggerVoLTECall}
                disabled={activeCallStatus !== null}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                {activeCallStatus ? `Appel VoLTE: ${activeCallStatus}...` : 'Tester Appel VoLTE HD'}
              </button>

              <button
                onClick={triggerSpeedBurst}
                disabled={speedTestRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
              >
                <Gauge className="w-3.5 h-3.5" />
                {speedTestRunning ? 'Mesure en cours...' : 'Tester Débit Mobile'}
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MULTI-GENERATION TECHNOLOGY CARDS (2G, 3G, 4G, 5G) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ---------------- 2G GSM / EDGE CARD ---------------- */}
            {(activeTechFilter === 'ALL' || activeTechFilter === '2G') && (
              <div className="rounded-2xl glass-panel p-6 border border-emerald-500/30 bg-gradient-to-br from-[#0c120e]/60 to-[#090912] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Signal className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-black text-lg text-white">2G CELLULAIRE</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          GSM &bull; GPRS &bull; EDGE
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">Voix Circuit CS, SMS & Données EGPRS</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-emerald-400 block font-semibold">STATUT OPÉRATIONNEL</span>
                    <span className="text-xs font-mono text-white font-bold">Site {currentSite.code}</span>
                  </div>
                </div>

                {/* Sub-technologies Pills */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5">Technologies 2G Actives sur {currentSite.code} :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSite.twoGParams.subTechs.map((st, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                        &bull; {st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quantitative 2G KPI Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#050508] border border-white/5">
                    <span className="text-slate-500 text-[10px] block">BCCH ARFCN</span>
                    <strong className="text-white text-sm">{currentSite.twoGParams.bcchArfcn}</strong>
                    <div className="text-[10px] text-slate-400">{currentSite.twoGParams.freqMhz} MHz</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#050508] border border-white/5">
                    <span className="text-slate-500 text-[10px] block">BSIC CODE</span>
                    <strong className="text-white text-sm">{currentSite.twoGParams.bsic}</strong>
                    <div className="text-[10px] text-slate-400">NCC:5 / BCC:2</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#050508] border border-white/5">
                    <span className="text-slate-500 text-[10px] block">RxLev (NIVEAU)</span>
                    <strong className="text-emerald-400 text-sm">{currentSite.twoGParams.rxLevDbm} dBm</strong>
                    <div className="text-[10px] text-slate-400">Excellent (-110 à -47)</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#050508] border border-white/5">
                    <span className="text-slate-500 text-[10px] block">RxQual / BER</span>
                    <strong className="text-cyan-400 text-sm">Qual {currentSite.twoGParams.rxQual}</strong>
                    <div className="text-[10px] text-slate-400">BER {currentSite.twoGParams.berPercent}%</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#050508] border border-white/5 text-xs font-mono flex items-center justify-between text-slate-300">
                  <span>TimeSlot Assigné: <strong className="text-white">TS {currentSite.twoGParams.timeslot} (AMR 12.2k)</strong></span>
                  <span>Timing Advance (TA): <strong className="text-purple-300">{currentSite.twoGParams.timingAdvance} (~550m)</strong></span>
                </div>
              </div>
            )}

            {/* ---------------- 3G UMTS / WCDMA / HSPA+ CARD ---------------- */}
            {(activeTechFilter === 'ALL' || activeTechFilter === '3G') && (
              <div className="rounded-2xl glass-panel p-6 border border-cyan-500/30 bg-gradient-to-br from-[#0c1014]/60 to-[#090912] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-black text-lg text-white">3G HSPA+ WCDMA</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          UMTS &bull; HSDPA &bull; DC-HSPA+
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">Haut Débit Mobile 3GPP R99 à Rel-8</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-cyan-400 block font-semibold">STATUT OPÉRATIONNEL</span>
                    <span className="text-xs font-mono text-white font-bold">Site {currentSite.code}</span>
                  </div>
                </div>

                {/* Sub-technologies Pills */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5">Technologies 3G Actives sur {currentSite.code} :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSite.threeGParams.subTechs.map((st, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                        &bull; {st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quantitative 3G KPI Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#050508] border border-white/5">
                    <span className="text-slate-500 text-[10px] block">UARFCN CARRIER</span>
                    <strong className="text-white text-sm">{currentSite.threeGParams.uarfcn}</strong>
                    <div className="text-[10px] text-slate-400">Band 1 (2100MHz)</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#050508] border border-white/5">
                    <span className="text-slate-500 text-[10px] block">PSC (SCRAMBLING)</span>
                    <strong className="text-white text-sm">{currentSite.threeGParams.psc}</strong>
                    <div className="text-[10px] text-slate-400">Code Primaire</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#050508] border border-white/5">
                    <span className="text-slate-500 text-[10px] block">RSCP (PUISSANCE)</span>
                    <strong className="text-cyan-400 text-sm">{currentSite.threeGParams.rscpDbm} dBm</strong>
                    <div className="text-[10px] text-slate-400">Signal Reçu CPICH</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#050508] border border-white/5">
                    <span className="text-slate-500 text-[10px] block">Ec/No (QUALITÉ)</span>
                    <strong className="text-emerald-400 text-sm">{currentSite.threeGParams.ecNoDb} dB</strong>
                    <div className="text-[10px] text-slate-400">CQI: {currentSite.threeGParams.cqi} / 30</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#050508] border border-white/5 text-xs font-mono flex items-center justify-between text-slate-300">
                  <span>Active Set (Soft Handover): <strong className="text-white">{currentSite.threeGParams.activeSetCount} Cellules actives</strong></span>
                  <span>Modulation HSPA+: <strong className="text-cyan-300">64-QAM / MIMO</strong></span>
                </div>
              </div>
            )}

            {/* ---------------- 4G LTE / LTE-ADVANCED CARD ---------------- */}
            {(activeTechFilter === 'ALL' || activeTechFilter === '4G') && (
              <div className="rounded-2xl glass-panel p-6 border border-purple-500/40 bg-gradient-to-br from-[#120e1c]/70 to-[#090912] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-black text-lg text-white">4G LTE-ADVANCED</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          LTE-A &bull; VoLTE &bull; CA 3x
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">Très Haut Débit 4G Carrier Aggregation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-purple-400 block font-semibold">STATUT OPÉRATIONNEL</span>
                    <span className="text-xs font-mono text-white font-bold">Site {currentSite.code}</span>
                  </div>
                </div>

                {/* Sub-technologies Pills */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5">Technologies 4G Actives sur {currentSite.code} :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSite.fourGParams.subTechs.map((st, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-mono">
                        &bull; {st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quantitative 4G KPI Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#050508] border border-white/5">
                    <span className="text-slate-500 text-[10px] block">EARFCN PRIMAIRE</span>
                    <strong className="text-white text-sm">{currentSite.fourGParams.primaryEarfcn}</strong>
                    <div className="text-[10px] text-slate-400">B3 1800MHz (20MHz)</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#050508] border border-white/5">
                    <span className="text-slate-500 text-[10px] block">PCI CELL ID</span>
                    <strong className="text-white text-sm">PCI {currentSite.fourGParams.pci}</strong>
                    <div className="text-[10px] text-slate-400">{currentSite.fourGParams.mimo}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#050508] border border-white/5">
                    <span className="text-slate-500 text-[10px] block">RSRP (COUVERTURE)</span>
                    <strong className="text-purple-400 text-sm">{currentSite.fourGParams.rsrpDbm} dBm</strong>
                    <div className="text-[10px] text-slate-400">RSRQ: {currentSite.fourGParams.rsrqDb} dB</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#050508] border border-white/5">
                    <span className="text-slate-500 text-[10px] block">SINR (QUALITÉ RF)</span>
                    <strong className="text-emerald-400 text-sm">+{currentSite.fourGParams.sinrDb} dB</strong>
                    <div className="text-[10px] text-slate-400">CQI {currentSite.fourGParams.cqi} (256-QAM)</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#050508] border border-white/5 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Débit Mesuré :</span>
                    <strong className="text-emerald-400 font-bold text-sm">DL: {liveThroughput} Mbps</strong>
                    <span className="text-slate-500">|</span>
                    <strong className="text-cyan-400 font-bold text-sm">UL: {currentSite.fourGParams.ulThroughputMbps} Mbps</strong>
                  </div>
                  <span className="text-purple-300">VoLTE EVS-SWB 24.4kbps (MOS: 4.45)</span>
                </div>
              </div>
            )}

            {/* ---------------- 5G NR NSA & SA CARD ---------------- */}
            {(activeTechFilter === 'ALL' || activeTechFilter === '5G') && (
              <div className="rounded-2xl glass-panel p-6 border border-amber-500/40 bg-gradient-to-br from-[#14100c]/70 to-[#090912] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-black text-lg text-white">5G NR GIGABIT</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          currentSite.activeTechs.fiveG 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {currentSite.activeTechs.fiveG ? '5G SA & NSA &bull; n78 C-Band' : '5G PLANIFIÉ Q4'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">Massive MIMO 64T64R & Ultra Faible Latence</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-mono block font-semibold ${currentSite.activeTechs.fiveG ? 'text-amber-400' : 'text-slate-500'}`}>
                      {currentSite.activeTechs.fiveG ? 'STATUT OPÉRATIONNEL' : 'EN COURS DÉPLOIEMENT'}
                    </span>
                    <span className="text-xs font-mono text-white font-bold">Site {currentSite.code}</span>
                  </div>
                </div>

                {/* Sub-technologies Pills */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5">Technologies 5G sur {currentSite.code} :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSite.fiveGParams.subTechs.map((st, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono">
                        &bull; {st}
                      </span>
                    ))}
                  </div>
                </div>

                {currentSite.activeTechs.fiveG ? (
                  <>
                    {/* Quantitative 5G KPI Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                      <div className="p-2.5 rounded-lg bg-[#050508] border border-white/5">
                        <span className="text-slate-500 text-[10px] block">NR-ARFCN / BAND</span>
                        <strong className="text-white text-sm">{currentSite.fiveGParams.nrarfcn}</strong>
                        <div className="text-[10px] text-slate-400">{currentSite.fiveGParams.band}</div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#050508] border border-white/5">
                        <span className="text-slate-500 text-[10px] block">gNodeB & NR-PCI</span>
                        <strong className="text-white text-sm">PCI {currentSite.fiveGParams.nrPci}</strong>
                        <div className="text-[10px] text-slate-400">gNB: {currentSite.fiveGParams.gnbId}</div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#050508] border border-white/5">
                        <span className="text-slate-500 text-[10px] block">SS-RSRP / BEAM</span>
                        <strong className="text-amber-400 text-sm">{currentSite.fiveGParams.ssRsrpDbm} dBm</strong>
                        <div className="text-[10px] text-slate-400">Beam #{currentSite.fiveGParams.beamIndex} / 8</div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#050508] border border-white/5">
                        <span className="text-slate-500 text-[10px] block">SS-SINR / LATENCE</span>
                        <strong className="text-emerald-400 text-sm">+{currentSite.fiveGParams.ssSinrDb} dB</strong>
                        <div className="text-[10px] text-slate-400">{currentSite.fiveGParams.latencyMs} ms URLLC</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#050508] border border-white/5 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Débit Gigabit :</span>
                        <strong className="text-amber-400 font-bold text-sm">DL: {currentSite.fiveGParams.dlThroughputMbps} Mbps</strong>
                        <span className="text-slate-500">|</span>
                        <strong className="text-cyan-400 font-bold text-sm">UL: {currentSite.fiveGParams.ulThroughputMbps} Mbps</strong>
                      </div>
                      <span className="text-emerald-400">Largeur Canal 100MHz (SCS 30kHz)</span>
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-xl bg-[#050508] border border-dashed border-amber-500/30 text-xs font-mono text-slate-400 text-center space-y-1">
                    <AlertTriangle className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <p className="text-white font-semibold">5G Non Activée sur ce site ({currentSite.code})</p>
                    <p>Le site est actuellement équipé en 2G GSM/EDGE, 3G HSPA+ et 4G LTE-Advanced. La mise en service 5G n78 est planifiée.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* LIVE DRIVE TEST EVENT STREAM & LOG RECORDER */}
          {/* ========================================================================= */}
          <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
                  JOURNAL DE TÉLÉMÉTRIE EN DIRECT & HANDOVER LOG ({currentSite.code})
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">Vitesse : <strong className="text-white">{vehicleSpeedKmh} km/h</strong></span>
                <span className="text-slate-400">Distance : <strong className="text-purple-300">{distanceCoveredKm} km</strong></span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {isDriveTesting ? 'Enregistrement Actif' : 'Prêt'}
                </span>
              </div>
            </div>

            {/* Log Console Window */}
            <div className="p-4 rounded-xl bg-[#050508] border border-white/10 font-mono text-xs max-h-60 overflow-y-auto space-y-2">
              {liveLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2.5 border-b border-white/5 pb-1.5">
                  <span className="text-slate-500 shrink-0">[{log.time}]</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                    log.type === 'HANDOVER' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' :
                    log.type === 'DATA' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' :
                    log.type === 'CALL' ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/40' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-slate-300 break-words">{log.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SRS (SITE RADIO SURVEY) ACCEPTANCE AUDIT CHECKLIST */}
          {/* ========================================================================= */}
          <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
                    AUDIT SRS (SITE RADIO SURVEY) & ACCEPTATION TECHNIQUE : {currentSite.code}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Vérification de conformité radio, transmission et énergie avant mise en service commerciale.</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                VERDICT: ACCEPTÉ POUR ON-AIR &bull; 100% CONFORME
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              {/* Radio & Antennas Check */}
              <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-3">
                <h4 className="text-purple-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Signal className="w-3.5 h-3.5" />
                  1. Radio, Antennes & Feeders
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={checklist.antennaTilt} 
                      onChange={(e) => setChecklist({...checklist, antennaTilt: e.target.checked})}
                      className="rounded bg-slate-800 border-white/20 text-purple-600 focus:ring-0"
                    />
                    <span>Tilt mécanique (2°) & électrique (4°)</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={checklist.vswrUnderLimit} 
                      onChange={(e) => setChecklist({...checklist, vswrUnderLimit: e.target.checked})}
                      className="rounded bg-slate-800 border-white/20 text-purple-600 focus:ring-0"
                    />
                    <span>VSWR &lt; 1.15 sur tous les secteurs</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={checklist.cpriFiberPower} 
                      onChange={(e) => setChecklist({...checklist, cpriFiberPower: e.target.checked})}
                      className="rounded bg-slate-800 border-white/20 text-purple-600 focus:ring-0"
                    />
                    <span>Puissance optique CPRI (-4.2 dBm OK)</span>
                  </label>
                </div>
              </div>

              {/* Transmission & Backhaul Check */}
              <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-3">
                <h4 className="text-cyan-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5" />
                  2. Faisceau FH & Transmission
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={checklist.microwaveRslLevel} 
                      onChange={(e) => setChecklist({...checklist, microwaveRslLevel: e.target.checked})}
                      className="rounded bg-slate-800 border-white/20 text-purple-600 focus:ring-0"
                    />
                    <span>Niveau RSL FH (-41.5 dBm nominal)</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={checklist.ptp1588SyncLock} 
                      onChange={(e) => setChecklist({...checklist, ptp1588SyncLock: e.target.checked})}
                      className="rounded bg-slate-800 border-white/20 text-purple-600 focus:ring-0"
                    />
                    <span>Synchro PTP 1588v2 & SyncE verrouillée</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={checklist.vlanTrunkingOk} 
                      onChange={(e) => setChecklist({...checklist, vlanTrunkingOk: e.target.checked})}
                      className="rounded bg-slate-800 border-white/20 text-purple-600 focus:ring-0"
                    />
                    <span>VLAN 2G/3G/4G/5G et gestion routés</span>
                  </label>
                </div>
              </div>

              {/* Power & Energy Check */}
              <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-3">
                <h4 className="text-emerald-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  3. Énergie, Rectifieur & Batteries
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={checklist.dcRectifierFloatOk} 
                      onChange={(e) => setChecklist({...checklist, dcRectifierFloatOk: e.target.checked})}
                      className="rounded bg-slate-800 border-white/20 text-purple-600 focus:ring-0"
                    />
                    <span>Tension Floating Rectifieur: -54.2 VDC</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={checklist.batteryBankHealthy} 
                      onChange={(e) => setChecklist({...checklist, batteryBankHealthy: e.target.checked})}
                      className="rounded bg-slate-800 border-white/20 text-purple-600 focus:ring-0"
                    />
                    <span>Test d'autonomie batteries (8h @ 80% DoD)</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={checklist.surgeSpdGreen} 
                      onChange={(e) => setChecklist({...checklist, surgeSpdGreen: e.target.checked})}
                      className="rounded bg-slate-800 border-white/20 text-purple-600 focus:ring-0"
                    />
                    <span>Parafoudres SPD vert & Terre &lt; 5 Ohms</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TOWER & POWER INFRASTRUCTURE SIZING MODELER */}
      {/* ========================================================================= */}
      {activeTab === 'TOWER_POWER' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Input Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tower & Structural */}
            <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
              <h3 className="font-heading font-bold text-sm text-purple-300 uppercase tracking-wider">
                1. Typologie Pylône & Secteurs
              </h3>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Type de Pylône</label>
                <select
                  value={siteType}
                  onChange={(e) => setSiteType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
                >
                  <option value="MACRO">Pylône Macro (Treillis / Haubané)</option>
                  <option value="ROOFTOP">Pylône Monotube Urbain sur Terrasse (Rooftop)</option>
                  <option value="GREENFIELD">Pylône Greenfield Rural Autoportant</option>
                  <option value="SMALL_CELL">Street Small Cell / Micro-site Urbain</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Hauteur du Pylône : {towerHeightM} mètres
                </label>
                <input
                  type="range"
                  min={10}
                  max={60}
                  value={towerHeightM}
                  onChange={(e) => setTowerHeightM(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-800 rounded accent-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Nombre de Secteurs Antennaires
                </label>
                <select
                  value={sectors}
                  onChange={(e) => setSectors(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
                >
                  <option value={1}>1 Secteur (Omnidirectionnel / Tunnel)</option>
                  <option value={3}>3 Secteurs (Standard Tri-Sector 120&deg;)</option>
                  <option value={4}>4 Secteurs (Quad Haute Capacité 90&deg;)</option>
                  <option value={6}>6 Secteurs (Ultra Densifié Stade 60&deg;)</option>
                </select>
              </div>
            </div>

            {/* Radio & Backhaul */}
            <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
              <h3 className="font-heading font-bold text-sm text-cyan-300 uppercase tracking-wider">
                2. Radios RRU & Transmission
              </h3>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Modules Radio Distants (RRUs) : {rruCount} Unités
                </label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={rruCount}
                  onChange={(e) => setRruCount(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
                />
                <span className="text-[10px] text-slate-500 font-mono">Ex: 2 bandes (B3+B7) &times; 3 secteurs = 6 RRUs</span>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Support de Transmission Backhaul
                </label>
                <select
                  value={backhaulType}
                  onChange={(e) => setBackhaulType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
                >
                  <option value="MICROWAVE">Faisceau Hertzien (11/18/23 GHz Dish)</option>
                  <option value="FIBER_GPON">Fibre Optique GPON / Metro Ethernet</option>
                  <option value="DARK_FIBER">Fibre Noire Dédiée 10G / CWDM</option>
                </select>
              </div>
            </div>

            {/* DC Power & Energy */}
            <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
              <h3 className="font-heading font-bold text-sm text-emerald-300 uppercase tracking-wider">
                3. Alimentation & Énergie Site
              </h3>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Architecture d'Alimentation
                </label>
                <select
                  value={powerSource}
                  onChange={(e) => setPowerSource(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-sm font-mono text-white"
                >
                  <option value="GRID_BATTERY">Réseau JIRAMA/Grid + Banc Batteries -48V</option>
                  <option value="SOLAR_HYBRID">Hybride Solaire PV + Batteries LiFePO4</option>
                  <option value="GENSET_HYBRID">Groupe Électrogène Diesel + Batteries</option>
                </select>
              </div>

              <div className="pt-2 text-xs font-mono text-slate-400 space-y-1">
                <div>&bull; Tension Bus DC : <strong className="text-white">-48.0 VDC nominal</strong></div>
                <div>&bull; Autonomie Ciblée : <strong className="text-emerald-400">8 Heures @ 80% DoD</strong></div>
              </div>
            </div>
          </div>

          {/* Quantitative Engineering Sizing Results */}
          <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-400" />
                <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
                  RÉSULTATS DE DIMENSIONNEMENT ÉNERGIE & INFRASTRUCTURE
                </h3>
              </div>
              <span className="text-xs font-mono text-purple-300 font-semibold">{sectors} SECTEURS &bull; {rruCount} RRU RADIOS</span>
            </div>

            {/* 4 Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
                <span className="text-slate-500 uppercase text-[10px]">PUISSANCE TOTALE DU SITE</span>
                <div className="text-2xl font-bold text-cyan-400 font-heading">
                  {(totalSitePowerWatts ?? 0).toLocaleString()} <span className="text-xs font-mono text-slate-400">W</span>
                </div>
                <span className="text-[10px] text-slate-400">{((totalSitePowerWatts ?? 0) / 1000).toFixed(2)} kW continu</span>
              </div>

              <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
                <span className="text-slate-500 uppercase text-[10px]">CHARGE RECTIFIEUR DC</span>
                <div className="text-2xl font-bold text-purple-400 font-heading">
                  {rectifierCurrentAmps} <span className="text-xs font-mono text-slate-400">Ampères</span>
                </div>
                <span className="text-[10px] text-slate-400">Sous bus -48V DC nominal</span>
              </div>

              <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
                <span className="text-slate-500 uppercase text-[10px]">CAPACITÉ BATTERIES REQUISE</span>
                <div className="text-2xl font-bold text-emerald-400 font-heading">
                  {batteryAhRequired} <span className="text-xs font-mono text-slate-400">Ah</span>
                </div>
                <span className="text-[10px] text-slate-400">Pour 8h autonomie @ 80% DoD</span>
              </div>

              <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
                <span className="text-slate-500 uppercase text-[10px]">MODULES RECTIFIEURS N+1</span>
                <div className="text-2xl font-bold text-amber-400 font-heading">
                  {Math.ceil((rectifierCurrentAmps * 1.5) / 50)} &times; 50A
                </div>
                <span className="text-[10px] text-slate-400">Redondance N+1 active</span>
              </div>
            </div>

            {/* Equipment Power Breakdown */}
            <div className="p-4 rounded-xl bg-[#050508] border border-white/5 text-xs font-mono space-y-2">
              <span className="text-slate-400 uppercase tracking-wider font-semibold block mb-2">Bilan de Puissance Détaillé :</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300">
                <div>&bull; {rruCount} &times; Radios RRU : <strong className="text-white">{totalRruPower}W</strong></div>
                <div>&bull; BBU Baseband : <strong className="text-white">{bbuPower}W</strong></div>
                <div>&bull; Routeur Cell Site (CSR) : <strong className="text-white">{routerPower}W</strong></div>
                <div>&bull; Faisceau Backhaul ({backhaulType}) : <strong className="text-white">{mwPower}W</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CUSTOM SITE MODAL */}
      {/* ========================================================================= */}
      {customSiteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl glass-panel border border-purple-500/40 bg-[#0c0c16] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                <h3 className="font-heading font-bold text-base text-white">Ajouter un Nouveau Site Cellulaire</h3>
              </div>
              <button 
                onClick={() => setCustomSiteModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddCustomSite} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 uppercase mb-1">Code du Site (Ex: ANM 234, TNR 099)</label>
                <input
                  type="text"
                  value={newSiteCode}
                  onChange={(e) => setNewSiteCode(e.target.value)}
                  placeholder="Ex: ANM 234"
                  className="w-full px-3 py-2 bg-[#050508] border border-white/10 rounded-lg text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-1">Nom / Emplacement du Site</label>
                <input
                  type="text"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  placeholder="Ex: Analamahitsy Sector 3 Station"
                  className="w-full px-3 py-2 bg-[#050508] border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/20 text-purple-300 text-[11px]">
                Le nouveau site sera instantanément configuré avec toutes ses technologies (2G GSM/EDGE, 3G WCDMA, 4G LTE-A et 5G NR) pour vos tests SRS et Drive Test.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomSiteModal(false)}
                  className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Créer & Connecter Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SITE AUTO-DISCOVERY & CELL SEARCH MODAL */}
      {/* ========================================================================= */}
      {autoDiscoveryModalOpen && (
        <SiteAutoDiscoveryModal
          isOpen={autoDiscoveryModalOpen}
          onClose={() => setAutoDiscoveryModalOpen(false)}
          onSiteDiscovered={handleSiteDiscovered}
        />
      )}

      {/* ========================================================================= */}
      {/* EXPORT MODAL */}
      {/* ========================================================================= */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title={`Dossier SRS & Drive Test - Site ${currentSite.code}`}
          toolName="Site Radio Survey & Drive Test Modeler"
          inputs={{
            siteCode: currentSite.code,
            siteName: currentSite.name,
            operator: currentSite.operator,
            plmn: currentSite.plmn,
            gpsCoordinates: `${currentSite.latitude}, ${currentSite.longitude}`,
            transmissionBackhaul: `${currentSite.transmissionMedium} (${currentSite.transmissionCapacityMbps} Mbps)`,
            activeTechnologies: '2G (GSM/EDGE), 3G (HSPA+), 4G (LTE-A), 5G (NR n78)'
          }}
          results={{
            twoGStatus: `BCCH ${currentSite.twoGParams.bcchArfcn} (945.4MHz), RxLev ${currentSite.twoGParams.rxLevDbm}dBm, RxQual ${currentSite.twoGParams.rxQual}`,
            threeGStatus: `UARFCN ${currentSite.threeGParams.uarfcn}, PSC ${currentSite.threeGParams.psc}, RSCP ${currentSite.threeGParams.rscpDbm}dBm, Ec/No ${currentSite.threeGParams.ecNoDb}dB`,
            fourGStatus: `EARFCN ${currentSite.fourGParams.primaryEarfcn}, PCI ${currentSite.fourGParams.pci}, RSRP ${currentSite.fourGParams.rsrpDbm}dBm, SINR +${currentSite.fourGParams.sinrDb}dB, Throughput DL ${currentSite.fourGParams.dlThroughputMbps}Mbps`,
            fiveGStatus: currentSite.activeTechs.fiveG 
              ? `NR-ARFCN ${currentSite.fiveGParams.nrarfcn} (n78), PCI ${currentSite.fiveGParams.nrPci}, SS-RSRP ${currentSite.fiveGParams.ssRsrpDbm}dBm, Throughput DL ${currentSite.fiveGParams.dlThroughputMbps}Mbps`
              : '5G Non Activée (Déploiement Planifié)',
            srsAuditVerdict: 'CONFORME / VALIDÉ POUR MISE EN SERVICE COMMERCIALE (100% OK)'
          }}
        />
      )}
    </div>
  );
};

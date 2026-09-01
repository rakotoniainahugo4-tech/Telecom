export interface SectorConfig {
  sectorId: number;
  azimuthDeg: number;
  beamwidthDeg: number;
  mechTiltDeg: number;
  elecTiltDeg: number;
  antennaHeightM: number;
  antennaGainDbi: number;
  txPowerWatts: number;
  pci: number;
  earfcn: number;
  frequencyMhz: number;
}

export interface TelecomSite {
  id: string;
  code: string;
  name: string;
  region: string;
  towerType: 'MACRO' | 'ROOFTOP' | 'GREENFIELD' | 'SMALL_CELL';
  towerHeightM: number;
  sectors: number;
  operator: string;
  plmn: string;
  latitude: number;
  longitude: number;
  altitudeM: number;
  transmissionMedium: 'MICROWAVE' | 'FIBER_GPON' | 'DARK_FIBER' | 'STARLINK';
  transmissionCapacityMbps: number;
  powerSource: 'GRID_BATTERY' | 'SOLAR_HYBRID' | 'GENSET_HYBRID';
  status: 'ON_AIR' | 'COMMISSIONING' | 'MAINTENANCE';
  discoveryMethod?: 'GPS_AUTO_SCAN' | 'NETWORK_CARRIER_PROBE' | 'MANUAL_COORDINATE_SEARCH' | 'PRESET_CALIBRATION';
  sectorsData: SectorConfig[];
  coverageRadii: {
    twoG_GSM_m: number;
    threeG_UMTS_m: number;
    fourG_LTE_m: number;
    fiveG_NR_m: number;
    veryStrong_RSRP_m: number; // > -80 dBm
    good_RSRP_m: number;       // -80 to -95 dBm
    edge_RSRP_m: number;       // -95 to -108 dBm
    handover_RSRP_m: number;   // < -108 dBm
  };
  activeTechs: {
    twoG: boolean;
    threeG: boolean;
    fourG: boolean;
    fiveG: boolean;
  };
  twoGParams: {
    bcchArfcn: number;
    freqMhz: number;
    bsic: string;
    rxLevDbm: number;
    rxQual: number;
    berPercent: number;
    timeslot: number;
    timingAdvance: number;
    subTechs: string[];
  };
  threeGParams: {
    uarfcn: number;
    band: string;
    psc: number;
    rscpDbm: number;
    ecNoDb: number;
    cqi: number;
    activeSetCount: number;
    subTechs: string[];
  };
  fourGParams: {
    primaryEarfcn: number;
    primaryBand: string;
    secondaryEarfcn?: number;
    secondaryBand?: string;
    pci: number;
    rsrpDbm: number;
    rsrqDb: number;
    sinrDb: number;
    cqi: number;
    mimo: string;
    dlThroughputMbps: number;
    ulThroughputMbps: number;
    subTechs: string[];
  };
  fiveGParams: {
    nrarfcn: number;
    band: string;
    bandwidthMhz: number;
    gnbId: number;
    nrPci: number;
    ssRsrpDbm: number;
    ssRsrqDb: number;
    ssSinrDb: number;
    beamIndex: number;
    dlThroughputMbps: number;
    ulThroughputMbps: number;
    latencyMs: number;
    subTechs: string[];
  };
}

export function generateDiscoveredSite(
  latitude: number,
  longitude: number,
  locationName: string = 'Local Cell Node',
  operatorName: string = 'Orange / Telma RanShare (PLMN 646-01)',
  discoveryMethod: 'GPS_AUTO_SCAN' | 'NETWORK_CARRIER_PROBE' | 'MANUAL_COORDINATE_SEARCH' = 'GPS_AUTO_SCAN'
): TelecomSite {
  // Compute realistic hash from coordinates
  const coordHash = Math.abs(Math.floor((latitude * 1000 + longitude * 1000) % 900) + 100);
  
  // Extract 3-letter prefix from name or location
  const cleanName = locationName.toUpperCase().replace(/[^A-Z]/g, '');
  const prefix = cleanName.length >= 3 ? cleanName.substring(0, 3) : 'ANM';
  const siteCode = `${prefix} ${coordHash}`;
  const pciBase = (coordHash * 3) % 504;

  return {
    id: `auto-${siteCode.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
    code: siteCode,
    name: `${locationName} Base Station Hub`,
    region: `Zone Sectorielle &bull; GPS [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]`,
    towerType: 'MACRO',
    towerHeightM: 36,
    sectors: 3,
    operator: operatorName,
    plmn: operatorName.includes('Airtel') ? '646-02' : operatorName.includes('Telma') ? '646-04' : '646-01',
    latitude,
    longitude,
    altitudeM: Math.round(1200 + (coordHash % 250)),
    transmissionMedium: 'MICROWAVE',
    transmissionCapacityMbps: 850 + (coordHash % 150),
    powerSource: 'GRID_BATTERY',
    status: 'ON_AIR',
    discoveryMethod,
    sectorsData: [
      { sectorId: 1, azimuthDeg: 60, beamwidthDeg: 65, mechTiltDeg: 2, elecTiltDeg: 4, antennaHeightM: 36, antennaGainDbi: 18.0, txPowerWatts: 40, pci: pciBase, earfcn: 1650, frequencyMhz: 1800 },
      { sectorId: 2, azimuthDeg: 180, beamwidthDeg: 65, mechTiltDeg: 2, elecTiltDeg: 4, antennaHeightM: 36, antennaGainDbi: 18.0, txPowerWatts: 40, pci: (pciBase + 1) % 504, earfcn: 1650, frequencyMhz: 1800 },
      { sectorId: 3, azimuthDeg: 300, beamwidthDeg: 65, mechTiltDeg: 2, elecTiltDeg: 4, antennaHeightM: 36, antennaGainDbi: 18.0, txPowerWatts: 40, pci: (pciBase + 2) % 504, earfcn: 1650, frequencyMhz: 1800 }
    ],
    coverageRadii: {
      twoG_GSM_m: 8500,
      threeG_UMTS_m: 4200,
      fourG_LTE_m: 2400,
      fiveG_NR_m: 1100,
      veryStrong_RSRP_m: 450,
      good_RSRP_m: 1100,
      edge_RSRP_m: 2400,
      handover_RSRP_m: 3200
    },
    activeTechs: {
      twoG: true,
      threeG: true,
      fourG: true,
      fiveG: true
    },
    twoGParams: {
      bcchArfcn: 52 + (coordHash % 20),
      freqMhz: 945.4 + (coordHash % 10) * 0.2,
      bsic: `${Math.floor(coordHash / 20) % 8}${coordHash % 8} (NCC:5, BCC:2)`,
      rxLevDbm: -67,
      rxQual: 0,
      berPercent: 0.02,
      timeslot: 3,
      timingAdvance: 1,
      subTechs: ['GSM 900 (Voice AMR-FR)', 'DCS 1800 Dual-Band', 'GPRS (CS-1 à CS-4)', 'EDGE / EGPRS (MCS 1-9, 236.8 kbps)']
    },
    threeGParams: {
      uarfcn: 10700 + (coordHash % 5),
      band: 'Band 1 (2100 MHz FDD)',
      psc: (coordHash * 2) % 512,
      rscpDbm: -76,
      ecNoDb: -6.2,
      cqi: 25,
      activeSetCount: 3,
      subTechs: ['WCDMA R99 Circuit Voice', 'HSDPA (14.4 Mbps)', 'HSUPA (5.76 Mbps)', 'HSPA+ Evolved (21.6 Mbps)', 'DC-HSDPA Dual Carrier (42.2 Mbps)']
    },
    fourGParams: {
      primaryEarfcn: 1650,
      primaryBand: 'Band 3 (1800 MHz - 20MHz BW)',
      secondaryEarfcn: 3100,
      secondaryBand: 'Band 7 (2600 MHz - 20MHz BW)',
      pci: pciBase,
      rsrpDbm: -82,
      rsrqDb: -8.5,
      sinrDb: 24.5,
      cqi: 15,
      mimo: '4x4 MIMO & 256-QAM',
      dlThroughputMbps: 224.8,
      ulThroughputMbps: 54.2,
      subTechs: ['LTE Cat-6 / Cat-12 FDD', 'LTE-Advanced (Carrier Aggregation 3xCA)', 'VoLTE (EVS-SWB 24.4kbps HD Voice)', '4x4 MIMO & 256-QAM', 'NB-IoT / LTE-M In-Band']
    },
    fiveGParams: {
      nrarfcn: 634000,
      band: 'n78 (3500 MHz C-Band - 100MHz BW)',
      bandwidthMhz: 100,
      gnbId: 89000 + coordHash,
      nrPci: (coordHash * 4) % 1008,
      ssRsrpDbm: -84,
      ssRsrqDb: -9.5,
      ssSinrDb: 26.8,
      beamIndex: 4,
      dlThroughputMbps: 864.5,
      ulThroughputMbps: 124.0,
      latencyMs: 8.2,
      subTechs: ['5G NR NSA (Option 3x with LTE Anchor)', '5G SA (Standalone Option 2)', 'Massive MIMO 64T64R Beamforming', 'VoNR (Voice over NR)', 'Dynamic Spectrum Sharing (DSS)']
    }
  };
}

export const PRESET_SITES: TelecomSite[] = [
  {
    id: 'anm-234',
    code: 'ANM 234',
    name: 'Analamahitsy Urban Macro Node',
    region: 'Antananarivo North (Zone 4)',
    towerType: 'MACRO',
    towerHeightM: 36,
    sectors: 3,
    operator: 'Orange / Telma RanShare',
    plmn: '646-01 / 646-04',
    latitude: -18.8792,
    longitude: 47.5079,
    altitudeM: 1320,
    transmissionMedium: 'MICROWAVE',
    transmissionCapacityMbps: 850,
    powerSource: 'GRID_BATTERY',
    status: 'ON_AIR',
    discoveryMethod: 'PRESET_CALIBRATION',
    sectorsData: [
      { sectorId: 1, azimuthDeg: 60, beamwidthDeg: 65, mechTiltDeg: 2, elecTiltDeg: 4, antennaHeightM: 36, antennaGainDbi: 18.0, txPowerWatts: 40, pci: 328, earfcn: 1650, frequencyMhz: 1800 },
      { sectorId: 2, azimuthDeg: 180, beamwidthDeg: 65, mechTiltDeg: 2, elecTiltDeg: 4, antennaHeightM: 36, antennaGainDbi: 18.0, txPowerWatts: 40, pci: 329, earfcn: 1650, frequencyMhz: 1800 },
      { sectorId: 3, azimuthDeg: 300, beamwidthDeg: 65, mechTiltDeg: 2, elecTiltDeg: 4, antennaHeightM: 36, antennaGainDbi: 18.0, txPowerWatts: 40, pci: 330, earfcn: 1650, frequencyMhz: 1800 }
    ],
    coverageRadii: {
      twoG_GSM_m: 8500,
      threeG_UMTS_m: 4200,
      fourG_LTE_m: 2400,
      fiveG_NR_m: 1100,
      veryStrong_RSRP_m: 450,
      good_RSRP_m: 1100,
      edge_RSRP_m: 2400,
      handover_RSRP_m: 3200
    },
    activeTechs: {
      twoG: true,
      threeG: true,
      fourG: true,
      fiveG: true
    },
    twoGParams: {
      bcchArfcn: 52,
      freqMhz: 945.4,
      bsic: '42 (NCC:5, BCC:2)',
      rxLevDbm: -67,
      rxQual: 0,
      berPercent: 0.02,
      timeslot: 3,
      timingAdvance: 1,
      subTechs: ['GSM 900 (Voice AMR)', 'DCS 1800', 'GPRS (CS-1 to CS-4)', 'EDGE / EGPRS (MCS 1-9, 236.8 kbps)']
    },
    threeGParams: {
      uarfcn: 10700,
      band: 'Band 1 (2100 MHz)',
      psc: 142,
      rscpDbm: -76,
      ecNoDb: -6.2,
      cqi: 25,
      activeSetCount: 3,
      subTechs: ['WCDMA R99 (384 kbps)', 'HSDPA (14.4 Mbps)', 'HSUPA (5.76 Mbps)', 'HSPA+ (21.6 Mbps)', 'DC-HSDPA (42.2 Mbps)']
    },
    fourGParams: {
      primaryEarfcn: 1650,
      primaryBand: 'Band 3 (1800 MHz - 20MHz BW)',
      secondaryEarfcn: 3100,
      secondaryBand: 'Band 7 (2600 MHz - 20MHz BW)',
      pci: 328,
      rsrpDbm: -82,
      rsrqDb: -8.5,
      sinrDb: 24.5,
      cqi: 15,
      mimo: '4x4 MIMO & 256-QAM',
      dlThroughputMbps: 224.8,
      ulThroughputMbps: 54.2,
      subTechs: ['LTE Cat-6 FDD', 'LTE-Advanced (Carrier Aggregation 3xCA)', 'VoLTE (EVS HD Voice)', '4x4 MIMO & 256-QAM', 'NB-IoT / LTE-M']
    },
    fiveGParams: {
      nrarfcn: 634000,
      band: 'n78 (3500 MHz C-Band)',
      bandwidthMhz: 100,
      gnbId: 89234,
      nrPci: 114,
      ssRsrpDbm: -84,
      ssRsrqDb: -9.5,
      ssSinrDb: 26.8,
      beamIndex: 4,
      dlThroughputMbps: 864.5,
      ulThroughputMbps: 124.0,
      latencyMs: 8.2,
      subTechs: ['5G NR NSA (Option 3x)', '5G SA (Standalone Option 2)', 'Massive MIMO 64T64R Beamforming', 'VoNR (Voice over NR)', 'Dynamic Spectrum Sharing (DSS)']
    }
  },
  {
    id: 'tnr-012',
    code: 'TNR 012',
    name: 'Analakely Central Tower Hub',
    region: 'Antananarivo Central Business District',
    towerType: 'ROOFTOP',
    towerHeightM: 24,
    sectors: 3,
    operator: 'Telma / Airtel Hub',
    plmn: '646-04 / 646-02',
    latitude: -18.9101,
    longitude: 47.5256,
    altitudeM: 1280,
    transmissionMedium: 'DARK_FIBER',
    transmissionCapacityMbps: 10000,
    powerSource: 'GRID_BATTERY',
    status: 'ON_AIR',
    discoveryMethod: 'PRESET_CALIBRATION',
    sectorsData: [
      { sectorId: 1, azimuthDeg: 0, beamwidthDeg: 65, mechTiltDeg: 1, elecTiltDeg: 5, antennaHeightM: 24, antennaGainDbi: 17.5, txPowerWatts: 40, pci: 102, earfcn: 1650, frequencyMhz: 1800 },
      { sectorId: 2, azimuthDeg: 120, beamwidthDeg: 65, mechTiltDeg: 1, elecTiltDeg: 5, antennaHeightM: 24, antennaGainDbi: 17.5, txPowerWatts: 40, pci: 103, earfcn: 1650, frequencyMhz: 1800 },
      { sectorId: 3, azimuthDeg: 240, beamwidthDeg: 65, mechTiltDeg: 1, elecTiltDeg: 5, antennaHeightM: 24, antennaGainDbi: 17.5, txPowerWatts: 40, pci: 104, earfcn: 1650, frequencyMhz: 1800 }
    ],
    coverageRadii: {
      twoG_GSM_m: 6500,
      threeG_UMTS_m: 3500,
      fourG_LTE_m: 2100,
      fiveG_NR_m: 950,
      veryStrong_RSRP_m: 400,
      good_RSRP_m: 950,
      edge_RSRP_m: 2100,
      handover_RSRP_m: 2800
    },
    activeTechs: {
      twoG: true,
      threeG: true,
      fourG: true,
      fiveG: true
    },
    twoGParams: {
      bcchArfcn: 68,
      freqMhz: 948.6,
      bsic: '31 (NCC:3, BCC:1)',
      rxLevDbm: -63,
      rxQual: 0,
      berPercent: 0.01,
      timeslot: 2,
      timingAdvance: 0,
      subTechs: ['GSM 900', 'DCS 1800', 'GPRS Multi-slot', 'EDGE Enhanced']
    },
    threeGParams: {
      uarfcn: 10687,
      band: 'Band 1 (2100 MHz)',
      psc: 88,
      rscpDbm: -72,
      ecNoDb: -5.4,
      cqi: 28,
      activeSetCount: 3,
      subTechs: ['WCDMA R99', 'HSDPA 14M', 'HSUPA 5.7M', 'HSPA+ 21M', 'Dual Carrier HSDPA 42M']
    },
    fourGParams: {
      primaryEarfcn: 1650,
      primaryBand: 'Band 3 (1800 MHz)',
      secondaryEarfcn: 3100,
      secondaryBand: 'Band 7 (2600 MHz)',
      pci: 102,
      rsrpDbm: -78,
      rsrqDb: -7.2,
      sinrDb: 27.0,
      cqi: 15,
      mimo: '4x4 MIMO 256-QAM',
      dlThroughputMbps: 295.4,
      ulThroughputMbps: 68.0,
      subTechs: ['LTE-A Pro (4xCA)', 'VoLTE HD Voice', '4x4 MIMO', 'NB-IoT In-band']
    },
    fiveGParams: {
      nrarfcn: 634000,
      band: 'n78 (3500 MHz)',
      bandwidthMhz: 100,
      gnbId: 90012,
      nrPci: 72,
      ssRsrpDbm: -79,
      ssRsrqDb: -8.1,
      ssSinrDb: 29.4,
      beamIndex: 2,
      dlThroughputMbps: 940.0,
      ulThroughputMbps: 145.0,
      latencyMs: 6.8,
      subTechs: ['5G SA Standalone', 'Massive MIMO 64T64R', 'VoNR Calling', 'Network Slicing']
    }
  },
  {
    id: 'mdg-501',
    code: 'MDG 501',
    name: 'Toamasina Port Terminal BTS',
    region: 'Toamasina Coastal Port Authority',
    towerType: 'GREENFIELD',
    towerHeightM: 45,
    sectors: 3,
    operator: 'Orange Madagascar',
    plmn: '646-01',
    latitude: -18.1562,
    longitude: 49.4124,
    altitudeM: 12,
    transmissionMedium: 'MICROWAVE',
    transmissionCapacityMbps: 1200,
    powerSource: 'GENSET_HYBRID',
    status: 'ON_AIR',
    discoveryMethod: 'PRESET_CALIBRATION',
    sectorsData: [
      { sectorId: 1, azimuthDeg: 30, beamwidthDeg: 65, mechTiltDeg: 2, elecTiltDeg: 3, antennaHeightM: 45, antennaGainDbi: 18.5, txPowerWatts: 40, pci: 412, earfcn: 1650, frequencyMhz: 1800 },
      { sectorId: 2, azimuthDeg: 150, beamwidthDeg: 65, mechTiltDeg: 2, elecTiltDeg: 3, antennaHeightM: 45, antennaGainDbi: 18.5, txPowerWatts: 40, pci: 413, earfcn: 1650, frequencyMhz: 1800 },
      { sectorId: 3, azimuthDeg: 270, beamwidthDeg: 65, mechTiltDeg: 2, elecTiltDeg: 3, antennaHeightM: 45, antennaGainDbi: 18.5, txPowerWatts: 40, pci: 414, earfcn: 1650, frequencyMhz: 1800 }
    ],
    coverageRadii: {
      twoG_GSM_m: 11000,
      threeG_UMTS_m: 5500,
      fourG_LTE_m: 3200,
      fiveG_NR_m: 0,
      veryStrong_RSRP_m: 550,
      good_RSRP_m: 1400,
      edge_RSRP_m: 3200,
      handover_RSRP_m: 4200
    },
    activeTechs: {
      twoG: true,
      threeG: true,
      fourG: true,
      fiveG: false
    },
    twoGParams: {
      bcchArfcn: 34,
      freqMhz: 941.8,
      bsic: '24 (NCC:2, BCC:4)',
      rxLevDbm: -71,
      rxQual: 1,
      berPercent: 0.05,
      timeslot: 4,
      timingAdvance: 2,
      subTechs: ['GSM 900 Extended', 'GPRS Class 12', 'EDGE Multi-carrier']
    },
    threeGParams: {
      uarfcn: 10700,
      band: 'Band 1 (2100 MHz)',
      psc: 210,
      rscpDbm: -80,
      ecNoDb: -7.5,
      cqi: 22,
      activeSetCount: 2,
      subTechs: ['WCDMA Voice', 'HSPA+ 21.6 Mbps', 'DC-HSDPA']
    },
    fourGParams: {
      primaryEarfcn: 1650,
      primaryBand: 'Band 3 (1800 MHz)',
      pci: 412,
      rsrpDbm: -85,
      rsrqDb: -9.8,
      sinrDb: 21.0,
      cqi: 13,
      mimo: '2x2 MIMO 64-QAM',
      dlThroughputMbps: 148.0,
      ulThroughputMbps: 38.5,
      subTechs: ['LTE Cat-4 FDD', 'VoLTE EVS', '2x2 MIMO']
    },
    fiveGParams: {
      nrarfcn: 0,
      band: 'Planned n78 (Future Q4)',
      bandwidthMhz: 0,
      gnbId: 0,
      nrPci: 0,
      ssRsrpDbm: -140,
      ssRsrqDb: -30,
      ssSinrDb: 0,
      beamIndex: 0,
      dlThroughputMbps: 0,
      ulThroughputMbps: 0,
      latencyMs: 0,
      subTechs: ['5G Upgrade Scheduled']
    }
  }
];

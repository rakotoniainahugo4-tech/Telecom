export interface LteBandData {
  band: number;
  name: string;
  duplex: 'FDD' | 'TDD';
  earfcnDlMin: number;
  earfcnDlMax: number;
  fDlLowMhz: number;
  fUlLowMhz?: number;
  earfcnUlOffset?: number;
  commonDeployment: string;
}

export const LTE_BANDS: LteBandData[] = [
  { band: 1, name: '2100 MHz (IMT)', duplex: 'FDD', earfcnDlMin: 0, earfcnDlMax: 599, fDlLowMhz: 2110, fUlLowMhz: 1920, commonDeployment: 'Global 3G/4G Refarm' },
  { band: 3, name: '1800 MHz (DCS)', duplex: 'FDD', earfcnDlMin: 1200, earfcnDlMax: 1949, fDlLowMhz: 1805, fUlLowMhz: 1710, commonDeployment: 'Primary European/African 4G Band' },
  { band: 7, name: '2600 MHz (IMT-E)', duplex: 'FDD', earfcnDlMin: 2750, earfcnDlMax: 3449, fDlLowMhz: 2620, fUlLowMhz: 2500, commonDeployment: 'High Capacity Urban Microcells' },
  { band: 8, name: '900 MHz (Extended GSM)', duplex: 'FDD', earfcnDlMin: 3450, earfcnDlMax: 3799, fDlLowMhz: 925, fUlLowMhz: 880, commonDeployment: 'Rural & Deep Indoor Coverage' },
  { band: 20, name: '800 MHz (Digital Dividend)', duplex: 'FDD', earfcnDlMin: 6150, earfcnDlMax: 6449, fDlLowMhz: 791, fUlLowMhz: 832, commonDeployment: 'Broad Rural Coverage' },
  { band: 28, name: '700 MHz (APT)', duplex: 'FDD', earfcnDlMin: 9210, earfcnDlMax: 9659, fDlLowMhz: 758, fUlLowMhz: 703, commonDeployment: 'Long-Range Suburban / In-Building' },
  { band: 38, name: '2600 MHz (TDD)', duplex: 'TDD', earfcnDlMin: 37750, earfcnDlMax: 38249, fDlLowMhz: 2570, commonDeployment: 'TDD High Capacity' },
  { band: 40, name: '2300 MHz (TDD)', duplex: 'TDD', earfcnDlMin: 38650, earfcnDlMax: 39649, fDlLowMhz: 2300, commonDeployment: 'Fixed Wireless Access (FWA)' },
  { band: 41, name: '2500 MHz (BRS/EBS)', duplex: 'TDD', earfcnDlMin: 39650, earfcnDlMax: 41589, fDlLowMhz: 2496, commonDeployment: 'High Bandwidth Carrier Aggregation' }
];

export interface EarfcnLookupResult {
  earfcn: number;
  band: number;
  bandName: string;
  duplex: 'FDD' | 'TDD';
  downlinkFrequencyMhz: number;
  uplinkFrequencyMhz?: number;
  commonDeployment: string;
}

export function calculateEarfcn(earfcnInput: number): EarfcnLookupResult {
  const match = LTE_BANDS.find(b => earfcnInput >= b.earfcnDlMin && earfcnInput <= b.earfcnDlMax);
  if (!match) {
    throw new Error(`EARFCN ${earfcnInput} not found in common 3GPP LTE band tables.`);
  }

  const offset = earfcnInput - match.earfcnDlMin;
  const fDl = match.fDlLowMhz + 0.1 * offset;
  let fUl: number | undefined = undefined;

  if (match.duplex === 'FDD' && match.fUlLowMhz !== undefined) {
    fUl = match.fUlLowMhz + 0.1 * offset;
  }

  return {
    earfcn: earfcnInput,
    band: match.band,
    bandName: match.name,
    duplex: match.duplex,
    downlinkFrequencyMhz: Math.round(fDl * 10) / 10,
    uplinkFrequencyMhz: fUl ? Math.round(fUl * 10) / 10 : undefined,
    commonDeployment: match.commonDeployment
  };
}

export interface SignalQualityRating {
  rating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  color: string;
  description: string;
}

export function evaluateRsrp(rsrpDbm: number): SignalQualityRating {
  if (rsrpDbm >= -80) {
    return { rating: 'EXCELLENT', color: '#22c55e', description: 'Strong signal, close to cell tower, maximum throughput expected.' };
  } else if (rsrpDbm >= -90) {
    return { rating: 'GOOD', color: '#38bdf8', description: 'Good cell reception with high data speeds and low latency.' };
  } else if (rsrpDbm >= -100) {
    return { rating: 'FAIR', color: '#f59e0b', description: 'Typical urban cell edge. Speeds may degrade during cell congestion.' };
  } else {
    return { rating: 'POOR', color: '#ef4444', description: 'Very weak signal. High retransmissions and possible call drops.' };
  }
}

export function evaluateRsrq(rsrqDb: number): SignalQualityRating {
  if (rsrqDb >= -10) {
    return { rating: 'EXCELLENT', color: '#22c55e', description: 'Low channel interference, dedicated resource block availability.' };
  } else if (rsrqDb >= -15) {
    return { rating: 'GOOD', color: '#38bdf8', description: 'Normal cell loading and acceptable interference levels.' };
  } else if (rsrqDb >= -19) {
    return { rating: 'FAIR', color: '#f59e0b', description: 'Interference present or cell heavily loaded.' };
  } else {
    return { rating: 'POOR', color: '#ef4444', description: 'Severe interference or extreme noise environment.' };
  }
}

export function evaluateSinr(sinrDb: number): SignalQualityRating {
  if (sinrDb >= 20) {
    return { rating: 'EXCELLENT', color: '#22c55e', description: 'Near zero noise floor. Enables 256-QAM or 64-QAM highest order modulation.' };
  } else if (sinrDb >= 13) {
    return { rating: 'GOOD', color: '#38bdf8', description: 'Solid signal-to-noise ratio. Supports 64-QAM modulation.' };
  } else if (sinrDb >= 0) {
    return { rating: 'FAIR', color: '#f59e0b', description: 'Usable SNR. Modulation likely throttled down to 16-QAM or QPSK.' };
  } else {
    return { rating: 'POOR', color: '#ef4444', description: 'Noise exceeds signal. High block error rate (BLER).' };
  }
}

import { LinkBudgetResult } from '../../types';

const SPEED_OF_LIGHT = 299792458; // m/s

export function frequencyToWavelength(freqHz: number): number {
  if (freqHz <= 0) throw new Error('Frequency must be greater than zero.');
  return SPEED_OF_LIGHT / freqHz;
}

export function wavelengthToFrequency(wavelengthMeters: number): number {
  if (wavelengthMeters <= 0) throw new Error('Wavelength must be greater than zero.');
  return SPEED_OF_LIGHT / wavelengthMeters;
}

/**
 * Free Space Path Loss (FSPL) in dB
 * Formula: FSPL (dB) = 32.44 + 20*log10(f_MHz) + 20*log10(d_km)
 */
export function calculateFspl(freqMhz: number, distKm: number): number {
  if (freqMhz <= 0 || distKm <= 0) {
    throw new Error('Frequency and distance must be positive values.');
  }
  const fspl = 32.44 + 20 * Math.log10(freqMhz) + 20 * Math.log10(distKm);
  return Math.round(fspl * 100) / 100;
}

/**
 * First Fresnel Zone Radius
 * r (meters) = 17.32 * sqrt( (d1_km * d2_km) / (f_GHz * (d1_km + d2_km)) )
 */
export interface FresnelResult {
  maxRadiusMeters: number;
  radiusAtObstacleMeters: number;
  minClearance60PercentMeters: number;
  recommendedClearance80PercentMeters: number;
  wavelengthMeters: number;
  isObstructed?: boolean;
}

export function calculateFresnelZone(freqGhz: number, d1Km: number, d2Km: number): FresnelResult {
  if (freqGhz <= 0 || d1Km <= 0 || d2Km <= 0) {
    throw new Error('Frequency and distances must be greater than zero.');
  }
  const totalDistKm = d1Km + d2Km;
  const radiusAtObstacle = 17.32 * Math.sqrt((d1Km * d2Km) / (freqGhz * totalDistKm));
  const midDistKm = totalDistKm / 2;
  const maxRadius = 17.32 * Math.sqrt((midDistKm * midDistKm) / (freqGhz * totalDistKm));

  const wavelength = SPEED_OF_LIGHT / (freqGhz * 1e9);

  return {
    maxRadiusMeters: Math.round(maxRadius * 100) / 100,
    radiusAtObstacleMeters: Math.round(radiusAtObstacle * 100) / 100,
    minClearance60PercentMeters: Math.round(radiusAtObstacle * 0.6 * 100) / 100,
    recommendedClearance80PercentMeters: Math.round(radiusAtObstacle * 0.8 * 100) / 100,
    wavelengthMeters: Math.round(wavelength * 1000) / 1000
  };
}

export interface LinkBudgetParams {
  frequencyMhz: number;
  distanceKm: number;
  txPowerDbm: number;
  txAntennaGainDbi?: number;
  txGainDbi?: number;
  txCableLossDb: number;
  rxAntennaGainDbi?: number;
  rxGainDbi?: number;
  rxCableLossDb: number;
  miscLossDb: number;
  rxSensitivityDbm: number;
}

export interface RfLinkBudgetResult extends LinkBudgetResult {
  isViable: boolean;
}

export function calculateLinkBudget(params: LinkBudgetParams): LinkBudgetResult {
  const {
    frequencyMhz,
    distanceKm,
    txPowerDbm,
    txAntennaGainDbi = params.txGainDbi ?? 0,
    txCableLossDb,
    rxAntennaGainDbi = params.rxGainDbi ?? 0,
    rxCableLossDb,
    miscLossDb,
    rxSensitivityDbm
  } = params;

  const fsplDb = calculateFspl(frequencyMhz, distanceKm);
  const eirpDbm = txPowerDbm + txAntennaGainDbi - txCableLossDb;
  const rxPowerDbm = eirpDbm - fsplDb - miscLossDb + rxAntennaGainDbi - rxCableLossDb;
  const fadeMarginDb = rxPowerDbm - rxSensitivityDbm;

  const wavelengthMeters = SPEED_OF_LIGHT / (frequencyMhz * 1e6);
  const fresnelRadiusMeters = calculateFresnelZone(frequencyMhz / 1000, distanceKm / 2, distanceKm / 2).maxRadiusMeters;

  let status: 'EXCELLENT' | 'GOOD' | 'MARGINAL' | 'FAIL' = 'FAIL';
  if (fadeMarginDb >= 20) status = 'EXCELLENT';
  else if (fadeMarginDb >= 15) status = 'GOOD';
  else if (fadeMarginDb >= 10) status = 'MARGINAL';

  return {
    frequencyMhz,
    distanceKm,
    txPowerDbm,
    txAntennaGainDbi,
    txCableLossDb,
    rxAntennaGainDbi,
    rxCableLossDb,
    miscLossDb,
    fsplDb,
    eirpDbm: Math.round(eirpDbm * 100) / 100,
    rxPowerDbm: Math.round(rxPowerDbm * 100) / 100,
    rxSensitivityDbm,
    fadeMarginDb: Math.round(fadeMarginDb * 100) / 100,
    wavelengthMeters: Math.round(wavelengthMeters * 1000) / 1000,
    fresnelRadiusMeters,
    status
  };
}

export function calculateRfLinkBudget(params: LinkBudgetParams): RfLinkBudgetResult {
  const base = calculateLinkBudget(params);
  return {
    ...base,
    isViable: base.fadeMarginDb >= 10
  };
}

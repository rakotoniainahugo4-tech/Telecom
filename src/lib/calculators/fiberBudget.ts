import { FiberBudgetResult } from '../../types';
import { dbmToMilliwatts } from './telecomPower';

export interface FiberBudgetParams {
  wavelengthNm: number; // 1310, 1490, 1550, 1625
  txPowerDbm: number; // e.g. +3 dBm for GPON Class B+ OLT, or +7 dBm Class C+
  rxSensitivityDbm: number; // e.g. -28 dBm for ONT
  fiberLengthKm: number;
  fiberAttenuationDbPerKm?: number; // Custom or auto
  numSplices: number;
  spliceLossDb: number; // default 0.05 dB
  numConnectors: number;
  connectorLossDb: number; // default 0.3 dB
  splitterRatio: 'None' | '1:2' | '1:4' | '1:8' | '1:16' | '1:32' | '1:64';
  engineeringMarginDb: number; // default 3.0 dB safety margin
}

export const WAVELENGTH_ATTENUATION_DEFAULTS: Record<number, number> = {
  1310: 0.35, // ITU-T G.652D O-band
  1490: 0.25, // GPON Downstream
  1550: 0.20, // C-band minimal attenuation window
  1625: 0.22  // L-band / OTDR testing window
};

export const SPLITTER_LOSSES: Record<string, number> = {
  'None': 0,
  '1:2': 3.5,
  '1:4': 7.2,
  '1:8': 10.5,
  '1:16': 13.8,
  '1:32': 17.0,
  '1:64': 20.5
};

export function calculateFiberBudget(params: FiberBudgetParams): FiberBudgetResult {
  const {
    wavelengthNm,
    txPowerDbm,
    rxSensitivityDbm,
    fiberLengthKm,
    numSplices,
    spliceLossDb,
    numConnectors,
    connectorLossDb,
    splitterRatio,
    engineeringMarginDb
  } = params;

  const fiberAttenRate = params.fiberAttenuationDbPerKm || WAVELENGTH_ATTENUATION_DEFAULTS[wavelengthNm] || 0.35;
  const totalFiberLossDb = fiberLengthKm * fiberAttenRate;
  const totalSpliceLossDb = numSplices * spliceLossDb;
  const totalConnectorLossDb = numConnectors * connectorLossDb;
  const splitterLossDb = SPLITTER_LOSSES[splitterRatio] || 0;

  const totalLossDb = totalFiberLossDb + totalSpliceLossDb + totalConnectorLossDb + splitterLossDb + engineeringMarginDb;
  const rxPowerDbm = txPowerDbm - totalLossDb;
  const powerMarginDb = rxPowerDbm - rxSensitivityDbm;
  const rxPowerMw = dbmToMilliwatts(rxPowerDbm);

  let status: 'PASS' | 'WARNING' | 'FAIL' = 'FAIL';
  if (powerMarginDb >= 3.0) {
    status = 'PASS';
  } else if (powerMarginDb >= 0) {
    status = 'WARNING';
  }

  return {
    wavelengthNm,
    txPowerDbm,
    fiberLengthKm,
    fiberAttenuationDbPerKm: Math.round(fiberAttenRate * 1000) / 1000,
    totalFiberLossDb: Math.round(totalFiberLossDb * 100) / 100,
    numSplices,
    spliceLossDb,
    totalSpliceLossDb: Math.round(totalSpliceLossDb * 100) / 100,
    numConnectors,
    connectorLossDb,
    totalConnectorLossDb: Math.round(totalConnectorLossDb * 100) / 100,
    splitterRatio,
    splitterLossDb,
    engineeringMarginDb,
    totalLossDb: Math.round(totalLossDb * 100) / 100,
    rxPowerDbm: Math.round(rxPowerDbm * 100) / 100,
    rxPowerMw: Math.round(rxPowerMw * 10000) / 10000,
    powerMarginDb: Math.round(powerMarginDb * 100) / 100,
    status
  };
}

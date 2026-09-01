export interface PoeStandard {
  standard: string;
  name: string;
  type: string;
  maxPsePowerWatts: number;
  minPdPowerWatts: number;
  voltageRange: string;
  pairs: number;
}

export const POE_STANDARDS: Record<string, PoeStandard> = {
  '802.3af': {
    standard: 'IEEE 802.3af',
    name: 'PoE (Type 1)',
    type: 'Type 1',
    maxPsePowerWatts: 15.4,
    minPdPowerWatts: 12.95,
    voltageRange: '44.0 - 57.0 V',
    pairs: 2
  },
  '802.3at': {
    standard: 'IEEE 802.3at',
    name: 'PoE+ (Type 2)',
    type: 'Type 2',
    maxPsePowerWatts: 30.0,
    minPdPowerWatts: 25.5,
    voltageRange: '50.0 - 57.0 V',
    pairs: 2
  },
  '802.3bt-type3': {
    standard: 'IEEE 802.3bt Type 3',
    name: 'PoE++ (4PPoE 60W)',
    type: 'Type 3',
    maxPsePowerWatts: 60.0,
    minPdPowerWatts: 51.0,
    voltageRange: '50.0 - 57.0 V',
    pairs: 4
  },
  '802.3bt-type4': {
    standard: 'IEEE 802.3bt Type 4',
    name: 'PoE++ (High Power 90W)',
    type: 'Type 4',
    maxPsePowerWatts: 90.0,
    minPdPowerWatts: 71.3,
    voltageRange: '52.0 - 57.0 V',
    pairs: 4
  }
};

export interface PoeCalculationParams {
  standardKey: string;
  deviceWatts: number;
  deviceCount: number;
  switchTotalBudgetWatts: number;
  cableLengthMeters: number; // Max 100m Ethernet standard
  cableCategory: 'Cat5e' | 'Cat6' | 'Cat6a';
}

export interface PoeCalculationResult {
  standard: PoeStandard;
  deviceWatts: number;
  deviceCount: number;
  totalDeviceLoadWatts: number;
  cableResistanceOhmsPer100m: number;
  cableLossWattsPerPort: number;
  totalRequiredPseWatts: number;
  switchTotalBudgetWatts: number;
  budgetUtilizationPercent: number;
  status: 'POWER OK' | 'LOW MARGIN' | 'INSUFFICIENT POWER';
  statusMessage: string;
}

export function calculatePoeBudget(params: PoeCalculationParams): PoeCalculationResult {
  const { standardKey, deviceWatts, deviceCount, switchTotalBudgetWatts, cableLengthMeters, cableCategory } = params;
  const standard = POE_STANDARDS[standardKey] || POE_STANDARDS['802.3at'];

  if (deviceWatts > standard.maxPsePowerWatts) {
    throw new Error(`Device wattage (${deviceWatts}W) exceeds maximum PSE output of ${standard.standard} (${standard.maxPsePowerWatts}W).`);
  }

  // Resistance per 100m for twisted pair loop (Ohms)
  let loopResistance = 12.5; // Cat5e standard (AWG 24)
  if (cableCategory === 'Cat6') loopResistance = 10.0; // AWG 23
  if (cableCategory === 'Cat6a') loopResistance = 9.2; // AWG 23 shielded

  const effectiveLoopResistance = (loopResistance * (cableLengthMeters / 100)) / (standard.pairs / 2);
  
  // Power loss = I^2 * R. Nominal voltage ~ 50V
  const nominalVoltage = 50.0;
  const currentAmps = deviceWatts / nominalVoltage;
  const cableLossWattsPerPort = Math.round(Math.pow(currentAmps, 2) * effectiveLoopResistance * 100) / 100;

  const totalRequiredPerPort = deviceWatts + cableLossWattsPerPort;
  const totalRequiredPseWatts = Math.round(totalRequiredPerPort * deviceCount * 10) / 10;
  const budgetUtilizationPercent = Math.round((totalRequiredPseWatts / switchTotalBudgetWatts) * 100);

  let status: 'POWER OK' | 'LOW MARGIN' | 'INSUFFICIENT POWER' = 'POWER OK';
  let statusMessage = 'Switch PoE power supply has ample headroom for attached loads.';

  if (totalRequiredPseWatts > switchTotalBudgetWatts) {
    status = 'INSUFFICIENT POWER';
    statusMessage = `Required power (${totalRequiredPseWatts}W) exceeds switch PoE budget (${switchTotalBudgetWatts}W). High priority ports will shut down lower priority ports.`;
  } else if (budgetUtilizationPercent > 80) {
    status = 'LOW MARGIN';
    statusMessage = `PoE capacity is at ${budgetUtilizationPercent}% utilization. Consider adding an auxiliary power supply or EPS.`;
  }

  return {
    standard,
    deviceWatts,
    deviceCount,
    totalDeviceLoadWatts: deviceWatts * deviceCount,
    cableResistanceOhmsPer100m: loopResistance,
    cableLossWattsPerPort,
    totalRequiredPseWatts,
    switchTotalBudgetWatts,
    budgetUtilizationPercent,
    status,
    statusMessage
  };
}

export function dbmToMilliwatts(dbm: number): number {
  return Math.pow(10, dbm / 10);
}

export function milliwattsToDbm(mw: number): number {
  if (mw <= 0) throw new Error('Power in mW must be greater than 0.');
  return 10 * Math.log10(mw);
}

export function dbmToWatts(dbm: number): number {
  return Math.pow(10, (dbm - 30) / 10);
}

export function wattsToDbm(w: number): number {
  if (w <= 0) throw new Error('Power in Watts must be greater than 0.');
  return 10 * Math.log10(w) + 30;
}

export function dbwToWatts(dbw: number): number {
  return Math.pow(10, dbw / 10);
}

export function wattsToDbw(w: number): number {
  if (w <= 0) throw new Error('Power in Watts must be greater than 0.');
  return 10 * Math.log10(w);
}

export interface BatteryAutonomyParams {
  batteryVoltage: number; // e.g. 48V (telecom standard) or 12V / 24V
  batteryCapacityAh: number; // e.g. 100Ah
  loadWatts: number; // e.g. 800W
  inverterEfficiencyPercent: number; // e.g. 90%
  depthOfDischargePercent: number; // e.g. 80%
}

export interface BatteryAutonomyResult {
  totalStoredEnergyWh: number;
  usableEnergyWh: number;
  autonomyHours: number;
  autonomyFormatted: string;
  loadCurrentAmps: number;
  cRate: string;
  recommendation: string;
}

export function calculateBatteryAutonomy(params: BatteryAutonomyParams): BatteryAutonomyResult {
  const { batteryVoltage, batteryCapacityAh, loadWatts, inverterEfficiencyPercent, depthOfDischargePercent } = params;
  if (batteryVoltage <= 0 || batteryCapacityAh <= 0 || loadWatts <= 0) {
    throw new Error('All input values must be greater than zero.');
  }

  const eff = Math.min(Math.max(inverterEfficiencyPercent / 100, 0.1), 1.0);
  const dod = Math.min(Math.max(depthOfDischargePercent / 100, 0.1), 1.0);

  const totalStoredEnergyWh = batteryVoltage * batteryCapacityAh;
  const usableEnergyWh = totalStoredEnergyWh * dod;
  const effectiveLoadWatts = loadWatts / eff;

  const autonomyHours = usableEnergyWh / effectiveLoadWatts;
  const hours = Math.floor(autonomyHours);
  const minutes = Math.round((autonomyHours - hours) * 60);

  const loadCurrentAmps = effectiveLoadWatts / batteryVoltage;
  const cRateVal = loadCurrentAmps / batteryCapacityAh;

  let recommendation = 'Optimal backup window for standard telecom sites.';
  if (autonomyHours < 2) {
    recommendation = 'Short autonomy window. Recommended to add battery strings or deploy an auto-start diesel generator.';
  } else if (autonomyHours >= 8) {
    recommendation = 'Excellent high-availability autonomy (N+1 telecom standard).';
  }

  return {
    totalStoredEnergyWh,
    usableEnergyWh,
    autonomyHours: Math.round(autonomyHours * 100) / 100,
    autonomyFormatted: `${hours}h ${minutes}m`,
    loadCurrentAmps: Math.round(loadCurrentAmps * 100) / 100,
    cRate: `C/${(1 / cRateVal).toFixed(1)} (${cRateVal.toFixed(2)}C)`,
    recommendation
  };
}

export interface UpsSizingParams {
  equipmentLoadWatts: number;
  powerFactor: number; // 0.8 to 0.9
  growthMarginPercent: number; // e.g. 25%
}

export interface UpsSizingResult {
  totalWatts: number;
  totalVa: number;
  recommendedUpsVa: number;
  recommendedGeneratorKva: number;
}

export function calculateUpsSizing(params: UpsSizingParams): UpsSizingResult {
  const { equipmentLoadWatts, powerFactor, growthMarginPercent } = params;
  const margin = 1 + growthMarginPercent / 100;
  const totalWatts = equipmentLoadWatts * margin;
  const totalVa = totalWatts / powerFactor;

  const standardRatings = [1000, 1500, 2000, 3000, 5000, 6000, 10000, 15000, 20000, 30000, 40000, 60000];
  const recommendedUpsVa = standardRatings.find(r => r >= totalVa) || Math.ceil(totalVa / 1000) * 1000;
  const recommendedGeneratorKva = Math.round((totalVa * 1.5) / 1000 * 10) / 10;

  return {
    totalWatts: Math.round(totalWatts),
    totalVa: Math.round(totalVa),
    recommendedUpsVa,
    recommendedGeneratorKva
  };
}

export interface PoeDeviceSpec {
  type: string;
  count: number;
  maxPowerPerPortWatts: number;
}

export interface PoeBudgetParams {
  switchTotalBudgetWatts: number;
  devices: PoeDeviceSpec[];
  cableLengthMeters: number;
}

export interface PoeBudgetResult {
  totalPowerDrawWatts: number;
  utilizationPercent: number;
  remainingBudgetWatts: number;
  estimatedCableLossWatts: number;
  isOverBudget: boolean;
}

export function calculatePoeBudget(params: PoeBudgetParams): PoeBudgetResult {
  const { switchTotalBudgetWatts, devices, cableLengthMeters } = params;
  
  let rawPowerDraw = 0;
  for (const d of devices) {
    rawPowerDraw += d.count * d.maxPowerPerPortWatts;
  }

  // Cable loss estimation: ~0.02W per meter per active port running Cat6
  const totalActivePorts = devices.reduce((sum, d) => sum + d.count, 0);
  const estimatedCableLossWatts = Math.round(totalActivePorts * (cableLengthMeters * 0.015) * 10) / 10;
  const totalPowerDrawWatts = Math.round((rawPowerDraw + estimatedCableLossWatts) * 10) / 10;
  const utilizationPercent = Math.round((totalPowerDrawWatts / Math.max(switchTotalBudgetWatts, 1)) * 100);
  const remainingBudgetWatts = Math.round((switchTotalBudgetWatts - totalPowerDrawWatts) * 10) / 10;
  const isOverBudget = totalPowerDrawWatts > switchTotalBudgetWatts;

  return {
    totalPowerDrawWatts,
    utilizationPercent,
    remainingBudgetWatts,
    estimatedCableLossWatts,
    isOverBudget
  };
}

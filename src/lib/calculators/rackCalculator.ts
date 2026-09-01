import { RackEquipment } from '../../types';

export interface RackSummary {
  totalUnits: number;
  usedUnits: number;
  freeUnits: number;
  utilizationPercent: number;
  totalPowerWatts: number;
  totalBtuPerHour: number;
  equipmentList: RackEquipment[];
}

export const DEFAULT_RACK_ITEMS: RackEquipment[] = [
  { id: '1', name: 'Nokia 7750 SR-1s Core Edge Router', uHeight: 3, startU: 38, powerWatts: 650, type: 'router' },
  { id: '2', name: 'Cisco Catalyst 9300 48P Access Switch', uHeight: 1, startU: 34, powerWatts: 280, type: 'switch' },
  { id: '3', name: 'Huawei MA5800-X7 OLT Chassis', uHeight: 6, startU: 26, powerWatts: 820, type: 'fiber' },
  { id: '4', name: 'High-Density 48-Port Cat6A Patch Panel', uHeight: 2, startU: 23, powerWatts: 0, type: 'patch' },
  { id: '5', name: 'Fortinet FortiGate 200F NGFW', uHeight: 1, startU: 20, powerWatts: 140, type: 'router' },
  { id: '6', name: 'Smart Monitored Dual-Circuit PDU', uHeight: 1, startU: 18, powerWatts: 15, type: 'pdu' },
  { id: '7', name: 'APC Smart-UPS RT 3000VA On-Line Battery', uHeight: 4, startU: 1, powerWatts: 180, type: 'ups' }
];

export interface EquipmentItem {
  id: string;
  name: string;
  heightU: number;
  powerWatts: number;
  weightKg: number;
  positionU: number;
}

export interface RackLayoutStats {
  totalU: number;
  usedU: number;
  availableU: number;
  utilizationPercent: number;
  totalPowerWatts: number;
  totalHeatBtuPerHour: number;
  requiredCoolingTons: number;
  totalWeightKg: number;
}

export function calculateRackLayout(rackHeight: number, items: EquipmentItem[]): RackLayoutStats {
  const usedU = items.reduce((sum, item) => sum + item.heightU, 0);
  const availableU = Math.max(0, rackHeight - usedU);
  const utilizationPercent = Math.min(100, Math.round((usedU / Math.max(rackHeight, 1)) * 100));
  const totalPowerWatts = items.reduce((sum, item) => sum + item.powerWatts, 0);
  const totalHeatBtuPerHour = Math.round(totalPowerWatts * 3.412142);
  const requiredCoolingTons = +(totalHeatBtuPerHour / 12000).toFixed(2);
  const totalWeightKg = items.reduce((sum, item) => sum + item.weightKg, 0);

  return {
    totalU: rackHeight,
    usedU,
    availableU,
    utilizationPercent,
    totalPowerWatts,
    totalHeatBtuPerHour,
    requiredCoolingTons,
    totalWeightKg
  };
}


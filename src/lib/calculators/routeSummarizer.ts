import { RouteSummaryResult } from '../../types';

export function calculateRouteSummary(subnets: string[]): RouteSummaryResult {
  const cleanSubnets = subnets.map(s => s.trim()).filter(s => s.length > 0);
  if (cleanSubnets.length === 0) {
    return {
      inputSubnets: [],
      summaryRoute: '',
      binaryMatchBits: 0,
      commonPrefixBinary: '',
      isContiguous: false,
      totalContainedIps: 0,
      supernetCapacityIps: 0
    };
  }

  const binaryList: string[] = [];
  let totalContainedIps = 0;

  for (const s of cleanSubnets) {
    const parts = s.split('/');
    const ipPart = parts[0].trim();
    const cidr = parts[1] ? parseInt(parts[1].trim(), 10) : 32;
    const octets = ipPart.split('.').map(o => parseInt(o.trim(), 10));
    if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) {
      continue;
    }
    const ipInt = ((octets[0] << 24) >>> 0) + ((octets[1] << 16) >>> 0) + ((octets[2] << 8) >>> 0) + (octets[3] >>> 0);
    const binStr = (ipInt >>> 0).toString(2).padStart(32, '0');
    binaryList.push(binStr);
    totalContainedIps += Math.pow(2, 32 - cidr);
  }

  if (binaryList.length === 0) {
    return {
      inputSubnets: cleanSubnets,
      summaryRoute: '',
      binaryMatchBits: 0,
      commonPrefixBinary: '',
      isContiguous: false,
      totalContainedIps: 0,
      supernetCapacityIps: 0
    };
  }

  // Find longest common prefix across all subnets
  let matchBits = 0;
  for (let i = 0; i < 32; i++) {
    const bit = binaryList[0][i];
    const allMatch = binaryList.every(b => b[i] === bit);
    if (allMatch) {
      matchBits++;
    } else {
      break;
    }
  }

  const firstBin = binaryList[0];
  const summaryBin = firstBin.substring(0, matchBits).padEnd(32, '0');
  const summaryInt = parseInt(summaryBin, 2);

  const octet1 = (summaryInt >>> 24) & 255;
  const octet2 = (summaryInt >>> 16) & 255;
  const octet3 = (summaryInt >>> 8) & 255;
  const octet4 = summaryInt & 255;

  const summaryIp = `${octet1}.${octet2}.${octet3}.${octet4}`;
  const summaryRoute = `${summaryIp}/${matchBits}`;
  const supernetCapacityIps = Math.pow(2, 32 - matchBits);

  return {
    inputSubnets: cleanSubnets,
    summaryRoute,
    binaryMatchBits: matchBits,
    commonPrefixBinary: firstBin.substring(0, matchBits),
    isContiguous: matchBits >= 8,
    totalContainedIps,
    supernetCapacityIps
  };
}

export const summarizeRoutes = calculateRouteSummary;

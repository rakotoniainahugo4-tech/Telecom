export interface RouteTableEntry {
  id: string;
  prefix: string; // e.g. "10.0.0.0/8"
  nextHop: string;
  interfaceName: string;
  protocol: 'STATIC' | 'OSPF' | 'BGP' | 'IS-IS' | 'CONNECTED';
  metric: number;
}

export interface LpmResult {
  destinationIp: string;
  matchedRoute: RouteTableEntry | null;
  longestPrefixLength: number;
  explanation: string;
  allMatchingRoutes: { route: RouteTableEntry; prefixLen: number; matches: boolean }[];
}

function ipToBinary32(ipStr: string): string {
  const octets = ipStr.split('.').map(o => parseInt(o.trim(), 10));
  if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) {
    throw new Error(`Invalid IP: ${ipStr}`);
  }
  const intVal = ((octets[0] << 24) >>> 0) + ((octets[1] << 16) >>> 0) + ((octets[2] << 8) >>> 0) + (octets[3] >>> 0);
  return (intVal >>> 0).toString(2).padStart(32, '0');
}

export function findLongestPrefixMatch(destIp: string, routingTable: RouteTableEntry[]): LpmResult {
  const destBin = ipToBinary32(destIp);
  let bestMatch: RouteTableEntry | null = null;
  let maxPrefixLen = -1;

  const evaluated: { route: RouteTableEntry; prefixLen: number; matches: boolean }[] = [];

  for (const entry of routingTable) {
    const [netIp, cidrStr] = entry.prefix.split('/');
    const cidr = parseInt(cidrStr, 10);
    const netBin = ipToBinary32(netIp);

    const matches = destBin.substring(0, cidr) === netBin.substring(0, cidr);
    evaluated.push({ route: entry, prefixLen: cidr, matches });

    if (matches && cidr > maxPrefixLen) {
      maxPrefixLen = cidr;
      bestMatch = entry;
    }
  }

  let explanation = '';
  if (bestMatch) {
    explanation = `Packet destined for ${destIp} matched entry ${bestMatch.prefix} via ${bestMatch.nextHop} (${bestMatch.interfaceName}) as it had the most specific prefix length (/${maxPrefixLen}).`;
  } else {
    explanation = `No matching route found in routing table for ${destIp}. Packet dropped or sent to default gateway 0.0.0.0/0 if configured.`;
  }

  return {
    destinationIp: destIp,
    matchedRoute: bestMatch,
    longestPrefixLength: maxPrefixLen,
    explanation,
    allMatchingRoutes: evaluated
  };
}

export const DEFAULT_ROUTING_TABLE: RouteTableEntry[] = [
  { id: '1', prefix: '0.0.0.0/0', nextHop: '198.51.100.1', interfaceName: 'ge-0/0/0 (Internet Uplink)', protocol: 'BGP', metric: 20 },
  { id: '2', prefix: '10.0.0.0/8', nextHop: '10.254.0.1', interfaceName: 'xe-1/0/0 (Core Agg)', protocol: 'OSPF', metric: 10 },
  { id: '3', prefix: '10.128.0.0/16', nextHop: '10.254.12.2', interfaceName: 'xe-1/0/1 (Distribution)', protocol: 'IS-IS', metric: 15 },
  { id: '4', prefix: '10.128.40.0/24', nextHop: '10.128.40.1', interfaceName: 'vlan-400 (Engineering Lab)', protocol: 'CONNECTED', metric: 0 },
  { id: '5', prefix: '192.168.1.0/24', nextHop: '192.168.1.254', interfaceName: 'vlan-10 (Management)', protocol: 'CONNECTED', metric: 0 },
  { id: '6', prefix: '172.16.0.0/12', nextHop: '172.31.255.1', interfaceName: 'bundle-1 (MPLS VPN)', protocol: 'BGP', metric: 100 }
];

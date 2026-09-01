import { SubnetCalculationResult } from '../../types';

export function calculateIpv4Subnet(input: string): SubnetCalculationResult {
  let ipStr = input.trim();
  let cidr = 24;

  if (ipStr.includes('/')) {
    const parts = ipStr.split('/');
    ipStr = parts[0].trim();
    cidr = parseInt(parts[1].trim(), 10);
  }

  if (isNaN(cidr) || cidr < 0 || cidr > 32) {
    throw new Error('CIDR prefix must be an integer between 0 and 32.');
  }

  const octets = ipStr.split('.').map(o => parseInt(o.trim(), 10));
  if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) {
    throw new Error('Invalid IPv4 address format. Must contain 4 octets between 0 and 255.');
  }

  // Convert to 32-bit unsigned int
  const ipInt = ((octets[0] << 24) >>> 0) + ((octets[1] << 16) >>> 0) + ((octets[2] << 8) >>> 0) + (octets[3] >>> 0);
  const maskInt = cidr === 0 ? 0 : ((0xFFFFFFFF << (32 - cidr)) >>> 0);
  const wildcardInt = (~maskInt) >>> 0;

  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;

  const intToIp = (num: number): string => {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');
  };

  const toBinary = (num: number): string => {
    return [
      ((num >>> 24) & 255).toString(2).padStart(8, '0'),
      ((num >>> 16) & 255).toString(2).padStart(8, '0'),
      ((num >>> 8) & 255).toString(2).padStart(8, '0'),
      (num & 255).toString(2).padStart(8, '0')
    ].join('.');
  };

  const totalAddresses = Math.pow(2, 32 - cidr);
  let usableHosts = 0;
  let firstUsable = '';
  let lastUsable = '';

  if (cidr === 32) {
    usableHosts = 1;
    firstUsable = intToIp(networkInt);
    lastUsable = intToIp(networkInt);
  } else if (cidr === 31) {
    // RFC 3021 Point-to-Point links
    usableHosts = 2;
    firstUsable = intToIp(networkInt);
    lastUsable = intToIp(broadcastInt);
  } else if (cidr === 0) {
    usableHosts = totalAddresses - 2;
    firstUsable = '0.0.0.1';
    lastUsable = '255.255.255.254';
  } else {
    usableHosts = Math.max(0, totalAddresses - 2);
    firstUsable = intToIp(networkInt + 1);
    lastUsable = intToIp(broadcastInt - 1);
  }

  // Determine IPv4 Class
  const firstOctet = octets[0];
  let ipClass = 'Unknown';
  if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'Class A (Unicast)';
  else if (firstOctet === 127) ipClass = 'Loopback (127.0.0.0/8)';
  else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'Class B (Unicast)';
  else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'Class C (Unicast)';
  else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'Class D (Multicast)';
  else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'Class E (Experimental)';

  // Private check (RFC 1918)
  let isPrivate = false;
  if (firstOctet === 10) isPrivate = true;
  else if (firstOctet === 172 && octets[1] >= 16 && octets[1] <= 31) isPrivate = true;
  else if (firstOctet === 192 && octets[1] === 168) isPrivate = true;

  const scope = isPrivate ? 'RFC 1918 Private' : 'Public Internet';

  return {
    ip: intToIp(ipInt),
    cidr,
    subnetMask: intToIp(maskInt),
    netmask: intToIp(maskInt),
    wildcardMask: intToIp(wildcardInt),
    networkAddress: intToIp(networkInt),
    broadcastAddress: intToIp(broadcastInt),
    firstUsableHost: firstUsable,
    lastUsableHost: lastUsable,
    firstUsableIp: firstUsable,
    lastUsableIp: lastUsable,
    totalAddresses,
    totalHosts: totalAddresses,
    usableHosts,
    ipClass,
    isPrivate,
    scope,
    ipBinary: toBinary(ipInt),
    maskBinary: toBinary(maskInt),
    netmaskBinary: toBinary(maskInt),
    networkBinary: toBinary(networkInt)
  };
}

export function calculateSubnet(ip: string, cidr?: number): SubnetCalculationResult {
  if (cidr !== undefined) {
    return calculateIpv4Subnet(`${ip}/${cidr}`);
  }
  return calculateIpv4Subnet(ip);
}

export { calculateRouteSummary as summarizeRoutes } from './routeSummarizer';

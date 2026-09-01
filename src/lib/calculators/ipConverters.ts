export interface IpConversionResult {
  dottedDecimal: string;
  binary: string;
  hexadecimal: string;
  integer: number;
  reverseDnsArpa: string;
}

export function convertIpv4(ipStr: string): IpConversionResult {
  const clean = ipStr.trim();
  const octets = clean.split('.').map(o => parseInt(o.trim(), 10));

  if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) {
    throw new Error('Invalid IPv4 address format. Enter standard dotted-decimal (e.g. 192.168.1.1).');
  }

  const intVal = ((octets[0] << 24) >>> 0) + ((octets[1] << 16) >>> 0) + ((octets[2] << 8) >>> 0) + (octets[3] >>> 0);

  const binOctets = octets.map(o => o.toString(2).padStart(8, '0'));
  const hexOctets = octets.map(o => o.toString(16).padStart(2, '0').toUpperCase());

  return {
    dottedDecimal: clean,
    binary: binOctets.join('.'),
    hexadecimal: `0x${hexOctets.join('')}`,
    integer: intVal,
    reverseDnsArpa: `${octets[3]}.${octets[2]}.${octets[1]}.${octets[0]}.in-addr.arpa`
  };
}

export function cidrToSubnetMask(cidr: number): string {
  if (cidr < 0 || cidr > 32) throw new Error('CIDR must be 0-32');
  const maskInt = cidr === 0 ? 0 : ((0xFFFFFFFF << (32 - cidr)) >>> 0);
  return [
    (maskInt >>> 24) & 255,
    (maskInt >>> 16) & 255,
    (maskInt >>> 8) & 255,
    maskInt & 255
  ].join('.');
}

export function subnetMaskToCidr(mask: string): number {
  const octets = mask.trim().split('.').map(o => parseInt(o.trim(), 10));
  if (octets.length !== 4) throw new Error('Invalid mask');
  const bin = octets.map(o => o.toString(2).padStart(8, '0')).join('');
  const ones = bin.indexOf('0');
  if (ones === -1) return 32;
  if (bin.slice(ones).includes('1')) throw new Error('Non-contiguous subnet mask');
  return ones;
}

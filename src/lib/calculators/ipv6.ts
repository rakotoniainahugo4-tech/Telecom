import { Ipv6CalculationResult } from '../../types';

export function calculateIpv6(input: string): Ipv6CalculationResult {
  let addressStr = input.trim();
  let prefix = 64;

  if (addressStr.includes('/')) {
    const parts = addressStr.split('/');
    addressStr = parts[0].trim();
    prefix = parseInt(parts[1].trim(), 10);
  }

  if (isNaN(prefix) || prefix < 0 || prefix > 128) {
    throw new Error('IPv6 Prefix length must be between 0 and 128.');
  }

  // Expand IPv6 address to full 8 hextets
  let hextets: string[] = [];
  if (addressStr.includes('::')) {
    const [left, right] = addressStr.split('::');
    const leftParts = left ? left.split(':') : [];
    const rightParts = right ? right.split(':') : [];
    const missing = 8 - (leftParts.length + rightParts.length);
    if (missing < 0) throw new Error('Invalid IPv6 address syntax.');
    const zeros = Array(missing).fill('0000');
    hextets = [...leftParts, ...zeros, ...rightParts];
  } else {
    hextets = addressStr.split(':');
  }

  if (hextets.length !== 8) {
    throw new Error('IPv6 address must resolve to exactly 8 hextets.');
  }

  const normalized = hextets.map(h => {
    const clean = h.trim().toLowerCase();
    if (!/^[0-9a-f]{1,4}$/.test(clean)) {
      throw new Error(`Invalid hexadecimal hextet: ${h}`);
    }
    return clean.padStart(4, '0');
  });

  const expanded = normalized.join(':');

  // Compress IPv6
  let compressed = expanded;
  // Replace longest contiguous block of zeros with ::
  const zeroSeq = /(?:^|:)0000(?::0000)+(?:$|:)/;
  const match = compressed.match(zeroSeq);
  if (match) {
    // Simplify representation
    compressed = normalized.map(h => parseInt(h, 16).toString(16)).join(':');
    // Replace longest zero run with ::
    compressed = compressed.replace(/(^|:)0(:0)+(:|$)/, '::');
  } else {
    compressed = normalized.map(h => parseInt(h, 16).toString(16)).join(':');
  }

  // Address Type
  let type = 'Global Unicast (2000::/3)';
  if (expanded.startsWith('fe80:')) type = 'Link-Local Unicast (FE80::/10)';
  else if (expanded.startsWith('fc00:') || expanded.startsWith('fd00:')) type = 'Unique Local Address - ULA (FC00::/7)';
  else if (expanded.startsWith('ff00:') || expanded.startsWith('ff')) type = 'Multicast (FF00::/8)';
  else if (expanded === '0000:0000:0000:0000:0000:0000:0000:0001') type = 'Loopback (::1/128)';
  else if (expanded === '0000:0000:0000:0000:0000:0000:0000:0000') type = 'Unspecified (::/128)';

  // Calculate network prefix hextets vs host portion
  const hextetPrefixCount = Math.floor(prefix / 16);
  const networkHextets = normalized.slice(0, hextetPrefixCount);
  const hostHextets = normalized.slice(hextetPrefixCount);

  return {
    address: addressStr,
    prefix,
    expanded,
    compressed,
    networkPrefix: `${networkHextets.join(':')}::/${prefix}`,
    hostPortion: hostHextets.length > 0 ? `::${hostHextets.join(':')}` : 'Full Interface',
    type,
    totalAddressesNotation: `2^${128 - prefix} (~${(Math.pow(2, Math.min(128 - prefix, 64))).toExponential(2)} addresses)`
  };
}

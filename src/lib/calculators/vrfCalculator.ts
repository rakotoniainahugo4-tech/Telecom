export interface VrfConfig {
  vrfName: string;
  rd: string; // e.g. "65000:100" or "10.0.0.1:100"
  importRt: string[];
  exportRt: string[];
  ciscoConfig: string;
  nokiaConfig: string;
}

export function validateRd(rd: string): boolean {
  const clean = rd.trim();
  // Format Type 0: 2-byte ASN : 4-byte value (e.g. 65000:100)
  // Format Type 1: 4-byte IPv4 : 2-byte value (e.g. 10.0.0.1:100)
  // Format Type 2: 4-byte ASN : 2-byte value (e.g. 4200000000:100)
  const asnFormat = /^\d{1,10}:\d{1,10}$/;
  const ipFormat = /^(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/;
  return asnFormat.test(clean) || ipFormat.test(clean);
}

export function generateVrfConfigurations(vrfName: string, rd: string, importRts: string[], exportRts: string[]): VrfConfig {
  const cleanName = vrfName.trim().toUpperCase() || 'VRF_CUSTOMER_A';
  const cleanRd = rd.trim() || '65000:100';

  const ciscoLines = [
    `! Cisco IOS-XR / IOS-XE VRF Configuration`,
    `vrf definition ${cleanName}`,
    ` rd ${cleanRd}`,
    ` address-family ipv4 unicast`,
    ...exportRts.map(rt => `  route-target export ${rt}`),
    ...importRts.map(rt => `  route-target import ${rt}`),
    ` exit-address-family`,
    `!`
  ];

  const nokiaLines = [
    `# Nokia SR OS VPRN Service Configuration`,
    `configure service vprn 100 customer 1 create`,
    `    description "${cleanName} - L3VPN Service"`,
    `    route-distinguisher ${cleanRd}`,
    `    vrf-target export target:${exportRts[0] || cleanRd}`,
    `    vrf-target import target:${importRts[0] || cleanRd}`,
    `    auto-bind-tunnel`,
    `        resolution any`,
    `    exit`,
    `    no shutdown`,
    `exit`
  ];

  return {
    vrfName: cleanName,
    rd: cleanRd,
    importRt: importRts,
    exportRt: exportRts,
    ciscoConfig: ciscoLines.join('\n'),
    nokiaConfig: nokiaLines.join('\n')
  };
}

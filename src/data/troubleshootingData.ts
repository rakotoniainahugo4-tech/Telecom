export interface TroubleshootingStep {
  stepNumber: number;
  layer: string;
  title: string;
  checkDescription: string;
  verificationCommand: string;
  expectedResult: string;
  suggestedToolRoute?: string;
}

export interface TroubleshootingWorkflow {
  id: string;
  title: string;
  icon: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  symptoms: string[];
  steps: TroubleshootingStep[];
}

export const TROUBLESHOOTING_WORKFLOWS: TroubleshootingWorkflow[] = [
  {
    id: 'internet-down',
    title: 'Complete Internet / Uplink Outage',
    icon: 'WifiOff',
    severity: 'CRITICAL',
    description: 'Systematic OSI model physical-to-application verification when all external Internet connectivity is lost.',
    symptoms: ['No web traffic egressing', 'All external hosts unreachable', 'Users reporting offline status'],
    steps: [
      {
        stepNumber: 1,
        layer: 'Layer 1 - Physical',
        title: 'Check Interface Physical Link & SFP Transceiver',
        checkDescription: 'Verify physical link light (Green/Amber), fiber Tx/Rx optical power levels, and copper cable continuity.',
        verificationCommand: 'show interfaces transceiver detail | include Rx Power',
        expectedResult: 'Link state UP, Rx Optical power between -3 dBm and -18 dBm.',
        suggestedToolRoute: '/tools/fiber-budget'
      },
      {
        stepNumber: 2,
        layer: 'Layer 2 - Data Link',
        title: 'Check ARP Table & VLAN Tagging',
        checkDescription: 'Ensure gateway MAC address is resolved in ARP cache and 802.1Q sub-interface VLAN encapsulation matches.',
        verificationCommand: 'show ip arp | include GigabitEthernet0/0/0',
        expectedResult: 'Valid hardware MAC address present in ARP table.'
      },
      {
        stepNumber: 3,
        layer: 'Layer 3 - Network',
        title: 'Default Gateway Ping Probe',
        checkDescription: 'Send test packets to the next-hop provider gateway router.',
        verificationCommand: 'ping 198.51.100.1 count 5',
        expectedResult: '5/5 replies received with < 5ms local latency.',
        suggestedToolRoute: '/tools/ping'
      },
      {
        stepNumber: 4,
        layer: 'Layer 3/4 - Routing & BGP',
        title: 'Verify BGP Peering & Default Route',
        checkDescription: 'Confirm eBGP session is in Established state and prefix 0.0.0.0/0 is present in the RIB.',
        verificationCommand: 'show ip bgp summary',
        expectedResult: 'State/PfxRcd showing number of prefixes, session state Established.',
        suggestedToolRoute: '/tools/lpm'
      },
      {
        stepNumber: 5,
        layer: 'Layer 7 - Application / DNS',
        title: 'DNS Resolution Test',
        checkDescription: 'Query external recursive nameservers for public domains.',
        verificationCommand: 'dig @8.8.8.8 google.com +short',
        expectedResult: 'Valid A/AAAA record returned.',
        suggestedToolRoute: '/tools/dns'
      }
    ]
  },
  {
    id: 'high-latency-jitter',
    title: 'High Latency & Packet Loss Degradation',
    icon: 'Activity',
    severity: 'HIGH',
    description: 'Diagnose intermittent transmission jitter, micro-burst congestion, bufferbloat, and MTU mismatch.',
    symptoms: ['Choppy VoIP calls', 'Lag spikes in video conferencing', 'TCP retransmissions'],
    steps: [
      {
        stepNumber: 1,
        layer: 'Layer 1/2 - Interface Drops',
        title: 'Check CRC Errors & Interface Drops',
        checkDescription: 'Inspect interface input/output errors, framing errors, and overrun drops.',
        verificationCommand: 'show interfaces gigabitEthernet 0/0 | include CRC|drop',
        expectedResult: '0 CRC errors, 0 output drops.'
      },
      {
        stepNumber: 2,
        layer: 'Layer 3 - Route Hop Latency',
        title: 'Hop-by-Hop Traceroute & MTU Check',
        checkDescription: 'Isolate which specific transit hop or ISP peering exchange introduces jitter or loss.',
        verificationCommand: 'traceroute 8.8.8.8',
        expectedResult: 'Consistent latencies across consecutive hops without abrupt 100ms+ spikes.',
        suggestedToolRoute: '/tools/traceroute'
      },
      {
        stepNumber: 3,
        layer: 'Layer 3/4 - QoS Queue Drops',
        title: 'Inspect QoS Queue Allocation',
        checkDescription: 'Verify whether strict priority voice queue (LLQ) or bandwidth queues (CBWFQ) are dropping packets.',
        verificationCommand: 'show policy-map interface gigabitEthernet 0/0',
        expectedResult: 'Zero drop-tail drops in Priority Queue.',
        suggestedToolRoute: '/tools/qos'
      }
    ]
  },
  {
    id: 'voip-one-way-audio',
    title: 'VoIP One-Way Audio / SIP NAT Failure',
    icon: 'PhoneOff',
    severity: 'HIGH',
    description: 'Troubleshoot asymmetric RTP audio routing, SIP ALG interference, and firewall NAT traversal.',
    symptoms: ['Caller hears recipient but recipient hears silence', 'Call disconnects at exactly 32 seconds', 'No ringback tone'],
    steps: [
      {
        stepNumber: 1,
        layer: 'Layer 7 - SIP SDP Payload',
        title: 'Inspect SDP Connection IP (c=IN IP4)',
        checkDescription: 'Verify whether the SIP INVITE/200 OK contains a private RFC 1918 IP in the SDP media connection field.',
        verificationCommand: 'pjsip set logger on',
        expectedResult: 'SDP IP contains public router WAN IP or valid STUN-mapped endpoint.',
        suggestedToolRoute: '/telecom/voip'
      },
      {
        stepNumber: 2,
        layer: 'Layer 4 - UDP RTP Ports',
        title: 'Check Firewall UDP RTP Port Forwarding',
        checkDescription: 'Confirm RTP dynamic media port range (e.g. UDP 10000-20000) is open and not blocked by stateful firewall.',
        verificationCommand: 'ss -u -a | grep -E "1[0-9]{4}"',
        expectedResult: 'Bidirectional UDP socket flow established.',
        suggestedToolRoute: '/tools/port-test'
      },
      {
        stepNumber: 3,
        layer: 'Layer 7 - Disable SIP ALG',
        title: 'Verify SIP ALG is Disabled on Edge Firewalls',
        checkDescription: 'SIP Application Layer Gateway (ALG) frequently corrupts SIP headers during NAT translation.',
        verificationCommand: 'show running-config | include sip-alg',
        expectedResult: 'SIP ALG disabled globally.'
      }
    ]
  },
  {
    id: 'fiber-high-loss',
    title: 'Optical Fiber High Attenuation / Alarm',
    icon: 'ZapOff',
    severity: 'CRITICAL',
    description: 'Diagnose optical power degradation (LOS, LOF), dirty fiber connectors, and optical cable microbends.',
    symptoms: ['ONT Loses Optical Carrier', 'Bit Error Rate (BER) spikes', 'Optical Rx power below -28 dBm sensitivity'],
    steps: [
      {
        stepNumber: 1,
        layer: 'Physical Optical',
        title: 'Measure OLT Port Tx & ONT Rx Power',
        checkDescription: 'Read calibrated optical power levels at both transmitter and receiver ends.',
        verificationCommand: 'show interface gigabitethernet 0/1/0 optical-power',
        expectedResult: 'Rx power within manufacturer dynamic range (-8 dBm to -27 dBm).',
        suggestedToolRoute: '/tools/fiber-budget'
      },
      {
        stepNumber: 2,
        layer: 'Optical Distribution',
        title: 'Compare 1310nm vs 1550nm/1625nm Attenuation',
        checkDescription: 'If 1550nm shows significantly higher attenuation than 1310nm, a physical macro-bend or pinch exists in the cable tray.',
        verificationCommand: 'otdr test port 1/1/1 wavelength 1310,1550',
        expectedResult: 'Attenuation difference < 0.15 dB/km between wavelengths.'
      },
      {
        stepNumber: 3,
        layer: 'Optical Connectors',
        title: 'Inspect & Clean Fiber Endfaces',
        checkDescription: 'Examine ferrule surface with optical microscope. Clean with dry lint-free cassette cleaner.',
        verificationCommand: 'Manual Inspection (IEC 61300-3-35)',
        expectedResult: 'Zone A (Core) completely free of dust, oils, or scratches.'
      }
    ]
  }
];

export interface TroubleshootingGuideStep {
  id: string;
  stepNumber: number;
  layer?: string;
  title: string;
  instruction: string;
  checkDescription?: string;
  command?: string;
  verificationCommand?: string;
  expectedResult?: string;
  toolRecommendation?: string;
  suggestedToolRoute?: string;
}

export interface TroubleshootingGuide {
  id: string;
  title: string;
  category?: string;
  icon: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  symptoms: string[];
  steps: TroubleshootingGuideStep[];
}

export const TROUBLESHOOTING_GUIDES: TroubleshootingGuide[] = TROUBLESHOOTING_WORKFLOWS.map(wf => ({
  id: wf.id,
  title: wf.title,
  category: wf.severity === 'CRITICAL' ? 'Core Network' : 'Service Layer',
  icon: wf.icon,
  severity: wf.severity,
  description: wf.description,
  symptoms: wf.symptoms,
  steps: wf.steps.map((s, idx) => ({
    id: `step-${idx + 1}`,
    stepNumber: s.stepNumber,
    layer: s.layer,
    title: s.title,
    instruction: s.checkDescription,
    checkDescription: s.checkDescription,
    command: s.verificationCommand,
    verificationCommand: s.verificationCommand,
    expectedResult: s.expectedResult,
    toolRecommendation: s.suggestedToolRoute,
    suggestedToolRoute: s.suggestedToolRoute
  }))
}));

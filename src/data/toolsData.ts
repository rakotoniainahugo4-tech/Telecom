import { ToolItem } from '../types';

export const ALL_TOOLS: ToolItem[] = [
  // DIAGNOSTICS & REAL TESTS
  {
    id: 'speed-test',
    name: 'Network Speed Test',
    category: 'DIAGNOSTICS',
    badge: 'REAL TEST',
    description: 'Controlled live HTTP byte-stream download, upload throughput, latency, and jitter measurement without simulated data.',
    iconName: 'Gauge',
    route: '/tools/speed-test',
    featured: true
  },
  {
    id: 'ping',
    name: 'Real Ping Probe',
    category: 'DIAGNOSTICS',
    badge: 'REAL TEST',
    description: 'Multi-probe TCP connect latency and jitter analysis across remote endpoints with detailed round-trip telemetry.',
    iconName: 'Activity',
    route: '/tools/ping',
    featured: true
  },
  {
    id: 'traceroute',
    name: 'Route & Hop Analyzer',
    category: 'DIAGNOSTICS',
    badge: 'REAL TEST',
    description: 'Autonomous cloud transit route path evaluation, DNS mapping, and destination latency inspection.',
    iconName: 'GitCommit',
    route: '/tools/traceroute',
    featured: true
  },
  {
    id: 'dns',
    name: 'DNS Query Resolver',
    category: 'DIAGNOSTICS',
    badge: 'REAL TEST',
    description: 'Live DNS lookup for A, AAAA, CNAME, MX, NS, TXT, and SOA records via high-performance recursive resolvers.',
    iconName: 'Globe',
    route: '/tools/dns',
    featured: true
  },
  {
    id: 'port-test',
    name: 'TCP Port Connectivity',
    category: 'DIAGNOSTICS',
    badge: 'REAL TEST',
    description: 'Diagnostic TCP socket handshake tester on standard service ports (SSH, HTTP, HTTPS, SIP, SMTP, etc.).',
    iconName: 'Server',
    route: '/tools/port-test',
    featured: true
  },
  {
    id: 'http-test',
    name: 'HTTP / HTTPS Web Probe',
    category: 'DIAGNOSTICS',
    badge: 'REAL TEST',
    description: 'Full HTTP response diagnostic inspecting status code, latency, headers, redirects, and SSRF-hardened safety.',
    iconName: 'ShieldCheck',
    route: '/tools/http-test'
  },
  {
    id: 'mtu-test',
    name: 'Path MTU & Frame Analyzer',
    category: 'NETWORK',
    badge: 'REAL TEST',
    description: 'Evaluate Maximum Transmission Unit (MTU), TCP MSS calculation, and overheads (PPPoE, IPSec, VXLAN, Jumbo).',
    iconName: 'Layers',
    route: '/tools/mtu-test'
  },

  // IP & ROUTING CALCULATORS
  {
    id: 'subnet-calculator',
    name: 'IPv4 Subnet Calculator',
    category: 'IP',
    badge: 'LOCAL CALCULATION',
    description: 'Comprehensive CIDR /1 to /32 subnetting, wildcard mask, usable IP range, broadcast, and bitwise binary breakdown.',
    iconName: 'Calculator',
    route: '/tools/subnet-calculator',
    featured: true
  },
  {
    id: 'ipv6-calculator',
    name: 'IPv6 Prefix Calculator',
    category: 'IP',
    badge: 'LOCAL CALCULATION',
    description: 'IPv6 address expansion, zero compression, prefix breakdown, address classification (ULA, GUA, Link-Local).',
    iconName: 'Cpu',
    route: '/tools/ipv6-calculator'
  },
  {
    id: 'route-summarizer',
    name: 'CIDR Route Summarizer',
    category: 'IP',
    badge: 'LOCAL CALCULATION',
    description: 'Compute smallest supernet route summary across arbitrary IPv4 subnet lists with bitwise common prefix proof.',
    iconName: 'Merge',
    route: '/tools/route-summarizer'
  },
  {
    id: 'converters',
    name: 'IP & Radix Converters',
    category: 'IP',
    badge: 'LOCAL CALCULATION',
    description: 'Instant conversion between Dotted-Decimal, 32-bit Integer, Hexadecimal, Binary, and reverse DNS ARPA.',
    iconName: 'Binary',
    route: '/tools/converters'
  },
  {
    id: 'longest-prefix-match',
    name: 'Longest Prefix Match (LPM)',
    category: 'IP',
    badge: 'LOCAL CALCULATION',
    description: 'Simulate router FIB lookup table matching destination IP against multiple overlapping prefixes with metric tie-break.',
    iconName: 'Navigation',
    route: '/tools/lpm'
  },

  // OPTICAL & FIBER
  {
    id: 'fiber-budget',
    name: 'Fiber Optic Power Budget',
    category: 'FIBER',
    badge: 'LOCAL CALCULATION',
    description: 'Calculate link attenuation, splice losses, connector insertion, PLC splitters (1:2 to 1:64), and ONT power margin across 1310/1490/1550/1625nm.',
    iconName: 'Zap',
    route: '/tools/fiber-budget',
    featured: true
  },

  // RF & WIRELESS
  {
    id: 'rf',
    name: 'RF Microwave Link Budget',
    category: 'RF',
    badge: 'LOCAL CALCULATION',
    description: 'End-to-end radio transmission link budget: EIRP, Free Space Path Loss (FSPL), fade margin, and antenna gains.',
    iconName: 'Radio',
    route: '/tools/rf',
    featured: true
  },
  {
    id: 'fresnel',
    name: '1st Fresnel Zone Clearance',
    category: 'RF',
    badge: 'LOCAL CALCULATION',
    description: 'Calculate microwave radio line-of-sight Fresnel zone ellipsoid radius, 60% clearance requirement, and obstacle height.',
    iconName: 'Eye',
    route: '/tools/fresnel'
  },
  {
    id: 'dbm',
    name: 'dBm / Power Converter',
    category: 'POWER',
    badge: 'LOCAL CALCULATION',
    description: 'Physical RF and optical power conversion between dBm, milliwatts (mW), Watts (W), and dBW with exact formulas.',
    iconName: 'BatteryCharging',
    route: '/tools/dbm'
  },

  // MOBILE NETWORKS
  {
    id: 'mobile',
    name: 'LTE EARFCN & Signal Matrix',
    category: 'MOBILE',
    badge: 'LOCAL CALCULATION',
    description: 'Convert 3GPP LTE EARFCN to Band frequency (DL/UL) and analyze entered RSRP, RSRQ, and SINR signal metrics.',
    iconName: 'Signal',
    route: '/telecom/mobile'
  },

  // VOIP & SIP SOFTPHONE
  {
    id: 'voip',
    name: 'Téléphone SIP Softphone (Linphone)',
    category: 'VOIP',
    badge: 'REAL TEST',
    description: 'Softphone SIP WebRTC complet : Numéroteur DTMF avec sons réels, enregistrement PBX (Asterisk/Kamailio/Linphone), journal d\'appels, carnet de contacts, serveur vocal IVR et test d\'écho audio direct.',
    iconName: 'PhoneCall',
    route: '/telecom/voip'
  },
  {
    id: 'qos',
    name: 'QoS & Network Performance',
    category: 'QOS',
    badge: 'LOCAL CALCULATION',
    description: 'Evaluate latency, packet loss, and jitter against ITU-T Y.1541 QoS classes and G.107 E-model voice quality standards.',
    iconName: 'Sliders',
    route: '/tools/qos'
  },

  // POWER & RACK INFRASTRUCTURE
  {
    id: 'poe',
    name: 'PoE Power Budget (802.3af/at/bt)',
    category: 'POWER',
    badge: 'LOCAL CALCULATION',
    description: 'Budget switch PoE output, cable DC resistance voltage drop, and device wattage across 802.3af, at, and bt standards.',
    iconName: 'PlugZap',
    route: '/tools/poe'
  },
  {
    id: 'battery-autonomy',
    name: 'Telecom Battery Autonomy',
    category: 'POWER',
    badge: 'LOCAL CALCULATION',
    description: 'Size -48V DC battery banks, Depth of Discharge (DoD), inverter efficiency, autonomy hours, and UPS/generator capacity.',
    iconName: 'BatteryFull',
    route: '/tools/battery'
  },
  {
    id: 'rack',
    name: '42U Server Rack Manager',
    category: 'POWER',
    badge: 'LOCAL CALCULATION',
    description: 'Interactive visual 42U telecom equipment rack planner with U-height utilization, thermal BTU, and wattage summation.',
    iconName: 'LayoutGrid',
    route: '/tools/rack'
  },
  {
    id: 'site-engineering',
    name: 'SRS, Drive Test & Transmission Site Modeler',
    category: 'TRANSMISSION',
    badge: 'REAL TEST',
    description: 'Interactive Site Radio Survey (SRS), Drive Test field app (2G GSM/EDGE, 3G HSPA+, 4G LTE-A, 5G NR), connected site telemetry (ANM 234), and -48V DC power/tower sizing.',
    iconName: 'Building2',
    route: '/telecom/site',
    featured: true
  },

  // LABS & SIMULATIONS
  {
    id: 'mpls-lab',
    name: 'IP/MPLS Core Architecture Lab',
    category: 'MPLS',
    badge: 'LAB / SIMULATION',
    description: 'Interactive topology (CE1-PE1-P1-P2-PE2-CE2) with VRF, LDP, BGP-EVPN, OSPF, and label stack inspection.',
    iconName: 'Network',
    route: '/network/mpls',
    featured: true
  },
  {
    id: 'network-topology',
    name: 'Interactive Topology Canvas',
    category: 'NETWORK',
    badge: 'LAB / SIMULATION',
    description: 'Drag-and-drop telecom diagram designer with Routers, Switches, OLT, Microwave, Cell Towers, and live packet flows.',
    iconName: 'Share2',
    route: '/network/topology',
    featured: true
  },
  {
    id: 'noc-dashboard',
    name: 'NOC Operations Center',
    category: 'DIAGNOSTICS',
    badge: 'LAB / SIMULATION',
    description: 'Live Network Operations Center interface displaying active telemetry, alarms, device availability, and traffic monitors.',
    iconName: 'MonitorDot',
    route: '/network/noc',
    featured: true
  },
  {
    id: 'troubleshooting',
    name: 'Telecom Troubleshooting Assistant',
    category: 'DIAGNOSTICS',
    badge: 'REFERENCE',
    description: 'Guided step-by-step diagnostic workflows for 8 major telecom failure modes (Fiber loss, DNS, Routing, VoIP, LTE).',
    iconName: 'Wrench',
    route: '/tools/troubleshooting'
  }
];

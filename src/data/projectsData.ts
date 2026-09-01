export interface ProjectItem {
  id: string;
  title: string;
  category: 'IP/MPLS' | 'VoIP / Telco' | 'Transmission' | 'Fiber Optic' | 'Infrastructure';
  engineeringObjective: string;
  description: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  topologyNodes: string[];
  keyOutcomes: string[];
}

export const PROJECTS_LIST: ProjectItem[] = [
  {
    id: 'mpls-carrier-core',
    title: 'Carrier-Grade Multi-Service IP/MPLS Core Network',
    category: 'IP/MPLS',
    engineeringObjective: 'Design and deploy a resilient dual-plane IP/MPLS backbone with sub-50ms Fast Reroute (FRR) and multi-tenant L3VPN / EVPN services.',
    description: 'Engineered a multi-chassis Nokia 7750 SR and Cisco ASR9000 core network interconnecting primary aggregation nodes across multiple regional datacenters. Implemented IS-IS with multi-topology routing, Segment Routing with Flexible Algorithms (SR-TE), and BGP-LU for scalable transport.',
    technologies: ['Nokia SR OS', 'Cisco IOS-XR', 'IS-IS Multi-Area', 'MPLS L3VPN (RFC 4364)', 'Segment Routing (SR-MPLS)', 'TI-LFA FRR', 'BGP-EVPN'],
    metrics: [
      { label: 'Failover Convergence', value: '< 38 ms (TI-LFA)' },
      { label: 'Backbone Throughput', value: '400 Gbps Core' },
      { label: 'Active L3VPN VRFs', value: '450+ Customer VRFs' },
      { label: 'Core Availability', value: '99.999% Five-Nines' }
    ],
    topologyNodes: ['CE1 (Customer)', 'PE1 (Nokia 7750 SR-1s)', 'P1 (Cisco ASR9006)', 'P2 (Nokia 7750 SR-12)', 'PE2 (Cisco ASR9001)', 'CE2 (Customer)'],
    keyOutcomes: [
      'Eliminated core single points of failure with redundant dual-homed PE architecture.',
      'Configured deterministic QoS bandwidth allocation for mission-critical VoIP and real-time video streams.',
      'Automated VRF route target provisioning and telemetry streaming via gNMI.'
    ]
  },
  {
    id: 'voip-gsm-gateway',
    title: 'Carrier VoIP-to-PSTN / GSM Softswitch Trunking Engine',
    category: 'VoIP / Telco',
    engineeringObjective: 'Build a high-density SIP-to-SS7/GSM interconnect gateway with low-latency transcoding and real-time Call Detail Record (CDR) auditing.',
    description: 'Designed an enterprise and carrier interconnection platform integrating Asterisk, FreeSWITCH, and OpenSIPS with GSM base stations. Deployed SBCs (Session Border Controllers) with TLS/SRTP encryption, G.729 / Opus dynamic transcoding, and automated SIP trunk failover.',
    technologies: ['SIP / SDP (RFC 3261)', 'Asterisk PBX', 'OpenSIPS SBC', 'RTP / RTCP', 'Wireshark VoIP Analysis', 'E1/PRI Signaling', 'PJSIP Stack'],
    metrics: [
      { label: 'Concurrent SIP Channels', value: '1,200 Active Calls' },
      { label: 'Call Setup Latency', value: '< 180 ms PDD' },
      { label: 'Mean Opinion Score (MOS)', value: '4.28 (HD G.722/Opus)' },
      { label: 'Trunk Switchover', value: 'Sub-second Failover' }
    ],
    topologyNodes: ['SIP Endpoints', 'Session Border Controller (SBC)', 'FreeSWITCH Core', 'Asterisk Media Gateway', 'Telco PSTN / SS7 / ISDN'],
    keyOutcomes: [
      'Implemented distributed SIP registration load-balancing across active-active softswitches.',
      'Achieved pristine voice quality through jitter buffer tuning and QoS DSCP EF (Expedited Forwarding) tagging.',
      'Integrated real-time SIP packet capture diagnostics with automated ladder-diagram visualization.'
    ]
  },
  {
    id: 'fiber-gpon-distribution',
    title: 'Metro FTTH Gigabit Passive Optical Network (GPON) Rollout',
    category: 'Fiber Optic',
    engineeringObjective: 'Design passive optical distribution network (ODN) with symmetrical power link budget for over 10,000 residential and enterprise subscribers.',
    description: 'Engineered physical optical architecture including OLT chassis placement, primary feeder routes, optical distribution frames (ODF), tiered 1:4 and 1:8 PLC splitters, and drop cable routing. Verified optical return loss and power margins using dual-wavelength OTDR testing.',
    technologies: ['ITU-T G.984 GPON', 'ITU-T G.9807 XGS-PON', 'Single-Mode G.652D Fiber', 'PLC Splitters (1:32 / 1:64)', 'OTDR Trace Analysis', 'SC/APC Optical Polish'],
    metrics: [
      { label: 'Coverage Subscribers', value: '12,500 Homes Passed' },
      { label: 'Max Optical Span', value: '18.4 km to farthest ONT' },
      { label: 'Average Insertion Loss', value: '24.2 dB (< 28 dB Class B+)' },
      { label: 'ONT Power Margin', value: '+3.8 dB Safety Margin' }
    ],
    topologyNodes: ['Huawei MA5800 OLT', 'Main ODF (Central Office)', 'Feeder Cable (96-core)', 'FDT Splitter Cabinet (1:4)', 'FAT Drop Box (1:8)', 'Subscriber ONT'],
    keyOutcomes: [
      'Engineered balanced optical budgets ensuring every ONT receives optical power between -14 dBm and -24 dBm.',
      'Decreased splice insertion losses to under 0.04 dB per core through precision core-alignment fusion splicers.',
      'Built interactive optical mapping and fault localization calculators.'
    ]
  },
  {
    id: 'rf-microwave-backhaul',
    title: 'High-Capacity Long-Haul Microwave Radio Backhaul',
    category: 'Transmission',
    engineeringObjective: 'Establish high-capacity 10 Gbps wireless backhaul across rugged terrain with full 1st Fresnel zone clearance and 99.999% availability.',
    description: 'Conducted radio frequency propagation analysis, terrain path profiling, and link budget calculations across 11 GHz and 18 GHz licensed microwave links. Deployed dual-polarized parabolic antennas with Space Diversity and Adaptive Modulation (QPSK to 4096-QAM).',
    technologies: ['Licensed Microwave (11/18 GHz)', 'Adaptive Modulation (ACM)', 'XPIC (Cross-Polarization)', 'Space Diversity Receivers', 'Fresnel Zone Profiling', 'ITU-R P.530 Rain Model'],
    metrics: [
      { label: 'Link Distance', value: '34.2 km Hop Span' },
      { label: 'Net Throughput', value: '2.5 Gbps Full-Duplex' },
      { label: 'Fade Margin', value: '38.4 dB @ 99.999%' },
      { label: 'Antenna Diameter', value: '1.8m High-Gain Dishes' }
    ],
    topologyNodes: ['Cell Site Tower Alpha (60m)', 'ODU Radio Alpha (11 GHz)', 'Parabolic Dish (42 dBi)', 'Free Space Path', 'Remote Dish (42 dBi)', 'Cell Site Tower Beta (45m)'],
    keyOutcomes: [
      'Eliminated thermal multipath fading utilizing vertically separated space diversity antennas.',
      'Achieved uninterrupted link availability even through severe monsoon rain events.',
      'Engineered complete site power redundancy with -48V DC battery banks and solar hybrid rectifiers.'
    ]
  }
];

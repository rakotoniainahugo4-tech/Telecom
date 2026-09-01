export interface DocArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  definition: string;
  architecture: string;
  parameters: string[];
  formula?: string;
  example: string;
  troubleshooting: string[];
  bestPractices: string[];
}

export const DOCUMENTATION_ARTICLES: DocArticle[] = [
  {
    id: 'mpls-architecture',
    category: 'MPLS',
    title: 'Multiprotocol Label Switching (MPLS) & L3VPN (RFC 4364)',
    summary: 'Core transport technology replacing destination IP lookups with 32-bit fixed label encapsulation.',
    definition: 'MPLS is a data-forwarding architecture where packets are assigned 32-bit label headers at the Provider Edge (PE) router. Core Provider (P) routers forward traffic purely by swapping labels in the Label Forwarding Information Base (LFIB), bypassing costly Layer 3 routing table lookups.',
    architecture: 'Customer Edge (CE) -> Provider Edge (PE) -> Provider Core (P1, P2) -> Provider Edge (PE) -> Customer Edge (CE).\nUses LDP (Label Distribution Protocol) or Segment Routing (SR-MPLS) for transport labels and MP-BGP (Multi-Protocol BGP) with VPNv4/VPNv6 address families for customer route separation via Route Distinguishers (RD) and Route Targets (RT).',
    parameters: [
      'Label (20 bits): Identifies the LSP forwarding index (0-1048575). Labels 0-15 are reserved.',
      'Traffic Class / TC (3 bits): Quality of Service (QoS) DiffServ / EXP mapping.',
      'Bottom of Stack / S (1 bit): Set to 1 for the innermost label (VPN label), 0 for transport labels.',
      'Time to Live / TTL (8 bits): Decremented at each hop to prevent loops.'
    ],
    formula: 'MPLS Header Size = 32 bits (4 bytes). Dual Label Stack = 8 bytes overhead.',
    example: 'In BGP/MPLS IP VPN, when CE1 sends IP packet to CE2, PE1 adds a 4-byte VPN label (allocated by BGP) and an outer 4-byte transport label (allocated by LDP/OSPF-SR). P routers swap the outer label and execute Penultimate Hop Popping (PHP). PE2 removes the inner VPN label and injects the raw IP packet into the customer VRF.',
    troubleshooting: [
      'Verify IGP reachability to loopback IP (/32) before troubleshooting LDP.',
      'Ensure LDP router-id matches the loopback address advertised in OSPF/IS-IS.',
      'Check Route Target export/import consistency between PE routers.',
      'Verify MTU along the core path is increased (>= 1522 or 1530 bytes) to accommodate label overhead without fragmentation.'
    ],
    bestPractices: [
      'Enable Penultimate Hop Popping (PHP) to reduce CPU load on terminating PE routers.',
      'Configure LDP-IGP synchronization to prevent blackholing during network convergence.',
      'Enforce strict Core MTU sizing (Jumbo frames 9000 bytes or minimum 1548 bytes).'
    ]
  },
  {
    id: 'ospf-routing',
    category: 'IP / Routing',
    title: 'Open Shortest Path First (OSPFv2 / OSPFv3)',
    summary: 'Link-state interior gateway protocol (IGP) based on Dijkstra Shortest Path First (SPF) algorithm.',
    definition: 'OSPF is an open standard link-state routing protocol operating directly over IP (protocol number 89). Routers synchronize their link-state databases (LSDB) via Link State Advertisements (LSAs) and calculate the loop-free shortest path tree.',
    architecture: 'Hierarchical two-tier architecture: Area 0 (Backbone Area) must be contiguous. All non-backbone areas connect to Area 0 via Area Border Routers (ABRs). Autonomous System Boundary Routers (ASBRs) inject external routes.',
    parameters: [
      'Hello Timer: Default 10s on broadcast/point-to-point, 30s on NBMA.',
      'Dead Timer: Default 4x Hello interval (40s / 120s).',
      'Router ID (RID): Unique 32-bit identifier.',
      'LSA Types: Type 1 (Router), Type 2 (Network), Type 3 (Summary), Type 4 (ASBR Summary), Type 5 (External).'
    ],
    formula: 'Cost = Reference Bandwidth / Interface Bandwidth (Default Ref = 100 Mbps, Recommended = 100 Gbps or 100000 Mbps).',
    example: 'For a 10 Gbps interface with auto-cost reference-bandwidth 100000 (100 Gbps), Cost = 100000 / 10000 = 10.',
    troubleshooting: [
      'Mismatched Hello/Dead intervals prevent adjacency formation.',
      'Area ID mismatch or subnet mask mismatch on point-to-point links.',
      'MTU mismatch causes routers to get stuck in EXSTART/EXCHANGE state.',
      'Duplicate Router IDs cause LSDB flapping and route instability.'
    ],
    bestPractices: [
      'Set auto-cost reference-bandwidth to 100000 or 1000000 on modern 10G/40G/100G networks.',
      'Use point-to-point network type on Ethernet links between routers to suppress DR/BDR election.',
      'Authenticate OSPF neighbors with cryptographic SHA-256 or MD5 keys.'
    ]
  },
  {
    id: 'fiber-optics',
    category: 'Fiber Optics',
    title: 'Optical Transmission & Passive Optical Networks (GPON / XGS-PON)',
    summary: 'Single-mode optical propagation, Rayleigh scattering, chromatic dispersion, and optical link budgeting.',
    definition: 'Fiber optic communications transmit modulated light pulses down silica glass cores (9µm core diameter for single-mode ITU-T G.652D). Point-to-Multipoint Passive Optical Networks (PON) utilize unpowered optical splitters to serve up to 64 or 128 ONTs from a single Optical Line Terminal (OLT) port.',
    architecture: 'OLT (Central Office) -> ODF -> Optical Feeder Fiber -> Passive Splitter Cabinet (1:4 / 1:8 / 1:16 / 1:32 / 1:64) -> Distribution Fiber -> ONT / ONU (Subscriber Premises).',
    parameters: [
      '1310 nm: Upstream GPON wavelength (attenuation ~0.35 dB/km).',
      '1490 nm: Downstream GPON data wavelength (attenuation ~0.25 dB/km).',
      '1550 nm: RF Video / DWDM minimal loss window (attenuation ~0.20 dB/km).',
      '1577 nm: Downstream XGS-PON 10G symmetrical wavelength.',
      '1270 nm: Upstream XGS-PON 10G wavelength.'
    ],
    formula: 'Total Loss (dB) = (Length_km * Attenuation_dB/km) + (N_splices * Loss_splice) + (N_connectors * Loss_connector) + Splitter_Loss + Safety_Margin',
    example: 'For a 10 km fiber link at 1490 nm with 4 fusion splices (0.05 dB each), 2 SC/APC connectors (0.3 dB each), 1:32 PLC splitter (17.0 dB), and 3.0 dB safety margin:\nLoss = (10 * 0.25) + (4 * 0.05) + (2 * 0.3) + 17.0 + 3.0 = 2.5 + 0.2 + 0.6 + 17.0 + 3.0 = 23.3 dB.',
    troubleshooting: [
      'Dirty fiber end-faces are responsible for >80% of optical link failures; clean with lint-free wipes and isopropyl alcohol.',
      'Microbends and tight bend radiuses (<30mm) cause massive attenuation at 1550nm/1625nm.',
      'High reflectance (ORL < -50 dB) from damaged UPC/APC connectors causes optical transmitter saturation.',
      'OTDR dead zones can obscure close-proximity fusion splice defects.'
    ],
    bestPractices: [
      'Use angled polish SC/APC connectors (green) for PON networks to minimize optical return loss.',
      'Perform dual-wavelength bi-directional OTDR testing at 1310 nm and 1550 nm.',
      'Maintain at least 3 dB power margin above ONT receiver sensitivity threshold.'
    ]
  },
  {
    id: 'rf-microwave',
    category: 'RF & Microwave',
    title: 'Microwave Radio Transmission & Fresnel Zone Clearance',
    summary: 'Point-to-point microwave line-of-sight propagation, atmospheric absorption, and fade margin calculation.',
    definition: 'Point-to-point microwave systems operate in licensed bands (6 GHz to 38 GHz) or V/E-bands (60-80 GHz) to deliver high-capacity backhaul between cell towers and network nodes over line-of-sight distances.',
    architecture: 'Baseband Indoor Unit (IDU) -> Coaxial/Fiber IF Cable -> Outdoor Unit (ODU) -> Waveguide -> Parabolic Dish Antenna -> Free Space -> Remote Antenna -> Remote ODU -> Remote IDU.',
    parameters: [
      'EIRP (Equivalent Isotropically Radiated Power): Total RF power radiated by antenna in dBm.',
      'FSPL (Free Space Path Loss): Signal power attenuation through vacuum/air.',
      'Fresnel Zone: Ellipsoidal volume between antennas where obstacles cause destructive phase cancellation.',
      'Fade Margin: Difference between nominal received signal level (RSL) and receiver threshold.'
    ],
    formula: 'FSPL (dB) = 32.44 + 20*log10(f_MHz) + 20*log10(d_km)\n1st Fresnel Radius r(m) = 17.32 * sqrt((d1 * d2) / (f_GHz * (d1 + d2)))',
    example: 'For an 18 GHz microwave link over 5 km: FSPL = 32.44 + 20*log10(18000) + 20*log10(5) = 32.44 + 85.11 + 13.98 = 131.53 dB. Midpoint Fresnel radius = 17.32 * sqrt((2.5 * 2.5) / (18 * 5)) = 4.56 meters. Obstacle clearance required >= 0.6 * 4.56 = 2.74 meters.',
    troubleshooting: [
      'Multipath fading caused by reflections over water bodies or flat ground.',
      'Tower sway during heavy winds causing narrow high-gain antenna beam misalignment.',
      'Heavy rain attenuation in bands above 10 GHz (especially 18 GHz, 23 GHz, and 80 GHz E-Band).',
      'Fresnel zone encroachment from growing vegetation or new construction.'
    ],
    bestPractices: [
      'Ensure at least 60% of the 1st Fresnel zone ellipsoid is 100% unobstructed across the path.',
      'Target a minimum 25 dB fade margin for 99.999% carrier-grade availability in high rain regions.',
      'Implement Adaptive Modulation and Coding (AMC) from QPSK up to 4096-QAM.'
    ]
  }
];

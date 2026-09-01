import React, { useState } from 'react';
import { BookOpen, Search, Layers, Radio, Network, PhoneCall, Zap, Shield, ChevronRight } from 'lucide-react';
import { Badge } from '../components/Badge';

interface DocArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  sections: Array<{ heading: string; content: string }>;
}

const ARTICLES: DocArticle[] = [
  {
    id: 'mpls-architecture',
    category: 'IP/MPLS Core',
    title: 'IP/MPLS Label Switching & L3VPN Architecture',
    summary: 'Comprehensive analysis of RFC 3031 MPLS architecture, LDP label distribution, MP-BGP VPNv4 address families, and Penultimate Hop Popping (PHP).',
    sections: [
      {
        heading: '1. MPLS Forwarding Paradigm',
        content: 'Multiprotocol Label Switching (MPLS) separates routing control planes (OSPF, IS-IS, BGP) from high-speed hardware forwarding planes. Rather than performing Longest Prefix Match (LPM) on 32-bit/128-bit IP headers at every transit hop, ingress Label Edge Routers (LER / PE) encapsulate packets with a 32-bit shim header containing a 20-bit label. Core transit routers (LSR / P) perform O(1) exact-match lookups in their Label Forwarding Information Base (LFIB) and swap labels at wire speed.'
      },
      {
        heading: '2. 2-Tier L3VPN Label Stack (RFC 4364)',
        content: 'In BGP/MPLS IP Virtual Private Networks (L3VPNs), packets traverse the core with a two-label stack. The Outer Label (Transport Label) is distributed by LDP or RSVP-TE to steer traffic across the P-router core towards the egress PE loopback. The Inner Label (VPN / Service Label) is advertised via MP-BGP (AFI 1, SAFI 128) with Route Distinguishers (RD) and Route Targets (RT) to identify the customer VRF instance on the egress PE router.'
      },
      {
        heading: '3. Penultimate Hop Popping (PHP)',
        content: 'To prevent the egress PE router from having to perform two sequential label lookups (first stripping the transport label, then inspecting the VPN label), the egress PE signals an Implicit Null Label (Label 3) via LDP to its upstream P-router neighbor. The penultimate P-router pops the outer transport label before transmitting the packet over the final link, so the egress PE directly receives the packet with only the inner VPN label.'
      }
    ]
  },
  {
    id: 'fiber-optics-gpon',
    category: 'Optical & FTTx',
    title: 'ITU-T G.984 GPON & Power Budget Design',
    summary: 'Engineering principles of Gigabit Passive Optical Networks (GPON), point-to-multipoint optical distribution networks (ODN), optical power loss calculation, and OTDR fault detection.',
    sections: [
      {
        heading: '1. GPON Optical Wavelength Division',
        content: 'GPON utilizes single-fiber bidirectional transmission via WDM: Downstream traffic (OLT to ONT) transmits at 1490 nm continuous broadcast TDM at 2.488 Gbps. Upstream traffic (ONT to OLT) transmits at 1310 nm TDMA burst mode at 1.244 Gbps. Optional RF video overlay operates at 1550 nm, while OTDR testing and monitoring occurs out-of-band at 1625 nm.'
      },
      {
        heading: '2. Optical Loss Calculation (ITU-T G.652)',
        content: 'A robust optical link budget must account for single-mode fiber attenuation (0.35 dB/km @ 1310nm, 0.20 dB/km @ 1550nm), optical splitter insertion loss (3.5 dB for 1:2, 10.5 dB for 1:8, 17.0 dB for 1:32, 20.5 dB for 1:64), connector pairs (0.5 dB/pair), fusion splices (0.1 dB/splice), and a minimum 3.0 dB safety/aging margin.'
      }
    ]
  },
  {
    id: 'rf-microwave-propagation',
    category: 'RF & Wireless',
    title: 'Microwave Line-of-Sight & Fresnel Zone Clearance',
    summary: 'Point-to-point wireless transmission link engineering: Free Space Path Loss (FSPL), 1st Fresnel zone clearance, earth curvature bulge, and fade margins.',
    sections: [
      {
        heading: '1. Free Space Path Loss (FSPL)',
        content: 'FSPL is the attenuation of an electromagnetic wave propagating through vacuum. Calculated as FSPL(dB) = 20*log10(d_km) + 20*log10(f_GHz) + 92.45. Higher carrier frequencies experience exponentially higher free space attenuation and require higher gain directional parabolic dish antennas.'
      },
      {
        heading: '2. Fresnel Zone Radius & Obstacle Clearance',
        content: 'To prevent destructive multi-path phase cancellation, at least 60% of the 1st Fresnel zone ellipsoid radius must remain unobstructed by terrain, buildings, or vegetation. The 1st Fresnel radius at distance d1 from Site A and d2 from Site B is F1(m) = 17.32 * sqrt((d1 * d2) / (f_GHz * d_total)).'
      }
    ]
  },
  {
    id: 'voip-sip-qos',
    category: 'VoIP & Telephony',
    title: 'SIP Trunking, RTP Packetization & Carrier QoS',
    summary: 'Session Initiation Protocol (RFC 3261), RTP audio transport, codec bandwidth dimensioning, DiffServ DSCP marking, and ITU-T Y.1541 carrier SLAs.',
    sections: [
      {
        heading: '1. Voice Protocol Overhead',
        content: 'Real-time Transport Protocol (RTP) introduces 12 bytes of header, encapsulated in UDP (8 bytes), IPv4 (20 bytes), and Ethernet (18 bytes), totaling 58 bytes of overhead per packet. At 20ms packetization (50 PPS), G.711 (64 kbps raw) requires 87.2 kbps of bandwidth per voice channel.'
      },
      {
        heading: '2. Quality of Service (QoS) & Queuing',
        content: 'Voice traffic is marked DSCP 46 (Expedited Forwarding / EF) and assigned to a hardware Strict Priority Queue (Low Latency Queuing / LLQ) to guarantee one-way latency < 150ms, jitter < 30ms, and packet loss < 1% across carrier backbones.'
      }
    ]
  }
];

export const DocumentationView: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<DocArticle>(ARTICLES[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = ARTICLES.filter(art =>
    art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// TELECOM ENGINEERING KNOWLEDGE BASE</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            STANDARDS & ENGINEERING DOCUMENTATION
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Carrier-grade whitepapers, RFC standards, optical loss formulas, RF microwave propagation physics, and VoIP packetization guides.
          </p>
        </div>
      </div>

      {/* Main Grid: Navigation Index (4 cols) + Article View (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Index */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search engineering papers..."
              className="w-full pl-9 pr-4 py-2 bg-[#090912] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-2 pt-2">
            {filteredArticles.map((art) => {
              const isSelected = selectedArticle.id === art.id;
              return (
                <button
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className={`w-full p-4 rounded-xl text-left font-mono transition-all border ${
                    isSelected
                      ? 'bg-purple-950/60 border-purple-500 text-white shadow-md'
                      : 'bg-[#090912] border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">
                    {art.category}
                  </span>
                  <h3 className="font-heading font-bold text-sm text-white mt-1">
                    {art.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {art.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Article Content */}
        <div className="lg:col-span-8 rounded-2xl glass-panel p-8 border border-white/10 space-y-6">
          <div className="pb-4 border-b border-white/10 space-y-2">
            <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
              {selectedArticle.category} &bull; WHITE PAPER
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
              {selectedArticle.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              {selectedArticle.summary}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {selectedArticle.sections.map((sec, i) => (
              <div key={i} className="space-y-2">
                <h3 className="font-heading font-bold text-base text-purple-300 tracking-wide">
                  {sec.heading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed text-justify">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Layers, Network, Radio, ShieldCheck, CheckCircle2, ArrowUpRight, Award } from 'lucide-react';
import { Badge } from '../components/Badge';

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  clientType: string;
  description: string;
  highlights: string[];
  technologies: string[];
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'National IP/MPLS Carrier Core & BGP Peering Overhaul',
    category: 'IP/MPLS Backbone',
    duration: '2023 - 2024',
    clientType: 'Tier-1 Telecom Operator',
    description: 'Architected and deployed a multi-vendor IP/MPLS core modernization using Nokia 7750 SR and Cisco ASR 9000 routers across 6 major regional aggregation hubs.',
    highlights: [
      'Implemented 2-tier L3VPN architecture (RFC 4364) serving 450+ enterprise VPN customers',
      'Configured RSVP-TE Fast Reroute (FRR) sub-50ms failover protection on primary DWDM rings',
      'Migrated full DFZ BGP routing tables to dual route reflectors with BFD fast peering detection'
    ],
    technologies: ['Nokia SR OS', 'Cisco IOS-XR', 'BGP-4', 'MPLS L3VPN', 'RSVP-TE', 'BFD', 'DWDM 100G']
  },
  {
    id: 'proj-2',
    title: 'Nationwide GPON FTTx Fiber Access Network Deployment',
    category: 'Optical & FTTx',
    duration: '2022 - 2023',
    clientType: 'National Broadband Infrastructure',
    description: 'Designed optical distribution network (ODN) topology and GPON power budgets for 35,000+ residential and commercial optical passings.',
    highlights: [
      'Engineered 1:64 and 1:32 optical splitter topologies ensuring < 24.5 dB total channel insertion loss',
      'Deployed Huawei MA5800 OLT chassis with redundant 10GE uplink LAG interfaces',
      'Conducted automated OTDR optical attenuation verification and splice loss certifications'
    ],
    technologies: ['ITU-T G.984 GPON', 'Huawei MA5800', 'ODF / Patch Trays', 'OTDR Testing', 'WDM']
  },
  {
    id: 'proj-3',
    title: 'Microwave Backhaul & Rural LTE BTS Cell Site Rollout',
    category: 'RF & Cellular',
    duration: '2021 - 2022',
    clientType: 'Mobile Network Operator',
    description: 'Dimensioned microwave radio link budgets and -48V DC solar-hybrid power plants for 28 remote rural macro cell sites.',
    highlights: [
      'Engineered 18GHz / 23GHz XPIC microwave radio links with 99.999% ITU-R carrier availability',
      'Conducted 1st Fresnel zone clearance terrain modeling and antenna mast height dimensioning',
      'Sized off-grid solar PV + LiFePO4 battery banks guaranteeing 72-hour continuous autonomy'
    ],
    technologies: ['Ericsson MINI-LINK', '3GPP LTE B3/B20', 'XPIC Radio', 'Solar Hybrid DC', 'IEEE 485']
  },
  {
    id: 'proj-4',
    title: 'Carrier-Grade SIP Trunking & High-Density VoIP PBX',
    category: 'VoIP & Telephony',
    duration: '2020 - 2021',
    clientType: 'Financial Services Enterprise',
    description: 'Engineered high-availability dual-datacenter Asterisk/Kamailio SIP core handling 1,200+ concurrent carrier-grade voice sessions with DSCP EF priority queuing.',
    highlights: [
      'Configured G.711 / G.729 / Opus adaptive transcoding with SBC security perimeter filtering',
      'Enforced DSCP 46 LLQ QoS policies over MPLS CE-PE links eliminating audio jitter and packet loss',
      'Integrated real-time RTCP-XR voice quality MOS telemetry and automated CDR accounting'
    ],
    technologies: ['Asterisk PBX', 'Kamailio SIP Proxy', 'RTP / RTCP', 'DiffServ QoS', 'Wireshark']
  }
];

export const ProjectsView: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// TELECOM ENGINEERING PORTFOLIO</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            ENGINEERING PROJECTS & CARRIER DELIVERIES
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Track record of large-scale telecommunications infrastructure: IP/MPLS core modernization, GPON fiber optical rollouts, and wireless microwave backhauls.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECTS.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl glass-panel p-6 border border-white/10 hover:border-purple-500/40 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                  {proj.category}
                </span>
                <span className="text-xs font-mono text-slate-500">{proj.duration}</span>
              </div>

              <h2 className="font-heading font-bold text-lg text-white">
                {proj.title}
              </h2>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {proj.description}
              </p>

              {/* Highlights */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">
                  KEY ENGINEERING ACCOMPLISHMENTS:
                </span>
                {proj.highlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-sans text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Tags */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
              {proj.technologies.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-[#090912] border border-white/5 text-[10px] font-mono text-slate-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

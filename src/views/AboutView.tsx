import React from 'react';
import { User, Award, ShieldCheck, Mail, Phone, MapPin, Globe, Terminal, Download } from 'lucide-react';
import { Badge } from '../components/Badge';

export const AboutView: React.FC = () => {
  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:RAKOTONIAINA;Tendry;;;
FN:Tendry RAKOTONIAINA
TITLE:Telecommunications & IP/MPLS Network Engineer
TEL;TYPE=CELL,VOICE:+261377695861
EMAIL:tendry.telecom@gmail.com
ADR;TYPE=WORK:;;Antananarivo;Analamanga;;101;Madagascar
NOTE:IP/MPLS Core Routing, GPON Optical Transmission, RF Microwave & Telecom Infrastructure Specialist.
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Tendry_RAKOTONIAINA_Telecom.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// LEAD ENGINEER PROFILE</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            TENDRY RAKOTONIAINA
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Telecommunications & IP Network Engineer &bull; Carrier IP/MPLS Routing, GPON Optical Infrastructure & RF Microwave Transmission.
          </p>
        </div>

        <button
          onClick={handleDownloadVCard}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors shadow-lg"
        >
          <Download className="w-4 h-4" />
          Download vCard Contact
        </button>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Bio & Overview (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-white tracking-tight">
              ENGINEERING MISSION & PHILOSOPHY
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Telecom and network engineer dedicated to designing, automating, and maintaining high-availability carrier backbones, metropolitan fiber optic distribution rings, and wireless transmission links across Madagascar and international service providers.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Tendry Telecom Lab is built to provide practicing telecom engineers, NOC analysts, and transmission specialists with precision calculation tools, RFC-compliant mathematics, and interactive network simulations.
            </p>
          </div>

          {/* Contact Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#090912] border border-white/5 flex items-center gap-3">
              <Phone className="w-4 h-4 text-purple-400" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">PHONE / WHATSAPP</span>
                <a href="tel:+261377695861" className="text-white font-bold hover:text-purple-300">
                  +261 37 76 958 61
                </a>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090912] border border-white/5 flex items-center gap-3">
              <Mail className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">DIRECT EMAIL</span>
                <a href="mailto:tendry.telecom@gmail.com" className="text-white font-bold hover:text-cyan-300">
                  tendry.telecom@gmail.com
                </a>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090912] border border-white/5 flex items-center gap-3">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">LOCATION</span>
                <span className="text-white font-bold">Antananarivo, Madagascar</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090912] border border-white/5 flex items-center gap-3">
              <Globe className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">LANGUAGES</span>
                <span className="text-white font-bold">French, English, Malagasy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Core Technical Competencies (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-sm text-purple-300 uppercase tracking-wider">
              CORE SPECIALIZATIONS
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#090912] border border-white/5">
                <span className="text-white font-bold block mb-1">IP/MPLS Carrier Routing</span>
                <p className="text-[11px] text-slate-400">BGP-4, OSPFv2/v3, IS-IS, L3VPN (RFC 4364), LDP, RSVP-TE Fast Reroute, Segment Routing (SR-MPLS), Nokia SR OS, Cisco IOS-XR.</p>
              </div>

              <div className="p-3 rounded-xl bg-[#090912] border border-white/5">
                <span className="text-white font-bold block mb-1">Fiber Optics & FTTx (GPON)</span>
                <p className="text-[11px] text-slate-400">ITU-T G.984 GPON, OLT Huawei MA5800, Optical Power Budgeting, ODN Splitter topologies (1:32 / 1:64), OTDR trace analysis.</p>
              </div>

              <div className="p-3 rounded-xl bg-[#090912] border border-white/5">
                <span className="text-white font-bold block mb-1">RF Microwave & Cellular 4G/5G</span>
                <p className="text-[11px] text-slate-400">Point-to-point microwave line-of-sight (FSPL, 1st Fresnel zone, fade margins), 3GPP LTE EARFCN, RSRP/RSRQ/SINR field analysis.</p>
              </div>

              <div className="p-3 rounded-xl bg-[#090912] border border-white/5">
                <span className="text-white font-bold block mb-1">VoIP & Telecom Infrastructure</span>
                <p className="text-[11px] text-slate-400">SIP trunking (RFC 3261), Asterisk PBX, DiffServ QoS DSCP EF LLQ, -48V DC battery backup autonomy, 42U rack engineering.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

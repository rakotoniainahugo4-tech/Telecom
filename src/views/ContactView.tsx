import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Download, MessageSquare, Clock } from 'lucide-react';
import { Badge } from '../components/Badge';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

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
            <span>// DIRECT ENGINEERING CONTACT</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            CONNECT WITH TENDRY RAKOTONIAINA
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Inquire about carrier backbone design, IP/MPLS audit, GPON optical network dimensioning, or RF link feasibility studies.
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

      {/* Main Grid: Direct Details + Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Contact Channels (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
              DIRECT CHANNELS
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <a
                href="tel:+261377695861"
                className="p-4 rounded-xl bg-[#090912] hover:bg-[#151522] border border-white/5 hover:border-purple-500/50 flex items-center gap-3 transition-colors block"
              >
                <Phone className="w-5 h-5 text-purple-400" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">PHONE / DIRECT CALL</span>
                  <span className="text-white font-bold text-sm">+261 37 76 958 61</span>
                </div>
              </a>

              <a
                href="mailto:tendry.telecom@gmail.com"
                className="p-4 rounded-xl bg-[#090912] hover:bg-[#151522] border border-white/5 hover:border-cyan-500/50 flex items-center gap-3 transition-colors block"
              >
                <Mail className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">EMAIL ADDRESS</span>
                  <span className="text-white font-bold text-sm">tendry.telecom@gmail.com</span>
                </div>
              </a>

              <div className="p-4 rounded-xl bg-[#090912] border border-white/5 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">ENGINEERING HQ</span>
                  <span className="text-white font-bold text-sm">Antananarivo (101), Madagascar</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#090912] border border-white/5 flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">TIMEZONE</span>
                  <span className="text-white font-bold text-sm">EAT (UTC+3)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-heading font-bold text-base text-white tracking-wider uppercase">
              TRANSMIT TECHNICAL INQUIRY
            </h3>
            <span className="text-[10px] font-mono text-purple-400">STATUS: READY TO RECEIVE</span>
          </div>

          {submitted ? (
            <div className="p-8 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3 font-mono">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-bold text-white font-heading">INQUIRY TRANSMITTED</h4>
              <p className="text-xs text-slate-300">
                Thank you, {name}. Your inquiry has been queued. Tendry will respond to {email} promptly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setSubject('');
                  setMessage('');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase text-[10px] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jean Dupont"
                    className="w-full px-3 py-2.5 bg-[#090912] border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase text-[10px] mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jean@telecom.mg"
                    className="w-full px-3 py-2.5 bg-[#090912] border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase text-[10px] mb-1">Inquiry Subject / Topic</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. IP/MPLS Core Redesign or GPON Budget Review"
                  className="w-full px-3 py-2.5 bg-[#090912] border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase text-[10px] mb-1">Technical Message / Project Scope</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your network requirements, bandwidth expectations, or consultation scope..."
                  className="w-full p-3 bg-[#090912] border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <Send className="w-4 h-4" /> Transmit Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

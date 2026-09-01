import React from 'react';
import { Radio, ShieldCheck, Activity, Terminal, ExternalLink, Cpu, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-white/10 bg-[#050508] relative z-10 text-slate-400 font-mono text-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Identity */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-purple-600 text-white font-bold">
                <Radio className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-lg text-white tracking-wider">
                TENDRY TELECOM LAB
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              "ENGINEERING THE CONNECTION." Professional telecommunications and network engineering platform with real diagnostics, RFC-compliant calculators, and core architectures.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>CORE SYSTEM STATUS: OPERATIONAL</span>
            </div>
          </div>

          {/* Col 2: Engineering Calculators */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-heading font-bold text-xs uppercase tracking-wider text-purple-300">
              Calculators & Design
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/tools/subnet-calculator')} className="hover:text-purple-300 transition-colors">
                  IPv4 Subnet & CIDR
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/fiber-budget')} className="hover:text-purple-300 transition-colors">
                  Fiber Optic Power Budget
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/rf')} className="hover:text-purple-300 transition-colors">
                  RF Microwave Link Budget
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/fresnel')} className="hover:text-purple-300 transition-colors">
                  Fresnel Zone Clearance
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/poe')} className="hover:text-purple-300 transition-colors">
                  PoE Power Budget (802.3bt)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/battery')} className="hover:text-purple-300 transition-colors">
                  Telecom Battery Autonomy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Real Diagnostics & Labs */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-heading font-bold text-xs uppercase tracking-wider text-purple-300">
              Diagnostics & Labs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/tools/speed-test')} className="hover:text-purple-300 transition-colors">
                  Real Network Speed Test
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/ping')} className="hover:text-purple-300 transition-colors">
                  TCP Connect Ping Probe
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/dns')} className="hover:text-purple-300 transition-colors">
                  DNS Recursive Resolver
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools/port-test')} className="hover:text-purple-300 transition-colors">
                  TCP Port Connectivity
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/network/mpls')} className="hover:text-purple-300 transition-colors">
                  IP/MPLS Backbone Lab
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/network/noc')} className="hover:text-purple-300 transition-colors">
                  NOC Operations Center
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Engineer Profile */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-heading font-bold text-xs uppercase tracking-wider text-purple-300">
              Lead Engineer
            </h4>
            <p className="text-xs text-white font-semibold">Tendry RAKOTONIAINA</p>
            <p className="text-xs text-slate-400">Telecommunications & Network Engineer</p>
            <div className="space-y-1.5 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-purple-400" />
                <span>+261 37 76 958 61</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>rakotoniainahugo4@gmail.com</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/contact')}
                className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-colors text-xs"
              >
                Get In Touch &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} TENDRY TELECOM LAB. All engineering formulas RFC-compliant.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SSRF Hardened
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              Real Measurement Guarantee
            </span>
            <span>•</span>
            <button onClick={() => onNavigate('/documentation/commands')} className="hover:text-purple-300">
              Command Manual
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

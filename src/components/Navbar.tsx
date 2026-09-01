import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Menu, 
  X, 
  Wrench, 
  Network, 
  Activity, 
  BookOpen, 
  FolderGit2, 
  User, 
  Mail, 
  Gauge, 
  Share2, 
  Layers, 
  Terminal,
  Signal
} from 'lucide-react';

interface NavbarProps {
  currentPath?: string;
  currentRoute?: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, currentRoute, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'HOME', path: '/', icon: Activity },
    { label: 'TOOLS', path: '/tools', icon: Wrench },
    { label: 'NETWORK LAB', path: '/network/mpls', icon: Network },
    { label: 'TELECOM', path: '/telecom/site', icon: Signal },
    { label: 'NOC', path: '/network/noc', icon: Gauge },
    { label: 'PROJECTS', path: '/projects', icon: FolderGit2 },
    { label: 'DOCS', path: '/documentation', icon: BookOpen },
    { label: 'ABOUT', path: '/about', icon: User },
    { label: 'CONTACT', path: '/contact', icon: Mail }
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (itemPath: string) => {
    const activeRoute = (currentPath || currentRoute || 'home').toLowerCase();
    const target = (itemPath || '').toLowerCase();

    if (target === '/' || target === 'home' || target === '') {
      return activeRoute === '/' || activeRoute === 'home' || activeRoute === '';
    }

    const cleanActive = activeRoute.replace(/^#\/?/, '').replace(/^\//, '');
    const cleanTarget = target.replace(/^\//, '');

    if (cleanActive === cleanTarget) return true;
    if (cleanTarget && cleanActive.startsWith(cleanTarget)) return true;

    // Additional cross-mappings
    if (cleanTarget === 'network/mpls' && (cleanActive === 'mpls-lab' || cleanActive.includes('mpls'))) return true;
    if (cleanTarget === 'telecom/site' && (cleanActive === 'cell-site' || cleanActive.includes('site'))) return true;
    if (cleanTarget === 'network/noc' && (cleanActive === 'noc-dashboard' || cleanActive.includes('noc'))) return true;
    if (cleanTarget === 'documentation' && (cleanActive === 'docs' || cleanActive.includes('doc'))) return true;
    if (cleanTarget === 'tools' && (cleanActive === 'toolbox' || cleanActive.startsWith('tools') || cleanActive.includes('test') || cleanActive.includes('calculator') || cleanActive.includes('budget'))) return true;

    return false;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 pt-3 pb-2 transition-all">
        <div 
          className={`max-w-7xl mx-auto px-4 py-2.5 rounded-2xl border transition-all duration-300 ${
            scrolled 
              ? 'bg-[#090912]/90 backdrop-blur-xl border-purple-500/20 shadow-2xl shadow-purple-950/40' 
              : 'bg-[#0e0e17]/75 backdrop-blur-lg border-white/10'
          } flex items-center justify-between`}
        >
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 border border-purple-400/40 text-white shadow-lg shadow-purple-900/50 group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090912]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-base tracking-wider text-white">
                  TENDRY
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  LAB
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 tracking-tight hidden sm:block">
                TELECOM & NETWORK ENGINEERING
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    active
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-950'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-purple-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleNavClick('/tools')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-mono font-semibold tracking-wider uppercase border border-purple-400/30 shadow-lg shadow-purple-900/40 hover:shadow-purple-700/50 hover:scale-[1.02] transition-all"
            >
              <Wrench className="w-3.5 h-3.5" />
              OPEN TOOLBOX
            </button>
            <button
              onClick={() => handleNavClick('/network/topology')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-mono font-semibold tracking-wider border border-white/10 hover:border-cyan-500/40 transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              TOPOLOGY
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-purple-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/85 backdrop-blur-xl flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-600 text-white">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-heading font-extrabold text-white">TENDRY TELECOM LAB</span>
                  <p className="text-[10px] font-mono text-purple-300">ENGINEERING THE CONNECTION.</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Links List */}
            <div className="grid grid-cols-1 gap-1.5 py-6">
              {navItems.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-mono font-medium transition-all ${
                      active
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-purple-400' : 'text-slate-400'}`} />
                      {item.label}
                    </div>
                    {active && <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Footer CTAs */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <button
              onClick={() => handleNavClick('/tools')}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold tracking-wider uppercase text-center shadow-lg shadow-purple-900/50"
            >
              EXPLORE TOOLBOX (20+ TOOLS)
            </button>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                SYSTEM ONLINE
              </span>
              <span>v2.4 CARRIER EDITION</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

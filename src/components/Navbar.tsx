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
  Signal,
  LogIn,
  LogOut,
  LayoutDashboard,
  Award,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  currentPath?: string;
  currentRoute?: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, currentRoute, onNavigate }) => {
  const { user, profile, signOut, isConfigured } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
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
    ...(user ? [
      { label: 'DASHBOARD', path: '/dashboard', icon: LayoutDashboard },
      { label: 'APPRENTISSAGE', path: '/progress', icon: Award }
    ] : []),
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
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await signOut();
    setUserDropdownOpen(false);
    onNavigate('home');
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
    if (cleanTarget === 'dashboard' && cleanActive === 'dashboard') return true;
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
              ? 'bg-[#0a101d]/95 backdrop-blur-xl border-cyan-500/25 shadow-2xl shadow-cyan-950/50' 
              : 'bg-[#0b1424]/85 backdrop-blur-lg border-cyan-500/15'
          } flex items-center justify-between`}
        >
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 border border-cyan-300/50 text-slate-950 shadow-lg shadow-cyan-950/60 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
              <Radio className="w-5 h-5 animate-pulse text-slate-950 stroke-[2.5]" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#070c14]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-base tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                  TENDRY
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
                  LAB
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 tracking-tight hidden sm:block">
                TELECOM & NETWORK ENGINEERING
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    active
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-950/60'
                      : 'text-slate-300 hover:text-white hover:bg-cyan-950/30 hover:border-cyan-500/20 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Auth & Actions */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-white text-xs font-mono transition-all hover:border-cyan-400/70"
                >
                  <div className="w-6 h-6 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center text-[11px] font-bold border border-cyan-400/40">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                  <span className="font-bold max-w-[100px] truncate text-slate-100">
                    {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {profile?.role || 'STUDENT'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl glass-panel-glow border border-cyan-500/40 py-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-cyan-500/20">
                      <p className="text-xs font-bold font-heading text-white truncate">{profile?.full_name || 'Ingénieur'}</p>
                      <p className="text-[10px] font-mono text-cyan-300 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNavClick('/dashboard')}
                        className="w-full text-left px-4 py-2 text-xs font-mono text-slate-200 hover:bg-cyan-500/15 hover:text-cyan-300 flex items-center gap-2 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                        Tableau de Bord
                      </button>

                      <button
                        onClick={() => handleNavClick('/progress')}
                        className="w-full text-left px-4 py-2 text-xs font-mono text-slate-200 hover:bg-cyan-500/15 hover:text-cyan-300 flex items-center gap-2 transition-colors"
                      >
                        <Award className="w-4 h-4 text-cyan-400" />
                        Mon Apprentissage
                      </button>

                      <button
                        onClick={() => handleNavClick('/profile')}
                        className="w-full text-left px-4 py-2 text-xs font-mono text-slate-200 hover:bg-cyan-500/15 hover:text-cyan-300 flex items-center gap-2 transition-colors"
                      >
                        <User className="w-4 h-4 text-cyan-400" />
                        Mon Profil
                      </button>
                    </div>

                    <div className="pt-1 border-t border-cyan-500/20">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-xs font-mono text-rose-300 hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        Se Déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('/login')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-bold transition-all shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Connexion
                </button>
                <button
                  onClick={() => handleNavClick('/register')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-950/60 border border-cyan-300/40"
                >
                  Inscription
                </button>
              </div>
            )}

            <button
              onClick={() => handleNavClick('/tools')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-mono font-bold tracking-wider uppercase border border-cyan-300/50 shadow-lg shadow-cyan-950/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all"
            >
              <Wrench className="w-3.5 h-3.5 stroke-[2.5]" />
              TOOLBOX
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden bg-[#070c14]/95 backdrop-blur-xl flex flex-col justify-between p-6 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-bold">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-heading font-extrabold text-white">TENDRY TELECOM LAB</span>
                  <p className="text-[10px] font-mono text-cyan-300">LEARN • PRACTICE • ENGINEER</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Auth status on mobile */}
            {user ? (
              <div className="my-4 p-3.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center text-xs font-bold border border-cyan-400/40 shrink-0">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{profile?.full_name || user.email}</p>
                    <p className="text-[10px] font-mono text-cyan-300">Rôle : {profile?.role || 'STUDENT'}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-2.5 py-1 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300 text-[11px] font-mono"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 my-4">
                <button
                  onClick={() => handleNavClick('/login')}
                  className="py-2.5 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold text-center"
                >
                  Connexion
                </button>
                <button
                  onClick={() => handleNavClick('/register')}
                  className="py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider text-center shadow-lg shadow-cyan-950/60"
                >
                  Inscription
                </button>
              </div>
            )}

            {/* Links List */}
            <div className="grid grid-cols-1 gap-1.5 py-2">
              {navItems.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-mono font-medium transition-all ${
                      active
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm shadow-cyan-950/50'
                        : 'text-slate-300 hover:bg-cyan-950/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                      {item.label}
                    </div>
                    {active && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Footer CTAs */}
          <div className="space-y-3 pt-4 border-t border-cyan-500/20">
            <button
              onClick={() => handleNavClick('/tools')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-mono font-bold tracking-wider uppercase text-center shadow-lg shadow-cyan-950/60"
            >
              EXPLORE TOOLBOX (20+ TOOLS)
            </button>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                SUPABASE AUTH READY
              </span>
              <span>v3.0 TELECOM LAB</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


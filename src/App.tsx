import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// All View Components
import { HomeView } from './views/HomeView';
import { ToolboxView } from './views/ToolboxView';
import { SpeedTestView } from './views/SpeedTestView';
import { PingTestView } from './views/PingTestView';
import { DnsLookupView } from './views/DnsLookupView';
import { PortTestView } from './views/PortTestView';
import { HttpTestView } from './views/HttpTestView';
import { TracerouteView } from './views/TracerouteView';
import { MtuTestView } from './views/MtuTestView';
import { SubnetCalculatorView } from './views/SubnetCalculatorView';
import { RfEngineeringView } from './views/RfEngineeringView';
import { FiberBudgetView } from './views/FiberBudgetView';
import { FresnelZoneView } from './views/FresnelZoneView';
import { PowerDbmView } from './views/PowerDbmView';
import { VoipBandwidthView } from './views/VoipBandwidthView';
import { MobileLteView } from './views/MobileLteView';
import { PoeCalculatorView } from './views/PoeCalculatorView';
import { BatteryAutonomyView } from './views/BatteryAutonomyView';
import { RackCalculatorView } from './views/RackCalculatorView';
import { SiteEngineeringView } from './views/SiteEngineeringView';
import { Ipv6CalculatorView } from './views/Ipv6CalculatorView';
import { RouteSummarizerView } from './views/RouteSummarizerView';
import { IpConvertersView } from './views/IpConvertersView';
import { QosView } from './views/QosView';
import { LpmView } from './views/LpmView';
import { MplsLabView } from './views/MplsLabView';
import { NetworkTopologyView } from './views/NetworkTopologyView';
import { NocDashboardView } from './views/NocDashboardView';
import { TroubleshootingView } from './views/TroubleshootingView';
import { CommandReferenceView } from './views/CommandReferenceView';
import { DocumentationView } from './views/DocumentationView';
import { ProjectsView } from './views/ProjectsView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';

// Auth & Member Views
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { ResetPasswordView } from './views/ResetPasswordView';
import { ProfileView } from './views/ProfileView';
import { DashboardView } from './views/DashboardView';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');

  const normalizeRoute = (r: string): string => {
    const clean = (r || '').replace(/^#\/?/, '').replace(/^\//, '').toLowerCase().trim();
    switch (clean) {
      case '':
      case 'home':
        return 'home';
      case 'dashboard':
        return 'dashboard';
      case 'profile':
        return 'profile';
      case 'login':
      case 'signin':
        return 'login';
      case 'register':
      case 'signup':
        return 'register';
      case 'reset-password':
      case 'forgot-password':
        return 'reset-password';
      case 'tools':
      case 'toolbox':
        return 'toolbox';
      case 'tools/speed-test':
      case 'speed-test':
        return 'speed-test';
      case 'tools/ping':
      case 'ping-test':
      case 'ping':
        return 'ping-test';
      case 'tools/dns':
      case 'dns-lookup':
      case 'dns':
        return 'dns-lookup';
      case 'tools/port-test':
      case 'port-test':
        return 'port-test';
      case 'tools/http-test':
      case 'http-test':
        return 'http-test';
      case 'tools/traceroute':
      case 'traceroute':
        return 'traceroute';
      case 'tools/mtu-test':
      case 'mtu-mss':
      case 'mtu-test':
        return 'mtu-mss';
      case 'tools/subnet-calculator':
      case 'subnet-ipv4':
      case 'subnet-calculator':
        return 'subnet-ipv4';
      case 'tools/rf':
      case 'rf-link-budget':
      case 'rf':
        return 'rf-link-budget';
      case 'tools/fiber-budget':
      case 'fiber-budget':
        return 'fiber-budget';
      case 'tools/fresnel':
      case 'fresnel-zone':
      case 'fresnel':
        return 'fresnel-zone';
      case 'tools/dbm':
      case 'power-converter':
      case 'dbm':
        return 'power-converter';
      case 'telecom/voip':
      case 'voip-bandwidth':
      case 'voip':
        return 'voip-bandwidth';
      case 'telecom/mobile':
      case 'lte-earfcn':
      case 'mobile':
        return 'lte-earfcn';
      case 'tools/poe':
      case 'poe-budget':
      case 'poe':
        return 'poe-budget';
      case 'tools/battery':
      case 'battery-autonomy':
      case 'battery':
        return 'battery-autonomy';
      case 'tools/rack':
      case 'rack-builder':
      case 'rack':
        return 'rack-builder';
      case 'telecom/site':
      case 'telecom/transmission':
      case 'telecom/drive-test':
      case 'telecom/srs':
      case 'transmission':
      case 'drive-test':
      case 'srs':
      case 'cell-site':
      case 'site':
        return 'cell-site';
      case 'tools/ipv6-calculator':
      case 'ipv6-calculator':
        return 'ipv6-calculator';
      case 'tools/route-summarizer':
      case 'route-summarizer':
        return 'route-summarizer';
      case 'tools/converters':
      case 'ip-converters':
      case 'converters':
        return 'ip-converters';
      case 'tools/qos':
      case 'qos-matrix':
      case 'qos':
        return 'qos-matrix';
      case 'tools/lpm':
      case 'lpm-simulator':
      case 'lpm':
        return 'lpm-simulator';
      case 'network/mpls':
      case 'mpls-lab':
      case 'mpls':
        return 'mpls-lab';
      case 'network/topology':
      case 'network-topology':
      case 'topology':
        return 'network-topology';
      case 'network/noc':
      case 'noc-dashboard':
      case 'noc':
        return 'noc-dashboard';
      case 'tools/troubleshooting':
      case 'troubleshooting':
        return 'troubleshooting';
      case 'commands':
        return 'commands';
      case 'documentation':
      case 'docs':
        return 'docs';
      case 'projects':
        return 'projects';
      case 'about':
        return 'about';
      case 'contact':
        return 'contact';
      default:
        return clean;
    }
  };

  // Handle URL hash changes or internal navigations
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setCurrentRoute(normalizeRoute(hash));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    const normalized = normalizeRoute(route);
    window.location.hash = normalized;
    setCurrentRoute(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentView = () => {
    const active = normalizeRoute(currentRoute);
    switch (active) {
      case 'home':
        return <HomeView onNavigate={navigate} />;
      case 'login':
        return <LoginView onNavigate={navigate} />;
      case 'register':
        return <RegisterView onNavigate={navigate} />;
      case 'reset-password':
        return <ResetPasswordView onNavigate={navigate} />;
      case 'profile':
        return (
          <ProtectedRoute onNavigate={navigate}>
            <ProfileView onNavigate={navigate} />
          </ProtectedRoute>
        );
      case 'dashboard':
        return (
          <ProtectedRoute onNavigate={navigate}>
            <DashboardView onNavigate={navigate} />
          </ProtectedRoute>
        );
      case 'toolbox':
        return <ToolboxView onNavigate={navigate} />;
      case 'speed-test':
        return <SpeedTestView />;
      case 'ping-test':
        return <PingTestView />;
      case 'dns-lookup':
        return <DnsLookupView />;
      case 'port-test':
        return <PortTestView />;
      case 'http-test':
        return <HttpTestView />;
      case 'traceroute':
        return <TracerouteView />;
      case 'mtu-mss':
        return <MtuTestView />;
      case 'subnet-ipv4':
        return <SubnetCalculatorView />;
      case 'rf-link-budget':
        return <RfEngineeringView />;
      case 'fiber-budget':
        return <FiberBudgetView />;
      case 'fresnel-zone':
        return <FresnelZoneView />;
      case 'power-converter':
        return <PowerDbmView />;
      case 'voip-bandwidth':
        return <VoipBandwidthView />;
      case 'lte-earfcn':
        return <MobileLteView />;
      case 'poe-budget':
        return <PoeCalculatorView />;
      case 'battery-autonomy':
        return <BatteryAutonomyView />;
      case 'rack-builder':
        return <RackCalculatorView />;
      case 'cell-site':
        return <SiteEngineeringView />;
      case 'ipv6-calculator':
        return <Ipv6CalculatorView />;
      case 'route-summarizer':
        return <RouteSummarizerView />;
      case 'ip-converters':
        return <IpConvertersView />;
      case 'qos-matrix':
        return <QosView />;
      case 'lpm-simulator':
        return <LpmView />;
      case 'mpls-lab':
        return <MplsLabView />;
      case 'network-topology':
        return <NetworkTopologyView />;
      case 'noc-dashboard':
        return <NocDashboardView />;
      case 'troubleshooting':
        return <TroubleshootingView onNavigateToTool={navigate} />;
      case 'commands':
        return <CommandReferenceView />;
      case 'docs':
        return <DocumentationView />;
      case 'projects':
        return <ProjectsView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      default:
        return <HomeView onNavigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#050508] telecom-grid flex flex-col text-slate-100 selection:bg-purple-600 selection:text-white">
        <Navbar currentRoute={currentRoute} currentPath={currentRoute} onNavigate={navigate} />

        <main className="flex-1">
          {renderCurrentView()}
        </main>

        <Footer onNavigate={navigate} />
      </div>
    </AuthProvider>
  );
}


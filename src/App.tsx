import React, { useState, useEffect } from 'react';
import { GlobalDashboard } from './views/GlobalDashboard';
import { IAMManager } from './views/IAMManager';
import { ContainerManager } from './views/ContainerManager';
import { NetworkManager } from './views/NetworkManager';
import { VaultManager } from './views/VaultManager';
import { WarpManager } from './views/WarpManager';
import { GitOpsManager } from './views/GitOpsManager';
import { TunnelVision } from './views/TunnelVision';
import { GhostProtocol } from './views/GhostProtocol';
import { AIDoctor } from './views/AIDoctor';
import { BlueprintsMarketplace } from './views/BlueprintsMarketplace';
import { SettingsManager } from './views/SettingsManager';
import { ThemeManager } from './views/ThemeManager';
import { InfinityCanvas } from './views/InfinityCanvas';
import { ChronosTaskScheduler } from './views/ChronosTaskScheduler';
import { MeshManager } from './views/MeshManager';
import { AuditBlackbox } from './views/AuditBlackbox';
import { DeepTraceAPM } from './views/DeepTraceAPM';
import { HypervisorManager } from './views/HypervisorManager';
import { NOCMode } from './views/NOCMode';
import { FinOpsManager } from './views/FinOpsManager';
import { CredentialsManager } from './views/CredentialsManager';
import ProfileManager from './views/ProfileManager';
import { PresenceProvider } from './contexts/PresenceContext';
import { TourProvider, useTour } from './contexts/TourContext';
import { TourOverlay } from './components/TourOverlay';
import { 
  LayoutDashboard, 
  Layers, 
  Shield, 
  Box, 
  Network, 
  Lock, 
  Settings, 
  Bell, 
  User,
  Menu,
  ChevronLeft,
  Zap as ZapIcon,
  History,
  GitBranch,
  Palette,
  Stethoscope,
  Library,
  Calendar,
  ShieldAlert,
  Activity,
  Monitor,
  TrendingDown,
  Compass
} from 'lucide-react';

type ViewType = 'dashboard' | 'canvas' | 'iam' | 'orchestrator' | 'networking' | 'vault' | 'warp' | 'gitops' | 'tunnels' | 'ghost' | 'aidoctor' | 'blueprints' | 'chronos' | 'mesh' | 'audit' | 'apm' | 'hypervisor' | 'noc' | 'finops' | 'theme' | 'settings' | 'credentials' | 'notifications' | 'profile';

const NavItem: React.FC<{ 
  view: ViewType; 
  activeView: ViewType; 
  setActiveView: (view: ViewType) => void; 
  icon: React.ReactNode; 
  label: string;
  isMenuOpen: boolean;
  id?: string;
}> = ({ view, activeView, setActiveView, icon, label, isMenuOpen, id }) => (
  <button 
    id={id}
    onClick={() => setActiveView(view)}
    className={`h-10 rounded flex items-center transition-all group relative mx-auto ${
      isMenuOpen ? 'w-full px-4 gap-3' : 'w-12 justify-center'
    } ${
      activeView === view ? 'bg-primary text-primary-foreground shadow-[0_0_10px_var(--primary)] shadow-primary/20' : 'text-brand-text/40 hover:text-brand-text/80 hover:bg-brand-text/5'
    }`}
    title={isMenuOpen ? undefined : label}
  >
    <div className="shrink-0">{icon}</div>
    {isMenuOpen && (
      <span className="text-[11px] font-bold uppercase tracking-wider truncate">
        {label}
      </span>
    )}
    {!isMenuOpen && (
      <div className="absolute left-16 px-2 py-1 bg-brand-sidebar text-[10px] font-bold uppercase rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-brand-border text-brand-text">
        {label}
      </div>
    )}
  </button>
);

const AppWrapper: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { startTour } = useTour();

  useEffect(() => {
    const handleNavigate = (e: any) => {
      setActiveView(e.detail as ViewType);
    };
    window.addEventListener('tour-navigate', handleNavigate);
    return () => window.removeEventListener('tour-navigate', handleNavigate);
  }, []);

  const ActiveViewComponent = () => {
    switch (activeView) {
      case 'dashboard': return <GlobalDashboard />;
      case 'canvas': return <InfinityCanvas />;
      case 'iam': return <IAMManager />;
      case 'orchestrator': return <ContainerManager />;
      case 'networking': return <NetworkManager />;
      case 'vault': return <VaultManager />;
      case 'warp': return <WarpManager />;
      case 'gitops': return <GitOpsManager />;
      case 'tunnels': return <TunnelVision />;
      case 'ghost': return <GhostProtocol />;
      case 'aidoctor': return <AIDoctor />;
      case 'blueprints': return <BlueprintsMarketplace />;
      case 'chronos': return <ChronosTaskScheduler />;
      case 'mesh': return <MeshManager />;
      case 'audit': return <AuditBlackbox />;
      case 'apm': return <DeepTraceAPM />;
      case 'hypervisor': return <HypervisorManager />;
      case 'noc': return <NOCMode />;
      case 'finops': return <FinOpsManager />;
      case 'settings': return <SettingsManager />;
      case 'credentials': return <CredentialsManager />;
      case 'profile': return <ProfileManager />;
      case 'theme': return <ThemeManager />;
      default: return (
        <div className="flex-1 flex flex-col bg-brand-bg">
          <header className="h-16 border-b border-brand-border flex items-center px-8">
            <h1 className="font-serif italic text-xl tracking-tight capitalize text-brand-text">{activeView}</h1>
          </header>
          <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
            <div className="max-w-2xl">
              <div className="bg-brand-sidebar border border-brand-border rounded-lg p-8">
                <h2 className="text-lg font-medium capitalize text-brand-text">{activeView} Configuration</h2>
                <p className="text-xs text-brand-text/40 uppercase tracking-widest mb-8">System Management Interface</p>
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="pb-6 border-b border-brand-text/5 last:border-0 last:pb-0">
                      <div className="h-2 w-24 bg-brand-text/10 rounded mb-2" />
                      <div className="h-4 w-full bg-brand-text/5 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text font-sans overflow-hidden transition-colors duration-500">
      {/* Left Navigation Sidebar */}
      {activeView !== 'noc' && (
        <aside className={`bg-brand-sidebar border-r border-brand-border flex flex-col transition-all duration-300 ease-in-out relative z-30 ${isMenuOpen ? 'w-64' : 'w-20'}`}>
          {/* Logo and Toggle Header */}
          <div className={`flex items-center h-16 border-b border-brand-border shrink-0 ${isMenuOpen ? 'justify-between px-4' : 'justify-center'}`}>
            {isMenuOpen && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-emerald-600 rounded flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                  <ZapIcon size={16} className="fill-current" />
                </div>
                <span className="font-bold text-xs tracking-tighter uppercase">BEXUS OS</span>
              </div>
            )}
            {!isMenuOpen && (
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-emerald-600 rounded flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                <ZapIcon size={16} className="fill-current" />
              </div>
            )}
            
            {isMenuOpen && (
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 hover:bg-brand-text/10 rounded text-brand-text/40 hover:text-primary transition-all"
              >
                <ChevronLeft size={16} />
              </button>
            )}
          </div>

          {!isMenuOpen && (
            <div className="flex justify-center py-4 border-b border-brand-border shrink-0">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-1.5 hover:bg-brand-text/10 rounded text-brand-text/40 hover:text-primary transition-all"
              >
                <Menu size={16} />
              </button>
            </div>
          )}

          {/* Scrollable Navigation Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-4 px-2 space-y-1">
            <NavItem id="nav-dashboard" view="dashboard" activeView={activeView} setActiveView={setActiveView} icon={<LayoutDashboard size={18} />} label="Dashboard" isMenuOpen={isMenuOpen} />
            <NavItem id="nav-canvas" view="canvas" activeView={activeView} setActiveView={setActiveView} icon={<Layers size={18} />} label="Infinity Canvas" isMenuOpen={isMenuOpen} />
            
            <div className="py-2">
              <div className={`h-px bg-brand-border transition-all ${isMenuOpen ? 'w-full' : 'w-8 mx-auto'}`} />
              {isMenuOpen && <span className="text-[9px] font-bold text-brand-text/30 uppercase tracking-widest px-2 mt-2 block">Infrastructure</span>}
            </div>

            <NavItem id="nav-iam" view="iam" activeView={activeView} setActiveView={setActiveView} icon={<Shield size={18} />} label="Gatekeeper" isMenuOpen={isMenuOpen} />
            <NavItem id="nav-orchestrator" view="orchestrator" activeView={activeView} setActiveView={setActiveView} icon={<Box size={18} />} label="Orchestrator" isMenuOpen={isMenuOpen} />
            <NavItem id="nav-networking" view="networking" activeView={activeView} setActiveView={setActiveView} icon={<Network size={18} />} label="Traffic Controller" isMenuOpen={isMenuOpen} />
            <NavItem view="vault" activeView={activeView} setActiveView={setActiveView} icon={<Lock size={18} />} label="Vault" isMenuOpen={isMenuOpen} />
            <NavItem view="warp" activeView={activeView} setActiveView={setActiveView} icon={<History size={18} />} label="Warp System" isMenuOpen={isMenuOpen} />
            <NavItem view="gitops" activeView={activeView} setActiveView={setActiveView} icon={<GitBranch size={18} />} label="Git Ops" isMenuOpen={isMenuOpen} />
            <NavItem view="tunnels" activeView={activeView} setActiveView={setActiveView} icon={<ZapIcon size={18} />} label="Tunnel Vision" isMenuOpen={isMenuOpen} />
            <NavItem view="ghost" activeView={activeView} setActiveView={setActiveView} icon={<Shield size={18} />} label="Ghost Protocol" isMenuOpen={isMenuOpen} />
            <NavItem view="aidoctor" activeView={activeView} setActiveView={setActiveView} icon={<Stethoscope size={18} />} label="AI Doctor" isMenuOpen={isMenuOpen} />
            <NavItem view="blueprints" activeView={activeView} setActiveView={setActiveView} icon={<Library size={18} />} label="Blueprints" isMenuOpen={isMenuOpen} />
            
            <div className="py-2">
              <div className={`h-px bg-brand-border transition-all ${isMenuOpen ? 'w-full' : 'w-8 mx-auto'}`} />
              {isMenuOpen && <span className="text-[9px] font-bold text-brand-text/30 uppercase tracking-widest px-2 mt-2 block">Observability</span>}
            </div>

            <NavItem id="nav-chronos" view="chronos" activeView={activeView} setActiveView={setActiveView} icon={<Calendar size={18} />} label="Chronos" isMenuOpen={isMenuOpen} />
            <NavItem id="nav-mesh" view="mesh" activeView={activeView} setActiveView={setActiveView} icon={<Network size={18} />} label="Mesh" isMenuOpen={isMenuOpen} />
            <NavItem id="nav-audit" view="audit" activeView={activeView} setActiveView={setActiveView} icon={<ShieldAlert size={18} />} label="Audit Blackbox" isMenuOpen={isMenuOpen} />
            <NavItem id="nav-apm" view="apm" activeView={activeView} setActiveView={setActiveView} icon={<Activity size={18} />} label="Deep Trace APM" isMenuOpen={isMenuOpen} />
            <NavItem id="nav-hypervisor" view="hypervisor" activeView={activeView} setActiveView={setActiveView} icon={<Monitor size={18} />} label="Hypervisor VM" isMenuOpen={isMenuOpen} />
            <NavItem id="nav-noc" view="noc" activeView={activeView} setActiveView={setActiveView} icon={<ZapIcon size={18} />} label="NOC Mode" isMenuOpen={isMenuOpen} />
            <NavItem id="nav-finops" view="finops" activeView={activeView} setActiveView={setActiveView} icon={<TrendingDown size={18} />} label="FinOps" isMenuOpen={isMenuOpen} />
            
            <div className="py-2">
              <div className={`h-px bg-brand-border transition-all ${isMenuOpen ? 'w-full' : 'w-8 mx-auto'}`} />
            </div>

            <NavItem id="nav-theme" view="theme" activeView={activeView} setActiveView={setActiveView} icon={<Palette size={18} />} label="Chameleon" isMenuOpen={isMenuOpen} />
            <NavItem id="nav-credentials" view="credentials" activeView={activeView} setActiveView={setActiveView} icon={<Lock size={18} />} label="Integrations" isMenuOpen={isMenuOpen} />
            <NavItem id="nav-settings" view="settings" activeView={activeView} setActiveView={setActiveView} icon={<Settings size={18} />} label="Settings" isMenuOpen={isMenuOpen} />
          </div>

          {/* Bottom Profile Area */}
          <div className="p-4 border-t border-brand-border shrink-0">
            <button 
              onClick={() => setActiveView('profile')}
              className={`flex items-center gap-3 w-full p-2 rounded hover:bg-brand-text/5 transition-all ${isMenuOpen ? '' : 'justify-center'}`}
            >
              <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                AD
              </div>
              {isMenuOpen && (
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold truncate">Admin Session</div>
                  <div className="text-[8px] font-mono text-brand-text/40 truncate uppercase tracking-tighter">belghalimohammed0@gmail.com</div>
                </div>
              )}
            </button>
          </div>
        </aside>
      )}

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Global Header with Tour Button */}
        {activeView !== 'noc' && (
          <header className="h-16 border-b border-brand-border bg-brand-sidebar flex items-center justify-between px-8 z-20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">System Pulse: Healthy</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={startTour}
                className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase rounded-full hover:bg-primary hover:text-primary-foreground transition-all group relative overflow-hidden"
              >
                <Compass size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                Take the Tour
                <div className="absolute inset-0 bg-primary/20 animate-pulse pointer-events-none" />
              </button>
              <div className="h-4 w-px bg-brand-border" />
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-brand-text">Admin Session</div>
                  <div className="text-[8px] font-mono text-brand-text/40 tracking-tighter uppercase">belghalimohammed0@gmail.com</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-brand-text/5 border border-brand-border flex items-center justify-center text-[10px] font-bold text-primary">
                  AD
                </div>
              </div>
            </div>
          </header>
        )}
        <ActiveViewComponent />
      </div>
      <TourOverlay />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PresenceProvider>
      <TourProvider onNavigate={(route) => {
        window.dispatchEvent(new CustomEvent('tour-navigate', { detail: route }));
      }}>
        <AppWrapper />
      </TourProvider>
    </PresenceProvider>
  );
};

export default App;

const Zap: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

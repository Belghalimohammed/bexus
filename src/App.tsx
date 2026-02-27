import React, { useState } from 'react';
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
  Library
} from 'lucide-react';

type ViewType = 'dashboard' | 'canvas' | 'iam' | 'orchestrator' | 'networking' | 'vault' | 'warp' | 'gitops' | 'tunnels' | 'ghost' | 'aidoctor' | 'blueprints' | 'theme' | 'settings' | 'notifications' | 'profile';

const NavItem: React.FC<{ 
  view: ViewType; 
  activeView: ViewType; 
  setActiveView: (view: ViewType) => void; 
  icon: React.ReactNode; 
  label: string;
  isMenuOpen: boolean;
}> = ({ view, activeView, setActiveView, icon, label, isMenuOpen }) => (
  <button 
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

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      case 'settings': return <SettingsManager />;
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
      <div className={`bg-brand-sidebar border-r border-brand-border flex flex-col items-center py-6 transition-all duration-300 ease-in-out relative ${isMenuOpen ? 'w-64 px-4' : 'w-20'}`}>
        <div className={`flex items-center w-full mb-10 ${isMenuOpen ? 'justify-between px-2' : 'flex-col gap-6 justify-center'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-600 rounded-lg flex items-center justify-center text-primary-foreground shadow-[0_0_15px_var(--primary)] shadow-primary/30 shrink-0 transition-all">
            <Zap size={20} className="fill-current" />
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 hover:bg-brand-text/10 rounded-lg text-brand-text/40 hover:text-primary transition-all border border-brand-border bg-brand-text/5 shadow-inner ${!isMenuOpen ? 'w-10 h-10 flex items-center justify-center' : ''}`}
            title={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <NavItem view="dashboard" activeView={activeView} setActiveView={setActiveView} icon={<LayoutDashboard size={20} />} label="Command Center" isMenuOpen={isMenuOpen} />
          <NavItem view="canvas" activeView={activeView} setActiveView={setActiveView} icon={<Layers size={20} />} label="Infinity Canvas" isMenuOpen={isMenuOpen} />
          <div className={`h-px bg-brand-border my-2 transition-all ${isMenuOpen ? 'w-full' : 'w-10 mx-auto'}`} />
          <NavItem view="iam" activeView={activeView} setActiveView={setActiveView} icon={<Shield size={20} />} label="Gatekeeper" isMenuOpen={isMenuOpen} />
          <NavItem view="orchestrator" activeView={activeView} setActiveView={setActiveView} icon={<Box size={20} />} label="Orchestrator" isMenuOpen={isMenuOpen} />
          <NavItem view="networking" activeView={activeView} setActiveView={setActiveView} icon={<Network size={20} />} label="Traffic Controller" isMenuOpen={isMenuOpen} />
          <NavItem view="vault" activeView={activeView} setActiveView={setActiveView} icon={<Lock size={20} />} label="Vault" isMenuOpen={isMenuOpen} />
          <NavItem view="warp" activeView={activeView} setActiveView={setActiveView} icon={<History size={20} />} label="Warp System" isMenuOpen={isMenuOpen} />
          <NavItem view="gitops" activeView={activeView} setActiveView={setActiveView} icon={<GitBranch size={20} />} label="Git Ops" isMenuOpen={isMenuOpen} />
          <NavItem view="tunnels" activeView={activeView} setActiveView={setActiveView} icon={<ZapIcon size={20} />} label="Tunnel Vision" isMenuOpen={isMenuOpen} />
          <NavItem view="ghost" activeView={activeView} setActiveView={setActiveView} icon={<Shield size={20} />} label="Ghost Protocol" isMenuOpen={isMenuOpen} />
          <NavItem view="aidoctor" activeView={activeView} setActiveView={setActiveView} icon={<Stethoscope size={20} />} label="AI Doctor" isMenuOpen={isMenuOpen} />
          <NavItem view="blueprints" activeView={activeView} setActiveView={setActiveView} icon={<Library size={20} />} label="Blueprints" isMenuOpen={isMenuOpen} />
          <div className={`h-px bg-brand-border my-2 transition-all ${isMenuOpen ? 'w-full' : 'w-10 mx-auto'}`} />
          <NavItem view="theme" activeView={activeView} setActiveView={setActiveView} icon={<Palette size={20} />} label="Chameleon" isMenuOpen={isMenuOpen} />
        </div>

        <div className="mt-auto flex flex-col gap-4 w-full pt-6 border-t border-brand-border">
          <button 
            onClick={() => setActiveView('notifications')}
            className={`flex items-center h-10 transition-all mx-auto ${isMenuOpen ? 'w-full px-4 gap-3' : 'w-12 justify-center'} ${activeView === 'notifications' ? 'text-primary' : 'text-brand-text/40 hover:text-brand-text/80 hover:bg-brand-text/5 rounded'}`}
          >
            <Bell size={20} />
            {isMenuOpen && <span className="text-[11px] font-bold uppercase tracking-wider">Alerts</span>}
          </button>
          <button 
            onClick={() => setActiveView('settings')}
            className={`flex items-center h-10 transition-all mx-auto ${isMenuOpen ? 'w-full px-4 gap-3' : 'w-12 justify-center'} ${activeView === 'settings' ? 'text-primary' : 'text-brand-text/40 hover:text-brand-text/80 hover:bg-brand-text/5 rounded'}`}
          >
            <Settings size={20} />
            {isMenuOpen && <span className="text-[11px] font-bold uppercase tracking-wider">Settings</span>}
          </button>
          <button 
            onClick={() => setActiveView('profile')}
            className={`flex items-center h-10 transition-all mx-auto ${isMenuOpen ? 'w-full px-4 gap-3' : 'w-12 justify-center'} ${activeView === 'profile' ? 'text-primary' : 'text-brand-text/40 hover:text-brand-text/80 hover:bg-brand-text/5 rounded'}`}
          >
            <User size={20} />
            {isMenuOpen && <span className="text-[11px] font-bold uppercase tracking-wider">Profile</span>}
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <ActiveViewComponent />
    </div>
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

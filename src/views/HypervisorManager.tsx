import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Cpu, 
  Activity, 
  Plus, 
  Settings, 
  Play, 
  Square, 
  RotateCcw, 
  Terminal, 
  Maximize2, 
  X, 
  ChevronRight,
  HardDrive,
  Network,
  Shield,
  MousePointer2,
  Keyboard,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VM {
  id: string;
  name: string;
  os: 'ubuntu' | 'windows' | 'alpine' | 'debian';
  status: 'running' | 'stopped' | 'pausing';
  uptime: string;
  vcpus: number;
  ram: number; // in GB
  ip: string;
  thumbnail: string;
}

export const HypervisorManager: React.FC = () => {
  const [selectedVM, setSelectedVM] = useState<VM | null>(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [vcpus, setVcpus] = useState(4);
  const [ram, setRam] = useState(8);

  const vms: VM[] = [
    { id: 'vm-1', name: 'Prod-Web-Server', os: 'ubuntu', status: 'running', uptime: '12d 4h 22m', vcpus: 4, ram: 8, ip: '10.0.5.12', thumbnail: 'https://picsum.photos/seed/ubuntu/400/225' },
    { id: 'vm-2', name: 'Win-AD-Controller', os: 'windows', status: 'running', uptime: '45d 1h 12m', vcpus: 8, ram: 16, ip: '10.0.5.15', thumbnail: 'https://picsum.photos/seed/windows/400/225' },
    { id: 'vm-3', name: 'Edge-Load-Balancer', os: 'alpine', status: 'running', uptime: '2d 18h 05m', vcpus: 2, ram: 2, ip: '10.0.5.20', thumbnail: 'https://picsum.photos/seed/alpine/400/225' },
    { id: 'vm-4', name: 'Dev-Sandbox', os: 'debian', status: 'stopped', uptime: '0s', vcpus: 4, ram: 4, ip: 'N/A', thumbnail: 'https://picsum.photos/seed/debian/400/225' },
  ];

  const getOSLogo = (os: VM['os']) => {
    switch (os) {
      case 'ubuntu': return 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo-ubuntu_no-text.svg';
      case 'windows': return 'https://upload.wikimedia.org/wikipedia/commons/4/48/Windows_logo_-_2012_%28dark_blue%29.svg';
      case 'alpine': return 'https://upload.wikimedia.org/wikipedia/commons/2/24/Alpine_Linux_logo.svg';
      case 'debian': return 'https://upload.wikimedia.org/wikipedia/commons/6/66/Openlogo-debian.svg';
      default: return '';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden relative">
      <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 border border-blue-500/20">
            <Monitor size={20} />
          </div>
          <div>
            <h1 className="font-serif italic text-xl tracking-tight text-brand-text">Hypervisor VM</h1>
            <p className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">Bare-Metal Virtualization Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <Plus size={14} /> Create New VM
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
        {/* Resource Pool Progress Bar */}
        <div className="bg-brand-sidebar border border-brand-border rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity size={18} className="text-indigo-400" />
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Bare-Metal Resource Pool</h2>
            </div>
            <div className="flex items-center gap-6 text-[10px] font-mono text-brand-text/40 uppercase">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Allocated
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-bg border border-brand-border" /> Available
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">CPU Threads</span>
                  <span className="text-2xl font-serif italic text-brand-text">42 / 64 <span className="text-sm font-mono text-brand-text/20 uppercase not-italic">Threads</span></span>
                </div>
                <span className="text-xs font-mono text-indigo-400">65%</span>
              </div>
              <div className="h-2 bg-brand-bg rounded-full overflow-hidden border border-brand-border">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">System RAM</span>
                  <span className="text-2xl font-serif italic text-brand-text">96 / 128 <span className="text-sm font-mono text-brand-text/20 uppercase not-italic">GB</span></span>
                </div>
                <span className="text-xs font-mono text-emerald-400">75%</span>
              </div>
              <div className="h-2 bg-brand-bg rounded-full overflow-hidden border border-brand-border">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* VM Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vms.map((vm) => (
            <motion.div 
              key={vm.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedVM(vm)}
              className="bg-brand-sidebar border border-brand-border rounded-2xl overflow-hidden cursor-pointer group hover:border-blue-500/50 transition-all relative"
            >
              {/* Live Thumbnail Preview */}
              <div className="aspect-video relative overflow-hidden bg-black">
                <img 
                  src={vm.thumbnail} 
                  alt={vm.name}
                  className={`w-full h-full object-cover transition-all duration-700 ${vm.status === 'running' ? 'opacity-60 group-hover:opacity-100 group-hover:scale-105' : 'opacity-20 grayscale'}`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* OS Overlay */}
                <div className="absolute top-3 left-3 w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg p-1.5 border border-white/10">
                  <img src={getOSLogo(vm.os)} alt={vm.os} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
                  <div className={`w-1.5 h-1.5 rounded-full ${vm.status === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-[8px] font-bold text-white uppercase tracking-tighter">{vm.status}</span>
                </div>

                {/* Play/Pause Overlay on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center text-primary shadow-2xl">
                    <Maximize2 size={20} />
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-brand-text truncate">{vm.name}</h3>
                  <p className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">{vm.ip}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-border">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-brand-text/20 uppercase tracking-widest">vCPUs</span>
                    <span className="text-xs font-mono text-brand-text/60">{vm.vcpus} Cores</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-brand-text/20 uppercase tracking-widest">RAM</span>
                    <span className="text-xs font-mono text-brand-text/60">{vm.ram} GB</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5">
                    <Clock size={10} className="text-brand-text/20" />
                    <span className="text-[9px] font-mono text-brand-text/40 uppercase">{vm.uptime}</span>
                  </div>
                  <ChevronRight size={14} className="text-brand-text/20 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* VM Detail Modal */}
      <AnimatePresence>
        {selectedVM && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isConsoleOpen) setSelectedVM(null);
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full z-50 transition-all duration-500 ${isConsoleOpen ? 'max-w-6xl' : 'max-w-4xl'}`}
            >
              <div className="bg-brand-sidebar border border-brand-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-bg/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                      <img src={getOSLogo(selectedVM.os)} alt={selectedVM.os} className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif italic text-brand-text">{selectedVM.name}</h2>
                      <p className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">VMID: {selectedVM.id} • {selectedVM.ip}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex bg-brand-bg border border-brand-border rounded-xl p-1">
                      <button className="p-2 hover:bg-emerald-500/10 text-emerald-400 rounded-lg transition-all" title="Start VM">
                        <Play size={18} fill="currentColor" />
                      </button>
                      <button className="p-2 hover:bg-amber-500/10 text-amber-400 rounded-lg transition-all" title="Reboot VM">
                        <RotateCcw size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-all" title="Stop VM">
                        <Square size={18} fill="currentColor" />
                      </button>
                    </div>
                    <button 
                      onClick={() => {
                        setIsConsoleOpen(false);
                        setSelectedVM(null);
                      }}
                      className="p-2 hover:bg-brand-text/10 rounded-full text-brand-text/40 hover:text-brand-text transition-all"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden flex">
                  {/* Sidebar: Config (Hidden when console is full) */}
                  {!isConsoleOpen && (
                    <div className="w-80 border-r border-brand-border p-8 space-y-8 overflow-y-auto custom-scrollbar">
                      <div className="space-y-6">
                        <div className="flex items-center gap-2">
                          <Settings size={14} className="text-primary" />
                          <h3 className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Hardware Allocation</h3>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">vCPUs</label>
                              <span className="text-[10px] font-mono text-primary">{vcpus} Cores</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" max="16" 
                              value={vcpus} 
                              onChange={(e) => setVcpus(parseInt(e.target.value))}
                              className="w-full accent-primary h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Virtual RAM</label>
                              <span className="text-[10px] font-mono text-primary">{ram} GB</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" max="32" 
                              value={ram} 
                              onChange={(e) => setRam(parseInt(e.target.value))}
                              className="w-full accent-primary h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-8 border-t border-brand-border">
                        <div className="flex items-center gap-2">
                          <HardDrive size={14} className="text-brand-text/40" />
                          <h3 className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Storage</h3>
                        </div>
                        <div className="p-4 bg-brand-bg border border-brand-border rounded-xl space-y-2">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-brand-text/40">Disk 0 (SATA)</span>
                            <span className="text-brand-text/60">100 GB</span>
                          </div>
                          <div className="h-1 bg-brand-sidebar rounded-full overflow-hidden">
                            <div className="h-full w-1/3 bg-blue-500" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Network size={14} className="text-brand-text/40" />
                          <h3 className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Networking</h3>
                        </div>
                        <div className="p-4 bg-brand-bg border border-brand-border rounded-xl space-y-2">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-brand-text/40">Interface</span>
                            <span className="text-brand-text/60">vmbr0</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-brand-text/40">MAC</span>
                            <span className="text-brand-text/60">00:1A:2B:3C:4D:5E</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Main: noVNC Console */}
                  <div className="flex-1 flex flex-col bg-black relative">
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                      <button 
                        onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                        className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all"
                      >
                        {isConsoleOpen ? <X size={14} /> : <Maximize2 size={14} />}
                        {isConsoleOpen ? 'Exit Full Console' : 'Expand Console'}
                      </button>
                      <div className="px-3 py-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 rounded-lg text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Stream
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                      <button className="p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-white/40 hover:text-white transition-all">
                        <Keyboard size={16} />
                      </button>
                      <button className="p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-white/40 hover:text-white transition-all">
                        <MousePointer2 size={16} />
                      </button>
                    </div>

                    {/* Embedded noVNC Simulation */}
                    <div className="flex-1 flex items-center justify-center p-12">
                      <div className="w-full h-full max-w-5xl aspect-video bg-slate-900 rounded-lg border border-white/5 shadow-2xl overflow-hidden relative group">
                        <img 
                          src={selectedVM.thumbnail} 
                          alt="Console Stream" 
                          className="w-full h-full object-cover opacity-80"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Interactive Cursor Simulation */}
                        <motion.div 
                          animate={{ 
                            x: [100, 400, 200, 600, 300],
                            y: [100, 200, 400, 300, 150]
                          }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="absolute pointer-events-none"
                        >
                          <MousePointer2 size={16} className="text-white drop-shadow-lg" />
                        </motion.div>

                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs font-mono text-white/60 uppercase tracking-widest">Click to focus console</p>
                        </div>
                      </div>
                    </div>

                    {/* Console Toolbar */}
                    <div className="h-12 border-t border-white/5 bg-white/2 flex items-center justify-between px-6">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase">
                          <Terminal size={12} />
                          <span>Console Input: Active</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase">
                          <Shield size={12} />
                          <span>Encrypted Stream</span>
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-white/20 uppercase">
                        Latency: 12ms • FPS: 60
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-brand-border bg-brand-bg/50 flex justify-end gap-4">
                  <button className="px-6 py-2 bg-brand-sidebar border border-brand-border rounded-xl text-xs font-bold uppercase text-brand-text/60 hover:text-brand-text transition-all">
                    Discard Changes
                  </button>
                  <button className="px-8 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                    Apply VM Config
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

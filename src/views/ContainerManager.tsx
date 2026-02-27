import React, { useState } from 'react';
import { Box, Terminal, Sliders, Trash2, Play, Square, RotateCcw, Search, Filter, ChevronDown, ChevronRight, Share2, Globe, Database, FileCode, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataExplorer } from '../components/DataExplorer';
import { ContainerFileExplorer } from '../components/ContainerFileExplorer';

interface Container {
  id: string;
  name: string;
  image: string;
  status: 'Running' | 'Stopped' | 'Building';
  cpu: string;
  mem: string;
  uptime: string;
}

interface Stack {
  name: string;
  status: 'Running' | 'Stopped';
  containers: Container[];
}

export const ContainerManager: React.FC = () => {
  const [activeContainer, setActiveContainer] = useState<Container | null>(null);
  const [activeTab, setActiveTab] = useState<'logs' | 'shell' | 'manage'>('logs');
  const [cpuLimit, setCpuLimit] = useState(50);
  const [memLimit, setMemLimit] = useState(512);
  const [diskWaste] = useState(82);

  const stacks: Stack[] = [
    {
      name: 'Nexus-Core',
      status: 'Running',
      containers: [
        { id: 'c1', name: 'api-gateway', image: 'node:18-alpine', status: 'Running', cpu: '2.4%', mem: '124MB', uptime: '12d 4h' },
        { id: 'c2', name: 'auth-service', image: 'node:18-alpine', status: 'Running', cpu: '1.8%', mem: '98MB', uptime: '12d 4h' },
        { id: 'c3', name: 'main-db', image: 'postgres:15', status: 'Running', cpu: '0.5%', mem: '442MB', uptime: '12d 4h' },
        { id: 'c4', name: 'cache-layer', image: 'redis:7', status: 'Running', cpu: '0.2%', mem: '24MB', uptime: '12d 4h' },
      ]
    },
    {
      name: 'Analytics-Stack',
      status: 'Running',
      containers: [
        { id: 'c5', name: 'data-collector', image: 'python:3.11-slim', status: 'Running', cpu: '5.2%', mem: '210MB', uptime: '5d 22h' },
        { id: 'c6', name: 'analytics-db', image: 'mongodb:6', status: 'Running', cpu: '1.2%', mem: '512MB', uptime: '5d 22h' },
        { id: 'c7', name: 'dashboard-ui', image: 'nginx:latest', status: 'Running', cpu: '0.1%', mem: '12MB', uptime: '5d 22h' },
      ]
    }
  ];

  const isDatabase = (image: string) => {
    const dbImages = ['postgres', 'mysql', 'mariadb', 'mongodb'];
    return dbImages.some(db => image.toLowerCase().includes(db));
  };

  const handleOpenConsole = (container: Container) => {
    setActiveContainer(container);
    setActiveTab('logs');
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden">
      <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text/50">Orchestrator</h2>
          <div className="h-4 w-px bg-brand-border" />
          <div className="flex items-center gap-2 text-[10px] font-mono text-brand-text/40">
            <Box size={12} />
            <span>12 Containers Running</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text/30" size={14} />
            <input 
              type="text" 
              placeholder="Search stacks..."
              className="bg-brand-text/5 border border-brand-text/10 rounded-md py-1.5 pl-9 pr-4 text-[11px] font-mono outline-none focus:border-primary/50 text-brand-text"
            />
          </div>
          <button className={`px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase rounded hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 ${diskWaste > 70 ? 'animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]' : ''}`}>
            <Trash2 size={12} />
            Prune Unused ({diskWaste}%)
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
          
          {/* Visual Networking Map */}
          <div className="bg-brand-sidebar border border-brand-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Share2 size={16} className="text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Visual Networking</h3>
              </div>
              <div className="flex gap-4 text-[9px] font-mono text-brand-text/40 uppercase">
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Internal Link</span>
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Public Port</span>
              </div>
            </div>
            <div className="h-48 bg-brand-bg/40 rounded-lg border border-brand-text/5 relative overflow-hidden">
              <svg className="w-full h-full">
                {/* Connection Lines */}
                <line x1="20%" y1="50%" x2="50%" y2="30%" stroke="var(--primary)" strokeWidth="1" strokeDasharray="4 4" className="opacity-20" />
                <line x1="20%" y1="50%" x2="50%" y2="70%" stroke="var(--primary)" strokeWidth="1" strokeDasharray="4 4" className="opacity-20" />
                <line x1="50%" y1="30%" x2="80%" y2="50%" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="1" />
                <line x1="50%" y1="70%" x2="80%" y2="50%" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="1" />
                
                {/* Nodes */}
                <g className="cursor-pointer group">
                  <circle cx="20%" cy="50%" r="6" fill="var(--primary)" />
                  <text x="20%" y="65%" textAnchor="middle" className="text-[8px] fill-brand-text/40 font-mono">DB-Svc</text>
                </g>
                <g className="cursor-pointer group">
                  <circle cx="50%" cy="30%" r="8" fill="var(--primary)" />
                  <text x="50%" y="20%" textAnchor="middle" className="text-[8px] fill-brand-text/40 font-mono">API-v1</text>
                </g>
                <g className="cursor-pointer group">
                  <circle cx="50%" cy="70%" r="8" fill="var(--primary)" />
                  <text x="50%" y="85%" textAnchor="middle" className="text-[8px] fill-brand-text/40 font-mono">Auth-Svc</text>
                </g>
                <g className="cursor-pointer group">
                  <circle cx="80%" cy="50%" r="10" fill="transparent" stroke="#60A5FA" strokeWidth="2" />
                  <circle cx="80%" cy="50%" r="4" fill="#60A5FA" />
                  <text x="80%" y="65%" textAnchor="middle" className="text-[8px] fill-blue-400/60 font-mono">Public:443</text>
                </g>
              </svg>
              <div className="absolute top-2 right-2 bg-brand-bg/60 px-2 py-1 rounded text-[8px] font-mono text-brand-text/40 uppercase">
                Live Topology Map
              </div>
            </div>
          </div>

          {/* Stack View */}
          <div className="space-y-6">
            {stacks.map((stack, i) => (
              <div key={i} className="bg-brand-sidebar border border-brand-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 bg-brand-text/5 border-b border-brand-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ChevronDown size={16} className="text-brand-text/30" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text">{stack.name}</h3>
                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 text-[9px] font-bold uppercase">
                      {stack.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-[10px] font-mono text-brand-text/40">{stack.containers.length} Containers</div>
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-brand-text/10 rounded transition-colors text-primary"><Play size={14} /></button>
                      <button className="p-1.5 hover:bg-brand-text/10 rounded transition-colors text-brand-text/40"><RotateCcw size={14} /></button>
                      <button className="p-1.5 hover:bg-brand-text/10 rounded transition-colors text-red-500"><Square size={14} /></button>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {stack.containers.map((container) => (
                    <div key={container.id} className="flex items-center justify-between px-4 py-3 bg-brand-text/2 hover:bg-brand-text/5 rounded-lg transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_var(--primary)]`} />
                        <div>
                          <div className="text-xs font-mono text-brand-text">{container.name}</div>
                          <div className="text-[9px] text-brand-text/30 font-mono uppercase">Image: {container.image}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-[9px] text-brand-text/30 uppercase font-bold">CPU</div>
                          <div className="text-[10px] font-mono text-primary">{container.cpu}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] text-brand-text/30 uppercase font-bold">MEM</div>
                          <div className="text-[10px] font-mono text-blue-400">{container.mem}</div>
                        </div>
                        <button 
                          onClick={() => handleOpenConsole(container)}
                          className="p-2 hover:bg-primary/10 rounded text-primary opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2"
                        >
                          <Terminal size={14} />
                          <span className="text-[10px] font-bold uppercase">Manage</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Controls Panel */}
        <div className="w-80 border-l border-brand-border bg-brand-sidebar p-6 flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sliders size={16} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Resource Controls</h3>
            </div>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[10px] uppercase font-bold text-brand-text/40">CPU Shares</label>
                  <span className="text-[10px] font-mono text-primary">{cpuLimit}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={cpuLimit} 
                  onChange={(e) => setCpuLimit(parseInt(e.target.value))}
                  className="w-full accent-primary h-1 bg-brand-border rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[10px] uppercase font-bold text-brand-text/40">Memory Limit</label>
                  <span className="text-[10px] font-mono text-blue-400">{memLimit} MB</span>
                </div>
                <input 
                  type="range" 
                  min="128" max="2048" step="128"
                  value={memLimit} 
                  onChange={(e) => setMemLimit(parseInt(e.target.value))}
                  className="w-full accent-blue-400 h-1 bg-brand-border rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Box size={16} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Image Management</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: 'node:18-alpine', size: '124MB', used: true },
                { name: 'postgres:15', size: '342MB', used: true },
                { name: 'nginx:latest', size: '45MB', used: false },
                { name: 'redis:7', size: '28MB', used: false },
              ].map((img, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-brand-text/5 rounded border border-brand-text/5">
                  <div className="overflow-hidden">
                    <div className="text-[10px] font-mono text-brand-text truncate">{img.name}</div>
                    <div className="text-[9px] text-brand-text/30 font-mono">{img.size}</div>
                  </div>
                  {!img.used && <Trash2 size={12} className="text-red-500 cursor-pointer hover:scale-110 transition-transform" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Console Slide-over */}
      <AnimatePresence>
        {activeContainer && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-[800px] bg-brand-bg border-l border-brand-border shadow-2xl z-50 flex flex-col"
          >
            <div className="h-16 border-b border-brand-border flex items-center justify-between px-6 bg-brand-sidebar">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Box size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-brand-text">{activeContainer.name}</h3>
                  <div className="text-[10px] font-mono text-brand-text/40 uppercase">{activeContainer.image}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-brand-text/5 p-1 rounded-lg border border-brand-text/10">
                  {(['logs', 'shell', 'manage'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                        activeTab === tab ? 'bg-primary text-primary-foreground shadow-lg' : 'text-brand-text/40 hover:text-brand-text/60'
                      }`}
                    >
                      {tab === 'logs' && <Terminal size={12} />}
                      {tab === 'shell' && <FileCode size={12} />}
                      {tab === 'manage' && (isDatabase(activeContainer.image) ? <Database size={12} /> : <Box size={12} />)}
                      {tab === 'manage' ? (isDatabase(activeContainer.image) ? 'Data' : 'Files') : tab}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveContainer(null)} 
                  className="p-2 hover:bg-brand-text/10 rounded-full text-brand-text/40 hover:text-brand-text transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              {activeTab === 'logs' && (
                <>
                  <div className="flex-1 bg-black/60 p-6 font-mono text-xs overflow-y-auto custom-scrollbar leading-relaxed">
                    <div className="text-primary mb-2">Connecting to container stream...</div>
                    <div className="text-brand-text/40 mb-1">[2024-02-26 14:22:01] INFO: Starting server on port 3000</div>
                    <div className="text-brand-text/40 mb-1">[2024-02-26 14:22:03] DEBUG: Database connection established</div>
                    <div className="text-brand-text/40 mb-1">[2024-02-26 14:22:05] WARN: High memory usage detected (85%)</div>
                    <div className="text-brand-text/40 mb-1">[2024-02-26 14:22:10] INFO: GET /api/v1/health 200 4ms</div>
                    <div className="text-brand-text/40 mb-1">[2024-02-26 14:22:12] INFO: POST /api/v1/auth/login 200 42ms</div>
                    <div className="text-brand-text/40 mb-1">[2024-02-26 14:22:15] INFO: GET /api/v1/metrics 200 8ms</div>
                    <div className="animate-pulse inline-block w-2 h-4 bg-primary ml-1" />
                  </div>
                  <div className="h-12 border-t border-brand-border bg-brand-sidebar flex items-center px-6 justify-between">
                    <span className="text-[10px] font-mono text-brand-text/30 uppercase tracking-widest flex items-center gap-2">
                      <Loader2 size={12} className="animate-spin" />
                      Streaming real-time logs...
                    </span>
                    <div className="flex gap-4">
                      <button className="text-[10px] font-bold text-brand-text/40 hover:text-brand-text uppercase">Clear</button>
                      <button className="text-[10px] font-bold text-brand-text/40 hover:text-brand-text uppercase">Download</button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'shell' && (
                <div className="flex-1 bg-black/80 p-6 font-mono text-sm flex flex-col">
                  <div className="text-emerald-400 mb-2">root@container:/app# <span className="text-white animate-pulse">_</span></div>
                  <div className="text-brand-text/40 mt-auto text-[10px] uppercase tracking-widest">Interactive TTY Session</div>
                </div>
              )}

              {activeTab === 'manage' && (
                isDatabase(activeContainer.image) ? (
                  <DataExplorer containerName={activeContainer.name} image={activeContainer.image} />
                ) : (
                  <ContainerFileExplorer containerName={activeContainer.name} />
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

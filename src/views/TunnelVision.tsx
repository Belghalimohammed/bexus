import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Globe, 
  Shield, 
  Lock, 
  Copy, 
  Plus, 
  MoreVertical, 
  ExternalLink, 
  Activity, 
  Server, 
  ChevronRight,
  Check,
  X,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface Tunnel {
  id: string;
  name: string;
  publicUrl: string;
  internalTarget: string;
  status: 'live' | 'paused' | 'error';
  region: string;
  auth: boolean;
  traffic: { time: number; value: number }[];
}

const mockTunnels: Tunnel[] = [
  {
    id: '1',
    name: 'Nexus API Staging',
    publicUrl: 'https://dev-7a2b.nexus.io',
    internalTarget: 'nexus-api:3000',
    status: 'live',
    region: 'EU-West',
    auth: true,
    traffic: Array.from({ length: 20 }, (_, i) => ({ time: i, value: Math.floor(Math.random() * 100) })),
  },
  {
    id: '2',
    name: 'Admin Dashboard',
    publicUrl: 'https://admin-9f1c.nexus.io',
    internalTarget: 'admin-ui:8080',
    status: 'live',
    region: 'US-East',
    auth: false,
    traffic: Array.from({ length: 20 }, (_, i) => ({ time: i, value: Math.floor(Math.random() * 50) })),
  },
  {
    id: '3',
    name: 'Websocket Gateway',
    publicUrl: 'https://ws-3d2e.nexus.io',
    internalTarget: 'gateway:4000',
    status: 'paused',
    region: 'US-West',
    auth: true,
    traffic: Array.from({ length: 20 }, (_, i) => ({ time: i, value: 0 })),
  }
];

export const TunnelVision: React.FC = () => {
  const [tunnels, setTunnels] = useState<Tunnel[]>(mockTunnels);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex bg-brand-bg overflow-hidden relative">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Zap size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text">Tunnel Vision</h2>
              <p className="text-[10px] text-brand-text/40 uppercase font-mono">Secure Port Forwarding & Edge Proxy</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={14} />
            Create Tunnel
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tunnels.map((tunnel) => (
              <motion.div
                key={tunnel.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-brand-sidebar border border-brand-border rounded-2xl p-6 relative group hover:border-primary/30 transition-all shadow-xl hover:shadow-primary/5"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tunnel.status === 'live' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-text/5 text-brand-text/30'}`}>
                      <Globe size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-brand-text">{tunnel.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-mono text-brand-text/40 uppercase tracking-tighter">{tunnel.region}</span>
                        {tunnel.auth && <ShieldCheck size={10} className="text-primary" />}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-brand-text/5 rounded-lg text-brand-text/30 hover:text-brand-text transition-all">
                    <MoreVertical size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-brand-bg/50 border border-brand-border rounded-xl p-3 flex items-center justify-between group/url">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="relative flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${tunnel.status === 'live' ? 'bg-emerald-500' : 'bg-brand-text/20'}`} />
                        {tunnel.status === 'live' && (
                          <div className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-brand-text/80 truncate">{tunnel.publicUrl}</span>
                    </div>
                    <button 
                      onClick={() => handleCopy(tunnel.publicUrl, tunnel.id)}
                      className="p-1.5 hover:bg-brand-text/10 rounded text-brand-text/40 hover:text-primary transition-all"
                    >
                      {copiedId === tunnel.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 px-1">
                    <ArrowRight size={12} className="text-brand-text/20" />
                    <span className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">Internal: </span>
                    <span className="text-[10px] font-mono text-primary font-bold">{tunnel.internalTarget}</span>
                  </div>

                  <div className="h-16 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={tunnel.traffic}>
                        <defs>
                          <linearGradient id={`gradient-${tunnel.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={tunnel.status === 'live' ? '#10b981' : '#64748b'} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={tunnel.status === 'live' ? '#10b981' : '#64748b'} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={tunnel.status === 'live' ? '#10b981' : '#64748b'} 
                          fillOpacity={1} 
                          fill={`url(#gradient-${tunnel.id})`} 
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex justify-between items-center mt-1 px-1">
                      <span className="text-[8px] uppercase font-bold text-brand-text/20 tracking-tighter">Traffic (req/s)</span>
                      <span className="text-[10px] font-mono font-bold text-brand-text/60">{tunnel.traffic[tunnel.traffic.length-1].value}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-brand-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase font-bold text-brand-text/20 tracking-widest">Latency</span>
                      <span className="text-[10px] font-mono text-brand-text/60">24ms</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase font-bold text-brand-text/20 tracking-widest">Uptime</span>
                      <span className="text-[10px] font-mono text-brand-text/60">99.9%</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-primary hover:underline">
                    View Logs
                    <ExternalLink size={10} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Tunnel Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[400px] bg-brand-sidebar border-l border-brand-border z-50 flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-brand-border flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-brand-text">Create New Tunnel</h3>
                  <p className="text-[10px] text-brand-text/40 uppercase font-mono">Expose local service to edge</p>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-brand-text/5 rounded-lg text-brand-text/40 hover:text-brand-text transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Select Target Container</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                      <Server size={16} />
                    </div>
                    <select className="w-full bg-brand-bg border border-brand-border rounded-xl px-12 py-3 text-xs font-mono text-brand-text outline-none focus:border-primary transition-all appearance-none">
                      <option>nexus-api (3000)</option>
                      <option>admin-ui (8080)</option>
                      <option>postgres-db (5432)</option>
                      <option>redis-cache (6379)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-text/20">
                      <ChevronRight size={16} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Deployment Region</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['US-East', 'US-West', 'EU-West', 'AP-South'].map((region) => (
                      <button 
                        key={region}
                        className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${region === 'EU-West' ? 'border-primary bg-primary/5 text-primary' : 'border-brand-border bg-brand-bg text-brand-text/40 hover:border-brand-text/20'}`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Security & Auth</label>
                  <div className="flex items-center justify-between p-4 bg-brand-bg border border-brand-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <Lock size={16} className="text-primary" />
                      <div>
                        <div className="text-xs font-bold text-brand-text">Password Protection</div>
                        <div className="text-[9px] text-brand-text/40 uppercase">Enable Basic Auth</div>
                      </div>
                    </div>
                    <button className="w-10 h-5 rounded-full bg-primary relative">
                      <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-primary" />
                    <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Tunnel Preview</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono text-brand-text/60">Public URL:</div>
                    <div className="bg-brand-sidebar border border-brand-border rounded-lg p-3 text-[11px] font-mono text-primary break-all">
                      https://dev-7a2b.nexus.io
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-brand-border bg-brand-bg/50">
                <button className="w-full py-4 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                  <Zap size={16} />
                  Establish Tunnel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

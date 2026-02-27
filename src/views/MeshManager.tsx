import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  Server, 
  Plus, 
  Copy, 
  Check, 
  RefreshCw, 
  Shield, 
  Activity, 
  Cpu, 
  Database, 
  HardDrive,
  MoreVertical,
  Zap,
  Globe,
  Lock,
  ArrowRightLeft
} from 'lucide-react';

interface Node {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'provisioning';
  role: 'manager' | 'worker';
  region: string;
  resources: {
    cpu: number;
    ram: number;
    disk: number;
  };
  containers: number;
}

export const MeshManager: React.FC = () => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [token] = useState('nexus_mesh_v1_8f2k9l3m4n5p6q7r8s9t0u1v2w3x4y5z');

  const nodes: Node[] = [
    { 
      id: 'n1', name: 'Nexus-Primary-01', ip: '192.168.1.10', status: 'online', role: 'manager', region: 'US-East-1',
      resources: { cpu: 45, ram: 62, disk: 28 }, containers: 12
    },
    { 
      id: 'n2', name: 'Nexus-Worker-01', ip: '192.168.1.11', status: 'online', role: 'worker', region: 'US-East-1',
      resources: { cpu: 12, ram: 34, disk: 15 }, containers: 8
    },
    { 
      id: 'n3', name: 'Nexus-Worker-02', ip: '192.168.1.12', status: 'online', role: 'worker', region: 'EU-West-1',
      resources: { cpu: 88, ram: 92, disk: 74 }, containers: 24
    },
    { 
      id: 'n4', name: 'Nexus-Worker-03', ip: '192.168.1.13', status: 'provisioning', role: 'worker', region: 'AP-South-1',
      resources: { cpu: 0, ram: 0, disk: 0 }, containers: 0
    },
  ];

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden">
      <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <Network size={20} />
          </div>
          <div>
            <h1 className="font-serif italic text-xl tracking-tight text-brand-text">Mesh Cluster Manager</h1>
            <p className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">Multi-Node Scaling & Orchestration</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-[10px] font-bold uppercase">
            <Globe size={12} /> 3 Regions Active
          </div>
          <button 
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={14} /> Add Worker Node
          </button>
        </div>
      </header>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Cluster Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Nodes', value: '4', icon: Server, color: 'text-blue-400' },
              { label: 'Active Containers', value: '44', icon: Zap, color: 'text-amber-400' },
              { label: 'Cluster CPU', value: '36%', icon: Cpu, color: 'text-indigo-400' },
              { label: 'Cluster RAM', value: '48%', icon: Activity, color: 'text-emerald-400' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-brand-sidebar border border-brand-border rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <stat.icon size={80} />
                </div>
                <p className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-serif italic text-brand-text">{stat.value}</h3>
                  <stat.icon size={20} className={stat.color} />
                </div>
              </div>
            ))}
          </div>

          {/* Nodes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {nodes.map((node) => (
              <motion.div 
                key={node.id}
                layoutId={node.id}
                className="bg-brand-sidebar border border-brand-border rounded-2xl overflow-hidden group hover:border-primary/50 transition-all"
              >
                <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-bg/30">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                      node.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      node.status === 'provisioning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      <Server size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider">{node.name}</h3>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                          node.role === 'manager' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-500/20 text-slate-400'
                        }`}>
                          {node.role}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-brand-text/40">{node.ip} • {node.region}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        node.status === 'online' ? 'bg-emerald-500' :
                        node.status === 'provisioning' ? 'bg-amber-500 animate-pulse' :
                        'bg-red-500'
                      }`} />
                      <span className="text-[10px] font-bold uppercase text-brand-text/60">{node.status}</span>
                    </div>
                    <span className="text-[10px] font-mono text-brand-text/30">{node.containers} Containers</span>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-3 gap-6">
                  {[
                    { label: 'CPU Usage', value: node.resources.cpu, icon: Cpu, color: 'bg-indigo-500' },
                    { label: 'RAM Usage', value: node.resources.ram, icon: Activity, color: 'bg-emerald-500' },
                    { label: 'Disk Space', value: node.resources.disk, icon: HardDrive, color: 'bg-amber-500' },
                  ].map((res, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-brand-text/40 uppercase tracking-widest">{res.label}</span>
                        <span className="text-[10px] font-mono text-brand-text">{res.value}%</span>
                      </div>
                      <div className="h-1.5 bg-brand-bg rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${res.value}%` }}
                          className={`h-full ${res.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-4 bg-brand-bg/50 border-t border-brand-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="text-[10px] font-bold text-brand-text/40 uppercase hover:text-primary transition-colors flex items-center gap-1">
                      <RefreshCw size={12} /> Reboot
                    </button>
                    <button className="text-[10px] font-bold text-brand-text/40 uppercase hover:text-primary transition-colors flex items-center gap-1">
                      <ArrowRightLeft size={12} /> Migrate
                    </button>
                  </div>
                  <button className="p-2 hover:bg-brand-text/5 rounded-lg text-brand-text/30 hover:text-brand-text transition-all">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Join Token Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-brand-sidebar border border-brand-border rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                    <Shield size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif italic text-brand-text">Join Worker Node</h2>
                    <p className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">Secure Cluster Authentication</p>
                  </div>
                </div>

                <div className="p-6 bg-brand-bg border border-brand-border rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Worker Join Token</span>
                    <span className="text-[10px] font-mono text-amber-500 uppercase">Expires in 24h</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-3 font-mono text-xs text-indigo-300 break-all">
                      {token}
                    </div>
                    <button 
                      onClick={copyToken}
                      className="shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Quick Setup Instructions</h4>
                  <div className="space-y-3">
                    {[
                      'Provision a fresh Ubuntu 22.04+ VPS',
                      'Install the Nexus Mesh Daemon (curl -sSL get.nexus.io | bash)',
                      'Paste the join token when prompted by the installer',
                    ].map((step, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="w-5 h-5 rounded-full bg-brand-text/5 border border-brand-border flex items-center justify-center text-[10px] font-bold text-brand-text/40 shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-xs text-brand-text/60 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => setShowJoinModal(false)}
                    className="flex-1 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs font-bold uppercase text-brand-text/60 hover:text-brand-text transition-all"
                  >
                    Close
                  </button>
                  <button className="flex-1 py-3 bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                    <RefreshCw size={14} /> Regenerate
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

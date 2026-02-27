import React, { useState } from 'react';
import { History, Zap, ArrowLeftRight, Trash2, Clock, Shield, ChevronRight, FileCode, Database, Box, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Snapshot {
  id: string;
  timestamp: string;
  label: string;
  delta: string;
  type: 'manual' | 'auto' | 'pre-deploy';
  status: 'healthy' | 'corrupt';
  size: string;
}

const snapshots: Snapshot[] = [
  { id: 'snap-1', timestamp: '2026-02-26 14:22', label: 'Post-Nginx Update', delta: '+124MB', type: 'manual', status: 'healthy', size: '1.2GB' },
  { id: 'snap-2', timestamp: '2026-02-26 04:00', label: 'Daily Nightly', delta: '+42MB', type: 'auto', status: 'healthy', size: '1.1GB' },
  { id: 'snap-3', timestamp: '2026-02-25 18:30', label: 'Pre-Auth-v2 Deploy', delta: '+850MB', type: 'pre-deploy', status: 'healthy', size: '1.05GB' },
  { id: 'snap-4', timestamp: '2026-02-25 04:00', label: 'Daily Nightly', delta: '+12MB', type: 'auto', status: 'healthy', size: '242MB' },
  { id: 'snap-5', timestamp: '2026-02-24 04:00', label: 'Daily Nightly', delta: '+15MB', type: 'auto', status: 'healthy', size: '230MB' },
];

export const WarpManager: React.FC = () => {
  const [selectedSnapshots, setSelectedSnapshots] = useState<string[]>(['snap-1', 'snap-3']);
  const [retentionDays, setRetentionDays] = useState(7);
  const [isComparing, setIsComparing] = useState(false);

  const toggleSnapshotSelection = (id: string) => {
    if (selectedSnapshots.includes(id)) {
      setSelectedSnapshots(prev => prev.filter(s => s !== id));
    } else if (selectedSnapshots.length < 2) {
      setSelectedSnapshots(prev => [...prev, id]);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden">
      <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text/50">Warp System</h2>
          <div className="h-4 w-px bg-brand-border" />
          <div className="flex items-center gap-2 text-[10px] font-mono text-brand-text/40">
            <Zap size={12} className="text-primary" />
            <span>Full System State Capture Active</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsComparing(!isComparing)}
            disabled={selectedSnapshots.length !== 2}
            className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
              selectedSnapshots.length === 2 
                ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white' 
                : 'bg-brand-text/5 border border-brand-text/10 text-brand-text/20 cursor-not-allowed'
            }`}
          >
            <ArrowLeftRight size={14} />
            Compare States
          </button>
          <button className="px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded hover:opacity-90 transition-colors flex items-center gap-2">
            <Zap size={14} />
            Capture Warp
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Timeline View */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-brand-border" />
            
            <div className="space-y-12 relative">
              {snapshots.map((snap, i) => (
                <motion.div 
                  key={snap.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex gap-12 group cursor-pointer ${selectedSnapshots.includes(snap.id) ? 'scale-[1.02]' : ''}`}
                  onClick={() => toggleSnapshotSelection(snap.id)}
                >
                  {/* Timeline Node */}
                  <div className="relative flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full border-4 border-brand-bg z-10 flex items-center justify-center transition-all duration-500 ${
                      selectedSnapshots.includes(snap.id) 
                        ? 'bg-primary shadow-[0_0_20px_var(--primary)]' 
                        : 'bg-brand-sidebar group-hover:bg-brand-sidebar/80'
                    }`}>
                      {snap.type === 'manual' ? <Zap size={20} className={selectedSnapshots.includes(snap.id) ? 'text-primary-foreground' : 'text-primary'} /> :
                       snap.type === 'pre-deploy' ? <Box size={20} className={selectedSnapshots.includes(snap.id) ? 'text-primary-foreground' : 'text-blue-400'} /> :
                       <Clock size={20} className={selectedSnapshots.includes(snap.id) ? 'text-primary-foreground' : 'text-brand-text/40'} />}
                    </div>
                    {selectedSnapshots.includes(snap.id) && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full border-2 border-brand-bg flex items-center justify-center text-[10px] font-bold z-20 text-white">
                        {selectedSnapshots.indexOf(snap.id) + 1}
                      </div>
                    )}
                  </div>

                  {/* Node Content */}
                  <div className={`flex-1 bg-brand-sidebar border rounded-xl p-6 transition-all duration-300 ${
                    selectedSnapshots.includes(snap.id) ? 'border-primary/50 bg-brand-sidebar/80' : 'border-brand-border group-hover:border-brand-border/80'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-sm font-bold text-brand-text uppercase tracking-tight">{snap.label}</h3>
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                            snap.type === 'manual' ? 'border-primary/30 text-primary' :
                            snap.type === 'pre-deploy' ? 'border-blue-500/30 text-blue-400' :
                            'border-brand-text/10 text-brand-text/30'
                          }`}>
                            {snap.type}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-brand-text/40">{snap.timestamp} • ID: {snap.id}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-mono text-amber-400 font-bold">{snap.delta} Delta</div>
                        <div className="text-[9px] text-brand-text/20 uppercase font-bold">Total: {snap.size}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-brand-text/5">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-brand-text/40">
                          <Box size={10} /> Image State
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-brand-text/40">
                          <Database size={10} /> Volume Data
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-brand-text/40">
                          <FileCode size={10} /> Nginx Config
                        </div>
                      </div>
                      <button className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase rounded hover:bg-red-600 hover:text-white transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95">
                        Restore State
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison & Settings Panel */}
        <div className="w-96 border-l border-brand-border bg-brand-sidebar flex flex-col">
          <div className="p-6 border-b border-brand-border">
            <div className="flex items-center gap-2 mb-6">
              <Shield size={16} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Auto-Prune Settings</h3>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[10px] uppercase font-bold text-brand-text/40">Hourly Retention</label>
                  <span className="text-[10px] font-mono text-primary">{retentionDays} Days</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="30" 
                  value={retentionDays} 
                  onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                  className="w-full accent-primary h-1 bg-brand-border rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="bg-brand-text/5 rounded-lg p-3 border border-brand-text/5">
                <div className="text-[9px] text-brand-text/40 uppercase font-bold mb-2">Policy Summary</div>
                <p className="text-[10px] font-mono leading-relaxed text-brand-text/60">
                  Keeping <span className="text-primary">24</span> hourly snapshots for {retentionDays} days, and <span className="text-blue-400">4</span> weekly snapshots indefinitely.
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-brand-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowLeftRight size={16} className="text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Comparison Engine</h3>
              </div>
              {isComparing && (
                <button onClick={() => setIsComparing(false)} className="text-[10px] font-bold text-brand-text/40 hover:text-brand-text uppercase">Close</button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <AnimatePresence mode="wait">
                {isComparing ? (
                  <motion.div 
                    key="diff"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="text-[10px] font-mono text-brand-text/40 mb-4">Comparing {selectedSnapshots[0]} vs {selectedSnapshots[1]}</div>
                    
                    <div className="space-y-2">
                      <div className="text-[9px] uppercase font-bold text-brand-text/30">Added Files</div>
                      <div className="text-[10px] font-mono text-emerald-400 bg-emerald-400/5 p-2 rounded border border-emerald-400/10">
                        + /var/lib/docker/volumes/auth_v2_data<br/>
                        + /etc/nginx/conf.d/auth-v2.conf
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[9px] uppercase font-bold text-brand-text/30">Modified Configs</div>
                      <div className="text-[10px] font-mono text-amber-400 bg-amber-400/5 p-2 rounded border border-amber-400/10">
                        ~ /etc/nexus/core/.env (API_VERSION 1.0 {'->'} 2.0)<br/>
                        ~ docker-compose.yml (image: auth:v1 {'->'} auth:v2)
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[9px] uppercase font-bold text-brand-text/30">Deleted Files</div>
                      <div className="text-[10px] font-mono text-rose-400 bg-rose-400/5 p-2 rounded border border-rose-400/10">
                        - /var/lib/docker/volumes/auth_v1_legacy
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                    <ArrowLeftRight size={40} className="mb-4 text-brand-text" />
                    <p className="text-[10px] font-mono uppercase tracking-widest text-brand-text">Select two snapshots<br/>to compare system states</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

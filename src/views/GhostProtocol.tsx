import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Fingerprint, 
  Key, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  Clock, 
  UserCheck, 
  AlertTriangle,
  Ghost,
  ShieldX,
  Terminal,
  Activity
} from 'lucide-react';

interface GhostAsset {
  id: string;
  name: string;
  type: 'container' | 'file' | 'secret';
  status: 'cloaked' | 'exposed';
  lastAccessed: string;
}

const mockAssets: GhostAsset[] = [
  { id: '1', name: 'nexus-internal-db', type: 'container', status: 'cloaked', lastAccessed: '2h ago' },
  { id: '2', name: 'master_encryption_keys.pem', type: 'file', status: 'cloaked', lastAccessed: '5m ago' },
  { id: '3', name: 'STRIPE_LIVE_SECRET', type: 'secret', status: 'cloaked', lastAccessed: '1d ago' },
  { id: '4', name: 'ghost-proxy-node', type: 'container', status: 'cloaked', lastAccessed: 'Just now' },
];

export const GhostProtocol: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [selfDestruct, setSelfDestruct] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [logs, setLogs] = useState([
    { id: '1', user: 'Admin', action: 'Ghost Mode Entry', time: '10:42:01', duration: '15m' },
    { id: '2', user: 'Sarah', action: 'Secret Access: DB_PASS', time: '09:15:22', duration: '2m' },
    { id: '3', user: 'System', action: 'Auto-Cloak Triggered', time: '04:00:00', duration: '-' },
  ]);

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    // Simulate biometric/hardware key challenge
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAuthenticated(true);
    setIsAuthenticating(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center bg-brand-bg relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)]" />
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-brand-sidebar border border-brand-border rounded-3xl p-10 shadow-2xl relative z-10 text-center space-y-8"
        >
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <ShieldAlert size={40} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-brand-text">Ghost Protocol</h2>
            <p className="text-[10px] text-brand-text/40 uppercase font-mono tracking-widest">Restricted Security Management Area</p>
          </div>

          <div className="p-6 bg-brand-bg/50 border border-brand-border rounded-2xl space-y-6">
            <div className="flex items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-brand-text/5 flex items-center justify-center text-brand-text/20">
                  <Fingerprint size={24} />
                </div>
                <span className="text-[8px] uppercase font-bold text-brand-text/20">Biometric</span>
              </div>
              <div className="w-px h-8 bg-brand-border" />
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Key size={24} />
                </div>
                <span className="text-[8px] uppercase font-bold text-primary">Hardware Key</span>
              </div>
            </div>

            <button 
              onClick={handleAuthenticate}
              disabled={isAuthenticating}
              className="w-full py-4 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
            >
              {isAuthenticating ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Activity size={18} />
                </motion.div>
              ) : (
                <>
                  <Unlock size={18} />
                  Initiate Challenge
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[9px] text-brand-text/20 uppercase font-mono">
            <Lock size={10} />
            End-to-End Encrypted Session
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden relative">
      {/* Ghost Mode Header */}
      <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
            <Ghost size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text">Ghost Protocol</h2>
              <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[8px] font-black uppercase border border-red-500/20 animate-pulse">Active</span>
            </div>
            <p className="text-[10px] text-brand-text/40 uppercase font-mono">Stealth Mode Management</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 px-4 py-2 bg-red-500/5 border border-red-500/10 rounded-xl">
            <div className="flex flex-col items-end">
              <span className="text-[8px] uppercase font-bold text-red-500/40 tracking-widest">Self-Destruct</span>
              <span className="text-[10px] font-mono text-red-500 font-bold">{selfDestruct ? 'ARMED' : 'STANDBY'}</span>
            </div>
            <button 
              onClick={() => setSelfDestruct(!selfDestruct)}
              className={`w-10 h-5 rounded-full relative transition-all ${selfDestruct ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-brand-text/10'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${selfDestruct ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="p-2 hover:bg-brand-text/5 rounded-lg text-brand-text/40 hover:text-brand-text transition-all"
          >
            <ShieldX size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 relative z-10">
        {/* Warning Banner */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
          <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest">Stealth Mode Warning</h3>
            <p className="text-[11px] text-brand-text/60 leading-relaxed max-w-2xl">
              You are currently viewing cloaked assets. All actions are being logged to the incognito audit stream. 
              The self-destruct mechanism is {selfDestruct ? 'ARMED' : 'active'}. 3 failed login attempts will trigger a credential wipe.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Hidden Assets Table */}
          <div className="xl:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EyeOff size={16} className="text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Cloaked Assets</h3>
              </div>
              <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Cloak New Asset</button>
            </div>

            <div className="bg-brand-sidebar border border-brand-border rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-text/2">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/40">Asset Name</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/40">Type</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/40">Last Access</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="text-xs font-mono">
                  {mockAssets.map((asset) => (
                    <tr key={asset.id} className="border-b border-brand-border/50 hover:bg-brand-text/5 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-brand-text font-bold filter blur-sm hover:blur-none transition-all duration-300 cursor-help">
                          {asset.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-brand-text/5 border border-brand-text/10 text-[9px] font-bold uppercase text-brand-text/40">
                          {asset.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-brand-text/40">{asset.lastAccessed}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-1.5 hover:bg-brand-text/10 rounded text-brand-text/40 hover:text-primary transition-all">
                            <Terminal size={14} />
                          </button>
                          <button className="p-1.5 hover:bg-brand-text/10 rounded text-brand-text/40 hover:text-red-500 transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Incognito Logs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Incognito Audit</h3>
            </div>

            <div className="bg-brand-sidebar border border-brand-border rounded-2xl p-6 space-y-6 shadow-xl h-[400px] flex flex-col">
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 bg-brand-bg/50 border border-brand-border rounded-xl space-y-2 group hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <UserCheck size={12} className="text-primary" />
                        <span className="text-[10px] font-bold text-brand-text">{log.user}</span>
                      </div>
                      <span className="text-[9px] font-mono text-brand-text/20">{log.time}</span>
                    </div>
                    <div className="text-[10px] text-brand-text/60 font-mono">{log.action}</div>
                    <div className="flex justify-between items-center pt-1 border-t border-brand-border/50">
                      <span className="text-[8px] uppercase font-bold text-brand-text/20 tracking-widest">Duration</span>
                      <span className="text-[9px] font-mono text-brand-text/40">{log.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-brand-border">
                <button className="w-full py-2 bg-brand-text/5 border border-brand-border text-brand-text/40 text-[10px] font-bold uppercase rounded-lg hover:text-brand-text hover:bg-brand-text/10 transition-all">
                  Export Audit Trail
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Grid Decoration */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
    </div>
  );
};

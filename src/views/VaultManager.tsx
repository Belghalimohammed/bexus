import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Key, 
  Database, 
  CreditCard, 
  Server, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertTriangle, 
  ChevronRight, 
  X, 
  Fingerprint,
  Cpu,
  Zap,
  Box,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Secret {
  id: string;
  key: string;
  value: string;
  lastRotated: string;
  rotationDays: number;
}

interface SecretStore {
  id: string;
  name: string;
  type: 'database' | 'api' | 'infrastructure' | 'app';
  secretCount: number;
  lastAccessed: string;
  isLocked: boolean;
  secrets: Secret[];
}

interface InjectionNode {
  id: string;
  name: string;
  type: 'container' | 'secret';
  status?: 'active' | 'idle';
}

interface InjectionLink {
  source: string;
  target: string;
}

export const VaultManager: React.FC = () => {
  const [selectedStore, setSelectedStore] = useState<SecretStore | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const stores: SecretStore[] = [
    {
      id: 'store-1',
      name: 'Production DB',
      type: 'database',
      secretCount: 4,
      lastAccessed: '2 mins ago',
      isLocked: true,
      secrets: [
        { id: 's1', key: 'POSTGRES_PASSWORD', value: 'nx_db_p4ss_2024_secure', lastRotated: '2024-01-15', rotationDays: 90 },
        { id: 's2', key: 'DB_ROOT_USER', value: 'nexus_admin', lastRotated: '2023-11-20', rotationDays: 180 },
        { id: 's3', key: 'REPLICA_KEY', value: 'repl_8f2k9l3m4n5p', lastRotated: '2024-02-10', rotationDays: 30 },
      ]
    },
    {
      id: 'store-2',
      name: 'Stripe API Keys',
      type: 'api',
      secretCount: 2,
      lastAccessed: '1 hour ago',
      isLocked: true,
      secrets: [
        { id: 's4', key: 'STRIPE_SECRET_KEY', value: 'sk_live_51N...8f2k', lastRotated: '2023-12-01', rotationDays: 90 },
        { id: 's5', key: 'WEBHOOK_SIGNING_SECRET', value: 'whsec_9l3m4n5p6q7r', lastRotated: '2024-01-05', rotationDays: 90 },
      ]
    },
    {
      id: 'store-3',
      name: 'AWS Infrastructure',
      type: 'infrastructure',
      secretCount: 3,
      lastAccessed: 'Yesterday',
      isLocked: true,
      secrets: [
        { id: 's6', key: 'AWS_ACCESS_KEY_ID', value: 'AKIA...8F2K', lastRotated: '2023-10-15', rotationDays: 365 },
        { id: 's7', key: 'AWS_SECRET_ACCESS_KEY', value: '9l3m4n5p6q7r8s9t0u1v2w3x4y5z', lastRotated: '2023-10-15', rotationDays: 365 },
      ]
    },
    {
      id: 'store-4',
      name: 'GitHub OAuth',
      type: 'app',
      secretCount: 2,
      lastAccessed: '3 days ago',
      isLocked: true,
      secrets: [
        { id: 's8', key: 'GITHUB_CLIENT_ID', value: 'Iv1...8f2k', lastRotated: '2024-01-20', rotationDays: 180 },
        { id: 's9', key: 'GITHUB_CLIENT_SECRET', value: '9l3m4n5p6q7r8s9t0u1v2w3x4y5z', lastRotated: '2024-01-20', rotationDays: 180 },
      ]
    }
  ];

  const injectionNodes: InjectionNode[] = [
    { id: 'c1', name: 'api-gateway', type: 'container', status: 'active' },
    { id: 'c2', name: 'auth-service', type: 'container', status: 'active' },
    { id: 'c3', name: 'billing-engine', type: 'container', status: 'idle' },
    { id: 's-db', name: 'Prod DB Secrets', type: 'secret' },
    { id: 's-stripe', name: 'Stripe Keys', type: 'secret' },
  ];

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase === 'nexus-vault-2024') {
      setIsUnlocked(true);
    }
  };

  const toggleReveal = (id: string) => {
    const newRevealed = new Set(revealedSecrets);
    if (newRevealed.has(id)) newRevealed.delete(id);
    else newRevealed.add(id);
    setRevealedSecrets(newRevealed);
  };

  const handleCopy = (id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isOld = (dateStr: string) => {
    const lastRotated = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastRotated.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 90;
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden relative">
      {/* Status Banner */}
      <div className="bg-indigo-500/10 border-b border-indigo-500/20 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Encryption at Rest: AES-256 Active</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-brand-text/40 uppercase">
          <span>KMS Cluster: eu-west-1a</span>
          <span className="text-emerald-400">Status: Healthy</span>
        </div>
      </div>

      <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Lock size={20} />
          </div>
          <div>
            <h1 className="font-serif italic text-xl tracking-tight text-brand-text">KMS Vault</h1>
            <p className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">Hardware-Backed Secret Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <Key size={14} /> New Secret Store
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-12">
        {/* Secret Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stores.map((store) => (
            <motion.div 
              key={store.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedStore(store)}
              className="bg-brand-sidebar border border-brand-border rounded-2xl p-6 cursor-pointer group hover:border-indigo-500/50 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {store.type === 'database' && <Database size={64} />}
                {store.type === 'api' && <CreditCard size={64} />}
                {store.type === 'infrastructure' && <Server size={64} />}
                {store.type === 'app' && <Box size={64} />}
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className={`p-2 rounded-lg ${
                  store.type === 'database' ? 'bg-blue-500/10 text-blue-400' :
                  store.type === 'api' ? 'bg-emerald-500/10 text-emerald-400' :
                  store.type === 'infrastructure' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-purple-500/10 text-purple-400'
                }`}>
                  {store.type === 'database' && <Database size={20} />}
                  {store.type === 'api' && <CreditCard size={20} />}
                  {store.type === 'infrastructure' && <Server size={20} />}
                  {store.type === 'app' && <Box size={20} />}
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-brand-bg border border-brand-border rounded text-[10px] font-mono text-brand-text/40">
                  <Lock size={10} /> {store.isLocked ? 'LOCKED' : 'UNLOCKED'}
                </div>
              </div>

              <h3 className="text-lg font-serif italic text-brand-text mb-1">{store.name}</h3>
              <p className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest mb-4">{store.secretCount} Secrets Stored</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-brand-border">
                <span className="text-[10px] text-brand-text/30 uppercase">Last accessed: {store.lastAccessed}</span>
                <ChevronRight size={14} className="text-brand-text/30 group-hover:text-indigo-400 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Injection Map */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap size={18} className="text-indigo-400" />
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Secret Injection Map</h2>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-brand-text/40 uppercase">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Authorized Link
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Container
              </div>
            </div>
          </div>

          <div className="bg-brand-sidebar border border-brand-border rounded-3xl p-12 relative min-h-[400px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            </div>

            <div className="relative w-full max-w-4xl flex justify-between items-center px-20">
              {/* Secrets Column */}
              <div className="space-y-12">
                {injectionNodes.filter(n => n.type === 'secret').map((node, i) => (
                  <motion.div 
                    key={node.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-48 p-4 bg-brand-bg border border-indigo-500/30 rounded-2xl flex items-center gap-3 shadow-xl shadow-indigo-500/5 relative z-10"
                  >
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                      <Key size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-text">{node.name}</p>
                      <p className="text-[8px] font-mono text-indigo-400 uppercase">KMS Store</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Connecting Lines (Simplified SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <path d="M 280 140 L 600 100" stroke="#4f46e5" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.3" />
                <path d="M 280 140 L 600 200" stroke="#4f46e5" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.3" />
                <path d="M 280 260 L 600 300" stroke="#4f46e5" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.3" />
                <path d="M 280 260 L 600 100" stroke="#4f46e5" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.3" />
              </svg>

              {/* Containers Column */}
              <div className="space-y-8">
                {injectionNodes.filter(n => n.type === 'container').map((node, i) => (
                  <motion.div 
                    key={node.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-48 p-4 bg-brand-bg border border-brand-border rounded-2xl flex items-center gap-3 shadow-xl relative z-10"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${node.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                      <Cpu size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-text">{node.name}</p>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                        <span className="text-[8px] font-mono text-brand-text/40 uppercase">{node.status}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Panel */}
      <AnimatePresence>
        {selectedStore && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedStore(null);
                setIsUnlocked(false);
                setPassphrase('');
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-2xl bg-brand-sidebar border-l border-brand-border z-50 shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-brand-border flex items-center justify-between bg-brand-bg/50">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                    selectedStore.type === 'database' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    selectedStore.type === 'api' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    selectedStore.type === 'infrastructure' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  }`}>
                    {selectedStore.type === 'database' && <Database size={24} />}
                    {selectedStore.type === 'api' && <CreditCard size={24} />}
                    {selectedStore.type === 'infrastructure' && <Server size={24} />}
                    {selectedStore.type === 'app' && <Box size={24} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif italic text-brand-text">{selectedStore.name}</h2>
                    <p className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">Secure Secret Store • {selectedStore.type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedStore(null);
                    setIsUnlocked(false);
                    setPassphrase('');
                  }}
                  className="p-2 hover:bg-brand-text/10 rounded-full text-brand-text/40 hover:text-brand-text transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                {!isUnlocked ? (
                  <div className="h-full flex flex-col items-center justify-center max-w-md mx-auto space-y-8">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 relative">
                      <Lock size={40} />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-sidebar border border-brand-border rounded-xl flex items-center justify-center text-indigo-400 shadow-lg">
                        <Fingerprint size={16} />
                      </div>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-bold text-brand-text uppercase tracking-widest">Vault Locked</h3>
                      <p className="text-xs text-brand-text/40 leading-relaxed">This store is protected by hardware-backed encryption. Provide your master passphrase or use biometric auth to proceed.</p>
                    </div>

                    <form onSubmit={handleUnlock} className="w-full space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Master Passphrase</label>
                        <input 
                          type="password" 
                          value={passphrase}
                          onChange={(e) => setPassphrase(e.target.value)}
                          placeholder="••••••••••••••••"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-4 bg-indigo-500 text-white text-xs font-bold uppercase rounded-xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
                      >
                        <ShieldCheck size={16} /> Unlock Secret Store
                      </button>
                    </form>

                    <div className="pt-8 border-t border-brand-border w-full">
                      <button className="w-full py-3 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold uppercase text-brand-text/40 hover:text-brand-text transition-all flex items-center justify-center gap-2">
                        <Fingerprint size={14} /> Use Biometric Authentication
                      </button>
                    </div>
                    <p className="text-[10px] text-brand-text/20 uppercase text-center">Hint: nexus-vault-2024</p>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <ShieldCheck size={18} className="text-emerald-400" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Store Unlocked • Session Active</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400/50">Expires in 14:59</span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secrets Ledger</h4>
                        <button className="text-[10px] font-bold text-indigo-400 uppercase hover:underline">Add Secret</button>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/50">
                              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Key</th>
                              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Value</th>
                              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rotation</th>
                              <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {selectedStore.secrets.map((secret) => (
                              <tr key={secret.id} className="group hover:bg-white/2 transition-colors">
                                <td className="p-4">
                                  <span className="text-xs font-mono text-brand-text font-bold">{secret.key}</span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-indigo-300">
                                      {revealedSecrets.has(secret.id) ? secret.value : '••••••••••••••••'}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`text-[10px] font-mono ${isOld(secret.lastRotated) ? 'text-red-400' : 'text-brand-text/40'}`}>
                                        {secret.lastRotated}
                                      </span>
                                      {isOld(secret.lastRotated) && <AlertTriangle size={10} className="text-red-400" />}
                                    </div>
                                    <select className="bg-transparent border-none text-[8px] font-bold text-indigo-400 uppercase tracking-tighter outline-none cursor-pointer p-0">
                                      <option>{secret.rotationDays} Days</option>
                                      <option>30 Days</option>
                                      <option>90 Days</option>
                                      <option>180 Days</option>
                                    </select>
                                  </div>
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => toggleReveal(secret.id)}
                                      className="p-2 hover:bg-white/5 rounded-lg text-brand-text/30 hover:text-brand-text transition-all"
                                      title={revealedSecrets.has(secret.id) ? "Hide Secret" : "Reveal Secret"}
                                    >
                                      {revealedSecrets.has(secret.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                    <button 
                                      onClick={() => handleCopy(secret.id, secret.value)}
                                      className="p-2 hover:bg-white/5 rounded-lg text-brand-text/30 hover:text-brand-text transition-all"
                                      title="Copy to Clipboard"
                                    >
                                      {copiedId === secret.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                    </button>
                                    <button className="p-2 hover:bg-white/5 rounded-lg text-brand-text/30 hover:text-indigo-400 transition-all" title="Rotate Key">
                                      <RefreshCw size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="p-6 bg-brand-bg border border-brand-border rounded-2xl space-y-4">
                      <div className="flex items-center gap-3">
                        <ArrowRight size={16} className="text-indigo-400" />
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Authorized Consumers</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['api-gateway', 'auth-service', 'worker-node-01'].map(consumer => (
                          <div key={consumer} className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-2">
                            <Box size={12} className="text-brand-text/30" />
                            <span className="text-[10px] font-mono text-brand-text/60">{consumer}</span>
                          </div>
                        ))}
                        <button className="px-3 py-1.5 border border-dashed border-slate-800 rounded-lg text-[10px] font-bold text-brand-text/20 hover:border-indigo-500/50 hover:text-indigo-400 transition-all">
                          + Authorize New
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-8 border-t border-brand-border bg-brand-bg/50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[10px] font-mono text-brand-text/20 uppercase tracking-widest">
                  <Lock size={12} /> Hardware Security Module (HSM) Active
                </div>
                <button 
                  onClick={() => {
                    setIsUnlocked(false);
                    setPassphrase('');
                  }}
                  className="px-6 py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
                >
                  Lock Store
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

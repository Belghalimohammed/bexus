import React, { useState } from 'react';
import { Globe, Lock, Activity, ArrowRight, Shield, Search, ExternalLink, Clock, Server, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../components/Modal';
import { SubdomainWizard } from '../components/wizards/SubdomainWizard';

export const NetworkManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'proxy' | 'ssl' | 'inspector'>('proxy');
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden">
      <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text/50">Traffic Controller</h2>
          <div className="h-4 w-px bg-brand-border" />
          <div className="flex items-center gap-1 bg-brand-text/5 p-1 rounded-lg">
            {(['proxy', 'ssl', 'inspector'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-brand-text/40 hover:text-brand-text/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text/30" size={14} />
            <input 
              type="text" 
              placeholder="Search network..."
              className="bg-brand-text/5 border border-brand-text/10 rounded-md py-1.5 pl-9 pr-4 text-[11px] font-mono outline-none focus:border-primary/50 text-brand-text"
            />
          </div>
          <button 
            onClick={() => setIsWizardOpen(true)}
            className="px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded hover:opacity-90 transition-colors"
          >
            {activeTab === 'ssl' ? 'Issue Certificate' : 'Add Proxy Host'}
          </button>
        </div>
      </header>

      <Modal 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
        title="Subdomain Wizard"
      >
        <SubdomainWizard 
          onClose={() => setIsWizardOpen(false)} 
          onComplete={(data) => {
            console.log('Wizard Complete:', data);
            setIsWizardOpen(false);
          }} 
        />
      </Modal>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto">
          
          {/* Main Content Area based on Tab */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'proxy' && (
                <motion.div 
                  key="proxy"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-brand-sidebar border border-brand-border rounded-xl overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-text/5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Active Proxy Hosts</h3>
                    <div className="flex gap-4 text-[10px] font-mono">
                      <span className="text-primary">HTTP: 80</span>
                      <span className="text-blue-400">HTTPS: 443</span>
                    </div>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-brand-border bg-brand-text/2">
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/40">Domain</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/40">Target</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/40">SSL</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-mono">
                      {[
                        { domain: 'api.nexus.io', target: '10.0.1.42:3000', ssl: 'Active' },
                        { domain: 'dashboard.nexus.io', target: '10.0.1.45:8080', ssl: 'Active' },
                        { domain: 'auth.nexus.io', target: '10.0.2.10:5000', ssl: 'Active' },
                        { domain: 'cdn.nexus.io', target: 'S3-Bucket-Proxy', ssl: 'Expiring' },
                      ].map((host, i) => (
                        <tr key={i} className="border-b border-brand-border/50 hover:bg-brand-text/5 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-brand-text font-medium">{host.domain}</span>
                              <ExternalLink size={10} className="text-brand-text/30 opacity-0 group-hover:opacity-100" />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-brand-text/60">{host.target}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Lock size={12} className={host.ssl === 'Expiring' ? 'text-red-500' : 'text-primary'} />
                              <span className={host.ssl === 'Expiring' ? 'text-red-400' : 'text-primary'}>{host.ssl}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="px-3 py-1 bg-brand-text/5 border border-brand-text/10 rounded text-[9px] font-bold uppercase hover:bg-brand-text/10 text-brand-text">Manage</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {activeTab === 'ssl' && (
                <motion.div 
                  key="ssl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-brand-sidebar border border-brand-border rounded-xl overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-text/5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">SSL Certificates (Let's Encrypt)</h3>
                    <div className="text-[10px] font-mono text-primary">Auto-renewal: Enabled</div>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { domain: '*.nexus.io', provider: 'Let\'s Encrypt', expiry: 42, status: 'Healthy' },
                      { domain: 'api.nexus.io', provider: 'Let\'s Encrypt', expiry: 12, status: 'Warning' },
                      { domain: 'auth.nexus.io', provider: 'Let\'s Encrypt', expiry: 89, status: 'Healthy' },
                      { domain: 'legacy.nexus.io', provider: 'ZeroSSL', expiry: 2, status: 'Critical' },
                    ].map((cert, i) => (
                      <div key={i} className="bg-brand-bg/40 border border-brand-text/5 rounded-lg p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xs font-bold text-brand-text">{cert.domain}</div>
                            <div className="text-[9px] text-brand-text/30 uppercase font-mono">{cert.provider}</div>
                          </div>
                          <Shield size={16} className={cert.status === 'Healthy' ? 'text-primary' : cert.status === 'Warning' ? 'text-yellow-500' : 'text-red-500'} />
                        </div>
                        <div className="flex items-end justify-between">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-brand-text/30 uppercase font-bold">Expires in</span>
                            <span className={`text-lg font-mono font-bold ${cert.expiry < 7 ? 'text-red-500' : cert.expiry < 15 ? 'text-yellow-500' : 'text-brand-text'}`}>
                              {cert.expiry} <span className="text-[10px] text-brand-text/40">Days</span>
                            </span>
                          </div>
                          <button className="text-[9px] font-bold text-primary hover:underline uppercase tracking-wider">Renew Now</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'inspector' && (
                <motion.div 
                  key="inspector"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-brand-sidebar border border-brand-border rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-primary" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Traffic Inspector</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[9px] font-mono text-brand-text/40 uppercase">Real-time Stream</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { method: 'GET', path: '/api/v1/health', status: 200, latency: '4ms', time: '14:22:01' },
                      { method: 'POST', path: '/api/v1/auth/login', status: 200, latency: '42ms', time: '14:22:03' },
                      { method: 'GET', path: '/api/v1/metrics', status: 200, latency: '12ms', time: '14:22:05' },
                      { method: 'GET', path: '/static/bundle.js', status: 304, latency: '2ms', time: '14:22:08' },
                      { method: 'POST', path: '/api/v1/upload', status: 413, latency: '150ms', time: '14:22:12' },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px] font-mono bg-brand-text/2 p-2 rounded border border-brand-text/5">
                        <div className="flex items-center gap-4">
                          <span className={`font-bold w-10 ${log.method === 'POST' ? 'text-blue-400' : 'text-primary'}`}>{log.method}</span>
                          <span className="text-brand-text/60 truncate max-w-[200px]">{log.path}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className={log.status >= 400 ? 'text-red-500' : 'text-primary'}>{log.status}</span>
                          <span className="text-brand-text/30 w-12 text-right">{log.latency}</span>
                          <span className="text-brand-text/20 w-16 text-right">{log.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Side Panel: Visual Routing */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-brand-sidebar border border-brand-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-8">
                <Shield size={16} className="text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Visual Routing</h3>
              </div>
              <div className="flex flex-col items-center gap-4 py-4 relative">
                {/* Public Internet */}
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-10 h-10 rounded-full bg-brand-sidebar border border-brand-border flex items-center justify-center text-brand-text/40">
                    <Globe size={18} />
                  </div>
                  <span className="text-[8px] font-mono text-brand-text/40 uppercase">Public Internet</span>
                </div>
                
                <div className="h-8 w-px bg-gradient-to-b from-primary to-transparent opacity-20" />
                
                {/* Port 443 */}
                <div className="px-4 py-1.5 bg-primary/5 border border-primary/20 rounded text-[9px] font-mono text-primary z-10">
                  Port 443 (SSL)
                </div>

                <div className="h-8 w-px bg-gradient-to-b from-transparent via-primary to-transparent opacity-20" />

                {/* Nginx */}
                <div className="px-6 py-3 bg-brand-sidebar border border-brand-border rounded-lg flex flex-col items-center gap-1 z-10 shadow-xl">
                  <Server size={16} className="text-primary" />
                  <span className="text-[10px] font-bold text-brand-text">Nginx Proxy</span>
                </div>

                <div className="h-8 w-px bg-gradient-to-b from-transparent to-blue-500 opacity-20" />

                {/* Containers */}
                <div className="flex gap-4 z-10">
                  <div className="px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded flex flex-col items-center">
                    <Cpu size={12} className="text-blue-400 mb-1" />
                    <span className="text-[9px] font-bold text-blue-400">API:3000</span>
                  </div>
                  <div className="px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded flex flex-col items-center">
                    <Cpu size={12} className="text-purple-400 mb-1" />
                    <span className="text-[9px] font-bold text-purple-400">Auth:5000</span>
                  </div>
                </div>

                {/* Background Flow Animation */}
                <div className="absolute inset-0 pointer-events-none flex justify-center">
                  <div className="w-px h-full bg-brand-border opacity-20" />
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-brand-border">
                <div className="text-[10px] text-brand-text/40 uppercase font-bold mb-4">Network Health</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-brand-text/60">Request Rate</span>
                    <span className="text-[10px] font-mono text-primary">1.2k/min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-brand-text/60">Error Rate</span>
                    <span className="text-[10px] font-mono text-brand-text">0.02%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

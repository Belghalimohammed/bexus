import React, { useState, useEffect } from 'react';
import { GitBranch, Github, Globe, Terminal, Shield, CheckCircle2, XCircle, Clock, ExternalLink, Eye, EyeOff, RefreshCw, Settings, Webhook, GitCommit, History, Plus, Minus, Send, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitWorkspaceView } from '../components/GitWorkspaceView';

interface Repo {
  id: string;
  name: string;
  branch: string;
  commit: string;
  status: 'success' | 'failed' | 'building';
  lastDeploy: string;
  url: string;
}

const repos: Repo[] = [
  { id: '1', name: 'nexus-api', branch: 'main', commit: '7a2b9c1', status: 'success', lastDeploy: '2m ago', url: 'api.nexus.io' },
  { id: '2', name: 'nexus-dashboard', branch: 'production', commit: 'f4e2a1b', status: 'building', lastDeploy: 'Just now', url: 'dashboard.nexus.io' },
  { id: '3', name: 'auth-service', branch: 'main', commit: 'd9c8b7a', status: 'failed', lastDeploy: '1h ago', url: 'auth.nexus.io' },
];

export const GitOpsManager: React.FC = () => {
  const [activeRepo, setActiveRepo] = useState<Repo>(repos[0]);
  const [isAutoDeploy, setIsAutoDeploy] = useState(true);
  const [revealEnv, setRevealEnv] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'workspace' | 'settings'>('overview');

  const envVars = [
    { id: '1', key: 'DATABASE_URL', value: 'postgresql://admin:********@db.nexus.io:5432/prod', scope: 'Production' },
    { id: '2', key: 'STRIPE_SECRET', value: 'sk_live_51Mz...9s2l', scope: 'Production' },
    { id: '3', key: 'STAGING_DB_URL', value: 'postgresql://dev:********@db.staging.io:5432/stage', scope: 'Staging' },
    { id: '4', key: 'REDIS_PASSWORD', value: 'red_pass_123_abc', scope: 'Global' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden">
      <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text/50">Git Ops</h2>
          <div className="h-4 w-px bg-brand-border" />
          <div className="flex items-center gap-2 text-[10px] font-mono text-brand-text/40">
            <Github size={12} />
            <span>Connected to GitHub Organization</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-1.5 bg-brand-text/5 border border-brand-text/10 rounded-md">
            <Webhook size={14} className={isAutoDeploy ? 'text-primary' : 'text-brand-text/20'} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-text/60">Auto-Deploy</span>
            <button 
              onClick={() => setIsAutoDeploy(!isAutoDeploy)}
              className={`w-8 h-4 rounded-full relative transition-all ${isAutoDeploy ? 'bg-primary' : 'bg-brand-sidebar'}`}
            >
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isAutoDeploy ? 'left-4.5' : 'left-0.5'}`} />
            </button>
          </div>
          <button className="px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded hover:opacity-90 transition-colors flex items-center gap-2">
            <RefreshCw size={14} />
            Deploy Now
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Repo Sidebar */}
        <div className="w-80 border-r border-brand-border bg-brand-sidebar flex flex-col">
          <div className="p-6 border-b border-brand-border">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-text/40 mb-4">Repositories</h3>
            <div className="space-y-3">
              {repos.map((repo) => (
                <div 
                  key={repo.id}
                  onClick={() => setActiveRepo(repo)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                    activeRepo.id === repo.id 
                      ? 'bg-primary/5 border-primary/30 shadow-[0_0_15px_var(--primary)]' 
                      : 'bg-brand-text/2 border-brand-text/5 hover:border-brand-text/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Github size={16} className={activeRepo.id === repo.id ? 'text-primary' : 'text-brand-text/40'} />
                      <span className="text-xs font-bold text-brand-text">{repo.name}</span>
                    </div>
                    {repo.status === 'success' ? <CheckCircle2 size={14} className="text-primary" /> :
                     repo.status === 'failed' ? <XCircle size={14} className="text-red-500" /> :
                     <RefreshCw size={14} className="text-blue-400 animate-spin" />}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-brand-text/40">
                      <GitBranch size={10} />
                      {repo.branch}
                    </div>
                    <div className="text-brand-text/20">#{repo.commit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-text/40 mb-4">Deployment History</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3 relative">
                  {i !== 3 && <div className="absolute left-1.5 top-4 bottom-0 w-px bg-brand-border" />}
                  <div className="w-3 h-3 rounded-full bg-brand-border border-2 border-brand-bg z-10 mt-1" />
                  <div>
                    <div className="text-[10px] font-bold text-brand-text/60">Production Deploy</div>
                    <div className="text-[9px] text-brand-text/30 font-mono">2026-02-26 12:00 • Success</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Sub-navigation */}
          <div className="h-12 border-b border-brand-border bg-brand-sidebar flex items-center px-8 gap-8">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`text-[10px] font-bold uppercase tracking-widest transition-all relative py-4 ${activeTab === 'overview' ? 'text-primary' : 'text-brand-text/40 hover:text-brand-text'}`}
            >
              Overview
              {activeTab === 'overview' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
            <button 
              onClick={() => setActiveTab('workspace')}
              className={`text-[10px] font-bold uppercase tracking-widest transition-all relative py-4 ${activeTab === 'workspace' ? 'text-primary' : 'text-brand-text/40 hover:text-brand-text'}`}
            >
              Workspace
              {activeTab === 'workspace' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`text-[10px] font-bold uppercase tracking-widest transition-all relative py-4 ${activeTab === 'settings' ? 'text-primary' : 'text-brand-text/40 hover:text-brand-text'}`}
            >
              Settings
              {activeTab === 'settings' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'overview' && (
              <div className="p-8 space-y-8">
                {/* Active Repo Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-brand-sidebar border border-brand-border rounded-xl p-6">
                    <div className="text-[10px] uppercase font-bold text-brand-text/30 mb-2">Current Branch</div>
                    <div className="flex items-center gap-2">
                      <GitBranch size={16} className="text-blue-400" />
                      <span className="text-lg font-mono font-bold text-brand-text">{activeRepo.branch}</span>
                    </div>
                  </div>
                  <div className="bg-brand-sidebar border border-brand-border rounded-xl p-6">
                    <div className="text-[10px] uppercase font-bold text-brand-text/30 mb-2">Last Commit</div>
                    <div className="flex items-center gap-2">
                      <Terminal size={16} className="text-primary" />
                      <span className="text-lg font-mono font-bold text-brand-text">{activeRepo.commit}</span>
                    </div>
                  </div>
                  <div className="bg-brand-sidebar border border-brand-border rounded-xl p-6">
                    <div className="text-[10px] uppercase font-bold text-brand-text/30 mb-2">Deployment URL</div>
                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-purple-400" />
                      <span className="text-sm font-mono font-bold truncate text-brand-text">{activeRepo.url}</span>
                      <ExternalLink size={12} className="text-brand-text/30 cursor-pointer hover:text-brand-text" />
                    </div>
                  </div>
                </div>

                {/* Environment Variables */}
                <div className="bg-brand-sidebar border border-brand-border rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-text/5">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-primary" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Environment Variables</h3>
                    </div>
                    <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Add Variable</button>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-brand-border bg-brand-text/2">
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/40">Key</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/40">Value</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/40">Scope</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-mono">
                      {envVars.map((env) => (
                        <tr key={env.id} className="border-b border-brand-border/50 hover:bg-brand-text/5 transition-colors group">
                          <td className="px-6 py-4 text-brand-text font-bold">{env.key}</td>
                          <td className="px-6 py-4">
                            <div 
                              className="flex items-center gap-2 cursor-help"
                              onMouseEnter={() => setRevealEnv(env.id)}
                              onMouseLeave={() => setRevealEnv(null)}
                            >
                              <span className={`transition-all duration-300 text-brand-text ${revealEnv === env.id ? 'opacity-100' : 'opacity-20 blur-sm'}`}>
                                {env.value}
                              </span>
                              {revealEnv === env.id ? <EyeOff size={12} className="text-brand-text/30" /> : <Eye size={12} className="text-brand-text/30" />}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              env.scope === 'Production' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                              env.scope === 'Staging' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {env.scope}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-1 hover:bg-brand-text/10 rounded opacity-0 group-hover:opacity-100 transition-all">
                              <Settings size={14} className="text-brand-text/40" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Deployment Logs */}
                <div className="bg-brand-sidebar border border-brand-border rounded-xl overflow-hidden flex flex-col h-80">
                  <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-text/5">
                    <div className="flex items-center gap-2">
                      <Terminal size={16} className="text-primary" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Deployment Logs: {activeRepo.name}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] font-mono text-brand-text/40 uppercase">Streaming</span>
                      </div>
                      <button className="text-[10px] font-bold text-brand-text/40 hover:text-brand-text uppercase">Clear</button>
                    </div>
                  </div>
                  <div className="flex-1 bg-black/60 p-6 font-mono text-[11px] overflow-y-auto custom-scrollbar leading-relaxed">
                    <div className="text-white/40 mb-1">[14:57:01] <span className="text-blue-400">INFO</span>: Fetching repository metadata...</div>
                    <div className="text-white/40 mb-1">[14:57:03] <span className="text-blue-400">INFO</span>: Pulling branch <span className="text-white font-bold">{activeRepo.branch}</span></div>
                    <div className="text-white/40 mb-1">[14:57:05] <span className="text-blue-400">INFO</span>: Found commit <span className="text-primary">{activeRepo.commit}</span></div>
                    <div className="text-white/40 mb-1">[14:57:08] <span className="text-purple-400">STEP</span>: Running docker build...</div>
                    <div className="text-white/20 mb-1">Step 1/12 : FROM node:18-alpine</div>
                    <div className="text-white/20 mb-1">Step 2/12 : WORKDIR /app</div>
                    <div className="text-white/20 mb-1">Step 3/12 : COPY package*.json ./</div>
                    <div className="text-white/20 mb-1">Step 4/12 : RUN npm install --production</div>
                    <div className="text-white/40 mb-1">[14:57:15] <span className="text-amber-400">WARN</span>: 12 vulnerabilities found in dependencies</div>
                    <div className="text-white/20 mb-1">Step 5/12 : COPY . .</div>
                    <div className="text-white/20 mb-1">Step 6/12 : RUN npm run build</div>
                    <div className="text-white/40 mb-1">[14:57:22] <span className="text-primary">SUCCESS</span>: Build completed in 14.2s</div>
                    <div className="text-white/40 mb-1">[14:57:24] <span className="text-blue-400">INFO</span>: Pushing image to registry...</div>
                    <div className="animate-pulse inline-block w-2 h-4 bg-primary ml-1" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'workspace' && (
              <GitWorkspaceView folderName={activeRepo.name} />
            )}

            {activeTab === 'settings' && (
              <div className="p-8">
                <div className="bg-brand-sidebar border border-brand-border rounded-xl p-8 max-w-2xl">
                  <h3 className="text-sm font-bold text-brand-text mb-6 uppercase tracking-widest">Repository Settings</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Build Command</label>
                      <input type="text" defaultValue="npm run build" className="w-full bg-brand-text/5 border border-brand-border rounded-lg px-4 py-2.5 text-xs font-mono text-brand-text outline-none focus:border-primary/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Output Directory</label>
                      <input type="text" defaultValue="dist" className="w-full bg-brand-text/5 border border-brand-border rounded-lg px-4 py-2.5 text-xs font-mono text-brand-text outline-none focus:border-primary/50" />
                    </div>
                    <div className="pt-4 border-t border-brand-border flex justify-end">
                      <button className="px-6 py-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded-lg hover:opacity-90 transition-all">Save Settings</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

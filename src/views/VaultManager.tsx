import React, { useState, useEffect, useRef } from 'react';
import { HardDrive, Cloud, FileCode, Folder, History, RotateCcw, Search, ChevronRight, ChevronDown, FileText, MoreVertical, Save, Download, Trash2, GitBranch, RefreshCw, Terminal, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../components/Modal';
import { GitInitWizard } from '../components/wizards/GitInitWizard';

import { GitWorkspaceView } from '../components/GitWorkspaceView';

export const VaultManager: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>('.env');
  const [restorePoint, setRestorePoint] = useState(100);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [viewMode, setViewMode] = useState<'code' | 'git'>('code');
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, folder: string } | null>(null);
  const [gitWizardFolder, setGitWizardFolder] = useState<string | null>(null);
  const [gitInitializedFolders, setGitInitializedFolders] = useState<Set<string>>(new Set(['nexus-core']));

  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContextMenu = (e: React.MouseEvent, folder: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, folder });
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
  };

  const files = [
    { name: 'nexus-core', type: 'folder', children: [
      { name: 'config', type: 'folder', children: [
        { name: 'default.json', type: 'file' },
        { name: 'production.json', type: 'file' },
      ]},
      { name: 'docker-compose.yml', type: 'file' },
      { name: '.env', type: 'file', active: true },
      { name: 'nginx.conf', type: 'file' },
      { name: 'scripts', type: 'folder', children: [
        { name: 'deploy.sh', type: 'file' },
        { name: 'backup.sh', type: 'file' },
      ]},
    ]},
    { name: 'backups', type: 'folder', children: [
      { name: 'daily_20240225.tar.gz', type: 'file' },
    ]},
  ];

  return (
    <div className="flex-1 flex bg-brand-bg overflow-hidden">
      {/* File Explorer Sidebar */}
      <div className="w-64 border-r border-brand-border bg-brand-sidebar flex flex-col">
        <div className="p-6 border-b border-brand-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] uppercase tracking-widest font-bold text-brand-text/50">File Explorer</h2>
            <div className="flex gap-3">
              <div className="group relative">
                <HardDrive size={14} className="text-primary cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-brand-sidebar text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-brand-text">Local Storage</div>
              </div>
              <div className="group relative">
                <Cloud size={14} className="text-brand-text/30 hover:text-brand-text cursor-help transition-opacity" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-brand-sidebar text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-brand-text">S3 Bucket</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-text/30" size={12} />
            <input 
              type="text" 
              placeholder="Search files..."
              className="w-full bg-brand-text/5 border border-brand-text/10 rounded px-2 py-1.5 pl-7 text-[10px] font-mono outline-none focus:border-primary/50 transition-all text-brand-text"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          <div className="space-y-1">
            <div 
              onClick={() => setIsExpanded(!isExpanded)}
              onContextMenu={(e) => handleContextMenu(e, 'nexus-infrastructure')}
              className="flex items-center gap-2 px-2 py-1.5 text-brand-text/60 hover:text-brand-text transition-colors cursor-pointer group"
            >
              <ChevronDown size={14} className={`transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
              <div className="relative">
                <Folder size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
                {gitInitializedFolders.has('nexus-infrastructure') && (
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full border border-brand-sidebar" />
                )}
              </div>
              <span className="text-xs font-medium">nexus-infrastructure</span>
              {gitInitializedFolders.has('nexus-infrastructure') && (
                <GitBranch size={10} className="text-primary ml-auto" />
              )}
            </div>
            
            {isExpanded && (
              <div className="ml-4 space-y-1 border-l border-brand-text/5">
                {files[0].children?.map((item, i) => (
                  <div 
                    key={i} 
                    onContextMenu={(e) => item.type === 'folder' ? handleContextMenu(e, item.name) : null}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer transition-all ${
                      item.active ? 'bg-primary/10 text-primary' : 'text-brand-text/40 hover:text-brand-text hover:bg-brand-text/5'
                    }`}
                    onClick={() => item.type === 'file' && setSelectedFile(item.name)}
                  >
                    {item.type === 'folder' ? <ChevronRight size={12} className="text-brand-text/30" /> : <div className="w-3" />}
                    <div className="relative">
                      {item.type === 'folder' ? <Folder size={14} className="text-blue-400/60" /> : <FileCode size={14} className="text-purple-400/60" />}
                      {gitInitializedFolders.has(item.name) && (
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full border border-brand-sidebar" />
                      )}
                    </div>
                    <span className="text-[11px] font-medium truncate">{item.name}</span>
                    {gitInitializedFolders.has(item.name) && (
                      <GitBranch size={10} className="text-primary ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            ref={contextMenuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ left: contextMenu.x, top: contextMenu.y }}
            className="fixed z-[100] w-48 bg-brand-sidebar border border-brand-border rounded-xl shadow-2xl py-2 overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-brand-border mb-1">
              <div className="text-[9px] uppercase font-bold text-brand-text/30 tracking-widest">Folder Options</div>
              <div className="text-[10px] font-mono text-brand-text truncate">{contextMenu.folder}</div>
            </div>
            <button 
              onClick={() => {
                setGitWizardFolder(contextMenu.folder);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs text-brand-text/60 hover:text-primary hover:bg-primary/5 transition-all"
            >
              <GitBranch size={14} />
              Git Init Workspace
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-xs text-brand-text/60 hover:text-brand-text hover:bg-brand-text/5 transition-all">
              <Terminal size={14} />
              Open in Terminal
            </button>
            <div className="h-px bg-brand-border my-1" />
            <button className="w-full flex items-center gap-3 px-4 py-2 text-xs text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all">
              <Trash2 size={14} />
              Delete Folder
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={!!gitWizardFolder}
        onClose={() => setGitWizardFolder(null)}
        title="Git-Init Wizard"
      >
        {gitWizardFolder && (
          <GitInitWizard 
            folderName={gitWizardFolder}
            onClose={() => setGitWizardFolder(null)}
            onComplete={(data) => {
              setGitInitializedFolders(prev => new Set([...prev, gitWizardFolder]));
              setGitWizardFolder(null);
            }}
          />
        )}
      </Modal>

      {/* Code Editor & Backups */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-brand-border flex items-center justify-between px-6 bg-brand-sidebar">
          <div className="flex items-center gap-3">
            <div className="flex bg-brand-text/5 p-1 rounded-lg border border-brand-text/10">
              <button 
                onClick={() => setViewMode('code')}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${viewMode === 'code' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-brand-text/40 hover:text-brand-text'}`}
              >
                Code
              </button>
              <button 
                onClick={() => setViewMode('git')}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${viewMode === 'git' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-brand-text/40 hover:text-brand-text'}`}
              >
                Git
              </button>
            </div>
            <div className="h-6 w-px bg-brand-border mx-1" />
            <FileText size={16} className="text-primary" />
            <div className="flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text">{selectedFile || 'Select a file'}</h3>
              <span className="text-[8px] font-mono text-brand-text/30 uppercase">/etc/nexus/core/{selectedFile}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className={`flex items-center gap-2 px-3 py-1.5 bg-brand-text/5 rounded border border-brand-text/10 text-[10px] font-bold uppercase text-brand-text/60 hover:text-primary hover:border-primary/30 transition-all ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSyncing ? <RefreshCw size={12} className="animate-spin" /> : <RefreshCw size={12} />}
              {isSyncing ? 'Syncing...' : 'Sync Workspace'}
            </button>
            <div className="h-4 w-px bg-brand-border" />
            <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded hover:opacity-90 transition-all active:scale-95">
              <Save size={12} />
              Save Changes
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {viewMode === 'code' ? (
            <>
              {/* Editor Area (Monaco Style) */}
              <div className="flex-1 bg-brand-bg p-4 font-mono text-xs overflow-hidden flex flex-col">
                <div className="flex-1 bg-brand-bg/80 border border-brand-border rounded-lg overflow-hidden flex relative">
                  {/* Gutter */}
                  <div className="w-12 bg-brand-sidebar border-r border-brand-text/5 flex flex-col items-center py-4 text-[10px] text-brand-text/20 select-none leading-6 font-mono">
                    {[...Array(30)].map((_, i) => <div key={i}>{i+1}</div>)}
                  </div>
                  
                  {/* Text Area */}
                  <div className="flex-1 relative">
                    <textarea 
                      className="w-full h-full bg-transparent outline-none resize-none px-4 py-4 leading-6 text-brand-text/80 font-mono caret-primary"
                      spellCheck={false}
                      defaultValue={`# Nexus Core Environment Configuration
# Generated on: 2026-02-26

NODE_ENV=production
PORT=3000

# Database Settings
DB_HOST=10.0.1.42
DB_PORT=5432
DB_USER=admin
DB_PASS=********
DB_NAME=nexus_prod

# Security
API_KEY=nx_live_8f2k...9s2l
JWT_SECRET=********
ALLOWED_ORIGINS=https://*.nexus.io

# Performance
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600
LOG_LEVEL=debug
ENABLE_METRICS=true

# Infrastructure
CLUSTER_ID=eu-west-1a
REPLICA_COUNT=3`}
                    />
                    
                    {/* Simulated Syntax Highlighting Overlay (Visual only) */}
                    <div className="absolute top-4 right-4 w-24 h-48 bg-white/2 border border-white/5 rounded pointer-events-none opacity-20 hidden lg:block">
                      <div className="p-2 space-y-1">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className={`h-1 rounded ${i % 3 === 0 ? 'w-full bg-[#00FF00]' : 'w-2/3 bg-blue-400'}`} />
                        ))}
                      </div>
                      <div className="text-[8px] text-center mt-2 uppercase font-bold tracking-tighter opacity-40">Minimap</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Backup Timeline */}
              <div className="w-80 border-l border-brand-border bg-brand-sidebar p-6 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <History size={16} className="text-primary" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Vault Backups</h3>
                  </div>
                  <button className="p-1.5 hover:bg-brand-text/5 rounded text-brand-text/40 hover:text-brand-text transition-all">
                    <Download size={14} />
                  </button>
                </div>

                <div className="flex-1 relative overflow-y-auto custom-scrollbar pr-2">
                  <div className="absolute left-2 top-0 bottom-0 w-px bg-brand-border" />
                  <div className="space-y-6 relative">
                    {[
                      { time: 'Today, 14:22', action: 'Manual Snapshot', user: 'Alex', size: '1.2MB' },
                      { time: 'Today, 04:00', action: 'Daily Backup', user: 'System', size: '12.4MB' },
                      { time: 'Yesterday, 18:30', action: 'Pre-Deployment', user: 'Sarah', size: '1.1MB' },
                      { time: 'Yesterday, 04:00', action: 'Daily Backup', user: 'System', size: '12.3MB' },
                      { time: 'Feb 24, 04:00', action: 'Daily Backup', user: 'System', size: '12.1MB' },
                      { time: 'Feb 23, 04:00', action: 'Daily Backup', user: 'System', size: '11.9MB' },
                    ].map((snap, i) => (
                      <div key={i} className="flex gap-4 group cursor-pointer">
                        <div className={`w-4 h-4 rounded-full border-4 border-brand-bg z-10 transition-all ${i === 0 ? 'bg-primary scale-110 shadow-[0_0_10px_var(--primary)]' : 'bg-brand-border group-hover:bg-primary/40'}`} />
                        <div className="flex-1 -mt-1 bg-brand-text/2 p-2 rounded border border-transparent group-hover:border-brand-text/5 transition-all">
                          <div className="flex justify-between items-start">
                            <div className="text-[10px] font-bold text-brand-text group-hover:text-primary transition-colors">{snap.action}</div>
                            <span className="text-[8px] font-mono text-brand-text/20">{snap.size}</span>
                          </div>
                          <div className="text-[9px] text-brand-text/30 uppercase font-bold mt-1 tracking-tighter">{snap.time} • {snap.user}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-brand-border">
                  <div className="flex justify-between mb-4">
                    <div className="flex flex-col">
                      <h4 className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">One-Click Restore</h4>
                      <span className="text-[8px] text-brand-text/20 uppercase font-mono">Rollback entire directory</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-red-500 font-bold">{restorePoint}%</span>
                      <div className="text-[8px] text-brand-text/20 uppercase font-mono">Stability Index</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="relative h-6 flex items-center">
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={restorePoint} 
                        onChange={(e) => setRestorePoint(parseInt(e.target.value))}
                        className="w-full accent-red-500 h-1 bg-brand-border rounded-lg appearance-none cursor-pointer z-10"
                      />
                      <div className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none">
                        <span className="text-[8px] font-mono text-brand-text/20">PAST</span>
                        <span className="text-[8px] font-mono text-brand-text/20">NOW</span>
                      </div>
                    </div>
                    <button className="w-full py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase rounded hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                      <RotateCcw size={14} />
                      Restore Point-in-Time
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <GitWorkspaceView folderName="nexus-core" />
          )}
        </div>
      </div>
    </div>
  );
};

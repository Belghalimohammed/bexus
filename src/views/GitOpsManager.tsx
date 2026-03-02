import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  GitBranch, 
  History, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Plus, 
  GripVertical, 
  ChevronRight,
  Zap,
  Box,
  Cpu,
  Shield,
  Clock,
  ExternalLink,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

interface ActionBlock {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  icon: React.ReactNode;
}

interface PipelineColumn {
  id: string;
  title: string;
  blocks: ActionBlock[];
}

export const GitOpsManager: React.FC = () => {
  const [columns, setColumns] = useState<PipelineColumn[]>([
    {
      id: 'source',
      title: 'Source',
      blocks: [
        { id: 's1', name: 'Fetch Repository', status: 'success', icon: <GitBranch size={14} /> },
        { id: 's2', name: 'Verify Signatures', status: 'success', icon: <Shield size={14} /> },
      ]
    },
    {
      id: 'build',
      title: 'Build & Artifacts',
      blocks: [
        { id: 'b1', name: 'Install Dependencies', status: 'success', icon: <Box size={14} /> },
        { id: 'b2', name: 'Containerize Image', status: 'running', icon: <Cpu size={14} /> },
        { id: 'b3', name: 'Security Scan', status: 'idle', icon: <Shield size={14} /> },
      ]
    },
    {
      id: 'deploy',
      title: 'Deployment',
      blocks: [
        { id: 'd1', name: 'Push to Registry', status: 'idle', icon: <ExternalLink size={14} /> },
        { id: 'd2', name: 'Canary Release', status: 'idle', icon: <Zap size={14} /> },
      ]
    }
  ]);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[02:14:01] SYSTEM: Nexus Forge Engine v4.2.0 initialized',
    '[02:14:03] GIT: Connected to github.com/nexus-os/core',
    '[02:14:05] PIPELINE: Triggered by commit 7f3a2d (Mohammed B.)',
    '[02:14:07] STEP: Fetch Repository - COMPLETED',
    '[02:14:10] STEP: Containerize Image - IN_PROGRESS',
    ' > Step 4/12: RUN npm install --production',
    ' > npm WARN deprecated rollup-plugin-terser@7.0.2',
    ' > added 432 packages in 8s',
    ' > Step 5/12: COPY . .',
  ]);

  const [isTriggering, setIsTriggering] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleManualTrigger = () => {
    setIsTriggering(true);
    setTimeout(() => setIsTriggering(false), 2000);
  };

  const history = [
    { id: 'h1', time: '12:45', duration: '2m 14s', status: 'success' },
    { id: 'h2', time: '11:20', duration: '1m 58s', status: 'failed' },
    { id: 'h3', time: '10:05', duration: '2m 05s', status: 'success' },
    { id: 'h4', time: '09:30', duration: '2m 10s', status: 'success' },
    { id: 'h5', time: '08:15', duration: '1m 45s', status: 'success' },
    { id: 'h6', time: '07:00', duration: '2m 30s', status: 'failed' },
    { id: 'h7', time: '05:45', duration: '2m 12s', status: 'success' },
    { id: 'h8', time: '04:30', duration: '2m 08s', status: 'success' },
    { id: 'h9', time: '03:15', duration: '1m 55s', status: 'success' },
    { id: 'h10', time: '02:00', duration: '2m 02s', status: 'success' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden relative">
      {/* Top Action Bar */}
      <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
            <GitBranch size={20} />
          </div>
          <div>
            <h1 className="font-serif italic text-xl tracking-tight text-brand-text">Nexus Forge</h1>
            <p className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">GitOps Pipeline Orchestrator</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-brand-bg border border-brand-border rounded-xl">
            <GitBranch size={14} className="text-brand-text/40" />
            <select className="bg-transparent text-xs font-bold text-brand-text outline-none cursor-pointer uppercase tracking-widest">
              <option>main</option>
              <option>production</option>
              <option>staging</option>
            </select>
          </div>
          <button 
            onClick={handleManualTrigger}
            disabled={isTriggering}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isTriggering ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            Manual Trigger
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Pipeline Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-brand-bg/50">
          <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar p-8">
            <div className="flex gap-8 h-full items-start">
              {columns.map((column) => (
                <div key={column.id} className="w-80 shrink-0 flex flex-col h-full max-h-full">
                  <div className="flex items-center justify-between px-2 mb-3 shrink-0">
                    <h3 className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">{column.title}</h3>
                    <button className="p-1 hover:bg-brand-text/5 rounded text-brand-text/20 hover:text-brand-text transition-all">
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <div className="flex-1 bg-brand-sidebar/20 border border-brand-border rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1">
                      <Reorder.Group axis="y" values={column.blocks} onReorder={(newBlocks) => {
                        const newColumns = columns.map(col => col.id === column.id ? { ...col, blocks: newBlocks } : col);
                        setColumns(newColumns);
                      }} className="space-y-3">
                        {column.blocks.map((block) => (
                          <Reorder.Item 
                            key={block.id} 
                            value={block}
                            className="bg-brand-sidebar border border-brand-border rounded-xl p-4 flex items-center justify-between group cursor-grab active:cursor-grabbing hover:border-primary/30 transition-all shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <GripVertical size={14} className="text-brand-text/10 group-hover:text-brand-text/30" />
                              <div className="p-2 bg-brand-bg rounded-lg text-brand-text/40">
                                {block.icon}
                              </div>
                              <span className="text-xs font-bold text-brand-text truncate max-w-[140px]">{block.name}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0">
                              {block.status === 'running' && <Loader2 size={14} className="text-blue-500 animate-spin" />}
                              {block.status === 'success' && <CheckCircle2 size={14} className="text-emerald-500" />}
                              {block.status === 'failed' && <XCircle size={14} className="text-red-500" />}
                              {block.status === 'idle' && <div className="w-3.5 h-3.5 rounded-full border border-brand-text/10" />}
                            </div>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    </div>
                    
                    <button className="w-full py-3 border border-dashed border-brand-border rounded-xl text-[10px] font-bold uppercase text-brand-text/20 hover:border-primary/30 hover:text-primary transition-all shrink-0 mt-auto">
                      + Add Action
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Runner Terminal */}
          <div className="h-72 bg-brand-sidebar border-t border-brand-border flex flex-col">
            <div className="px-6 py-3 border-b border-brand-border flex items-center justify-between bg-brand-bg/50">
              <div className="flex items-center gap-3">
                <Terminal size={14} className="text-primary" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40">Live Runner Terminal</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] font-mono text-brand-text/20 uppercase">Streaming stdout</span>
                </div>
                <button 
                  onClick={() => setTerminalLogs([])}
                  className="text-[9px] font-bold text-brand-text/20 hover:text-brand-text uppercase"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto custom-scrollbar leading-relaxed bg-black/5">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="text-brand-text/60 mb-1">
                  {log.includes('SUCCESS') || log.includes('COMPLETED') ? <span className="text-emerald-500">{log}</span> :
                   log.includes('RUNNING') || log.includes('IN_PROGRESS') ? <span className="text-blue-500 font-bold">{log}</span> :
                   log.includes('SYSTEM') ? <span className="text-primary font-bold">{log}</span> :
                   log.includes('GIT') ? <span className="text-amber-500">{log}</span> :
                   log.includes('PIPELINE') ? <span className="text-purple-500">{log}</span> :
                   log.includes('STEP') ? <span className="text-brand-text/80 font-bold">{log}</span> :
                   <span className="text-brand-text/30">{log}</span>}
                </div>
              ))}
              <div className="animate-pulse inline-block w-2 h-4 bg-primary ml-1" />
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>

        {/* Pipeline History Sidebar */}
        <aside className="w-80 border-l border-brand-border bg-brand-sidebar flex flex-col shrink-0">
          <div className="p-6 border-b border-brand-border shrink-0">
            <div className="flex items-center gap-2">
              <History size={16} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Pipeline History</h3>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
            {history.map((run) => (
              <div key={run.id} className="p-4 bg-brand-bg/50 border border-brand-border rounded-xl group hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${run.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="text-xs font-bold text-brand-text uppercase tracking-wider">Run #{run.id.slice(1)}</span>
                  </div>
                  <span className="text-[10px] font-mono text-brand-text/30">{run.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-brand-text/40">
                    <Clock size={10} />
                    {run.duration}
                  </div>
                  <ChevronRight size={14} className="text-brand-text/20 group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 border-t border-brand-border shrink-0">
            <button className="w-full py-3 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-bold uppercase text-brand-text/40 hover:text-brand-text transition-all flex items-center justify-center gap-2">
              <Settings size={14} />
              Runner Settings
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

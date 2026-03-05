import React, { useState } from 'react';
import { LayoutDashboard, FileText, Users, Settings, Plus, Search, ChevronRight, Hash, Clock, MessageSquare, CheckCircle2, AlertCircle, Trash2, MoreVertical, GripVertical, User, Box, Server, Database, Shield, Zap, History, GitBranch, Palette, Stethoscope, Library, Calendar, ShieldAlert, Activity, Monitor, TrendingDown, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OpsBoard } from './OpsBoard';
import { WikiEditor } from './WikiEditor';

type WorkspaceTab = 'ops' | 'wiki';

export const TeamWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('ops');

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      {/* Top Navigation Tab Bar */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0 z-10">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <h1 className="font-serif italic text-xl tracking-tight text-slate-900">Team Workspace</h1>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">DevOps Collaboration Hub</p>
          </div>
          
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('ops')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                activeTab === 'ops' 
                  ? 'bg-white text-primary shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard size={14} />
              The Ops Board
            </button>
            <button
              onClick={() => setActiveTab('wiki')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                activeTab === 'wiki' 
                  ? 'bg-white text-primary shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText size={14} />
              The Wiki
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="User" className="w-full h-full rounded-full" />
              </div>
            ))}
            <button className="w-8 h-8 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[10px] font-bold hover:scale-110 transition-all">
              <Plus size={14} />
            </button>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'ops' ? (
            <motion.div
              key="ops"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <OpsBoard />
            </motion.div>
          ) : (
            <motion.div
              key="wiki"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <WikiEditor />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

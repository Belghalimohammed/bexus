import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Play, 
  History, 
  Plus, 
  FileCode, 
  Terminal, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download
} from 'lucide-react';

interface Task {
  id: string;
  name: string;
  type: 'python' | 'bash' | 'node';
  schedule: string;
  lastRun: string;
  status: 'success' | 'failed' | 'running';
}

interface RunLog {
  id: string;
  timestamp: string;
  duration: string;
  exitCode: number;
  output: string;
  status: 'success' | 'failed';
}

export const ChronosTaskScheduler: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const tasks: Task[] = [
    { id: '1', name: 'DB Backup', type: 'bash', schedule: '0 0 * * *', lastRun: '2 hours ago', status: 'success' },
    { id: '2', name: 'Log Rotation', type: 'bash', schedule: '*/30 * * * *', lastRun: '15 mins ago', status: 'success' },
    { id: '3', name: 'User Sync', type: 'python', schedule: '0 12 * * *', lastRun: 'Yesterday', status: 'failed' },
    { id: '4', name: 'Cache Purge', type: 'node', schedule: '0 * * * *', lastRun: '45 mins ago', status: 'running' },
  ];

  const runHistory: RunLog[] = [
    { id: 'h1', timestamp: '2024-03-20 14:00:00', duration: '1.2s', exitCode: 0, status: 'success', output: 'Starting backup...\nCompressing files...\nUploading to S3...\nBackup completed successfully.' },
    { id: 'h2', timestamp: '2024-03-20 13:00:00', duration: '0.8s', exitCode: 1, status: 'failed', output: 'Starting backup...\nError: Connection timed out while connecting to S3.\nRetrying in 5 minutes...' },
  ];

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long' });

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden">
      <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Calendar size={20} />
          </div>
          <div>
            <h1 className="font-serif italic text-xl tracking-tight text-brand-text">Chronos Task Scheduler</h1>
            <p className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">Visual Automation Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text/30" size={14} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="bg-brand-sidebar border border-brand-border rounded-lg pl-10 pr-4 py-2 text-xs text-brand-text outline-none focus:border-primary transition-all w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <Plus size={14} /> Create Task
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Script Library */}
        <div className="w-80 border-r border-brand-border bg-brand-sidebar/20 flex flex-col">
          <div className="p-6 border-b border-brand-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] uppercase tracking-widest font-bold text-brand-text/50">Script Library</h2>
              <Filter size={14} className="text-brand-text/30 cursor-pointer hover:text-brand-text/60" />
            </div>
            <div className="space-y-2">
              {tasks.map(task => (
                <motion.div 
                  key={task.id}
                  whileHover={{ x: 4 }}
                  className="p-3 bg-brand-sidebar border border-brand-border rounded-xl cursor-move group hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${
                        task.type === 'python' ? 'bg-blue-500/10 text-blue-400' :
                        task.type === 'node' ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-slate-500/10 text-slate-400'
                      }`}>
                        <FileCode size={14} />
                      </div>
                      <span className="text-xs font-bold text-brand-text">{task.name}</span>
                    </div>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      task.status === 'success' ? 'bg-emerald-500' :
                      task.status === 'failed' ? 'bg-red-500' :
                      'bg-amber-500 animate-pulse'
                    }`} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-brand-text/40 font-mono">
                    <span>{task.schedule}</span>
                    <span className="group-hover:text-primary transition-colors">Drag to schedule</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <h2 className="text-[10px] uppercase tracking-widest font-bold text-brand-text/50 mb-4">Recent Executions</h2>
            <div className="space-y-4">
              {runHistory.map(log => (
                <div key={log.id} className="flex gap-3 items-start">
                  <div className={`mt-1 ${log.status === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {log.status === 'success' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-brand-text truncate">DB Backup</p>
                    <p className="text-[10px] text-brand-text/40 font-mono">{log.timestamp}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedTask(tasks[0]);
                      setShowHistory(true);
                    }}
                    className="p-1 hover:bg-brand-text/5 rounded text-brand-text/30 hover:text-brand-text/60"
                  >
                    <History size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main: Calendar Timeline */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-sidebar/10">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-serif italic text-brand-text">{monthName} {currentMonth.getFullYear()}</h2>
              <div className="flex bg-brand-sidebar border border-brand-border rounded-lg p-1">
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                  className="p-1.5 hover:bg-brand-text/5 rounded text-brand-text/60"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => setCurrentMonth(new Date())}
                  className="px-3 text-[10px] font-bold uppercase text-brand-text/60 hover:text-brand-text"
                >
                  Today
                </button>
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                  className="p-1.5 hover:bg-brand-text/5 rounded text-brand-text/60"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="flex bg-brand-sidebar border border-brand-border rounded-lg p-1">
              {['Month', 'Week', 'Day'].map(view => (
                <button 
                  key={view}
                  className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${
                    view === 'Month' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-brand-text/40 hover:text-brand-text/80'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-7 gap-px bg-brand-border border border-brand-border rounded-2xl overflow-hidden shadow-2xl">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-brand-sidebar/50 p-4 text-center border-b border-brand-border">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40">{day}</span>
                </div>
              ))}
              {Array.from({ length: 42 }).map((_, i) => {
                const dayNum = i - firstDayOfMonth(currentMonth) + 1;
                const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth(currentMonth);
                const isToday = isCurrentMonth && dayNum === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth();

                return (
                  <div 
                    key={i} 
                    className={`min-h-[140px] p-3 bg-brand-bg transition-colors hover:bg-brand-sidebar/20 relative group ${
                      !isCurrentMonth ? 'opacity-20' : ''
                    }`}
                  >
                    <span className={`text-xs font-mono ${isToday ? 'text-primary font-bold' : 'text-brand-text/40'}`}>
                      {isCurrentMonth ? dayNum : ''}
                    </span>
                    
                    {isCurrentMonth && dayNum % 5 === 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-bold text-indigo-400 truncate flex items-center gap-1">
                          <Clock size={10} /> 00:00 DB Backup
                        </div>
                        <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-bold text-emerald-400 truncate flex items-center gap-1">
                          <Clock size={10} /> 12:00 User Sync
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 border-2 border-dashed border-primary/20 m-1 rounded-xl pointer-events-none transition-opacity flex items-center justify-center">
                      <span className="text-[8px] font-bold uppercase text-primary tracking-tighter">Drop to Schedule</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Run History Popup */}
      <AnimatePresence>
        {showHistory && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-brand-sidebar border border-brand-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-bg/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <History size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif italic text-brand-text">Run History: {selectedTask.name}</h2>
                    <p className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">Execution Logs & Diagnostics</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-brand-text/10 rounded-full text-brand-text/40 hover:text-brand-text transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Log List */}
                <div className="w-72 border-r border-brand-border overflow-y-auto custom-scrollbar">
                  {runHistory.map((log, idx) => (
                    <div 
                      key={log.id}
                      className={`p-4 border-b border-brand-border cursor-pointer transition-all ${
                        idx === 0 ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-brand-text/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-brand-text/40 uppercase">{log.timestamp}</span>
                        <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-text">Exit Code: {log.exitCode}</span>
                        <span className="text-[10px] text-brand-text/40">{log.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Log Details */}
                <div className="flex-1 flex flex-col bg-slate-950">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Terminal size={14} className="text-brand-text/40" />
                      <span className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">Standard Output (stdout)</span>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-brand-text/60 hover:text-white transition-all">
                      <Download size={12} /> Export Log
                    </button>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto custom-scrollbar font-mono text-xs text-indigo-300/80 leading-relaxed">
                    <pre className="whitespace-pre-wrap">
                      {runHistory[0].output}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-brand-border bg-brand-bg/50 flex justify-end">
                <button 
                  onClick={() => setShowHistory(false)}
                  className="px-6 py-2 bg-brand-sidebar border border-brand-border rounded-xl text-xs font-bold uppercase text-brand-text/60 hover:text-brand-text transition-all"
                >
                  Close History
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

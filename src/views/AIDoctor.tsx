import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Wand2, 
  Terminal, 
  Calendar, 
  ChevronRight, 
  Zap,
  Clock,
  HeartPulse,
  Thermometer,
  ShieldCheck
} from 'lucide-react';

interface Diagnosis {
  id: string;
  severity: 'critical' | 'warning' | 'stable';
  title: string;
  container: string;
  timestamp: string;
  errorLog: string;
  aiFix: string;
  command: string;
}

const mockDiagnoses: Diagnosis[] = [
  {
    id: '1',
    severity: 'critical',
    title: 'Memory Leak Detected',
    container: 'python-api-v2',
    timestamp: '2m ago',
    errorLog: 'FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory\n[14:22:01] Process exited with code 137 (OOM Killed)',
    aiFix: 'The application is exceeding its allocated memory limit of 512MB. Analysis of the heap dump suggests a growing cache object in the auth middleware. I recommend increasing the container memory limit to 2GB and enabling garbage collection flags.',
    command: 'docker update --memory 2g python-api-v2'
  },
  {
    id: '2',
    severity: 'warning',
    title: 'High Latency Spike',
    container: 'nginx-ingress',
    timestamp: '15m ago',
    errorLog: '2026/02/27 10:15:22 [error] 31#31: *421 upstream timed out (110: Connection timed out) while connecting to upstream',
    aiFix: 'The upstream service is responding slowly. This is likely due to a connection pool exhaustion. Increasing the worker_connections and keepalive timeout will alleviate the pressure.',
    command: 'nexus network update-config nginx --keepalive 60'
  }
];

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [text]);

  return <p className="text-cyan-400 leading-relaxed">{displayedText}<span className="animate-pulse">_</span></p>;
};

export const AIDoctor: React.FC = () => {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(mockDiagnoses[0]);
  const [isFixing, setIsFixing] = useState(false);
  const [fixApplied, setFixApplied] = useState(false);

  const handleApplyFix = async () => {
    setIsFixing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsFixing(false);
    setFixApplied(true);
    setTimeout(() => setFixApplied(false), 3000);
  };

  // Generate 30 days of health data
  const healthData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    stability: Math.random() > 0.8 ? 'low' : Math.random() > 0.4 ? 'high' : 'medium'
  }));

  return (
    <div className="flex-1 flex bg-brand-bg overflow-hidden">
      {/* Left Sidebar: Vitals Panel */}
      <div className="w-80 border-r border-brand-border bg-brand-sidebar flex flex-col">
        <div className="p-6 border-b border-brand-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Stethoscope size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text">AI Doctor</h2>
              <p className="text-[10px] text-brand-text/40 uppercase font-mono">Autonomous Self-Healing</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-brand-bg border border-brand-border rounded-xl">
              <div className="text-[8px] uppercase font-bold text-brand-text/30 mb-1">System Temp</div>
              <div className="flex items-center gap-2">
                <Thermometer size={12} className="text-emerald-500" />
                <span className="text-xs font-mono font-bold text-brand-text">38°C</span>
              </div>
            </div>
            <div className="p-3 bg-brand-bg border border-brand-border rounded-xl">
              <div className="text-[8px] uppercase font-bold text-brand-text/30 mb-1">Heartbeat</div>
              <div className="flex items-center gap-2">
                <HeartPulse size={12} className="text-red-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-brand-text">72bpm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          <div className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest px-2">Active Diagnoses</div>
          <div className="space-y-2">
            {mockDiagnoses.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDiagnosis(d)}
                className={`w-full p-4 rounded-2xl border text-left transition-all group ${
                  selectedDiagnosis?.id === d.id 
                    ? 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/5' 
                    : 'bg-brand-text/2 border-brand-text/5 hover:border-brand-text/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-1.5 rounded-lg ${d.severity === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    <AlertCircle size={14} />
                  </div>
                  <span className="text-[9px] font-mono text-brand-text/30">{d.timestamp}</span>
                </div>
                <h3 className={`text-xs font-bold mb-1 transition-colors ${selectedDiagnosis?.id === d.id ? 'text-primary' : 'text-brand-text'}`}>
                  {d.title}
                </h3>
                <div className="text-[10px] text-brand-text/40 font-mono truncate">
                  Container: {d.container}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-brand-border bg-brand-bg/30">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Health History</div>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-sm bg-emerald-500/20" />
              <div className="w-2 h-2 rounded-sm bg-emerald-500/50" />
              <div className="w-2 h-2 rounded-sm bg-emerald-500" />
            </div>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {healthData.map((d) => (
              <div 
                key={d.day}
                className={`aspect-square rounded-sm transition-all hover:scale-125 cursor-help ${
                  d.stability === 'high' ? 'bg-emerald-500' : 
                  d.stability === 'medium' ? 'bg-emerald-500/50' : 
                  'bg-red-500/50 shadow-[0_0_5px_rgba(239,68,68,0.5)]'
                }`}
                title={`Day ${d.day}: ${d.stability === 'high' ? 'Optimal' : d.stability === 'medium' ? 'Degraded' : 'Critical'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Treatment Plan */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar">
          <div className="flex items-center gap-4">
            <Activity size={18} className="text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-text">Treatment Plan: {selectedDiagnosis?.title}</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-text/5 rounded-lg border border-brand-text/10 text-[10px] font-mono text-brand-text/40">
              <ShieldCheck size={12} className="text-emerald-500" />
              Verified Fix
            </div>
            <button 
              onClick={handleApplyFix}
              disabled={isFixing || fixApplied}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-bold uppercase transition-all shadow-xl ${
                fixApplied ? 'bg-emerald-500 text-white' : 'bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20'
              } ${isFixing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isFixing ? <Zap size={14} className="animate-pulse" /> : fixApplied ? <CheckCircle2 size={14} /> : <Wand2 size={14} />}
              {isFixing ? 'Applying Fix...' : fixApplied ? 'Fix Applied' : 'Apply AI Fix'}
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left: Error Log */}
          <div className="flex-1 border-r border-brand-border flex flex-col bg-black/20">
            <div className="p-4 border-b border-brand-border bg-brand-sidebar/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">
                <Terminal size={12} />
                Raw Error Log
              </div>
              <button className="text-[10px] text-brand-text/20 hover:text-brand-text transition-colors">Copy Logs</button>
            </div>
            <div className="flex-1 p-6 font-mono text-xs text-red-400/80 overflow-y-auto custom-scrollbar leading-relaxed">
              <pre className="whitespace-pre-wrap">{selectedDiagnosis?.errorLog}</pre>
            </div>
          </div>

          {/* Right: AI Analysis */}
          <div className="flex-1 flex flex-col bg-brand-bg">
            <div className="p-4 border-b border-brand-border bg-brand-sidebar/50 flex items-center gap-2 text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">
              <Zap size={12} className="text-cyan-400" />
              AI Diagnosis & Solution
            </div>
            <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div className="text-[10px] uppercase font-bold text-brand-text/20 tracking-[0.2em]">Analysis</div>
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={selectedDiagnosis?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium"
                  >
                    <TypewriterText text={selectedDiagnosis?.aiFix || ''} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="space-y-4">
                <div className="text-[10px] uppercase font-bold text-brand-text/20 tracking-[0.2em]">Proposed Command</div>
                <div className="bg-brand-sidebar border border-brand-border rounded-2xl p-6 relative group">
                  <div className="absolute top-4 right-4 text-[8px] uppercase font-bold text-brand-text/20">Executable</div>
                  <code className="text-xs font-mono text-primary break-all">
                    {selectedDiagnosis?.command}
                  </code>
                </div>
              </div>

              <div className="p-6 bg-cyan-400/5 border border-cyan-400/10 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-cyan-400/10 rounded-lg text-cyan-400">
                  <ShieldCheck size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Safety Verification</h4>
                  <p className="text-[11px] text-brand-text/40 leading-relaxed">
                    This fix has been cross-referenced with your system configuration and is marked as safe. 
                    No downtime is expected during application.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

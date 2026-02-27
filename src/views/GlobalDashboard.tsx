import React, { useState, useEffect } from 'react';
import { Search, Zap, Activity, Clock, Shield, AlertTriangle, Info } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const data = [
  { value: 400 }, { value: 300 }, { value: 600 }, { value: 800 },
  { value: 500 }, { value: 900 }, { value: 1100 }, { value: 800 },
  { value: 1200 }, { value: 1000 }, { value: 1400 }, { value: 1100 },
];

const Gauge: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-brand-text/5"
          />
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-mono font-bold text-brand-text">{value}%</span>
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold">{label}</span>
    </div>
  );
};

export const GlobalDashboard: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<'green' | 'yellow' | 'red'>('green');
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [logs, setLogs] = useState([
    { id: 1, user: 'Alex', action: 'restarted', target: 'Nginx-Proxy', time: '2m ago' },
    { id: 2, user: 'Sarah', action: 'scaled', target: 'API-Svc', time: '5m ago' },
    { id: 3, user: 'System', action: 'deployed', target: 'Auth-v2', time: '12m ago' },
    { id: 4, user: 'Alex', action: 'updated', target: 'SSL-Cert', time: '18m ago' },
    { id: 5, user: 'Mike', action: 'pruned', target: 'Docker-Images', time: '24m ago' },
  ]);

  // Simulate dynamic health
  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.95) setHealthStatus('red');
      else if (rand > 0.8) setHealthStatus('yellow');
      else setHealthStatus('green');
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePanic = () => {
    setIsPanicActive(true);
    setTimeout(() => setIsPanicActive(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden relative">
      {/* Panic Overlay */}
      <AnimatePresence>
        {isPanicActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-red-600/20 backdrop-blur-xl flex flex-col items-center justify-center border-4 border-red-600 animate-pulse"
          >
            <Zap size={80} className="text-red-600 mb-4 fill-current" />
            <h2 className="text-4xl font-black uppercase tracking-tighter text-red-600">Emergency Protocol Active</h2>
            <p className="text-red-600/60 font-mono mt-2">TERMINATING ALL ACTIVE SSH SESSIONS...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <header className="h-16 border-b border-brand-border bg-brand-sidebar flex items-center justify-between px-8 z-10">
        <div className="flex items-center gap-6 flex-1">
          <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:opacity-100 group-focus-within:text-primary transition-all" size={16} />
            <input 
              type="text" 
              placeholder="Search infrastructure... (Cmd+K)"
              className="w-full bg-brand-text/5 border border-brand-text/10 rounded-md py-1.5 pl-10 pr-4 text-xs font-mono outline-none focus:border-primary/50 focus:bg-brand-text/10 transition-all text-brand-text"
            />
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1 border rounded-full transition-all duration-500 ${
            healthStatus === 'green' ? 'bg-primary/10 border-primary/20 text-primary' :
            healthStatus === 'yellow' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
            'bg-red-500/10 border-red-500/20 text-red-500'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              healthStatus === 'green' ? 'bg-primary' :
              healthStatus === 'yellow' ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">
              System {healthStatus === 'green' ? 'Healthy' : healthStatus === 'yellow' ? 'Warning' : 'Critical'}
            </span>
          </div>
        </div>
        
        <button 
          onClick={handlePanic}
          className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md hover:bg-red-600 hover:text-white transition-all group active:scale-95"
        >
          <Zap size={14} className="group-hover:fill-current" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Panic Button</span>
        </button>
      </header>

      {/* Bento Grid */}
      <main className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-brand-bg">
        <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
          
          {/* Resource Gauges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-12 lg:col-span-4 bg-brand-sidebar border border-brand-border rounded-xl p-6 flex justify-around items-center"
          >
            <Gauge label="CPU" value={42} color="var(--primary)" />
            <Gauge label="RAM" value={68} color="var(--primary)" />
            <Gauge label="DISK" value={85} color="#F59E0B" />
          </motion.div>

          {/* Network Throughput */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 lg:col-span-8 bg-brand-sidebar border border-brand-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Network Throughput</h3>
              </div>
              <div className="flex gap-4 text-[10px] font-mono">
                <span className="text-primary">IN: 1.2 GB/s</span>
                <span className="text-blue-400">OUT: 450 MB/s</span>
              </div>
            </div>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--primary)" 
                    strokeWidth={2} 
                    dot={false} 
                    isAnimationActive={true}
                  />
                  <YAxis hide domain={['dataMin', 'dataMax']} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Service Status */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 lg:col-span-7 bg-brand-sidebar border border-brand-border rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Shield size={16} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Critical Services</h3>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-6">
              {['Nginx', 'Postgres', 'Redis', 'Docker', 'Auth-Svc', 'API-Gateway', 'Worker-1', 'Worker-2', 'S3-Proxy', 'DNS', 'K8s', 'Vault'].map((svc, i) => (
                <div key={svc} className="flex flex-col items-center gap-2 group cursor-help">
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${i === 4 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-primary shadow-[0_0_8px_var(--primary)] shadow-primary/50'}`} />
                    <div className={`absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-20 ${i === 4 ? 'bg-yellow-500' : 'bg-primary'}`} />
                  </div>
                  <span className="text-[9px] font-mono text-brand-text/40 group-hover:text-brand-text transition-opacity whitespace-nowrap">{svc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Audit Logs Ticker */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-12 lg:col-span-5 bg-brand-sidebar border border-brand-border rounded-xl p-6 flex flex-col overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Recent Audit Logs</h3>
            </div>
            <div className="flex-1 relative">
              <div className="space-y-3">
                {logs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center justify-between text-[10px] font-mono border-b border-brand-text/5 pb-2 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold">{log.user}</span>
                      <span className="text-brand-text/40">{log.action}</span>
                      <span className="text-blue-400">{log.target}</span>
                    </div>
                    <span className="text-brand-text/30">{log.time}</span>
                  </motion.div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-brand-sidebar/80 to-transparent pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Activity, 
  Cpu, 
  Zap, 
  Terminal, 
  Network, 
  AlertTriangle,
  Globe,
  Server,
  Database,
  ShieldAlert
} from 'lucide-react';

interface HealthNode {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
}

interface Threat {
  id: string;
  ip: string;
  country: string;
  rule: string;
  time: string;
}

const Gauge: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => {
  const isCritical = value > 85;
  return (
    <div className={`flex flex-col items-center justify-center p-8 bg-white/2 border border-white/5 rounded-3xl ${isCritical ? 'animate-pulse' : ''}`}>
      <div className="relative w-64 h-64">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${value * 2.82} 282`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-serif italic text-white">{value}%</span>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-2">{label}</span>
        </div>
      </div>
    </div>
  );
};

export const NOCMode: React.FC = () => {
  const [nodes, setNodes] = useState<HealthNode[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [cpu, setCpu] = useState(42);
  const [mem, setMem] = useState(68);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Initialize nodes
  useEffect(() => {
    const initialNodes: HealthNode[] = Array.from({ length: 144 }).map((_, i) => ({
      id: `node-${i}`,
      name: `Nexus-Node-${i}`,
      status: Math.random() > 0.95 ? (Math.random() > 0.5 ? 'critical' : 'warning') : 'healthy'
    }));
    setNodes(initialNodes);

    const initialThreats: Threat[] = [
      { id: '1', ip: '45.12.3.1', country: 'RU', rule: 'SQL Injection', time: '14:22:01' },
      { id: '2', ip: '103.4.12.88', country: 'CN', rule: 'Geo-Block', time: '14:22:05' },
      { id: '3', ip: '192.168.1.45', country: 'US', rule: 'Rate Limit', time: '14:22:12' },
    ];
    setThreats(initialThreats);
  }, []);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(prev => Math.min(100, Math.max(0, prev + (Math.random() * 10 - 5))));
      setMem(prev => Math.min(100, Math.max(0, prev + (Math.random() * 4 - 2))));
      
      // Randomly flicker a node
      setNodes(prev => prev.map(n => 
        Math.random() > 0.99 ? { ...n, status: Math.random() > 0.9 ? 'critical' : 'healthy' } : n
      ));

      // Add threat
      if (Math.random() > 0.7) {
        const newThreat: Threat = {
          id: Math.random().toString(),
          ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.x.x`,
          country: ['RU', 'CN', 'US', 'KP', 'IR'][Math.floor(Math.random() * 5)],
          rule: ['XSS', 'DDoS', 'Brute Force', 'WAF Block'][Math.floor(Math.random() * 4)],
          time: new Date().toLocaleTimeString([], { hour12: false })
        };
        setThreats(prev => [newThreat, ...prev.slice(0, 10)]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Carousel logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % 3);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const carouselItems = [
    {
      id: 'logs',
      title: 'Global Log Stream',
      icon: <Terminal size={24} />,
      content: (
        <div className="flex-1 font-mono text-xl text-white/40 space-y-4 p-12 overflow-hidden">
          <div className="text-blue-400">[INFO] <span className="text-white">Nexus-Core:</span> Initializing secure handshake with eu-west-1...</div>
          <div className="text-emerald-400">[SUCCESS] <span className="text-white">DB-Cluster:</span> Replication lag synchronized (0.02ms)</div>
          <div className="text-amber-400">[WARN] <span className="text-white">Edge-Proxy:</span> High latency detected on AP-South-1 gateway</div>
          <div className="text-red-400">[CRITICAL] <span className="text-white">Aegis-WAF:</span> Blocked distributed brute-force attack on /auth/login</div>
          <div className="text-blue-400">[INFO] <span className="text-white">Hypervisor:</span> Provisioning new Ubuntu 22.04 VM (ID: vm-8f2k)</div>
          <div className="text-emerald-400">[SUCCESS] <span className="text-white">Vault:</span> Master key rotation completed successfully</div>
          <div className="animate-pulse inline-block w-4 h-8 bg-primary ml-1" />
        </div>
      )
    },
    {
      id: 'tunnels',
      title: 'Active Network Tunnels',
      icon: <Network size={24} />,
      content: (
        <div className="flex-1 grid grid-cols-2 gap-8 p-12 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <Zap size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-widest">Tunnel-{i}00{i}</h3>
                  <p className="text-lg font-mono text-white/40">10.0.5.{i}2 → nexus.io:808{i}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-emerald-400 font-mono text-xl">ACTIVE</span>
                <span className="text-white/20 text-sm font-mono">LATENCY: {Math.floor(Math.random() * 20) + 5}ms</span>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'apm',
      title: 'APM Latency Distribution',
      icon: <Activity size={24} />,
      content: (
        <div className="flex-1 flex flex-col p-12 space-y-12">
          {[
            { label: 'API Gateway', val: 42, color: 'bg-indigo-500' },
            { label: 'Auth Service', val: 88, color: 'bg-emerald-500' },
            { label: 'Database Cluster', val: 156, color: 'bg-amber-500' },
            { label: 'S3 Storage Proxy', val: 24, color: 'bg-purple-500' },
          ].map((item, i) => (
            <div key={i} className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-2xl font-bold text-white uppercase tracking-widest">{item.label}</span>
                <span className="text-4xl font-serif italic text-white">{item.val}ms</span>
              </div>
              <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.val / 200) * 100}%` }}
                  className={`h-full ${item.color} shadow-[0_0_20px_rgba(255,255,255,0.2)]`}
                />
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden z-[9999] flex flex-col font-sans">
      {/* Top Header */}
      <div className="h-24 border-b border-white/10 flex items-center justify-between px-12 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <Zap size={32} className="fill-current" />
          </div>
          <div>
            <h1 className="text-4xl font-serif italic tracking-tight">NOC Command Center</h1>
            <p className="text-sm font-mono text-white/40 uppercase tracking-[0.5em]">BEXUS Infrastructure OS • Global Operations</p>
          </div>
        </div>
        <div className="flex items-center gap-12">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">System Time</span>
            <span className="text-3xl font-mono">{new Date().toLocaleTimeString([], { hour12: false })}</span>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Active Nodes</span>
            <span className="text-3xl font-mono text-emerald-400">144 / 144</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-px bg-white/10">
        
        {/* Left Column: Health Matrix & Gauges */}
        <div className="col-span-4 flex flex-col bg-black divide-y divide-white/10">
          {/* Health Matrix */}
          <div className="flex-1 p-12 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold uppercase tracking-widest text-white/40">Global Health Matrix</h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-mono text-white/40">OK</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[10px] font-mono text-white/40">ERR</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-3 flex-1 content-start">
              {nodes.map(node => (
                <div 
                  key={node.id} 
                  className={`aspect-square rounded-sm transition-all duration-500 ${
                    node.status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                    node.status === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' :
                    'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse'
                  }`}
                  title={node.name}
                />
              ))}
            </div>
          </div>

          {/* Gauges */}
          <div className="h-[400px] grid grid-cols-2 gap-px bg-white/10">
            <div className="bg-black flex items-center justify-center">
              <Gauge value={Math.round(cpu)} label="Cluster CPU" color="#818cf8" />
            </div>
            <div className="bg-black flex items-center justify-center">
              <Gauge value={Math.round(mem)} label="Cluster Memory" color="#10b981" />
            </div>
          </div>
        </div>

        {/* Center Column: Carousel */}
        <div className="col-span-5 bg-black flex flex-col relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={carouselIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="flex-1 flex flex-col"
            >
              <div className="h-20 border-b border-white/10 flex items-center justify-between px-12 bg-white/2">
                <div className="flex items-center gap-4">
                  <div className="text-primary">{carouselItems[carouselIndex].icon}</div>
                  <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-white/80">{carouselItems[carouselIndex].title}</h2>
                </div>
                <div className="flex gap-2">
                  {carouselItems.map((_, i) => (
                    <div key={i} className={`h-1 w-12 rounded-full transition-all duration-500 ${i === carouselIndex ? 'bg-primary' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
              {carouselItems[carouselIndex].content}
            </motion.div>
          </AnimatePresence>
          
          {/* Carousel Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
            <motion.div 
              key={carouselIndex}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 15, ease: "linear" }}
              className="h-full bg-primary"
            />
          </div>
        </div>

        {/* Right Column: Threat Ticker */}
        <div className="col-span-3 bg-black flex flex-col border-l border-white/10">
          <div className="h-20 border-b border-white/10 flex items-center px-12 bg-red-500/5">
            <div className="flex items-center gap-4">
              <ShieldAlert className="text-red-500" size={24} />
              <h2 className="text-2xl font-bold uppercase tracking-widest text-red-500">Live Threat Ticker</h2>
            </div>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-0 p-12 space-y-8">
              <AnimatePresence>
                {threats.map((threat, i) => (
                  <motion.div
                    key={threat.id}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    className="flex flex-col gap-2 border-b border-white/5 pb-6"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-4xl font-mono font-bold text-red-400">{threat.ip}</span>
                      <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-xs font-bold uppercase">
                        <Globe size={12} /> {threat.country}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-white/60 uppercase tracking-widest">{threat.rule}</span>
                      <span className="text-lg font-mono text-white/20">{threat.time}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Bottom Ticker Bar */}
      <div className="h-16 bg-primary text-primary-foreground flex items-center overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee items-center gap-12 text-lg font-bold uppercase tracking-widest">
          <span>System Status: Optimal</span>
          <div className="w-2 h-2 rounded-full bg-white" />
          <span>Active Connections: 12,842</span>
          <div className="w-2 h-2 rounded-full bg-white" />
          <span>Average Response Time: 14ms</span>
          <div className="w-2 h-2 rounded-full bg-white" />
          <span>WAF Blocks (24h): 4,281</span>
          <div className="w-2 h-2 rounded-full bg-white" />
          <span>Cluster Health: 100%</span>
          <div className="w-2 h-2 rounded-full bg-white" />
          <span>System Status: Optimal</span>
          <div className="w-2 h-2 rounded-full bg-white" />
          <span>Active Connections: 12,842</span>
          <div className="w-2 h-2 rounded-full bg-white" />
          <span>Average Response Time: 14ms</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}} />
    </div>
  );
};

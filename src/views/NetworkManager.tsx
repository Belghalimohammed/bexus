import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  Globe, 
  Zap, 
  ShieldAlert, 
  Search, 
  Filter, 
  Activity, 
  Lock, 
  AlertTriangle, 
  ChevronDown, 
  Check, 
  X, 
  MousePointer2,
  Bot,
  ShieldCheck,
  Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThreatPing {
  id: string;
  x: number;
  y: number;
  color: string;
}

interface TrafficLog {
  id: string;
  timestamp: string;
  ip: string;
  country: string;
  countryCode: string;
  rule: string;
  action: 'blocked' | 'challenged' | 'allowed';
  severity: 'high' | 'medium' | 'low';
}

const countries = [
  { code: 'CN', name: 'China' },
  { code: 'RU', name: 'Russia' },
  { code: 'KP', name: 'North Korea' },
  { code: 'IR', name: 'Iran' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
];

export const NetworkManager: React.FC = () => {
  const [pings, setPings] = useState<ThreatPing[]>([]);
  const [blockedCountries, setBlockedCountries] = useState<string[]>(['CN', 'RU', 'KP']);
  const [maxRequests, setMaxRequests] = useState(100);
  const [timeWindow, setTimeWindow] = useState(60);
  const [showCaptcha, setShowCaptcha] = useState(true);
  const [blockMalicious, setBlockMalicious] = useState(true);
  const [blockTor, setBlockTor] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(true);
  const [logs, setLogs] = useState<TrafficLog[]>([
    { id: '1', timestamp: '14:22:01', ip: '45.12.3.1', country: 'Russia', countryCode: 'RU', rule: 'SQL Injection Attempt', action: 'blocked', severity: 'high' },
    { id: '2', timestamp: '14:22:05', ip: '103.4.12.88', country: 'China', countryCode: 'CN', rule: 'Geo-Blocked Region', action: 'blocked', severity: 'medium' },
    { id: '3', timestamp: '14:22:12', ip: '192.168.1.45', country: 'USA', countryCode: 'US', rule: 'Rate Limit Exceeded', action: 'challenged', severity: 'low' },
    { id: '4', timestamp: '14:22:18', ip: '5.188.62.144', country: 'Netherlands', countryCode: 'NL', rule: 'Known Malicious IP', action: 'blocked', severity: 'high' },
  ]);

  // Simulate real-time pings
  useEffect(() => {
    const interval = setInterval(() => {
      const newPing: ThreatPing = {
        id: Math.random().toString(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: Math.random() > 0.7 ? '#ef4444' : '#f59e0b',
      };
      setPings(prev => [...prev.slice(-10), newPing]);
      
      // Add a log entry occasionally
      if (Math.random() > 0.8) {
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        const newLog: TrafficLog = {
          id: Math.random().toString(),
          timestamp: new Date().toLocaleTimeString([], { hour12: false }),
          ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          country: randomCountry.name,
          countryCode: randomCountry.code,
          rule: ['XSS Attack', 'Path Traversal', 'Bot Signature', 'Geo-Blocked'][Math.floor(Math.random() * 4)],
          action: 'blocked',
          severity: 'high'
        };
        setLogs(prev => [newLog, ...prev.slice(0, 9)]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleCountry = (code: string) => {
    setBlockedCountries(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden relative">
      <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400 border border-red-500/20">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="font-serif italic text-xl tracking-tight text-brand-text">Aegis WAF</h1>
            <p className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">Web Application Firewall & Threat Mitigation</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-[10px] font-bold uppercase">
            <ShieldCheck size={12} /> Protection Active
          </div>
          <div className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">
            Ruleset: <span className="text-brand-text">v4.2.0-stable</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
        {/* Global Threat Map */}
        <div className="bg-brand-sidebar border border-brand-border rounded-3xl p-8 relative overflow-hidden h-[400px]">
          <div className="absolute top-6 left-8 z-10">
            <h2 className="text-xs font-bold text-brand-text/60 uppercase tracking-widest mb-1">Global Threat Map</h2>
            <p className="text-[10px] font-mono text-brand-text/20 uppercase">Real-time Malicious Request Interception</p>
          </div>
          
          <div className="absolute top-6 right-8 z-10 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] font-bold text-red-400 uppercase">Critical Block</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="text-[10px] font-bold text-amber-400 uppercase">Challenge Issued</span>
            </div>
          </div>

          {/* Stylized World Map SVG */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <svg viewBox="0 0 1000 500" className="w-full h-full text-brand-text fill-current">
              <path d="M150,150 Q200,100 250,150 T350,150 T450,150 T550,150 T650,150 T750,150 T850,150" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
              {/* Simple representation of continents */}
              <path d="M100,100 L200,100 L250,200 L200,300 L100,300 Z" /> {/* NA */}
              <path d="M150,350 L250,350 L280,450 L200,480 L150,450 Z" /> {/* SA */}
              <path d="M450,100 L600,100 L650,200 L600,300 L500,300 L450,200 Z" /> {/* Europe/Africa */}
              <path d="M650,100 L900,100 L950,300 L800,450 L700,400 L650,200 Z" /> {/* Asia */}
              <path d="M800,400 L850,400 L870,450 L820,450 Z" /> {/* Australia */}
            </svg>
          </div>

          {/* Threat Pings */}
          <AnimatePresence>
            {pings.map(ping => (
              <motion.div
                key={ping.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ 
                  position: 'absolute', 
                  left: `${ping.x}%`, 
                  top: `${ping.y}%`,
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: ping.color,
                  boxShadow: `0 0 20px ${ping.color}`
                }}
              />
            ))}
          </AnimatePresence>

          <div className="absolute bottom-6 left-8 flex gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-brand-text/20 uppercase tracking-widest">Requests/Sec</span>
              <span className="text-2xl font-serif italic text-brand-text">1,284</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-brand-text/20 uppercase tracking-widest">Blocks/Min</span>
              <span className="text-2xl font-serif italic text-red-400">42</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-brand-text/20 uppercase tracking-widest">Avg Latency</span>
              <span className="text-2xl font-serif italic text-emerald-400">14ms</span>
            </div>
          </div>
        </div>

        {/* Configuration Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Geo-Blocking */}
          <div className="bg-brand-sidebar border border-brand-border rounded-3xl p-6 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-blue-400" />
              <h3 className="text-xs font-bold text-brand-text uppercase tracking-widest">Geo-Blocking</h3>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Restricted Regions</label>
              <div className="relative">
                <div className="flex flex-wrap gap-2 p-3 bg-brand-bg border border-brand-border rounded-xl min-h-[100px]">
                  {blockedCountries.map(code => (
                    <div key={code} className="flex items-center gap-2 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-[10px] font-bold text-red-400 uppercase">
                      {code}
                      <X size={10} className="cursor-pointer hover:text-red-300" onClick={() => toggleCountry(code)} />
                    </div>
                  ))}
                  <button className="text-[10px] font-bold text-brand-text/20 hover:text-brand-text transition-colors">+ Add Country</button>
                </div>
              </div>
              <p className="text-[9px] text-brand-text/30 leading-relaxed italic">Traffic from these regions will be dropped immediately at the edge.</p>
            </div>
          </div>

          {/* Card 2: Rate Limiting */}
          <div className="bg-brand-sidebar border border-brand-border rounded-3xl p-6 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Zap size={18} className="text-amber-400" />
              <h3 className="text-xs font-bold text-brand-text uppercase tracking-widest">Rate Limiting</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Max Requests</label>
                  <span className="text-[10px] font-mono text-amber-400">{maxRequests} reqs</span>
                </div>
                <input 
                  type="range" 
                  min="10" max="1000" 
                  value={maxRequests} 
                  onChange={(e) => setMaxRequests(parseInt(e.target.value))}
                  className="w-full accent-amber-500 h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Time Window</label>
                  <span className="text-[10px] font-mono text-amber-400">{timeWindow}s</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="300" 
                  value={timeWindow} 
                  onChange={(e) => setTimeWindow(parseInt(e.target.value))}
                  className="w-full accent-amber-500 h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Show CAPTCHA</span>
                <button 
                  onClick={() => setShowCaptcha(!showCaptcha)}
                  className={`w-10 h-5 rounded-full relative transition-all ${showCaptcha ? 'bg-amber-500' : 'bg-brand-bg border border-brand-border'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showCaptcha ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Bot Mitigation */}
          <div className="bg-brand-sidebar border border-brand-border rounded-3xl p-6 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Bot size={18} className="text-emerald-400" />
              <h3 className="text-xs font-bold text-brand-text uppercase tracking-widest">Bot Mitigation</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Block Malicious IPs', active: blockMalicious, setter: setBlockMalicious, icon: ShieldAlert },
                { label: 'Block Tor Exit Nodes', active: blockTor, setter: setBlockTor, icon: Lock },
                { label: 'AI Behavioral Analysis', active: aiAnalysis, setter: setAiAnalysis, icon: Activity },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-brand-bg/50 border border-brand-border rounded-xl">
                  <div className="flex items-center gap-3">
                    <item.icon size={14} className={item.active ? 'text-emerald-400' : 'text-brand-text/20'} />
                    <span className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">{item.label}</span>
                  </div>
                  <button 
                    onClick={() => item.setter(!item.active)}
                    className={`w-8 h-4 rounded-full relative transition-all ${item.active ? 'bg-emerald-500' : 'bg-brand-sidebar border border-brand-border'}`}
                  >
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${item.active ? 'left-4.5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Traffic Log */}
        <div className="bg-brand-sidebar border border-brand-border rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-bg/30">
            <div className="flex items-center gap-3">
              <Activity size={16} className="text-red-400" />
              <h2 className="text-xs font-bold text-brand-text uppercase tracking-widest">Real-time Traffic Log</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[9px] font-mono text-brand-text/40 uppercase">Monitoring Ingress</span>
              </div>
              <button className="p-2 hover:bg-brand-text/5 rounded-lg text-brand-text/30 hover:text-brand-text transition-all">
                <Filter size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border bg-brand-bg/20">
                  <th className="p-4 text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Timestamp</th>
                  <th className="p-4 text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Attacker IP</th>
                  <th className="p-4 text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Origin</th>
                  <th className="p-4 text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">WAF Rule Triggered</th>
                  <th className="p-4 text-[10px] font-bold text-brand-text/40 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {logs.map((log) => (
                  <tr key={log.id} className={`group transition-colors ${log.action === 'blocked' ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-brand-text/5'}`}>
                    <td className="p-4">
                      <span className="text-[10px] font-mono text-brand-text/40">{log.timestamp}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-mono font-bold ${log.action === 'blocked' ? 'text-red-400' : 'text-brand-text'}`}>{log.ip}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-3 bg-brand-text/10 rounded-sm flex items-center justify-center overflow-hidden">
                          <span className="text-[8px] font-bold">{log.countryCode}</span>
                        </div>
                        <span className="text-xs text-brand-text/60">{log.country}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={12} className={log.severity === 'high' ? 'text-red-400' : 'text-amber-400'} />
                        <span className="text-xs font-medium text-brand-text/80">{log.rule}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                        log.action === 'blocked' ? 'bg-red-500/20 text-red-400' :
                        log.action === 'challenged' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

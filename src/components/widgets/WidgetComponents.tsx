import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Server, Shuffle, Database, Cpu, TrendingUp, List, Activity, 
  Terminal as TerminalIcon, Play, Shield, AlertTriangle, GitBranch, 
  Webhook, StickyNote, Globe, ExternalLink, Copy, CheckCircle2, 
  XCircle, Loader2, Clock, Search, Power, MoreVertical, 
  ArrowRight, Lock, Key, Mail, User, Github, Gitlab, 
  RefreshCw, Smartphone, Monitor, Phone as PhoneIcon, Chrome, 
  Globe as WorldClockIcon, Trash2, Plus, Upload, AlertCircle,
  ChevronRight, Eye, EyeOff, X, QrCode, LogOut
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

// --- Infrastructure & Topology ---

export const DockerNode: React.FC<{ name: string; image: string; status: 'up' | 'down' }> = ({ name, image, status }) => (
  <div className="p-4 h-full flex flex-col justify-between relative">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-primary">
          <Box size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">{name}</h3>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{image}</p>
        </div>
      </div>
      <div className={`w-2 h-2 rounded-full ${status === 'up' ? 'bg-emerald-500 shadow-[0_0_8px_var(--emerald-500)]' : 'bg-red-500 shadow-[0_0_8px_var(--red-500)]'}`} />
    </div>
    
    {/* Connection Points */}
    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-200 rounded-full z-10" />
    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-200 rounded-full z-10" />
  </div>
);

export const VMNode: React.FC<{ name: string; os: string; cpu: string; ram: string }> = ({ name, os, cpu, ram }) => {
  const [isOn, setIsOn] = useState(true);
  return (
    <div className="p-4 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
            <Server size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{name}</h3>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{os}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOn(!isOn)}
          className={`w-10 h-5 rounded-full transition-all relative ${isOn ? 'bg-emerald-500' : 'bg-slate-300'}`}
        >
          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isOn ? 'right-1' : 'left-1'}`} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">vCPU</p>
          <p className="text-xs font-bold text-slate-700">{cpu}</p>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">RAM</p>
          <p className="text-xs font-bold text-slate-700">{ram}</p>
        </div>
      </div>
    </div>
  );
};

export const LoadBalancerNode: React.FC<{ name: string; algorithm: string }> = ({ name, algorithm }) => (
  <div className="p-4 h-full flex flex-col justify-center items-center relative">
    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
      <Shuffle size={24} />
    </div>
    <h3 className="text-sm font-bold text-slate-900">{name}</h3>
    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{algorithm}</p>
    
    {/* Visual Routing Lines */}
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-px bg-slate-200" />
    <div className="absolute right-0 top-1/3 w-8 h-px bg-slate-200" />
    <div className="absolute right-0 top-2/3 w-8 h-px bg-slate-200" />
  </div>
);

export const S3BucketNode: React.FC<{ name: string; size: string }> = ({ name, size }) => (
  <div className="p-4 h-full flex flex-col items-center justify-center">
    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-2">
      <Database size={24} />
    </div>
    <h3 className="text-sm font-bold text-slate-900">{name}</h3>
    <p className="text-lg font-mono font-bold text-slate-700 mt-1">{size}</p>
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Size</p>
  </div>
);

// --- Telemetry & Metrics ---

export const RadialGauge: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  const color = value > 80 ? 'text-red-500' : value > 60 ? 'text-amber-500' : 'text-emerald-500';
  const stroke = value > 80 ? '#ef4444' : value > 60 ? '#f59e0b' : '#10b981';
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="p-4 h-full flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90">
          <circle cx="48" cy="48" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
          <circle 
            cx="48" cy="48" r={radius} fill="transparent" stroke={stroke} strokeWidth="8" 
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-bold ${color}`}>{value}%</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
      </div>
    </div>
  );
};

export const NetworkSparkline: React.FC = () => {
  const [data, setData] = useState(Array.from({ length: 20 }, (_, i) => ({ time: i, value: 20 + Math.random() * 40 })));

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, value: 20 + Math.random() * 40 }];
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network I/O (Mbps)</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Live</span>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const TopProcesses: React.FC = () => (
  <div className="p-4 h-full flex flex-col">
    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Top Processes</h3>
    <div className="space-y-2">
      {[
        { name: 'node', cpu: '12.4%', ram: '256MB' },
        { name: 'postgres', cpu: '8.1%', ram: '512MB' },
        { name: 'nginx', cpu: '2.3%', ram: '64MB' },
      ].map((p, i) => (
        <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
          <span className="text-xs font-mono font-bold text-slate-700">{p.name}</span>
          <div className="flex gap-3">
            <span className="text-[10px] font-mono text-emerald-600 font-bold">{p.cpu}</span>
            <span className="text-[10px] font-mono text-slate-400">{p.ram}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const UptimeSLA: React.FC = () => (
  <div className="p-4 h-full flex flex-col items-center justify-center">
    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Uptime SLA</h3>
    <p className="text-4xl font-serif italic font-bold text-slate-900 tracking-tight">99.99%</p>
    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Trailing 30 Days</p>
  </div>
);

// --- Interactive & Control ---

export const MiniTerminalWidget: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      theme: {
        background: '#020617',
        foreground: '#f8fafc',
        cursor: '#3b82f6',
      },
      fontSize: 12,
      fontFamily: 'JetBrains Mono, monospace',
      cursorBlink: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    term.writeln('\x1b[1;34mBEXUS OS Terminal v2.0\x1b[0m');
    term.writeln('Connected to: \x1b[1;32mproduction-api-01\x1b[0m');
    term.write('\r\n\x1b[1;32madmin@bexus\x1b[0m:\x1b[1;34m~\x1b[0m$ ');

    term.onData(data => {
      if (data === '\r') {
        term.write('\r\n\x1b[1;32madmin@bexus\x1b[0m:\x1b[1;34m~\x1b[0m$ ');
      } else {
        term.write(data);
      }
    });

    xtermRef.current = term;

    return () => {
      term.dispose();
    };
  }, []);

  return (
    <div className="h-full bg-slate-950 p-2 overflow-hidden">
      <div ref={terminalRef} className="h-full w-full" />
    </div>
  );
};

export const QuickScript: React.FC<{ label: string }> = ({ label }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const run = () => {
    setLoading(true);
    setSuccess(false);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="p-4 h-full flex flex-col items-center justify-center">
      <button 
        onClick={run}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${
          success 
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
            : 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
        }`}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : success ? <CheckCircle2 size={16} /> : <Play size={16} />}
        {loading ? 'Executing...' : success ? 'Completed' : label}
      </button>
      <p className="text-[9px] text-slate-400 mt-3 uppercase tracking-widest font-bold">Custom Bash Script</p>
    </div>
  );
};

export const SQLRunner: React.FC = () => {
  const [query, setQuery] = useState('SELECT * FROM users LIMIT 5;');
  return (
    <div className="p-4 h-full flex flex-col gap-3">
      <div className="flex-1 flex flex-col gap-2">
        <textarea 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-600 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
        <button className="py-2 bg-slate-900 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-slate-800 transition-all">
          Run Query
        </button>
      </div>
      <div className="h-24 bg-slate-950 rounded-lg p-3 overflow-auto custom-scrollbar">
        <pre className="text-[10px] text-emerald-400 font-mono">
          {JSON.stringify([
            { id: 1, name: 'Mohammed', role: 'Admin' },
            { id: 2, name: 'Sarah', role: 'DevOps' }
          ], null, 2)}
        </pre>
      </div>
    </div>
  );
};

// --- Security & Edge ---

export const TunnelsList: React.FC = () => (
  <div className="p-4 h-full flex flex-col">
    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Active Tunnels</h3>
    <div className="space-y-2 overflow-y-auto custom-scrollbar pr-1">
      {[
        { url: 'api-staging.bexus.run', type: 'Ngrok' },
        { url: 'web-prod.bexus.run', type: 'Cloudflare' },
        { url: 'db-proxy.bexus.run', type: 'Custom' },
      ].map((t, i) => (
        <div key={i} className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between group">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-900 truncate max-w-[120px]">{t.url}</span>
            <span className="text-[8px] text-slate-400 uppercase font-bold">{t.type}</span>
          </div>
          <button className="p-1.5 text-slate-400 hover:text-primary transition-colors">
            <Copy size={12} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

export const WAFCounter: React.FC = () => (
  <div className="p-4 h-full flex flex-col items-center justify-center">
    <div className="relative mb-2">
      <Shield size={32} className="text-red-500" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white" />
    </div>
    <p className="text-4xl font-bold text-slate-900">1,428</p>
    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1">Threats Blocked Today</p>
  </div>
);

export const SSLExpiry: React.FC = () => (
  <div className="p-4 h-full flex flex-col">
    <div className="flex items-center gap-2 mb-3">
      <AlertTriangle size={16} className="text-amber-500" />
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SSL Expiry Warnings</h3>
    </div>
    <div className="space-y-2">
      {[
        { domain: 'dev.bexus.run', days: 3 },
        { domain: 'test.bexus.run', days: 5 },
      ].map((d, i) => (
        <div key={i} className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs font-bold text-amber-900">{d.domain}</p>
          <p className="text-[10px] text-amber-700 mt-0.5">Expires in {d.days} days</p>
        </div>
      ))}
    </div>
  </div>
);

// --- Developer & CI/CD ---

export const GitStream: React.FC = () => (
  <div className="p-4 h-full flex flex-col">
    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Commit Stream</h3>
    <div className="space-y-4 relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
      {[
        { msg: 'feat: add profile page', hash: '7f3a2d', user: 'Mohammed' },
        { msg: 'fix: sidebar layout', hash: '2b9e1c', user: 'Sarah' },
        { msg: 'chore: update deps', hash: '9d4f5g', user: 'Bot' },
      ].map((c, i) => (
        <div key={i} className="flex items-start gap-4 relative z-10">
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
            {c.user[0]}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 leading-tight">{c.msg}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] font-mono text-slate-400">{c.hash}</span>
              <span className="text-[9px] font-bold text-primary uppercase tracking-tighter">{c.user}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const PipelineStatus: React.FC = () => (
  <div className="p-4 h-full flex flex-col justify-center">
    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Pipeline: Core-API</h3>
    <div className="flex items-center gap-2">
      {[
        { name: 'Build', status: 'success' },
        { name: 'Test', status: 'running' },
        { name: 'Deploy', status: 'idle' },
      ].map((s, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className={`w-full h-2 rounded-full ${
              s.status === 'success' ? 'bg-emerald-500' : 
              s.status === 'running' ? 'bg-blue-500 animate-pulse' : 
              'bg-slate-200'
            }`} />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{s.name}</span>
          </div>
          {i < 2 && <ArrowRight size={12} className="text-slate-300 mb-4" />}
        </React.Fragment>
      ))}
    </div>
  </div>
);

export const WebhookTrigger: React.FC = () => {
  const [active, setActive] = useState(false);
  const trigger = () => {
    setActive(true);
    setTimeout(() => setActive(false), 1000);
  };

  return (
    <div className={`p-4 h-full flex flex-col items-center justify-center transition-all duration-300 ${active ? 'bg-primary/10' : ''}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${active ? 'bg-primary text-white scale-110' : 'bg-slate-100 text-slate-400'}`}>
        <Webhook size={24} />
      </div>
      <div className="w-full space-y-2">
        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 text-center block">Webhook Endpoint</label>
        <div className="flex gap-2">
          <input readOnly value="https://hooks.bexus.run/tr_8f2k9l" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-mono text-slate-600" />
          <button onClick={trigger} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-primary transition-all"><Copy size={14} /></button>
        </div>
      </div>
    </div>
  );
};

// --- Utilities & Custom ---

export const StickyNoteWidget: React.FC = () => (
  <div className="p-4 h-full bg-yellow-50 flex flex-col">
    <div className="flex items-center gap-2 mb-2 text-yellow-700">
      <StickyNote size={14} />
      <span className="text-[10px] font-bold uppercase tracking-widest">Admin Note</span>
    </div>
    <textarea 
      defaultValue="Remember to flush Redis cache after the next deployment. Password for staging DB: bexus_admin_2024"
      className="flex-1 bg-transparent text-xs text-yellow-900/80 outline-none resize-none font-medium leading-relaxed"
    />
  </div>
);

export const WorldClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (offset: number) => {
    const d = new Date(time.getTime() + offset * 3600000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="p-4 h-full flex flex-col justify-center gap-4">
      {[
        { label: 'UTC', offset: 0 },
        { label: 'New York', offset: -5 },
        { label: 'Tokyo', offset: 9 },
      ].map((c, i) => (
        <div key={i} className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.label}</span>
          <span className="text-sm font-mono font-bold text-slate-900">{formatTime(c.offset)}</span>
        </div>
      ))}
    </div>
  );
};

export const IframeEmbed: React.FC = () => {
  const [url, setUrl] = useState('https://picsum.photos/seed/bexus/800/600');
  return (
    <div className="h-full flex flex-col">
      <div className="p-2 bg-slate-50 border-b border-slate-100 flex gap-2">
        <input 
          type="text" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-[10px] outline-none"
        />
        <ExternalLink size={12} className="text-slate-400 mt-1" />
      </div>
      <div className="flex-1 bg-slate-100">
        <iframe src={url} className="w-full h-full border-none" title="Embed" />
      </div>
    </div>
  );
};

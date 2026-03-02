import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Clock, 
  AlertCircle, 
  Zap, 
  Database, 
  Search, 
  Filter, 
  Copy, 
  Stethoscope, 
  ChevronRight, 
  Terminal,
  ArrowDownRight,
  ArrowUpRight,
  MoreVertical,
  BarChart3,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';

interface TraceSegment {
  id: string;
  label: string;
  duration: number; // in ms
  startOffset: number; // in ms
  type: 'dns' | 'ssl' | 'proxy' | 'app' | 'db' | 'render';
}

interface SlowQuery {
  id: string;
  query: string;
  executionTime: number;
  calls: number;
  impact: 'high' | 'medium' | 'low';
}

const generateSparklineData = (count: number, min: number, max: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    value: Math.floor(Math.random() * (max - min + 1) + min),
    time: i
  }));
};

export const DeepTraceAPM: React.FC = () => {
  const [selectedTraceId, setSelectedTraceId] = useState('trace-8f2k9l');
  
  const p99Data = useMemo(() => generateSparklineData(20, 120, 180), []);
  const errorRateData = useMemo(() => generateSparklineData(20, 0, 5), []);
  const rpmData = useMemo(() => generateSparklineData(20, 800, 1200), []);

  const traceSegments: TraceSegment[] = [
    { id: '1', label: 'DNS Lookup', duration: 12, startOffset: 0, type: 'dns' },
    { id: '2', label: 'SSL Handshake', duration: 24, startOffset: 12, type: 'ssl' },
    { id: '3', label: 'Nginx Proxy Ingress', duration: 8, startOffset: 36, type: 'proxy' },
    { id: '4', label: 'Auth Middleware', duration: 45, startOffset: 44, type: 'app' },
    { id: '5', label: 'SELECT * FROM users WHERE id = ?', duration: 182, startOffset: 89, type: 'db' },
    { id: '6', label: 'SELECT * FROM permissions WHERE user_id = ?', duration: 64, startOffset: 110, type: 'db' },
    { id: '7', label: 'JSON Serialization', duration: 15, startOffset: 271, type: 'app' },
    { id: '8', label: 'Client Render / Hydration', duration: 32, startOffset: 286, type: 'render' },
  ];

  const slowQueries: SlowQuery[] = [
    { id: 'q1', query: 'SELECT u.*, p.meta FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.last_login > NOW() - INTERVAL \'30 days\' ORDER BY u.created_at DESC LIMIT 100;', executionTime: 452, calls: 1204, impact: 'high' },
    { id: 'q2', query: 'UPDATE containers SET status = \'unhealthy\' WHERE last_ping < NOW() - INTERVAL \'5 minutes\' AND provider_id = 42;', executionTime: 215, calls: 840, impact: 'medium' },
    { id: 'q3', query: 'SELECT COUNT(*) FROM audit_logs WHERE severity = \'critical\' AND timestamp > CURRENT_DATE;', executionTime: 184, calls: 4502, impact: 'medium' },
    { id: 'q4', query: 'DELETE FROM session_cache WHERE expires_at < NOW();', executionTime: 92, calls: 12, impact: 'low' },
  ];

  const totalDuration = Math.max(...traceSegments.map(s => s.startOffset + s.duration));

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden relative">
      <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 border border-purple-500/20">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="font-serif italic text-xl tracking-tight text-brand-text">Deep Trace APM</h1>
            <p className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">High-Performance Performance Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-[10px] font-bold uppercase">
            <Zap size={12} /> Real-time Profiling Active
          </div>
          <button className="p-2 hover:bg-brand-text/5 rounded-lg text-brand-text/30 hover:text-brand-text transition-all">
            <Settings size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
          {/* Top Sparkline Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'P99 Latency', value: '142ms', trend: 'up', data: p99Data, color: '#818cf8' },
              { label: 'Error Rate', value: '0.04%', trend: 'down', data: errorRateData, color: '#f87171' },
              { label: 'Requests / Min', value: '1,204', trend: 'up', data: rpmData, color: '#34d399' },
            ].map((metric, idx) => (
              <div key={idx} className="bg-brand-sidebar border border-brand-border rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group">
                <div className="flex justify-between items-start z-10">
                  <div>
                    <p className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest mb-1">{metric.label}</p>
                    <h3 className="text-3xl font-serif italic text-brand-text">{metric.value}</h3>
                  </div>
                  <div className={`p-1.5 rounded-lg ${metric.trend === 'up' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {metric.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  </div>
                </div>
                <div className="h-16 w-full -mb-2 -mx-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metric.data}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={metric.color} 
                        strokeWidth={2} 
                        dot={false} 
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>

          {/* Waterfall Chart / Flame Graph */}
          <div className="bg-brand-sidebar border border-brand-border rounded-3xl p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Waterfall Trace Analyzer</h2>
                  <span className="text-[10px] font-mono text-brand-text/30">Trace ID: {selectedTraceId} • 200 OK • {totalDuration}ms Total</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-[10px] font-bold uppercase text-brand-text/40 hover:text-brand-text transition-all">
                  Next Trace
                </button>
                <button className="p-2 hover:bg-brand-text/5 rounded-lg text-brand-text/30 hover:text-brand-text transition-all">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Timeline Ruler */}
              <div className="flex h-6 border-b border-brand-border relative mb-4">
                {[0, 25, 50, 75, 100].map(percent => (
                  <div 
                    key={percent} 
                    className="absolute h-full border-l border-brand-border/30 flex items-end pb-1"
                    style={{ left: `${percent}%` }}
                  >
                    <span className="text-[8px] font-mono text-brand-text/20 ml-1">
                      {Math.round((totalDuration * percent) / 100)}ms
                    </span>
                  </div>
                ))}
              </div>

              {/* Waterfall Rows */}
              <div className="space-y-2">
                {traceSegments.map((segment) => (
                  <div key={segment.id} className="group relative">
                    <div className="flex items-center h-8 hover:bg-white/2 rounded transition-colors px-2">
                      <div className="w-48 shrink-0 flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          segment.type === 'db' ? 'bg-amber-500' :
                          segment.type === 'app' ? 'bg-indigo-500' :
                          'bg-slate-500'
                        }`} />
                        <span className="text-[10px] font-mono text-brand-text/60 truncate group-hover:text-brand-text transition-colors">
                          {segment.label}
                        </span>
                      </div>
                      <div className="flex-1 relative h-4">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(segment.duration / totalDuration) * 100}%` }}
                          style={{ left: `${(segment.startOffset / totalDuration) * 100}%` }}
                          className={`absolute h-full rounded-sm shadow-lg ${
                            segment.duration > 150 ? 'bg-red-500/40 border border-red-500/50' :
                            segment.duration > 50 ? 'bg-amber-500/40 border border-amber-500/50' :
                            'bg-indigo-500/20 border border-indigo-500/30'
                          }`}
                        >
                          <div className="absolute inset-0 flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[8px] font-bold text-white/60">{segment.duration}ms</span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center gap-4">
              <AlertCircle size={18} className="text-red-400 shrink-0" />
              <p className="text-[10px] text-brand-text/60 leading-relaxed uppercase tracking-wider">
                <span className="text-red-400 font-bold">Bottleneck Detected:</span> The database query <span className="text-white font-mono">SELECT * FROM users...</span> is taking <span className="text-white">182ms</span>, which is 57% of the total request time.
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Slow Query Analyzer */}
        <div className="w-96 border-l border-brand-border bg-brand-sidebar flex flex-col">
          <div className="p-6 border-b border-brand-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Slow Query Analyzer</h3>
              </div>
              <button className="p-1.5 hover:bg-brand-text/5 rounded text-brand-text/40 hover:text-brand-text transition-all">
                <Filter size={14} />
              </button>
            </div>
            
            <div className="space-y-4">
              {slowQueries.map((query) => (
                <div key={query.id} className="p-4 bg-brand-bg/50 border border-brand-border rounded-2xl space-y-4 group hover:border-amber-500/30 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        query.impact === 'high' ? 'bg-red-500 animate-pulse' :
                        query.impact === 'medium' ? 'bg-amber-500' :
                        'bg-blue-500'
                      }`} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        query.impact === 'high' ? 'text-red-400' :
                        query.impact === 'medium' ? 'text-amber-400' :
                        'text-blue-400'
                      }`}>
                        {query.impact} Impact
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-brand-text/30">{query.calls} calls/min</span>
                  </div>

                  <div className="relative">
                    <div className="bg-slate-950 rounded-xl p-3 font-mono text-[10px] text-indigo-300/80 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                      {query.query}
                    </div>
                    <button className="absolute top-2 right-2 p-1.5 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:text-white">
                      <Copy size={12} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-brand-text/30 uppercase font-bold tracking-tighter">Avg Exec Time</span>
                      <span className="text-xs font-mono font-bold text-brand-text">{query.executionTime}ms</span>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-[9px] font-bold uppercase hover:bg-indigo-500 hover:text-white transition-all">
                      <Stethoscope size={12} /> Optimize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 mt-auto bg-brand-bg/30">
            <div className="flex items-center gap-3 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 shrink-0">
                <Stethoscope size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-text uppercase tracking-widest">AI Doctor Insight</p>
                <p className="text-[10px] text-brand-text/40 leading-relaxed">3 queries can be optimized by adding composite indexes.</p>
              </div>
              <ChevronRight size={16} className="text-brand-text/20 ml-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

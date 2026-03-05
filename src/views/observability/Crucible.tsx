import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Target, 
  Activity, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  Shield, 
  Box, 
  Server, 
  Network, 
  Clock, 
  TrendingUp,
  Cpu,
  Database,
  Skull,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

type VictimType = 'container' | 'vm' | 'network';

interface Victim {
  id: string;
  name: string;
  type: VictimType;
  status: 'healthy' | 'unstable' | 'down';
}

const VICTIMS: Victim[] = [
  { id: 'v1', name: 'nginx-gateway', type: 'container', status: 'healthy' },
  { id: 'v2', name: 'db-prod-primary', type: 'container', status: 'healthy' },
  { id: 'v3', name: 'api-worker-pool', type: 'vm', status: 'healthy' },
  { id: 'v4', name: 'us-east-route', type: 'network', status: 'healthy' },
];

export const Crucible: React.FC = () => {
  const [selectedVictim, setSelectedVictim] = useState<Victim>(VICTIMS[0]);
  const [isChaosActive, setIsChaosActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [survivalScore, setSurvivalScore] = useState(100);
  const [activeAttacks, setActiveAttacks] = useState<string[]>([]);
  const [latencyValue, setLatencyValue] = useState(500);

  // Mock metrics for the survival chart
  const [metrics, setMetrics] = useState(Array.from({ length: 20 }, (_, i) => ({ time: i, score: 100 })));

  useEffect(() => {
    let interval: any;
    if (isChaosActive && countdown > 0) {
      interval = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0 && isChaosActive) {
      // Chaos is actually running
      interval = setInterval(() => {
        setSurvivalScore(prev => {
          const drop = activeAttacks.length * (Math.random() * 5);
          const newScore = Math.max(0, prev - drop + (Math.random() * 2)); // Some auto-healing
          setMetrics(m => [...m.slice(1), { time: m[m.length-1].time + 1, score: newScore }]);
          return newScore;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isChaosActive, countdown, activeAttacks]);

  const initiateChaos = () => {
    if (activeAttacks.length === 0) return;
    setIsChaosActive(true);
    setCountdown(5);
    setSurvivalScore(100);
    setMetrics(Array.from({ length: 20 }, (_, i) => ({ time: i, score: 100 })));
  };

  const stopChaos = () => {
    setIsChaosActive(false);
    setCountdown(0);
    setActiveAttacks([]);
  };

  const toggleAttack = (id: string) => {
    if (isChaosActive) return;
    setActiveAttacks(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      {/* Header with Hazard Aesthetic */}
      <header className="h-24 border-b border-slate-200 bg-white relative overflow-hidden flex items-center px-8 shrink-0">
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 20px, transparent 20px, transparent 40px)' 
          }} 
        />
        <div className="flex items-center gap-6 z-10">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Skull size={24} />
          </div>
          <div>
            <h1 className="font-serif italic text-2xl tracking-tight text-slate-900">The Crucible</h1>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1 font-bold">Chaos Engineering Laboratory</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-8 z-10">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Resilience</span>
            <span className={`text-2xl font-mono font-bold ${survivalScore > 70 ? 'text-emerald-500' : survivalScore > 30 ? 'text-amber-500' : 'text-red-500'}`}>
              {survivalScore.toFixed(1)}%
            </span>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Experiments</p>
              <p className="text-xs font-bold text-slate-900">{isChaosActive ? activeAttacks.length : 0} Running</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${isChaosActive ? 'bg-red-500 animate-pulse' : 'bg-slate-200'}`} />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          
          {/* Left Column: Configuration */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {/* Blast Radius Selector */}
            <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Target size={18} className="text-primary" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Blast Radius Selector</h2>
              </div>
              
              <div className="space-y-3">
                {VICTIMS.map(victim => (
                  <button
                    key={victim.id}
                    disabled={isChaosActive}
                    onClick={() => setSelectedVictim(victim)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      selectedVictim.id === victim.id 
                        ? 'bg-primary/5 border-primary text-primary shadow-sm' 
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {victim.type === 'container' ? <Box size={16} /> : victim.type === 'vm' ? <Server size={16} /> : <Network size={16} />}
                      <div className="text-left">
                        <p className="text-xs font-bold">{victim.name}</p>
                        <p className="text-[9px] uppercase font-bold opacity-60">{victim.type}</p>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </button>
                ))}
              </div>
            </section>

            {/* The Big Red Button */}
            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                <Timer size={32} className={isChaosActive ? 'text-red-500 animate-spin-slow' : 'text-slate-300'} />
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isChaosActive ? (countdown > 0 ? `Initializing in ${countdown}s` : 'Experiment in Progress') : 'Ready for Deployment'}
              </h3>
              <p className="text-xs text-slate-400 mb-8 max-w-[200px]">
                Initiating chaos will simulate real-world failures on the selected target.
              </p>

              {!isChaosActive ? (
                <button
                  onClick={initiateChaos}
                  disabled={activeAttacks.length === 0}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-red-600/20 hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                >
                  Initiate Chaos
                </button>
              ) : (
                <button
                  onClick={stopChaos}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-slate-900/20 hover:bg-black transition-all"
                >
                  Terminate Experiment
                </button>
              )}
            </section>
          </div>

          {/* Right Column: Attack Vectors & Monitoring */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Attack Vectors Grid */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Zap size={18} className="text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Attack Vectors</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Latency Injection */}
                <div 
                  onClick={() => toggleAttack('latency')}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer group ${
                    activeAttacks.includes('latency') 
                      ? 'bg-amber-50 border-amber-200 shadow-md' 
                      : 'bg-white border-slate-200 hover:border-amber-200'
                  }`}
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                    <Clock size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Latency Injection</h4>
                  <p className="text-[10px] text-slate-400 mb-4">Add artificial delay to network requests.</p>
                  {activeAttacks.includes('latency') && (
                    <div className="space-y-2" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-between text-[9px] font-bold text-amber-600 uppercase">
                        <span>Delay</span>
                        <span>{latencyValue}ms</span>
                      </div>
                      <input 
                        type="range" 
                        min="100" 
                        max="2000" 
                        step="100"
                        value={latencyValue}
                        onChange={e => setLatencyValue(parseInt(e.target.value))}
                        className="w-full h-1 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  )}
                </div>

                {/* Memory Leak */}
                <div 
                  onClick={() => toggleAttack('memory')}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer group ${
                    activeAttacks.includes('memory') 
                      ? 'bg-red-50 border-red-200 shadow-md' 
                      : 'bg-white border-slate-200 hover:border-red-200'
                  }`}
                >
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-transform">
                    <Cpu size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Memory Leak</h4>
                  <p className="text-[10px] text-slate-400">Slowly consume RAM until OOM-kill occurs.</p>
                </div>

                {/* Pod Sniper */}
                <div 
                  onClick={() => toggleAttack('sniper')}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer group ${
                    activeAttacks.includes('sniper') 
                      ? 'bg-slate-900 border-slate-900 shadow-md text-white' 
                      : 'bg-white border-slate-200 hover:border-slate-900'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                    activeAttacks.includes('sniper') ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Skull size={20} />
                  </div>
                  <h4 className="text-sm font-bold mb-1">Pod Sniper</h4>
                  <p className={`text-[10px] ${activeAttacks.includes('sniper') ? 'text-slate-400' : 'text-slate-400'}`}>Randomly restart containers in the cluster.</p>
                </div>
              </div>
            </section>

            {/* Survival Monitoring */}
            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-primary" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Survival Score Widget</h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Auto-Healing Active</span>
                  </div>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ display: 'none' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                      animationDuration={300}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-8 mt-8 border-t border-slate-50 pt-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Peak Impact</p>
                  <p className="text-xl font-mono font-bold text-red-500">-{ (100 - Math.min(...metrics.map(m => m.score))).toFixed(1) }%</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recovery Time</p>
                  <p className="text-xl font-mono font-bold text-slate-900">14.2s</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Resilience Tier</p>
                  <p className="text-xl font-mono font-bold text-emerald-500">Alpha</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

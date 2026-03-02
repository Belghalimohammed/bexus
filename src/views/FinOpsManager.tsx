import React, { useState, useMemo } from 'react';
import { 
  TrendingDown, 
  Leaf, 
  DollarSign, 
  Zap, 
  ArrowDownRight, 
  Maximize2, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OverprovisionedContainer {
  id: string;
  name: string;
  allocatedRam: string;
  usedRam: string;
  wastePercentage: number;
  potentialSavings: string;
}

export const FinOpsManager: React.FC = () => {
  const [isRightsizing, setIsRightsizing] = useState<string | null>(null);
  const [containers, setContainers] = useState<OverprovisionedContainer[]>([
    { id: 'c1', name: 'nexus-api-gateway', allocatedRam: '4.0 GB', usedRam: '240 MB', wastePercentage: 94, potentialSavings: '$42.50' },
    { id: 'c2', name: 'auth-service-replica', allocatedRam: '2.0 GB', usedRam: '120 MB', wastePercentage: 94, potentialSavings: '$21.25' },
    { id: 'c3', name: 'billing-engine-v2', allocatedRam: '8.0 GB', usedRam: '1.2 GB', wastePercentage: 85, potentialSavings: '$85.00' },
    { id: 'c4', name: 'redis-cache-layer', allocatedRam: '4.0 GB', usedRam: '3.8 GB', wastePercentage: 5, potentialSavings: '$2.10' },
    { id: 'c5', name: 'worker-node-04', allocatedRam: '16.0 GB', usedRam: '2.4 GB', wastePercentage: 85, potentialSavings: '$170.00' },
  ]);

  const handleRightsize = (id: string) => {
    setIsRightsizing(id);
    setTimeout(() => {
      setContainers(prev => prev.filter(c => c.id !== id));
      setIsRightsizing(null);
    }, 1500);
  };

  const totalMonthlySavings = useMemo(() => {
    return containers.reduce((acc, c) => acc + parseFloat(c.potentialSavings.replace('$', '')), 0) + 1240.50;
  }, [containers]);

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden relative">
      {/* Header */}
      <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <TrendingDown size={20} />
          </div>
          <div>
            <h1 className="font-serif italic text-xl tracking-tight text-brand-text">FinOps & Analytics</h1>
            <p className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">Financial & Ecological Infrastructure Optimization</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-[10px] font-bold uppercase">
            <Activity size={12} /> Optimization Engine: Active
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
        {/* Top Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Savings Calculator */}
          <div className="md:col-span-2 bg-gradient-to-br from-brand-sidebar to-brand-bg border border-brand-border rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <DollarSign size={240} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h2 className="text-xs font-bold text-brand-text/40 uppercase tracking-widest mb-4">Estimated Monthly Savings</h2>
                <div className="flex items-baseline gap-4">
                  <span className="text-7xl font-serif italic text-emerald-400 tracking-tighter">
                    ${totalMonthlySavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <div className="flex items-center gap-1 text-emerald-400/60 font-mono text-sm">
                    <ArrowDownRight size={16} />
                    <span>vs. AWS/GCP</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-brand-border/50 flex gap-12">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-brand-text/20 uppercase tracking-widest">Compute Efficiency</span>
                  <span className="text-xl font-mono text-brand-text">94.2%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-brand-text/20 uppercase tracking-widest">Storage ROI</span>
                  <span className="text-xl font-mono text-brand-text">3.8x</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-brand-text/20 uppercase tracking-widest">Annual Projection</span>
                  <span className="text-xl font-mono text-emerald-400/80">${(totalMonthlySavings * 12).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Carbon Footprint Widget */}
          <div className="bg-brand-sidebar border border-brand-border rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Leaf size={120} />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-bold text-brand-text/40 uppercase tracking-widest">Carbon Footprint</h2>
                <Leaf size={18} className="text-emerald-400" />
              </div>
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-4xl font-serif italic text-emerald-400">1.24 <span className="text-sm font-mono not-italic text-emerald-400/40">kW/h</span></span>
                  <p className="text-[10px] font-mono text-brand-text/30 uppercase">Current Power Consumption</p>
                </div>
                <div className="space-y-1">
                  <span className="text-4xl font-serif italic text-emerald-400">0.82 <span className="text-sm font-mono not-italic text-emerald-400/40">kg CO2e</span></span>
                  <p className="text-[10px] font-mono text-brand-text/30 uppercase">Estimated Daily Emissions</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Carbon Neutral Target: 2028</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Waste Analyzer */}
        <div className="bg-brand-sidebar border border-brand-border rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-brand-border flex items-center justify-between bg-brand-bg/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 border border-amber-500/20">
                <AlertCircle size={20} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-brand-text uppercase tracking-widest">Resource Waste Analyzer</h2>
                <p className="text-[10px] font-mono text-brand-text/30 uppercase">Detected Over-provisioned Containers</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[9px] font-mono text-brand-text/40 uppercase">Scanning Infrastructure</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border bg-brand-bg/20">
                  <th className="p-6 text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Container Name</th>
                  <th className="p-6 text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Allocation</th>
                  <th className="p-6 text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Actual Usage</th>
                  <th className="p-6 text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Waste Index</th>
                  <th className="p-6 text-[10px] font-bold text-brand-text/40 uppercase tracking-widest text-right">Optimization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                <AnimatePresence mode="popLayout">
                  {containers.map((container) => (
                    <motion.tr 
                      key={container.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="group hover:bg-brand-text/2 transition-colors"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <Box size={16} className="text-brand-text/20" />
                          <span className="text-xs font-bold text-brand-text">{container.name}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-xs font-mono text-brand-text/60">{container.allocatedRam} RAM</span>
                      </td>
                      <td className="p-6">
                        <span className="text-xs font-mono text-brand-text font-bold">{container.usedRam}</span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-1.5 bg-brand-bg rounded-full overflow-hidden w-24">
                            <div 
                              className={`h-full rounded-full ${container.wastePercentage > 80 ? 'bg-red-500' : 'bg-amber-500'}`}
                              style={{ width: `${container.wastePercentage}%` }}
                            />
                          </div>
                          <span className={`text-[10px] font-mono font-bold ${container.wastePercentage > 80 ? 'text-red-400' : 'text-amber-400'}`}>
                            {container.wastePercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <button 
                          onClick={() => handleRightsize(container.id)}
                          disabled={isRightsizing === container.id}
                          className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2 ml-auto disabled:opacity-50"
                        >
                          {isRightsizing === container.id ? <RefreshCw size={12} className="animate-spin" /> : <Maximize2 size={12} />}
                          Rightsize & Save {container.potentialSavings}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {containers.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/20">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-serif italic text-brand-text">Infrastructure Optimized</h3>
                <p className="text-xs text-brand-text/40 uppercase tracking-widest">No over-provisioned containers detected in the current scan.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

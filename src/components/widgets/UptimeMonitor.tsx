import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

export const UptimeMonitor: React.FC = () => {
  const [uptime, setUptime] = useState(99.98);
  const [incidents, setIncidents] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => {
        const change = (Math.random() - 0.5) * 0.01;
        return Math.min(100, Math.max(99.9, prev + change));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-brand-sidebar/50 text-brand-text p-3 border border-brand-border rounded">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 opacity-50">
          <Activity size={14} />
          <span className="uppercase tracking-widest text-[10px] font-bold">SLA Monitor</span>
        </div>
        <div className="flex items-center gap-1 text-primary">
          <ShieldCheck size={12} />
          <span className="text-[10px] font-bold">SECURE</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono opacity-50">
            <span>UPTIME</span>
            <span>{uptime.toFixed(2)}%</span>
          </div>
          <div className="h-2 bg-brand-text/5 rounded-full overflow-hidden border border-brand-border">
            <div 
              className="h-full bg-primary transition-all duration-1000"
              style={{ width: `${uptime}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-brand-text/5 p-2 rounded border border-brand-border">
            <div className="text-[8px] opacity-50 uppercase tracking-tighter">Incidents</div>
            <div className="text-sm font-mono font-bold text-red-500">{incidents}</div>
          </div>
          <div className="bg-brand-text/5 p-2 rounded border border-brand-border">
            <div className="text-[8px] opacity-50 uppercase tracking-tighter">Response</div>
            <div className="text-sm font-mono font-bold">12ms</div>
          </div>
        </div>
      </div>
    </div>
  );
};

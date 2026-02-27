import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const ResourceGauge: React.FC = () => {
  const [stats, setStats] = useState({ cpu: 45, ram: 62 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 20) + 30,
        ram: Math.floor(Math.random() * 10) + 55,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderGauge = (value: number, label: string, icon: React.ReactNode, color: string) => {
    const data = [
      { value: value },
      { value: 100 - value },
    ];

    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="relative w-full h-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={30}
                outerRadius={40}
                startAngle={180}
                endAngle={0}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={color} />
                <Cell fill="var(--border)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
            <span className="text-lg font-mono font-bold text-brand-text">{value}%</span>
            <div className="flex items-center gap-1 opacity-50 text-[10px] uppercase tracking-tighter text-brand-text">
              {icon}
              {label}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-brand-sidebar/50 text-brand-text p-3 border border-brand-border rounded">
      {renderGauge(stats.cpu, 'CPU', <Cpu size={10} />, 'var(--primary)')}
      <div className="w-px bg-brand-border mx-2 self-stretch" />
      {renderGauge(stats.ram, 'RAM', <HardDrive size={10} />, '#3b82f6')}
    </div>
  );
};

import React from 'react';
import { Terminal, Cpu, Globe, Activity, Plus } from 'lucide-react';
import { WidgetDefinition, WidgetType } from '../types';

const WIDGETS: WidgetDefinition[] = [
  { type: 'terminal', label: 'Mini Terminal', icon: 'Terminal', defaultW: 2, defaultH: 2 },
  { type: 'resource', label: 'Resource Gauge', icon: 'Cpu', defaultW: 2, defaultH: 2 },
  { type: 'subdomain', label: 'Subdomain Add', icon: 'Globe', defaultW: 2, defaultH: 2 },
  { type: 'uptime', label: 'Uptime Monitor', icon: 'Activity', defaultW: 2, defaultH: 2 },
];

interface SidebarProps {
  onAddWidget: (type: WidgetType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAddWidget }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return <Terminal size={18} />;
      case 'Cpu': return <Cpu size={18} />;
      case 'Globe': return <Globe size={18} />;
      case 'Activity': return <Activity size={18} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-brand-border">
        <h2 className="text-[10px] uppercase tracking-widest font-bold text-brand-text/50">Widget Library</h2>
      </div>
      
      <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar">
        {WIDGETS.map((widget) => (
          <div
            key={widget.type}
            className="group bg-brand-sidebar/50 border border-brand-border p-3 rounded cursor-pointer hover:border-primary hover:bg-brand-text/5 transition-all"
            onClick={() => onAddWidget(widget.type)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-brand-text/60 group-hover:opacity-100 group-hover:text-primary">
                {getIcon(widget.icon)}
                <span className="text-[11px] font-medium">{widget.label}</span>
              </div>
              <Plus size={12} className="opacity-0 group-hover:opacity-100 text-primary" />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-brand-border bg-brand-sidebar/30">
        <div className="text-[9px] font-mono text-brand-text/30 uppercase text-center">
          Infinity Canvas v1.1.0
        </div>
      </div>
    </div>
  );
};

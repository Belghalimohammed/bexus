import React from 'react';
import { 
  Terminal, Cpu, Globe, Activity, Plus, Box, Server, Shuffle, Database, 
  TrendingUp, List, Clock, Shield, AlertTriangle, GitBranch, Play, 
  Webhook, StickyNote, Globe as WorldClock, ExternalLink, GripVertical
} from 'lucide-react';
import { WidgetType } from '../types';

interface WidgetDef {
  type: WidgetType;
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES = [
  {
    name: 'Infrastructure & Topology',
    widgets: [
      { type: 'docker', label: 'Docker Container', icon: <Box size={14} /> },
      { type: 'vm', label: 'VM / Bare-Metal', icon: <Server size={14} /> },
      { type: 'lb', label: 'Load Balancer', icon: <Shuffle size={14} /> },
      { type: 's3', label: 'S3 Storage Bucket', icon: <Database size={14} /> },
    ]
  },
  {
    name: 'Telemetry & Metrics',
    widgets: [
      { type: 'gauge', label: 'Radial Resource Gauge', icon: <Cpu size={14} /> },
      { type: 'sparkline', label: 'Network I/O Sparkline', icon: <TrendingUp size={14} /> },
      { type: 'processes', label: 'Top Processes Table', icon: <List size={14} /> },
      { type: 'uptime_sla', label: 'Uptime SLA Tracker', icon: <Activity size={14} /> },
    ]
  },
  {
    name: 'Interactive & Control',
    widgets: [
      { type: 'terminal', label: 'Mini-Terminal', icon: <Terminal size={14} /> },
      { type: 'script', label: 'Quick-Script Button', icon: <Play size={14} /> },
      { type: 'sql', label: 'SQL Query Runner', icon: <Database size={14} /> },
    ]
  },
  {
    name: 'Security & Edge',
    widgets: [
      { type: 'tunnels', label: 'Active Tunnels List', icon: <Globe size={14} /> },
      { type: 'waf', label: 'WAF Threat Counter', icon: <Shield size={14} /> },
      { type: 'ssl', label: 'SSL Expiry Warning', icon: <AlertTriangle size={14} /> },
    ]
  },
  {
    name: 'Developer & CI/CD',
    widgets: [
      { type: 'git', label: 'Git Commit Stream', icon: <GitBranch size={14} /> },
      { type: 'pipeline', label: 'Pipeline Status', icon: <Activity size={14} /> },
      { type: 'webhook', label: 'Webhook Trigger', icon: <Webhook size={14} /> },
    ]
  },
  {
    name: 'Utilities & Custom',
    widgets: [
      { type: 'sticky', label: 'Markdown Sticky Note', icon: <StickyNote size={14} /> },
      { type: 'clock', label: 'World Clock', icon: <WorldClock size={14} /> },
      { type: 'iframe', label: 'Iframe Embed', icon: <ExternalLink size={14} /> },
    ]
  }
];

interface SidebarProps {
  onAddWidget: (type: WidgetType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAddWidget }) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200 w-72">
      <div className="p-6 border-b border-slate-200 bg-white">
        <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Widget Library</h2>
        <p className="text-[9px] text-slate-400 mt-1">Drag and drop to canvas</p>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {CATEGORIES.map((cat) => (
          <div key={cat.name} className="space-y-2">
            <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2">{cat.name}</h3>
            <div className="space-y-1">
              {cat.widgets.map((widget) => (
                <div
                  key={widget.type}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('widgetType', widget.type);
                  }}
                  className="group flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-sm cursor-grab active:cursor-grabbing transition-all"
                  onClick={() => onAddWidget(widget.type as WidgetType)}
                >
                  <div className="flex items-center gap-3 text-slate-600 group-hover:text-primary">
                    <div className="text-slate-300 group-hover:text-primary/40">
                      <GripVertical size={12} />
                    </div>
                    <div className="p-1.5 bg-slate-100 rounded group-hover:bg-primary/5 transition-colors">
                      {widget.icon}
                    </div>
                    <span className="text-[11px] font-medium truncate max-w-[140px]">{widget.label}</span>
                  </div>
                  <Plus size={12} className="opacity-0 group-hover:opacity-100 text-primary" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="text-[9px] font-mono text-slate-400 uppercase text-center">
          BEXUS Canvas Engine v2.0
        </div>
      </div>
    </div>
  );
};

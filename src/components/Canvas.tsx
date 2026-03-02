import React from 'react';
// @ts-ignore
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { WidgetInstance } from '../types';
import { X } from 'lucide-react';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface CanvasProps {
  widgets: WidgetInstance[];
  onLayoutChange: (layout: any[]) => void;
  onRemoveWidget: (id: string) => void;
  onDrop: (type: WidgetType, x: number, y: number) => void;
}

import { 
  DockerNode, VMNode, LoadBalancerNode, S3BucketNode, 
  RadialGauge, NetworkSparkline, TopProcesses, UptimeSLA, 
  MiniTerminalWidget, QuickScript, SQLRunner, TunnelsList, 
  WAFCounter, SSLExpiry, GitStream, PipelineStatus, 
  WebhookTrigger, StickyNoteWidget, WorldClock, IframeEmbed 
} from './widgets/WidgetComponents';
import { WidgetType } from '../types';

export const Canvas: React.FC<CanvasProps> = ({ widgets, onLayoutChange, onRemoveWidget, onDrop }) => {
  const renderWidget = (widget: WidgetInstance) => {
    return <WidgetRenderer widget={widget} />;
  };

  const layout = widgets.map(w => ({
    i: w.id,
    x: w.x,
    y: w.y,
    w: w.w,
    h: w.h,
  }));

  return (
    <div className="flex-1 bg-slate-100 relative overflow-y-auto custom-scrollbar">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]" 
        style={{ 
          backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', 
          backgroundSize: '30px 30px' 
        }} 
      />

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        onLayoutChange={onLayoutChange}
        draggableHandle=".widget-drag-handle"
        margin={[16, 16]}
        isDroppable={true}
        onDrop={(layout: any, item: any, e: any) => {
          const type = e.dataTransfer.getData('widgetType') as WidgetType;
          if (type) {
            onDrop(type, item.x, item.y);
          }
        }}
      >
        {widgets.map((widget) => (
          <div key={widget.id} className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div className="widget-drag-handle absolute top-0 left-0 right-0 h-8 cursor-move z-10 flex items-center px-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50 border-b border-slate-100">
              <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-slate-300" />)}
              </div>
              <span className="ml-3 text-[9px] font-bold uppercase tracking-widest text-slate-400 truncate pr-8">
                {widget.type.replace('_', ' ')}
              </span>
            </div>
            
            <button
              onClick={() => onRemoveWidget(widget.id)}
              className="absolute top-2 right-2 p-1 rounded-lg hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <X size={14} />
            </button>

            <div className="h-full w-full pt-8">
              {renderWidget(widget)}
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

const WidgetRenderer: React.FC<{ widget: WidgetInstance }> = ({ widget }) => {
  switch (widget.type) {
    case 'docker': return <DockerNode name="postgres-db" image="postgres:15-alpine" status="up" />;
    case 'vm': return <VMNode name="worker-node-01" os="Ubuntu 22.04" cpu="4 vCPU" ram="16GB" />;
    case 'lb': return <LoadBalancerNode name="nginx-ingress" algorithm="round-robin" />;
    case 's3': return <S3BucketNode name="assets-prod" size="45.2 GB" />;
    case 'gauge': return <RadialGauge label="CPU Usage" value={72} />;
    case 'sparkline': return <NetworkSparkline />;
    case 'processes': return <TopProcesses />;
    case 'uptime_sla': return <UptimeSLA />;
    case 'terminal': return <MiniTerminalWidget />;
    case 'script': return <QuickScript label="Flush Redis Cache" />;
    case 'sql': return <SQLRunner />;
    case 'tunnels': return <TunnelsList />;
    case 'waf': return <WAFCounter />;
    case 'ssl': return <SSLExpiry />;
    case 'git': return <GitStream />;
    case 'pipeline': return <PipelineStatus />;
    case 'webhook': return <WebhookTrigger />;
    case 'sticky': return <StickyNoteWidget />;
    case 'clock': return <WorldClock />;
    case 'iframe': return <IframeEmbed />;
    default: return (
      <div className="p-4 flex items-center justify-center h-full text-slate-400 text-[10px] uppercase font-bold tracking-widest">
        {widget.type}
      </div>
    );
  }
};

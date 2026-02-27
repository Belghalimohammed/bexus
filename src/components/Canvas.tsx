import React from 'react';
// @ts-ignore
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { WidgetInstance } from '../types';
import { MiniTerminal } from './widgets/MiniTerminal';
import { ResourceGauge } from './widgets/ResourceGauge';
import { SubdomainQuickAdd } from './widgets/SubdomainQuickAdd';
import { UptimeMonitor } from './widgets/UptimeMonitor';
import { X } from 'lucide-react';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface CanvasProps {
  widgets: WidgetInstance[];
  onLayoutChange: (layout: any[]) => void;
  onRemoveWidget: (id: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ widgets, onLayoutChange, onRemoveWidget }) => {
  const renderWidget = (widget: WidgetInstance) => {
    switch (widget.type) {
      case 'terminal': return <MiniTerminal />;
      case 'resource': return <ResourceGauge />;
      case 'subdomain': return <SubdomainQuickAdd />;
      case 'uptime': return <UptimeMonitor />;
      default: return null;
    }
  };

  const layout = widgets.map(w => ({
    i: w.id,
    x: w.x,
    y: w.y,
    w: w.w,
    h: w.h,
  }));

  return (
    <div className="flex-1 bg-brand-bg relative overflow-y-auto custom-scrollbar">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
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
      >
        {widgets.map((widget) => (
          <div key={widget.id} className="group relative">
            <div className="widget-drag-handle absolute top-0 left-0 right-0 h-6 cursor-move z-10 flex items-center px-2 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-text/5 rounded-t">
              <div className="flex gap-0.5">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-brand-text/20" />)}
              </div>
            </div>
            
            <button
              onClick={() => onRemoveWidget(widget.id)}
              className="absolute top-1 right-1 p-1 rounded hover:bg-red-500/20 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <X size={12} />
            </button>

            <div className="h-full w-full pt-2">
              {renderWidget(widget)}
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

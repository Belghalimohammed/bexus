import React, { useState, useCallback, useMemo } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Canvas } from '../components/Canvas';
import { WidgetInstance, WidgetType, Page } from '../types';
import { Plus, FileText, Trash2 } from 'lucide-react';

export const InfinityCanvas: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([
    {
      id: 'default',
      name: 'Main Dashboard',
      widgets: [
        { id: '1', type: 'resource', x: 0, y: 0, w: 4, h: 2 },
        { id: '2', type: 'terminal', x: 4, y: 0, w: 4, h: 2 },
        { id: '3', type: 'uptime', x: 8, y: 0, w: 4, h: 2 },
      ]
    }
  ]);
  const [activePageId, setActivePageId] = useState<string>('default');

  const activePage = useMemo(() => 
    pages.find(p => p.id === activePageId) || pages[0],
  [pages, activePageId]);

  const addPage = useCallback(() => {
    const id = Math.random().toString(36).substr(2, 9);
    const newPage: Page = {
      id,
      name: `New Page ${pages.length + 1}`,
      widgets: []
    };
    setPages(prev => [...prev, newPage]);
    setActivePageId(id);
  }, [pages.length]);

  const removePage = useCallback((id: string) => {
    if (pages.length <= 1) return;
    setPages(prev => prev.filter(p => p.id !== id));
    if (activePageId === id) {
      setActivePageId(pages.find(p => p.id !== id)?.id || 'default');
    }
  }, [pages, activePageId]);

  const updateActivePageWidgets = useCallback((updater: (widgets: WidgetInstance[]) => WidgetInstance[]) => {
    setPages(prev => prev.map(p => 
      p.id === activePageId ? { ...p, widgets: updater(p.widgets) } : p
    ));
  }, [activePageId]);

  const addWidget = useCallback((type: WidgetType) => {
    const id = Math.random().toString(36).substr(2, 9);
    updateActivePageWidgets(prev => {
      const newWidget: WidgetInstance = {
        id,
        type,
        x: (prev.length * 4) % 12,
        y: Infinity,
        w: 4,
        h: 2,
      };
      return [...prev, newWidget];
    });
  }, [updateActivePageWidgets]);

  const removeWidget = useCallback((id: string) => {
    updateActivePageWidgets(prev => prev.filter((w) => w.id !== id));
  }, [updateActivePageWidgets]);

  const handleLayoutChange = useCallback((currentLayout: any[]) => {
    updateActivePageWidgets(prev => 
      prev.map((w) => {
        const layoutItem = currentLayout.find((l: any) => l.i === w.id);
        if (layoutItem) {
          return {
            ...w,
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          };
        }
        return w;
      })
    );
  }, [updateActivePageWidgets]);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Pages & Widgets Sidebar */}
      <div className="w-64 bg-brand-sidebar/30 border-r border-brand-border flex flex-col">
        <div className="p-4 border-b border-brand-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] uppercase tracking-widest font-bold text-brand-text/50">Pages</h2>
            <button 
              onClick={addPage}
              className="p-1 hover:bg-brand-text/5 rounded transition-colors text-primary"
              title="Add New Page"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
            {pages.map(page => (
              <div 
                key={page.id}
                onClick={() => setActivePageId(page.id)}
                className={`group flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-all ${
                  activePageId === page.id ? 'bg-primary/10 text-primary' : 'hover:bg-brand-text/5 text-brand-text/60'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText size={14} className={activePageId === page.id ? 'opacity-100' : 'opacity-40'} />
                  <span className="text-xs truncate">{page.name}</span>
                </div>
                {pages.length > 1 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removePage(page.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <Sidebar onAddWidget={addWidget} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-brand-bg">
        {/* Header */}
        <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar/30">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="font-serif italic text-xl tracking-tight text-brand-text">NOC Infinity Canvas</h1>
              <span className="text-[10px] font-mono text-primary opacity-70 uppercase tracking-tighter">
                Active: {activePage.name}
              </span>
            </div>
            <div className="flex items-center gap-2 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-primary text-[10px] font-mono uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live System Active
            </div>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">
            <span>Lat: 37.7749° N</span>
            <span>Lon: 122.4194° W</span>
            <span className="text-brand-text opacity-100">{new Date().toLocaleTimeString()}</span>
          </div>
        </header>

        {/* Canvas */}
        <Canvas 
          key={activePageId} 
          widgets={activePage.widgets} 
          onLayoutChange={handleLayoutChange}
          onRemoveWidget={removeWidget}
        />
      </div>
    </div>
  );
};

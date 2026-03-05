import React, { useState, useCallback, useMemo } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Canvas } from '../components/Canvas';
import { WidgetInstance, WidgetType, Page } from '../types';
import { Plus, FileText, Trash2, Box, Layout } from 'lucide-react';
import { Matrix3D } from '../components/Matrix3D';

export const InfinityCanvas: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([
    {
      id: 'default',
      name: 'Main Dashboard',
      widgets: [
        { id: '1', type: 'gauge', x: 0, y: 0, w: 4, h: 2 },
        { id: '2', type: 'terminal', x: 4, y: 0, w: 4, h: 2 },
        { id: '3', type: 'uptime_sla', x: 8, y: 0, w: 4, h: 2 },
      ]
    }
  ]);
  const [activePageId, setActivePageId] = useState<string>('default');
  const [is3DMode, setIs3DMode] = useState(false);

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
      let w = 4, h = 2;
      
      // Custom sizes based on widget type
      if (type === 'vm' || type === 'sql' || type === 'iframe') { w = 4; h = 3; }
      if (type === 'terminal') { w = 6; h = 4; }
      if (type === 'git' || type === 'tunnels') { w = 3; h = 4; }
      if (type === 'gauge' || type === 'uptime_sla' || type === 'waf') { w = 3; h = 2; }
      if (type === 'sticky') { w = 3; h = 3; }

      const newWidget: WidgetInstance = {
        id,
        type,
        x: (prev.length * 4) % 12,
        y: Infinity,
        w,
        h,
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
      <div className="hidden md:flex w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Canvas Pages</h2>
            <button 
              onClick={addPage}
              className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-primary border border-slate-200"
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
                className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  activePageId === page.id ? 'bg-primary/5 text-primary border border-primary/20' : 'hover:bg-slate-100 text-slate-600 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText size={14} className={activePageId === page.id ? 'opacity-100' : 'opacity-40'} />
                  <span className="text-xs font-medium truncate">{page.name}</span>
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
      <div className="flex-1 flex flex-col bg-slate-100">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-4 md:px-8 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="font-serif italic text-lg md:text-xl tracking-tight text-slate-900">Infinity Canvas</h1>
              <span className="text-[9px] md:text-[10px] font-mono text-primary font-bold uppercase tracking-tighter">
                {activePage.name}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded text-emerald-600 text-[10px] font-bold uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={() => setIs3DMode(!is3DMode)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border transition-all ${
                is3DMode 
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm'
              }`}
            >
              {is3DMode ? <Box size={16} /> : <Layout size={16} />}
              <span className="hidden md:inline text-[10px] font-bold uppercase tracking-widest">
                {is3DMode ? '3D Matrix Active' : 'Enable 3D Matrix'}
              </span>
            </button>

            <div className="hidden md:flex items-center gap-6 text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
              <span>37.77° N</span>
              <span>122.41° W</span>
            </div>
          </div>
        </header>

        {/* Canvas or 3D Matrix */}
        <div className="flex-1 relative overflow-hidden">
          {is3DMode ? (
            <Matrix3D />
          ) : (
            <Canvas 
              key={activePageId} 
              widgets={activePage.widgets} 
              onLayoutChange={handleLayoutChange}
              onRemoveWidget={removeWidget}
              isDraggable={window.innerWidth > 768}
              isResizable={window.innerWidth > 768}
              onDrop={(type, x, y) => {
                const id = Math.random().toString(36).substr(2, 9);
                updateActivePageWidgets(prev => {
                  let w = 4, h = 2;
                  if (type === 'vm' || type === 'sql' || type === 'iframe') { w = 4; h = 3; }
                  if (type === 'terminal') { w = 6; h = 4; }
                  if (type === 'git' || type === 'tunnels') { w = 3; h = 4; }
                  if (type === 'gauge' || type === 'uptime_sla' || type === 'waf') { w = 3; h = 2; }
                  if (type === 'sticky') { w = 3; h = 3; }

                  return [...prev, { id, type, x, y, w, h }];
                });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

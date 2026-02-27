import React, { useState, useEffect } from 'react';
import { Palette, Layout, Image as ImageIcon, Check, Upload, RefreshCw, Moon, Zap, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemePreset {
  id: string;
  name: string;
  primary: string;
  foreground: string;
  bg: string;
  sidebar: string;
  border: string;
  text: string;
  muted: string;
  icon: React.ReactNode;
}

const presets: ThemePreset[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    primary: '#6366f1',
    foreground: '#ffffff',
    bg: '#020617',
    sidebar: '#0f172a',
    border: '#1e293b',
    text: '#ffffff',
    muted: 'rgba(255, 255, 255, 0.4)',
    icon: <Moon size={16} />
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    primary: '#ff00ff',
    foreground: '#000000',
    bg: '#000000',
    sidebar: '#050505',
    border: '#333333',
    text: '#ffffff',
    muted: 'rgba(255, 255, 255, 0.4)',
    icon: <Zap size={16} />
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    primary: '#2563eb',
    foreground: '#ffffff',
    bg: '#ffffff',
    sidebar: '#f1f5f9',
    border: '#cbd5e1',
    text: '#0f172a',
    muted: 'rgba(15, 23, 42, 0.5)',
    icon: <Building2 size={16} />
  },
  {
    id: 'nexus',
    name: 'Nexus Default',
    primary: '#00FF00',
    foreground: '#000000',
    bg: '#050505',
    sidebar: '#0a0a0a',
    border: '#1e293b',
    text: '#ffffff',
    muted: 'rgba(255, 255, 255, 0.4)',
    icon: <RefreshCw size={16} />
  }
];

const swatches = [
  '#00FF00', '#6366f1', '#2563eb', '#ff00ff', '#f59e0b', '#ef4444', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899'
];

export const ThemeManager: React.FC = () => {
  const [activePreset, setActivePreset] = useState('nexus');
  const [primaryColor, setPrimaryColor] = useState('#00FF00');
  const [logo, setLogo] = useState<string | null>(null);

  const applyTheme = (theme: Partial<ThemePreset>) => {
    const root = document.documentElement;
    if (theme.primary) {
      root.style.setProperty('--primary', theme.primary);
      setPrimaryColor(theme.primary);
    }
    if (theme.foreground) root.style.setProperty('--primary-foreground', theme.foreground);
    if (theme.bg) root.style.setProperty('--bg', theme.bg);
    if (theme.sidebar) root.style.setProperty('--sidebar', theme.sidebar);
    if (theme.border) root.style.setProperty('--border', theme.border);
    if (theme.text) root.style.setProperty('--text', theme.text);
    if (theme.muted) root.style.setProperty('--text-muted', theme.muted);
    
    // Update body class for light/dark modes if needed
    if (theme.bg === '#ffffff') {
      root.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
    }
  };

  const handlePresetClick = (preset: ThemePreset) => {
    setActivePreset(preset.id);
    applyTheme(preset);
  };

  const handleColorClick = (color: string) => {
    setPrimaryColor(color);
    applyTheme({ primary: color });
    setActivePreset('custom');
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden transition-colors duration-500">
      <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar">
        <div className="flex items-center gap-4">
          <Palette size={20} className="text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-50">Chameleon Theme Engine</h2>
        </div>
        <button 
          onClick={() => applyTheme(presets.find(p => p.id === 'nexus')!)}
          className="px-4 py-1.5 bg-white/5 border border-white/10 text-[10px] font-bold uppercase rounded hover:bg-white/10 transition-colors"
        >
          Reset to Default
        </button>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Theme Presets */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Layout size={16} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Theme Presets</h3>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className={`p-6 rounded-2xl border transition-all relative group overflow-hidden ${
                    activePreset === preset.id 
                      ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(0,0,0,0.2)]' 
                      : 'border-brand-border bg-brand-sidebar hover:border-brand-text/20'
                  }`}
                >
                  <div className="flex flex-col items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      activePreset === preset.id ? 'bg-primary text-primary-foreground' : 'bg-brand-text/5 text-brand-text/40'
                    }`}>
                      {preset.icon}
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${
                      activePreset === preset.id ? 'text-primary' : 'text-brand-text/40'
                    }`}>
                      {preset.name}
                    </span>
                  </div>
                  
                  {/* Preview Dots */}
                  <div className="absolute bottom-3 right-3 flex gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.primary }} />
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.bg }} />
                  </div>

                  {activePreset === preset.id && (
                    <motion.div 
                      layoutId="active-preset"
                      className="absolute inset-0 bg-primary/5 pointer-events-none"
                    />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Color Matrix */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Palette size={16} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">The Color Matrix</h3>
            </div>
            <div className="bg-brand-sidebar border border-brand-border rounded-2xl p-8">
              <div className="grid grid-cols-10 gap-4">
                {swatches.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorClick(color)}
                    className={`aspect-square rounded-xl transition-all hover:scale-110 relative ${
                      primaryColor === color ? 'ring-2 ring-white ring-offset-4 ring-offset-brand-bg' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {primaryColor === color && (
                      <Check size={16} className="absolute inset-0 m-auto text-primary-foreground" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-brand-text/5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-brand-text/30 mb-1">Custom Hex Code</div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg border border-brand-text/10" style={{ backgroundColor: primaryColor }} />
                    <input 
                      type="text" 
                      value={primaryColor}
                      onChange={(e) => handleColorClick(e.target.value)}
                      className="bg-brand-text/5 border border-brand-text/10 rounded px-3 py-1.5 text-xs font-mono outline-none focus:border-primary transition-colors text-brand-text"
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-brand-text/40 leading-relaxed">
                    This updates <code className="text-primary">--color-primary</code> across the entire application.<br/>
                    All glows, borders, and active states will sync immediately.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Branding & Logo */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon size={16} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Logo & Branding</h3>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-brand-sidebar border border-brand-border rounded-2xl p-8 flex flex-col items-center justify-center gap-4 border-dashed relative group cursor-pointer hover:bg-brand-text/5 transition-colors">
                <Upload size={32} className="text-brand-text/20 group-hover:text-primary group-hover:opacity-100 transition-all" />
                <div className="text-center">
                  <div className="text-xs font-bold uppercase tracking-wider mb-1">Sidebar Logo</div>
                  <div className="text-[10px] text-brand-text/30">Drag and drop or click to upload (SVG/PNG)</div>
                </div>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>

              <div className="bg-brand-sidebar border border-brand-border rounded-2xl p-8 flex flex-col items-center justify-center gap-4 border-dashed relative group cursor-pointer hover:bg-brand-text/5 transition-colors">
                <ImageIcon size={32} className="text-brand-text/20 group-hover:text-primary group-hover:opacity-100 transition-all" />
                <div className="text-center">
                  <div className="text-xs font-bold uppercase tracking-wider mb-1">Favicon</div>
                  <div className="text-[10px] text-brand-text/30">Best results with 32x32px square icons</div>
                </div>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
          </section>

          {/* Preview Card */}
          <section className="pt-12 border-t border-brand-text/5">
            <div className="text-[10px] uppercase font-bold text-brand-text/30 mb-6 text-center">Live Component Preview</div>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-brand-sidebar border border-brand-border rounded-xl p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  <Zap size={24} />
                </div>
                <h4 className="text-sm font-bold mb-2">Primary Action</h4>
                <button className="w-full py-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded-lg shadow-[0_0_15px_var(--primary)] shadow-primary/20">
                  Execute Command
                </button>
              </div>
              <div className="bg-brand-sidebar border border-brand-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40">System Status</span>
                </div>
                <div className="space-y-3">
                  <div className="h-1.5 w-full bg-brand-text/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/3" />
                  </div>
                  <div className="h-1.5 w-full bg-brand-text/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/2" />
                  </div>
                </div>
              </div>
              <div className="bg-brand-sidebar border border-brand-border rounded-xl p-6 flex flex-col justify-center items-center text-center">
                <div className="text-2xl font-mono font-bold text-primary mb-1">99.9%</div>
                <div className="text-[9px] uppercase font-bold text-brand-text/30">Uptime Reliability</div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

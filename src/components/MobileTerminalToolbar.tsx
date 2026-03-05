import React from 'react';
import { ChevronUp, Slash } from 'lucide-react';

interface MobileTerminalToolbarProps {
  onKeyClick: (key: string) => void;
}

export const MobileTerminalToolbar: React.FC<MobileTerminalToolbarProps> = ({ onKeyClick }) => {
  return (
    <div className="md:hidden fixed bottom-16 left-0 right-0 h-12 bg-slate-900 border-t border-white/10 flex items-center justify-around px-2 z-40">
      {['CTRL', 'ESC', 'TAB'].map((key) => (
        <button
          key={key}
          onClick={() => onKeyClick(key)}
          className="px-3 py-1.5 bg-white/10 rounded text-[10px] font-bold text-white uppercase tracking-widest active:bg-white/20 transition-all"
        >
          {key}
        </button>
      ))}
      <button
        onClick={() => onKeyClick('UP')}
        className="p-2 bg-white/10 rounded text-white active:bg-white/20 transition-all"
      >
        <ChevronUp size={16} />
      </button>
      <button
        onClick={() => onKeyClick('/')}
        className="p-2 bg-white/10 rounded text-white active:bg-white/20 transition-all"
      >
        <Slash size={14} />
      </button>
    </div>
  );
};

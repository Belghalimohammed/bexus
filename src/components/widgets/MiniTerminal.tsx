import React, { useState, useEffect } from 'react';
import { Terminal, Send } from 'lucide-react';

export const MiniTerminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(['System initialized...', 'Waiting for command...']);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setHistory(prev => [...prev.slice(-1), `> ${input}`]);
    setInput('');
    
    // Mock response
    setTimeout(() => {
      setHistory(prev => [...prev.slice(-1), `exec: ${input.split(' ')[0]} success`]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-brand-sidebar/50 text-brand-text font-mono text-xs p-2 border border-brand-border rounded shadow-inner">
      <div className="flex items-center gap-2 mb-1 opacity-50 border-bottom border-brand-border pb-1">
        <Terminal size={12} />
        <span className="uppercase tracking-widest text-[10px]">Quick Terminal</span>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col justify-end gap-1">
        {history.map((line, i) => (
          <div key={i} className="truncate opacity-80">{line}</div>
        ))}
      </div>
      <form onSubmit={handleSend} className="mt-2 flex gap-1 border-t border-brand-border pt-2">
        <span className="opacity-50">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none border-none p-0 text-brand-text"
          placeholder="cmd..."
        />
        <button type="submit" className="opacity-50 hover:opacity-100 transition-opacity">
          <Send size={12} />
        </button>
      </form>
    </div>
  );
};

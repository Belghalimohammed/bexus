import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Search, 
  Hash, 
  Lock, 
  Plus, 
  ChevronDown, 
  MoreVertical,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickMessage {
  id: string;
  user: string;
  text: string;
  time: string;
  isMe: boolean;
}

export const GlobalQuickChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<QuickMessage[]>([
    { id: '1', user: 'Sarah', text: 'Hey, did you see the spike on the gateway?', time: '10:45 AM', isMe: false },
    { id: '2', user: 'Mohammed', text: 'Yeah, I\'m looking at it now. Seems like a burst of traffic from the US-East region.', time: '10:46 AM', isMe: true },
    { id: '3', user: 'Sarah', text: 'Should we scale the workers?', time: '10:47 AM', isMe: false },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const msg: QuickMessage = {
      id: Math.random().toString(36).substr(2, 9),
      user: 'Mohammed',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    setMessages([...messages, msg]);
    setInputText('');
  };

  return (
    <div className="fixed bottom-8 right-24 z-[100]">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-slate-900 text-white rotate-90' : 'bg-indigo-600 text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            3
          </span>
        )}
      </button>

      {/* Slide-over Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              width: isExpanded ? 480 : 360,
              height: isExpanded ? 600 : 480
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <header className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Hash size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">#incidents</h3>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">3 Active Now</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-all"
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-all">
                  <MoreVertical size={16} />
                </button>
              </div>
            </header>

            {/* Feed */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/20"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  {!msg.isMe && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-2">{msg.user}</span>}
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.isMe 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 mx-2">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <div className="relative">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Quick reply..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <button 
                  onClick={sendMessage}
                  disabled={!inputText.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { 
  Hash, 
  Lock, 
  Plus, 
  Search, 
  Users, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Code, 
  AtSign, 
  X, 
  MessageSquare, 
  ChevronDown, 
  Edit3, 
  Box, 
  Activity, 
  Terminal, 
  Bell, 
  Clock,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Menu as MenuIcon,
  ArrowLeft,
  Smile
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer 
} from 'recharts';
import { Swipeable } from '../../components/Swipeable';

// --- Types ---

type PresenceStatus = 'online' | 'idle' | 'offline';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  status: PresenceStatus;
}

interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  threadCount?: number;
  embed?: {
    type: 'container' | 'vm';
    name: string;
    status: 'up' | 'down';
    metrics: { time: number; value: number }[];
  };
}

// --- Mock Data ---

const MEMBERS: TeamMember[] = [
  { id: '1', name: 'Mohammed', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed', status: 'online' },
  { id: '2', name: 'Sarah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', status: 'idle' },
  { id: '3', name: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', status: 'online' },
  { id: '4', name: 'Bot', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bot', status: 'offline' },
];

const CHANNELS: Channel[] = [
  { id: 'c1', name: 'general', isPrivate: false },
  { id: 'c2', name: 'incidents', isPrivate: false },
  { id: 'c3', name: 'security-ops', isPrivate: true },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    userId: '1',
    userName: 'Mohammed',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed',
    content: 'Hey team, I noticed some latency on the nginx-gateway. Investigating now.',
    timestamp: '10:24 AM',
    threadCount: 2,
  },
  {
    id: 'm2',
    userId: '3',
    userName: 'Admin',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    content: 'Check the resource usage for https://nexus.os/containers/nginx-gateway',
    timestamp: '10:25 AM',
    embed: {
      type: 'container',
      name: 'nginx-gateway',
      status: 'up',
      metrics: Array.from({ length: 10 }, (_, i) => ({ time: i, value: 40 + Math.random() * 40 })),
    }
  },
  {
    id: 'm3',
    userId: '2',
    userName: 'Sarah',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: 'I see it too. CPU is spiking to 85%. I\'ll scale the worker pool.',
    timestamp: '10:26 AM',
  }
];

// --- Components ---

const PresenceIndicator: React.FC<{ status: PresenceStatus }> = ({ status }) => {
  const colors = {
    online: 'bg-emerald-500',
    idle: 'bg-amber-500',
    offline: 'bg-slate-400',
  };
  return (
    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-50 ${colors[status]}`} />
  );
};

const InfrastructureEmbed: React.FC<{ embed: Message['embed'] }> = ({ embed }) => {
  if (!embed) return null;
  return (
    <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-primary">
            {embed.type === 'container' ? <Box size={16} /> : <Terminal size={16} />}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">{embed.name}</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{embed.type}</p>
          </div>
        </div>
        <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase flex items-center gap-1 ${
          embed.status === 'up' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          <div className={`w-1 h-1 rounded-full ${embed.status === 'up' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {embed.status}
        </div>
      </div>
      <div className="h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={embed.metrics}>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={embed.status === 'up' ? '#10b981' : '#ef4444'} 
              fill={embed.status === 'up' ? '#10b981' : '#ef4444'} 
              fillOpacity={0.1} 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
        <span>CPU Load</span>
        <span className="text-slate-900">72.4%</span>
      </div>
    </div>
  );
};

export const NexusComms: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<Channel | TeamMember>(CHANNELS[0]);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [activeThread, setActiveThread] = useState<Message | null>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      userId: '3',
      userName: 'Admin',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Simple unfurl logic
    if (inputText.includes('nexus.os/containers/')) {
      const name = inputText.split('nexus.os/containers/')[1].split(' ')[0];
      newMessage.embed = {
        type: 'container',
        name,
        status: 'up',
        metrics: Array.from({ length: 10 }, (_, i) => ({ time: i, value: 30 + Math.random() * 50 })),
      };
    }

    setMessages([...messages, newMessage]);
    setInputText('');
    setShowSlashMenu(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputText(value);
    if (value.endsWith('/')) {
      setShowSlashMenu(true);
    } else if (!value.includes('/')) {
      setShowSlashMenu(false);
    }
  };

  return (
    <div className="flex-1 flex h-screen bg-white overflow-hidden relative">
      {/* 1. The Roster (Left Sidebar) - Slide-over on mobile */}
      <AnimatePresence>
        {(isRosterOpen || (typeof window !== 'undefined' && window.innerWidth > 768)) && (
          <motion.aside 
            initial={typeof window !== 'undefined' && window.innerWidth <= 768 ? { x: '-100%' } : false}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 shadow-2xl md:shadow-none ${!isRosterOpen && 'hidden md:flex'}`}
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <button className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded-lg transition-all group">
                <span className="text-sm font-bold text-slate-900">Nexus Workspace</span>
                <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
              </button>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-xl text-primary transition-all shadow-sm border border-slate-200">
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => setIsRosterOpen(false)}
                  className="md:hidden p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
          {/* Channels */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Channels</h3>
              <button className="p-1 hover:bg-slate-200 rounded text-slate-400"><Plus size={14} /></button>
            </div>
            {CHANNELS.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all group ${
                  'name' in activeChannel && activeChannel.name === channel.name 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {channel.isPrivate ? <Lock size={14} /> : <Hash size={14} />}
                <span className="text-sm font-medium">{channel.name}</span>
              </button>
            ))}
          </div>

          {/* Direct Messages */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Direct Messages</h3>
              <button className="p-1 hover:bg-slate-200 rounded text-slate-400"><Plus size={14} /></button>
            </div>
            {MEMBERS.map((member) => (
              <button
                key={member.id}
                onClick={() => setActiveChannel(member)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group ${
                  'name' in activeChannel && activeChannel.name === member.name 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                    <img src={member.avatar} alt={member.name} className="w-full h-full" />
                  </div>
                  <PresenceIndicator status={member.status} />
                </div>
                <span className="text-sm font-medium truncate">{member.name}</span>
              </button>
            ))}
          </div>
        </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 2. The Command Chat (Center Pane) */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {/* Chat Header */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 bg-white z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={() => setIsRosterOpen(true)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-400"
            >
              <MenuIcon size={20} />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-lg font-bold text-slate-900">
                  {'isPrivate' in activeChannel ? `#${activeChannel.name}` : activeChannel.name}
                </h2>
                {'isPrivate' in activeChannel && activeChannel.isPrivate && <Lock size={14} className="text-slate-400" />}
              </div>
              <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Users size={12} />
                <span>12 Members</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search history..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all w-48 lg:w-64"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><Search size={20} className="sm:hidden" /></button>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><MoreVertical size={20} /></button>
          </div>
        </header>

        {/* Message Feed */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 custom-scrollbar bg-slate-50/30"
        >
          {messages.map((msg) => (
            <div key={msg.id} className="md:block">
              {typeof window !== 'undefined' && window.innerWidth <= 768 ? (
                <Swipeable 
                  onLeftSwipe={() => console.log('Stop message', msg.id)}
                  onRightSwipe={() => console.log('Restart message', msg.id)}
                >
                  <div className="flex gap-4 group p-2">
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shrink-0 shadow-sm">
                      <img src={msg.userAvatar} alt={msg.userName} className="w-full h-full" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-900">{msg.userName}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed break-words">
                        {msg.content}
                      </p>
                      {msg.embed && <InfrastructureEmbed embed={msg.embed} />}
                      
                      <div className="mt-3 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setActiveThread(msg)}
                          className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:text-primary hover:border-primary/30 transition-all"
                        >
                          <MessageSquare size={12} />
                          {msg.threadCount || 0} Replies
                        </button>
                      </div>
                    </div>
                  </div>
                </Swipeable>
              ) : (
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shrink-0 shadow-sm">
                    <img src={msg.userAvatar} alt={msg.userName} className="w-full h-full" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-900">{msg.userName}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed break-words">
                      {msg.content}
                    </p>
                    {msg.embed && <InfrastructureEmbed embed={msg.embed} />}
                    
                    <div className="mt-3 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setActiveThread(msg)}
                        className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:text-primary hover:border-primary/30 transition-all"
                      >
                        <MessageSquare size={12} />
                        {msg.threadCount || 0} Replies
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message Input Composer */}
        <div className="p-6 bg-white border-t border-slate-200">
          <div className="relative">
            <AnimatePresence>
              {showSlashMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-0 mb-4 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                >
                  <div className="px-3 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                    DevOps Commands
                  </div>
                  <div className="space-y-0.5">
                    {[
                      { cmd: '/status', desc: 'Get live status of a resource', icon: <Activity size={14} />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                      { cmd: '/page', desc: 'Trigger high-priority alert', icon: <Bell size={14} />, color: 'text-red-500', bg: 'bg-red-50' },
                      { cmd: '/logs', desc: 'Stream last 50 lines of logs', icon: <Terminal size={14} />, color: 'text-blue-500', bg: 'bg-blue-50' },
                    ].map((item) => (
                      <button 
                        key={item.cmd}
                        onClick={() => {
                          setInputText(item.cmd + ' ');
                          setShowSlashMenu(false);
                        }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all group text-left"
                      >
                        <div className={`w-8 h-8 ${item.bg} ${item.color} rounded-lg flex items-center justify-center transition-colors`}>
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{item.cmd}</p>
                          <p className="text-[10px] text-slate-400">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
              <textarea 
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Message ${'isPrivate' in activeChannel ? `#${activeChannel.name}` : activeChannel.name}`}
                className="w-full p-4 text-sm outline-none resize-none min-h-[100px]"
              />
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all"><Paperclip size={18} /></button>
                  <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all"><Code size={18} /></button>
                  <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all"><AtSign size={18} /></button>
                </div>
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. The Thread & Context Drawer (Right Sidebar) */}
      <AnimatePresence>
        {activeThread && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-80 bg-slate-50 border-l border-slate-200 flex flex-col shrink-0 z-20"
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Thread</h3>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">#{activeChannel.name}</p>
              </div>
              <button 
                onClick={() => setActiveThread(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Original Message */}
              <div className="flex gap-3 pb-6 border-b border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden shrink-0">
                  <img src={activeThread.userAvatar} alt={activeThread.userName} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">{activeThread.userName}</span>
                    <span className="text-[9px] font-bold text-slate-400">{activeThread.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{activeThread.content}</p>
                </div>
              </div>

              {/* Replies */}
              <div className="space-y-6">
                {[
                  { user: 'Sarah', text: 'I\'m checking the load balancer logs now.', time: '10:28 AM' },
                  { user: 'Mohammed', text: 'Confirmed, traffic is being rerouted.', time: '10:30 AM' },
                ].map((reply, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden shrink-0">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.user}`} alt={reply.user} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">{reply.user}</span>
                        <span className="text-[9px] font-bold text-slate-400">{reply.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{reply.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              <div className="relative">
                <textarea 
                  placeholder="Reply..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 resize-none min-h-[80px]"
                />
                <button className="absolute bottom-2 right-2 p-1.5 bg-primary text-white rounded-lg shadow-lg shadow-primary/20">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

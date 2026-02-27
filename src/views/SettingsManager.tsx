import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Settings, 
  Shield, 
  Cpu, 
  Zap, 
  Globe, 
  Bell, 
  Database, 
  Lock, 
  Eye, 
  EyeOff,
  ChevronRight,
  ChevronDown,
  Save,
  Trash2,
  AlertCircle,
  Plus,
  Clock,
  Server,
  Mail,
  MessageSquare,
  X,
  Smartphone,
  Laptop,
  Chrome,
  ShieldAlert,
  Key
} from 'lucide-react';

type SettingSection = 'general' | 'ai' | 'security' | 'infrastructure' | 'gateway' | 'storage' | 'notifications';

interface NavItem {
  id: SettingSection;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'general', label: 'General', icon: <Settings size={16} /> },
  { id: 'ai', label: 'AI Engine', icon: <Zap size={16} /> },
  { id: 'security', label: 'Security', icon: <Shield size={16} /> },
  { id: 'infrastructure', label: 'Infrastructure', icon: <Cpu size={16} /> },
  { id: 'gateway', label: 'Gateway & SSL', icon: <Globe size={16} /> },
  { id: 'storage', label: 'Storage & S3', icon: <Database size={16} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
];

const MaskedInput: React.FC<{ label: string; defaultValue?: string; placeholder?: string }> = ({ label, defaultValue, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <input 
          type={show ? 'text' : 'password'} 
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
        />
        <button 
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
};

const TagInput: React.FC<{ label: string; tags: string[]; setTags: (tags: string[]) => void; placeholder: string }> = ({ label, tags, setTags, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      <div className="flex flex-wrap gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg min-h-[44px] focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
        {tags.map(tag => (
          <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[10px] font-mono">
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 bg-transparent border-none outline-none text-sm text-white min-w-[120px]"
        />
      </div>
    </div>
  );
};

export const SettingsManager: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingSection>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [aiMode, setAiMode] = useState<'cloud' | 'local'>('cloud');
  const [autonomousEnabled, setAutonomousEnabled] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(90);
  const [temperature, setTemperature] = useState(0.7);
  const [dockerConnMode, setDockerConnMode] = useState<'local' | 'remote'>('local');
  const [memoryLimit, setMemoryLimit] = useState(512);
  const [cpuQuota, setCpuQuota] = useState(1);
  const [includeVolumes, setIncludeVolumes] = useState(false);
  const [includeImages, setIncludeImages] = useState(true);
  const [expandedAuthProvider, setExpandedAuthProvider] = useState<string | null>(null);
  const [whitelistTags, setWhitelistTags] = useState(['192.168.1.0/24', '10.0.0.0/8']);
  const [blacklistTags, setBlacklistTags] = useState(['45.12.3.1', '182.1.2.3']);
  const [fail2banEnabled, setFail2banEnabled] = useState(true);
  const [acmeChallenge, setAcmeChallenge] = useState<'http' | 'dns'>('http');
  const [globalHeaders, setGlobalHeaders] = useState([
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' }
  ]);
  const [compressionEnabled, setCompressionEnabled] = useState(true);
  const [smtpTls, setSmtpTls] = useState(true);
  const [alertRouting, setAlertRouting] = useState<Record<string, Record<string, boolean>>>({
    'Container Crash': { email: true, discord: true, slack: true, push: true },
    'High CPU Usage': { email: true, discord: false, slack: true, push: true },
    'Failed Login': { email: true, discord: true, slack: false, push: true },
    'Backup Success': { email: false, discord: false, slack: true, push: false },
    'New User Invited': { email: true, discord: false, slack: false, push: true },
    'SSL Certificate Renewal': { email: true, discord: true, slack: true, push: true }
  });

  const filteredNavItems = navItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="flex-1 flex bg-slate-950 overflow-hidden">
      {/* Left Column: Sticky Sidebar */}
      <div className="w-72 border-r border-slate-800 bg-slate-950 flex flex-col sticky top-0 h-full">
        <div className="p-8 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white mb-6">Settings</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-10 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeSection === item.id 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <span className={activeSection === item.id ? 'text-indigo-400' : 'text-slate-500'}>
                {item.icon}
              </span>
              {item.label}
              {activeSection === item.id && (
                <ChevronRight size={14} className="ml-auto opacity-50" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Admin User</span>
              <span className="text-[10px] text-slate-500 uppercase">Pro Plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Scrollable Form Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
        <div className="max-w-4xl mx-auto p-12 space-y-12">
          
          {/* Section: General */}
          {activeSection === 'general' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">General Settings</h3>
                <p className="text-sm text-slate-400">Manage your workspace identity and core preferences.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center gap-3 text-indigo-400">
                    <Globe size={18} />
                    <h4 className="text-sm font-bold uppercase tracking-widest">Workspace</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 uppercase">Workspace Name</label>
                      <input type="text" defaultValue="Nexus Infrastructure" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 uppercase">Custom Domain</label>
                      <input type="text" defaultValue="nexus.io" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center gap-3 text-indigo-400">
                    <Settings size={18} />
                    <h4 className="text-sm font-bold uppercase tracking-widest">Appearance</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-300 uppercase">Dark Mode</span>
                        <span className="text-[10px] text-slate-400">Always use dark theme</span>
                      </div>
                      <button className="w-10 h-5 rounded-full bg-indigo-500 relative">
                        <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Section: AI Engine */}
          {activeSection === 'ai' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">AI Engine & Automation</h3>
                <p className="text-sm text-slate-400">Configure the intelligence behind automated log analysis and self-healing.</p>
              </div>

              {/* Provider Selection */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Provider Type</label>
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button 
                      onClick={() => setAiMode('cloud')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${aiMode === 'cloud' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Cloud Providers
                    </button>
                    <button 
                      onClick={() => setAiMode('local')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${aiMode === 'local' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Local Models
                    </button>
                  </div>
                </div>

                {aiMode === 'cloud' ? (
                  <div className="space-y-6">
                    {/* OpenAI Card */}
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <Zap size={16} />
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">OpenAI</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MaskedInput label="API Key" placeholder="sk-..." />
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Default Model</label>
                          <select className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none">
                            <option>gpt-4o</option>
                            <option>gpt-4-turbo</option>
                            <option>gpt-3.5-turbo</option>
                          </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Organization ID</label>
                          <input type="text" placeholder="org-..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                        </div>
                      </div>
                    </div>

                    {/* Anthropic Card */}
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <Zap size={16} />
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Anthropic</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MaskedInput label="API Key" placeholder="sk-ant-..." />
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Default Model</label>
                          <select className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none">
                            <option>claude-3-5-sonnet-latest</option>
                            <option>claude-3-opus-latest</option>
                            <option>claude-3-haiku-latest</option>
                          </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Organization ID</label>
                          <input type="text" placeholder="org-..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                        </div>
                      </div>
                    </div>

                    {/* Gemini Card */}
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <Zap size={16} />
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Google Gemini</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MaskedInput label="API Key" placeholder="AIza..." />
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Default Model</label>
                          <select className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none">
                            <option>gemini-1.5-pro</option>
                            <option>gemini-1.5-flash</option>
                          </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Organization ID</label>
                          <input type="text" placeholder="Project ID or Org ID" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Cpu size={16} />
                      </div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Local Models (Ollama / vLLM)</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ollama/vLLM Base URL</label>
                        <input type="text" placeholder="http://localhost:11434" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                      </div>
                      <MaskedInput label="Bearer Token" placeholder="Optional token..." />
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Custom Model Name</label>
                        <input type="text" placeholder="llama3:8b" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Behavioral Tuning */}
                <div className="pt-8 border-t border-slate-800 space-y-8">
                  <div className="flex items-center gap-3">
                    <Settings size={18} className="text-indigo-400" />
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Behavioral Tuning</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Creativity (Temperature)</label>
                        <span className="text-xs font-mono text-indigo-400 font-bold">{temperature}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={temperature} 
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 uppercase font-mono">
                        <span>Precise (0.0)</span>
                        <span>Creative (1.0)</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Max Tokens</label>
                      <input 
                        type="number" 
                        defaultValue="4096" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global System Prompt Override</label>
                    <textarea 
                      placeholder="You are a senior DevOps engineer specializing in infrastructure automation..." 
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-32 resize-none" 
                    />
                    <p className="text-[10px] text-slate-500 italic">This prompt will be prepended to all AI Doctor diagnostic requests.</p>
                  </div>
                </div>

                {/* Autonomous Action Toggle Card */}
                <div className={`p-8 rounded-2xl border transition-all duration-500 ${autonomousEnabled ? 'bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'bg-slate-950 border-slate-800'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${autonomousEnabled ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-slate-500'}`}>
                        <Zap size={24} className={autonomousEnabled ? 'animate-pulse' : ''} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">Autonomous Action</h4>
                        <p className="text-sm text-slate-400">Allow AI Doctor to automatically execute terminal commands.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setAutonomousEnabled(!autonomousEnabled)}
                      className={`w-14 h-7 rounded-full relative transition-all duration-300 ${autonomousEnabled ? 'bg-indigo-500' : 'bg-slate-800'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${autonomousEnabled ? 'left-8' : 'left-1'}`} />
                    </button>
                  </div>

                  {autonomousEnabled && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-6 pt-6 border-t border-indigo-500/20"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Confidence Threshold</label>
                          <span className="text-sm font-mono text-indigo-400 font-bold">{confidenceThreshold}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="50" 
                          max="100" 
                          value={confidenceThreshold}
                          onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                          className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 uppercase font-mono">
                          <span>Cautious (50%)</span>
                          <span>Strict (100%)</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                        <AlertCircle size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-400 leading-relaxed">
                          <span className="text-indigo-400 font-bold">Warning:</span> Enabling autonomous actions allows the AI to modify your infrastructure without confirmation. Ensure your confidence threshold is set to a safe level.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Section: Security */}
          {activeSection === 'security' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Security & Access</h3>
                <p className="text-sm text-slate-400">Manage authentication protocols, active sessions, and network security.</p>
              </div>

              {/* Authentication Providers Accordion */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Authentication Providers</h4>
                </div>
                <div className="divide-y divide-slate-800">
                  {[
                    { id: 'saml', label: 'SAML / SSO', icon: <Shield size={16} /> },
                    { id: 'github', label: 'GitHub OAuth', icon: <Globe size={16} /> },
                    { id: 'google', label: 'Google OIDC', icon: <Globe size={16} /> }
                  ].map((provider) => (
                    <div key={provider.id} className="bg-slate-900/50">
                      <button 
                        onClick={() => setExpandedAuthProvider(expandedAuthProvider === provider.id ? null : provider.id)}
                        className="w-full flex items-center justify-between p-6 hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-indigo-400">{provider.icon}</div>
                          <span className="text-sm font-bold text-white uppercase tracking-wider">{provider.label}</span>
                        </div>
                        <ChevronDown size={16} className={`text-slate-500 transition-transform ${expandedAuthProvider === provider.id ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {expandedAuthProvider === provider.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <MaskedInput label="Client ID" placeholder="Enter client id..." />
                                <MaskedInput label="Client Secret" placeholder="Enter client secret..." />
                              </div>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Auth URL</label>
                                  <input type="text" placeholder="https://..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Token URL</label>
                                  <input type="text" placeholder="https://..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Sessions Bento Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone size={18} className="text-indigo-400" />
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Active Sessions</h4>
                  </div>
                  <button className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase rounded-lg hover:bg-red-500 hover:text-white transition-all">
                    Revoke All Sessions
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Device</th>
                        <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Browser</th>
                        <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">IP Address</th>
                        <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {[
                        { device: 'MacBook Pro', browser: 'Chrome', ip: '192.168.1.45', current: true, icon: <Laptop size={14} /> },
                        { device: 'iPhone 15', browser: 'Safari', ip: '172.20.10.2', current: false, icon: <Smartphone size={14} /> },
                        { device: 'Windows PC', browser: 'Edge', ip: '10.0.0.12', current: false, icon: <Laptop size={14} /> }
                      ].map((session, i) => (
                        <tr key={i} className="group">
                          <td className="py-4 flex items-center gap-3">
                            <div className="text-slate-500 group-hover:text-indigo-400 transition-colors">{session.icon}</div>
                            <span className="text-xs font-bold text-white">{session.device}</span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <Chrome size={12} className="text-slate-500" />
                              <span className="text-xs text-slate-400">{session.browser}</span>
                            </div>
                          </td>
                          <td className="py-4 text-xs font-mono text-slate-400">{session.ip}</td>
                          <td className="py-4 text-right">
                            {session.current ? (
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-bold uppercase rounded border border-emerald-500/20">Current</span>
                            ) : (
                              <button className="text-[8px] font-bold text-slate-500 uppercase hover:text-red-500 transition-colors">Revoke</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Network Firewall */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
                <div className="flex items-center gap-3">
                  <ShieldAlert size={18} className="text-indigo-400" />
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Network Firewall</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <TagInput 
                    label="IP Whitelist (CIDR)" 
                    tags={whitelistTags} 
                    setTags={setWhitelistTags} 
                    placeholder="Enter IP and press Enter..." 
                  />
                  <TagInput 
                    label="IP Blacklist" 
                    tags={blacklistTags} 
                    setTags={setBlacklistTags} 
                    placeholder="Enter IP and press Enter..." 
                  />
                </div>
              </div>

              {/* Fail2Ban Intrusion Detection */}
              <div className={`p-8 rounded-2xl border transition-all duration-500 ${fail2banEnabled ? 'bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'bg-slate-950 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${fail2banEnabled ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-slate-500'}`}>
                      <ShieldAlert size={24} className={fail2banEnabled ? 'animate-pulse' : ''} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Fail2Ban Intrusion Detection</h4>
                      <p className="text-sm text-slate-400">Auto-ban IPs after multiple failed login attempts.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFail2banEnabled(!fail2banEnabled)}
                    className={`w-14 h-7 rounded-full relative transition-all duration-300 ${fail2banEnabled ? 'bg-indigo-500' : 'bg-slate-800'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${fail2banEnabled ? 'left-8' : 'left-1'}`} />
                  </button>
                </div>

                {fail2banEnabled && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-8 pt-8 border-t border-indigo-500/20"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Max Retry Attempts</label>
                        <input type="number" defaultValue="5" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Find Time (minutes)</label>
                        <input type="number" defaultValue="10" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ban Time (hours)</label>
                        <input type="number" defaultValue="24" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Key size={18} className="text-indigo-400" />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white uppercase">Enforce Hardware WebAuthn</span>
                          <span className="text-[10px] text-slate-500">Require YubiKey for all Admin roles</span>
                        </div>
                      </div>
                      <button className="w-10 h-5 rounded-full bg-indigo-500 relative">
                        <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Danger Zone */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-red-500">
                  <AlertCircle size={18} />
                  <h4 className="text-sm font-bold uppercase tracking-widest">Danger Zone</h4>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white uppercase">Delete Workspace</span>
                    <span className="text-[10px] text-slate-400">Permanently remove all data and infrastructure.</span>
                  </div>
                  <button className="px-6 py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase rounded-lg hover:bg-red-500 hover:text-white transition-all">
                    Delete Forever
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Section: Infrastructure */}
          {activeSection === 'infrastructure' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Infrastructure & Daemon</h3>
                <p className="text-sm text-slate-400">Low-level engine tuning for the bare metal.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
                {/* Connection Mode */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Connection Mode</label>
                  <div className="flex gap-4">
                    {[
                      { id: 'local', label: 'Local Unix Socket', desc: '/var/run/docker.sock' },
                      { id: 'remote', label: 'Remote TCP', desc: 'tcp://host:2376' }
                    ].map((mode) => (
                      <button 
                        key={mode.id}
                        onClick={() => setDockerConnMode(mode.id as 'local' | 'remote')}
                        className={`flex-1 p-4 rounded-xl border transition-all text-left group ${dockerConnMode === mode.id ? 'bg-indigo-500/10 border-indigo-500 shadow-lg shadow-indigo-500/5' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold uppercase ${dockerConnMode === mode.id ? 'text-indigo-400' : 'text-white'}`}>{mode.label}</span>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${dockerConnMode === mode.id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-700'}`}>
                            {dockerConnMode === mode.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">{mode.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditional TLS Dropzones */}
                <AnimatePresence>
                  {dockerConnMode === 'remote' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4"
                    >
                      {['ca.pem', 'cert.pem', 'key.pem'].map((file) => (
                        <div key={file} className="p-4 bg-slate-950 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-indigo-500/50 transition-colors cursor-pointer group">
                          <Plus size={16} className="text-slate-500 group-hover:text-indigo-400" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{file}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Global Resource Defaults */}
                <div className="pt-8 border-t border-slate-800 space-y-8">
                  <div className="flex items-center gap-3">
                    <Cpu size={18} className="text-indigo-400" />
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Global Resource Defaults</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Default Memory Limit</label>
                        <span className="text-xs font-mono text-indigo-400 font-bold">{memoryLimit < 1024 ? `${memoryLimit}MB` : `${(memoryLimit / 1024).toFixed(1)}GB`}</span>
                      </div>
                      <input 
                        type="range" 
                        min="128" 
                        max="8192" 
                        step="128" 
                        value={memoryLimit} 
                        onChange={(e) => setMemoryLimit(parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 uppercase font-mono">
                        <span>128MB</span>
                        <span>8GB</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Default CPU Quota</label>
                        <span className="text-xs font-mono text-indigo-400 font-bold">{cpuQuota} Cores</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="16" 
                        step="0.5" 
                        value={cpuQuota} 
                        onChange={(e) => setCpuQuota(parseFloat(e.target.value))}
                        className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 uppercase font-mono">
                        <span>0.5 Core</span>
                        <span>16 Cores</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logging Driver Matrix */}
                <div className="pt-8 border-t border-slate-800 space-y-6">
                  <div className="flex items-center gap-3">
                    <Database size={18} className="text-indigo-400" />
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Logging Driver Configuration</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Default Driver</label>
                      <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none">
                        <option value="json-file">json-file</option>
                        <option value="journald">journald</option>
                        <option value="loki">loki</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">max-size</label>
                      <input type="text" defaultValue="10m" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">max-file</label>
                      <input type="number" defaultValue="3" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" />
                    </div>
                  </div>
                </div>

                {/* Garbage Collection */}
                <div className="pt-8 border-t border-slate-800 space-y-6">
                  <div className="flex items-center gap-3">
                    <Trash2 size={18} className="text-indigo-400" />
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Automated Garbage Collection</h4>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cron Expression Builder</label>
                      <div className="flex gap-3">
                        {[
                          { label: 'Minute', options: ['0', '15', '30', '45'] },
                          { label: 'Hour', options: Array.from({ length: 24 }, (_, i) => i.toString()) },
                          { label: 'Day', options: ['*', '1', '15', 'Last'] }
                        ].map((unit) => (
                          <div key={unit.label} className="flex-1 space-y-2">
                            <span className="text-[9px] text-slate-500 uppercase font-mono">{unit.label}</span>
                            <select className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500">
                              {unit.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                        ))}
                        <div className="flex-[2] flex flex-col justify-end">
                          <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-indigo-400 text-center">
                            docker system prune -a
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                        onClick={() => setIncludeVolumes(!includeVolumes)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${includeVolumes ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-slate-900 border-slate-800'}`}
                      >
                        <span className="text-xs font-bold text-white uppercase">Include Unused Volumes</span>
                        <div className={`w-8 h-4 rounded-full relative transition-all ${includeVolumes ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                          <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${includeVolumes ? 'left-4.5' : 'left-0.5'}`} />
                        </div>
                      </button>
                      <button 
                        onClick={() => setIncludeImages(!includeImages)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${includeImages ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-slate-900 border-slate-800'}`}
                      >
                        <span className="text-xs font-bold text-white uppercase">Include Dangling Images</span>
                        <div className={`w-8 h-4 rounded-full relative transition-all ${includeImages ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                          <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${includeImages ? 'left-4.5' : 'left-0.5'}`} />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Section: Gateway */}
          {activeSection === 'gateway' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Gateway & SSL</h3>
                <p className="text-sm text-slate-400">Manage the internal reverse proxy, SSL certificates, and global routing rules.</p>
              </div>

              {/* ACME Configuration */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
                <div className="flex items-center gap-3">
                  <Lock size={18} className="text-indigo-400" />
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Certificate Authority (ACME)</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Registration Email</label>
                    <input type="email" placeholder="admin@nexus.io" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Challenge Type</label>
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button 
                        onClick={() => setAcmeChallenge('http')}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${acmeChallenge === 'http' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        HTTP-01
                      </button>
                      <button 
                        onClick={() => setAcmeChallenge('dns')}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${acmeChallenge === 'dns' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        DNS-01
                      </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {acmeChallenge === 'dns' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DNS Provider</label>
                        <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none">
                          <option>Cloudflare</option>
                          <option>AWS Route53</option>
                          <option>DigitalOcean</option>
                          <option>Google Cloud DNS</option>
                        </select>
                      </div>
                      <MaskedInput label="DNS API Token" placeholder="Enter provider token..." />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Global HTTP Headers Builder */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={18} className="text-indigo-400" />
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Global HTTP Headers</h4>
                  </div>
                  <button 
                    onClick={() => setGlobalHeaders([...globalHeaders, { key: '', value: '' }])}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase rounded-lg hover:bg-indigo-500 hover:text-white transition-all"
                  >
                    <Plus size={12} /> Add Header
                  </button>
                </div>

                <div className="space-y-3">
                  {globalHeaders.map((header, index) => (
                    <div key={index} className="flex gap-3 items-start group">
                      <div className="flex-1 space-y-1">
                        <input 
                          type="text" 
                          value={header.key}
                          onChange={(e) => {
                            const newHeaders = [...globalHeaders];
                            newHeaders[index].key = e.target.value;
                            setGlobalHeaders(newHeaders);
                          }}
                          placeholder="Header Key"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <div className="flex-[2] space-y-1">
                        <input 
                          type="text" 
                          value={header.value}
                          onChange={(e) => {
                            const newHeaders = [...globalHeaders];
                            newHeaders[index].value = e.target.value;
                            setGlobalHeaders(newHeaders);
                          }}
                          placeholder="Header Value"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <button 
                        onClick={() => setGlobalHeaders(globalHeaders.filter((_, i) => i !== index))}
                        className="p-2 text-slate-600 hover:text-red-500 transition-colors mt-0.5"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proxy Tuning */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
                <div className="flex items-center gap-3">
                  <Zap size={18} className="text-indigo-400" />
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Proxy Tuning</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white uppercase">Gzip/Brotli Compression</span>
                      <span className="text-[10px] text-slate-500">Enable global asset compression</span>
                    </div>
                    <button 
                      onClick={() => setCompressionEnabled(!compressionEnabled)}
                      className={`w-10 h-5 rounded-full relative transition-all ${compressionEnabled ? 'bg-indigo-500' : 'bg-slate-800'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${compressionEnabled ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Client Max Body Size (MB)</label>
                    <input type="number" defaultValue="100" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fallback 404/502 Error Page (HTML)</label>
                    <span className="text-[10px] font-mono text-indigo-400">Monaco Editor Widget</span>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                    <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800">
                        <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                        <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
                        <span className="ml-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">error_page.html</span>
                      </div>
                      <textarea 
                        defaultValue={`<!DOCTYPE html>\n<html>\n<head>\n  <title>Nexus - Error</title>\n  <style>body { background: #020617; color: #fff; font-family: sans-serif; }</style>\n</head>\n<body>\n  <h1>{{status_code}}</h1>\n  <p>{{message}}</p>\n</body>\n</html>`}
                        className="w-full h-64 bg-transparent p-6 text-xs font-mono text-indigo-300 outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Section: Storage */}
          {activeSection === 'storage' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Storage & S3 Backups</h3>
                <p className="text-sm text-slate-400">Configure remote destinations for snapshots and backups.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Provider</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none">
                    <option>AWS S3</option>
                    <option>MinIO</option>
                    <option>Backblaze B2</option>
                    <option>Cloudflare R2</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Endpoint URL</label>
                    <input type="text" placeholder="https://s3.amazonaws.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bucket Name</label>
                    <input type="text" placeholder="nexus-backups" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                  <MaskedInput label="Access Key" />
                  <MaskedInput label="Secret Key" />
                </div>

                <div className="pt-8 border-t border-slate-800 space-y-6">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Retention Policy</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hourly Snapshots</label>
                      <div className="flex items-center gap-3">
                        <input type="number" defaultValue="7" className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-indigo-500" />
                        <span className="text-xs text-slate-500 uppercase">Days</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Daily Snapshots</label>
                      <div className="flex items-center gap-3">
                        <input type="number" defaultValue="30" className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-indigo-500" />
                        <span className="text-xs text-slate-500 uppercase">Days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Section: Notifications */}
          {activeSection === 'notifications' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Notifications & Alerting</h3>
                <p className="text-sm text-slate-400">Configure how and where you receive system alerts and health reports.</p>
              </div>

              {/* Email (SMTP) Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-indigo-400" />
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Email (SMTP) Configuration</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SMTP Host</label>
                    <input type="text" placeholder="smtp.gmail.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Port</label>
                    <input type="number" placeholder="587" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" />
                  </div>
                  <MaskedInput label="Username" placeholder="user@example.com" />
                  <MaskedInput label="Password" placeholder="••••••••" />
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">From Address</label>
                    <input type="email" placeholder="nexus-alerts@yourdomain.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white uppercase">Require TLS</span>
                    <span className="text-[10px] text-slate-500">Enforce encrypted connection for mail delivery</span>
                  </div>
                  <button 
                    onClick={() => setSmtpTls(!smtpTls)}
                    className={`w-10 h-5 rounded-full relative transition-all ${smtpTls ? 'bg-indigo-500' : 'bg-slate-800'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${smtpTls ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              {/* Integrations Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} className="text-indigo-400" />
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Chat & Webhook Integrations</h4>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Discord Webhook URL</label>
                    <input type="text" placeholder="https://discord.com/api/webhooks/..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Slack Bot Token</label>
                    <input type="password" placeholder="xoxb-..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Telegram Chat ID</label>
                    <input type="text" placeholder="-100123456789" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" />
                  </div>
                </div>
              </div>

              {/* Alert Routing Matrix */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-indigo-400" />
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Alert Routing Matrix</h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Event</th>
                        {['Email', 'Discord', 'Slack', 'UI Push'].map(channel => (
                          <th key={channel} className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">{channel}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {Object.keys(alertRouting).map((event) => (
                        <tr key={event} className="group hover:bg-slate-950/50 transition-colors">
                          <td className="py-4">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">{event}</span>
                          </td>
                          {['email', 'discord', 'slack', 'push'].map(channel => (
                            <td key={channel} className="py-4 text-center">
                              <button 
                                onClick={() => {
                                  const newRouting = { ...alertRouting };
                                  newRouting[event][channel] = !newRouting[event][channel];
                                  setAlertRouting(newRouting);
                                }}
                                className={`w-5 h-5 rounded border transition-all inline-flex items-center justify-center ${
                                  alertRouting[event][channel] 
                                    ? 'bg-indigo-500 border-indigo-500 text-white' 
                                    : 'bg-slate-950 border-slate-800 text-transparent hover:border-slate-600'
                                }`}
                              >
                                <Zap size={10} fill="currentColor" />
                              </button>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                  <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-wider">
                    <span className="text-indigo-400 font-bold">Pro Tip:</span> Route critical events like <span className="text-white">Container Crash</span> to all channels to ensure zero downtime awareness.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer: Save Action */}
          <div className="pt-12 border-t border-slate-800 flex justify-end gap-4">
            <button className="px-6 py-2.5 text-slate-400 text-xs font-bold uppercase hover:text-white transition-all">
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-2.5 bg-indigo-500 text-white text-xs font-bold uppercase rounded-xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2"
            >
              {isSaving ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Zap size={14} />
                </motion.div>
              ) : (
                <Save size={14} />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

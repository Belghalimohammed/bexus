import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Save,
  Trash2,
  AlertCircle,
  Plus,
  Clock,
  Server,
  Mail,
  MessageSquare
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

export const SettingsManager: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingSection>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [aiMode, setAiMode] = useState<'cloud' | 'local'>('cloud');
  const [autonomousEnabled, setAutonomousEnabled] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(90);
  const [temperature, setTemperature] = useState(0.7);

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
                <h3 className="text-2xl font-bold text-white mb-2">Security & Access Control</h3>
                <p className="text-sm text-slate-400">Manage authentication protocols and network security.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Authentication Methods</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Email / Password', active: true },
                      { label: 'GitHub OAuth', active: true },
                      { label: 'Google OIDC', active: false },
                      { label: 'SAML / SSO', active: false },
                    ].map((method) => (
                      <div key={method.label} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                        <span className="text-xs font-bold text-white uppercase">{method.label}</span>
                        <button className={`w-10 h-5 rounded-full relative transition-all ${method.active ? 'bg-indigo-500' : 'bg-slate-800'}`}>
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${method.active ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-slate-800 space-y-6">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Network Security</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">IP Whitelist / Blacklist (CIDR)</label>
                        <textarea placeholder="192.168.1.1/32&#10;10.0.0.0/8" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-24 font-mono resize-none" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white uppercase">Fail2Ban Integration</span>
                          <span className="text-[10px] text-slate-500">Auto-ban after 5 failed attempts</span>
                        </div>
                        <button className="w-10 h-5 rounded-full bg-indigo-500 relative">
                          <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

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
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Docker Connection</label>
                  <div className="flex gap-4">
                    {['Local Socket', 'Remote TCP'].map((mode) => (
                      <label key={mode} className="flex-1 flex items-center gap-3 p-4 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer group">
                        <input type="radio" name="docker-conn" defaultChecked={mode === 'Local Socket'} className="accent-indigo-500" />
                        <span className="text-xs font-bold text-white uppercase">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Default Memory Limit</label>
                      <span className="text-xs font-mono text-indigo-400 font-bold">512MB</span>
                    </div>
                    <input type="range" min="128" max="4096" step="128" defaultValue="512" className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global CPU Quota</label>
                      <span className="text-xs font-mono text-indigo-400 font-bold">50%</span>
                    </div>
                    <input type="range" min="10" max="100" defaultValue="50" className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-800 space-y-6">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Garbage Collection</h4>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 text-indigo-400 mb-2">
                      <Clock size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Cron Schedule</span>
                    </div>
                    <div className="flex gap-2">
                      {['0', '0', '*', '*', '0'].map((val, i) => (
                        <input key={i} type="text" defaultValue={val} className="w-10 h-10 bg-slate-900 border border-slate-800 rounded text-center text-sm font-mono text-white outline-none focus:border-indigo-500" />
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase">Runs: Every Sunday at Midnight (docker system prune -a)</p>
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
                <p className="text-sm text-slate-400">Routing and certification defaults for Nginx/Caddy.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">ACME (Let's Encrypt)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Registration Email</label>
                      <input type="email" placeholder="admin@nexus.io" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Challenge Type</label>
                      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                        {['HTTP-01', 'DNS-01'].map((c) => (
                          <button key={c} className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${c === 'HTTP-01' ? 'bg-indigo-500 text-white' : 'text-slate-500'}`}>{c}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-800 space-y-6">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Global Security Headers</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
                      { key: 'X-Frame-Options', value: 'DENY' },
                      { key: 'X-Content-Type-Options', value: 'nosniff' },
                    ].map((header) => (
                      <div key={header.key} className="flex gap-3">
                        <input type="text" defaultValue={header.key} className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none focus:border-indigo-500" />
                        <input type="text" defaultValue={header.value} className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs font-mono text-white outline-none focus:border-indigo-500" />
                        <button className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    ))}
                    <button className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase hover:underline pt-2">
                      <Plus size={12} /> Add Header
                    </button>
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
                <h3 className="text-2xl font-bold text-white mb-2">Notifications & Webhooks</h3>
                <p className="text-sm text-slate-400">Configure alert routing for system events.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">SMTP Setup</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Host</label>
                      <input type="text" placeholder="smtp.gmail.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Port</label>
                      <input type="number" placeholder="587" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-indigo-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MaskedInput label="User" />
                    <MaskedInput label="Password" />
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-800 space-y-6">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Chat Ops</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Discord Webhook URL</label>
                      <input type="text" placeholder="https://discord.com/api/webhooks/..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 font-mono" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Slack Bot Token</label>
                      <input type="password" placeholder="xoxb-..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 font-mono" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Telegram Bot Token</label>
                      <input type="password" placeholder="123456:ABC-DEF..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 font-mono" />
                    </div>
                  </div>
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

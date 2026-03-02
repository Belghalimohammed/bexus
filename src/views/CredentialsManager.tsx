import React, { useState } from 'react';
import { 
  GitBranch, 
  Box, 
  Cloud, 
  Key, 
  Github, 
  Gitlab, 
  Eye, 
  EyeOff, 
  Copy, 
  RefreshCw, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Upload, 
  Shield, 
  Lock,
  Search,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'git' | 'registries' | 'cloud' | 'ssh';

interface SecretInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SecretInput: React.FC<SecretInputProps> = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</label>
      <div className="relative group">
        <input 
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-10"
        />
        <button 
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
};

const Toast: React.FC<{ message: string; onClear: () => void }> = ({ message, onClear }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClear, 3000);
    return () => clearTimeout(timer);
  }, [onClear]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl z-[100] flex items-center gap-3 border border-white/10"
    >
      <CheckCircle2 size={18} className="text-emerald-400" />
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
};

export const CredentialsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('git');
  const [toast, setToast] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [testSuccess, setTestSuccess] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
  };

  const handleTestConnection = (id: string) => {
    setTestingConnection(id);
    setTestSuccess(null);
    setTimeout(() => {
      setTestingConnection(null);
      setTestSuccess(id);
      showToast(`${id.charAt(0).toUpperCase() + id.slice(1)} connection successful`);
    }, 1500);
  };

  const tabs = [
    { id: 'git', label: 'Version Control (Git)', icon: <GitBranch size={18} /> },
    { id: 'registries', label: 'Container Registries', icon: <Box size={18} /> },
    { id: 'cloud', label: 'Cloud Providers', icon: <Cloud size={18} /> },
    { id: 'ssh', label: 'SSH Keys', icon: <Key size={18} /> },
  ];

  return (
    <div className="flex-1 flex bg-slate-50 overflow-hidden">
      {/* Sidebar Tabs */}
      <aside className="w-72 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-200 bg-white">
          <h1 className="font-serif italic text-xl tracking-tight text-slate-900">Integrations</h1>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">External Credentials</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-primary shadow-sm border border-slate-200 border-l-4 border-l-primary' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-primary' : 'text-slate-400'}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-10">
        <AnimatePresence mode="wait">
          {activeTab === 'git' && (
            <motion.div 
              key="git"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl space-y-8"
            >
              <div className="grid grid-cols-1 gap-6">
                {['GitHub', 'GitLab', 'Bitbucket'].map((provider) => (
                  <GitCard 
                    key={provider} 
                    name={provider} 
                    onSave={() => showToast(`${provider} credentials saved`)}
                    onTest={() => handleTestConnection(provider.toLowerCase())}
                    isTesting={testingConnection === provider.toLowerCase()}
                    isSuccess={testSuccess === provider.toLowerCase()}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'registries' && (
            <motion.div 
              key="registries"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl space-y-6"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Container Registries</h2>
                  <p className="text-sm text-slate-500">Manage external image repositories for automated pulls.</p>
                </div>
                <button 
                  onClick={() => showToast('Registry modal opened')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <Plus size={14} />
                  Add Registry
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Registry</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">URL</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Username</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <RegistryRow 
                      name="Docker Hub" 
                      url="index.docker.io" 
                      user="nexus_admin" 
                      isDefault 
                    />
                    <RegistryRow 
                      name="GitHub GHCR" 
                      url="ghcr.io" 
                      user="mohammed_b" 
                    />
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'cloud' && (
            <motion.div 
              key="cloud"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl space-y-8"
            >
              <div className="grid grid-cols-1 gap-8">
                <CloudCard 
                  provider="AWS" 
                  fields={['Access Key ID', 'Secret Access Key']} 
                  onSave={() => showToast('AWS Credentials Saved')}
                />
                <CloudCard 
                  provider="Google Cloud" 
                  isGCP 
                  onSave={() => showToast('GCP Service Account Uploaded')}
                />
                <CloudCard 
                  provider="Azure" 
                  fields={['Tenant ID', 'Client ID', 'Client Secret']} 
                  onSave={() => showToast('Azure Credentials Saved')}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'ssh' && (
            <motion.div 
              key="ssh"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl space-y-6"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">SSH Key Manager</h2>
                  <p className="text-sm text-slate-500">Private keys for worker node orchestration and mesh networking.</p>
                </div>
                <button 
                  onClick={() => showToast('Import key modal opened')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <Upload size={14} />
                  Import Private Key
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Key Name</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Algorithm</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Fingerprint</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <SSHKeyRow name="Nexus-Core-Worker" algo="Ed25519" fingerprint="SHA256:x7v...9k2" />
                    <SSHKeyRow name="Backup-Node-01" algo="RSA 4096" fingerprint="SHA256:p2m...1a4" />
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {toast && <Toast message={toast} onClear={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

const GitCard: React.FC<{ 
  name: string; 
  onSave: () => void; 
  onTest: () => void;
  isTesting: boolean;
  isSuccess: boolean;
}> = ({ name, onSave, onTest, isTesting, isSuccess }) => {
  const [authType, setAuthType] = useState<'https' | 'ssh'>('https');
  
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-900 shadow-sm">
            {name === 'GitHub' ? <Github size={20} /> : <GitBranch size={20} />}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{name}</h3>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Git Integration</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setAuthType('https')}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${authType === 'https' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
          >
            HTTPS
          </button>
          <button 
            onClick={() => setAuthType('ssh')}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${authType === 'ssh' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
          >
            SSH Key
          </button>
        </div>
      </div>

      <div className="p-6">
        {authType === 'https' ? (
          <div className="grid grid-cols-2 gap-6">
            <SecretInput label="Username" value="" onChange={() => {}} placeholder="nexus-bot" />
            <SecretInput label="Personal Access Token" value="" onChange={() => {}} placeholder="ghp_xxxxxxxxxxxx" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Public Ed25519 Key</label>
                <button className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                  <RefreshCw size={10} />
                  Generate New Keypair
                </button>
              </div>
              <div className="relative group">
                <textarea 
                  readOnly
                  value="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMpj94/S3fS9K6p8f7G9H9J9K9L9M9N9O9P9Q9R9S9T nexus-os-core"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-mono text-slate-600 h-24 resize-none outline-none"
                />
                <button className="absolute top-3 right-3 p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-primary transition-all shadow-sm">
                  <Copy size={14} />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 italic">Paste this key into your {name} account settings under "SSH and GPG keys".</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onTest}
            disabled={isTesting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
              isSuccess 
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                : 'bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
            }`}
          >
            {isTesting ? <RefreshCw size={12} className="animate-spin" /> : isSuccess ? <CheckCircle2 size={12} /> : <ExternalLink size={12} />}
            {isTesting ? 'Testing...' : isSuccess ? 'Connection Verified' : 'Test Connection'}
          </button>
          {isSuccess && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest animate-pulse">
              <CheckCircle2 size={10} />
              Success
            </span>
          )}
        </div>
        <button 
          onClick={onSave}
          className="px-6 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-slate-800 transition-all"
        >
          Save Credentials
        </button>
      </div>
    </div>
  );
};

const RegistryRow: React.FC<{ name: string; url: string; user: string; isDefault?: boolean }> = ({ name, url, user, isDefault }) => (
  <tr className="group hover:bg-slate-50 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
          <Box size={16} />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
            {name}
            {isDefault && <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase tracking-tighter">Default</span>}
          </div>
          <div className="text-[10px] text-slate-400">Private Registry</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-xs font-mono text-slate-500">{url}</td>
    <td className="px-6 py-4 text-xs text-slate-600">{user}</td>
    <td className="px-6 py-4">
      <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Connected
      </span>
    </td>
    <td className="px-6 py-4 text-right">
      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 text-slate-400 hover:text-primary transition-colors"><ExternalLink size={14} /></button>
        <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
      </div>
    </td>
  </tr>
);

const CloudCard: React.FC<{ provider: string; fields?: string[]; isGCP?: boolean; onSave: () => void }> = ({ provider, fields, isGCP, onSave }) => (
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-900 shadow-sm">
          <Cloud size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">{provider}</h3>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Cloud Infrastructure</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status:</span>
        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Not Configured</span>
      </div>
    </div>

    <div className="p-6">
      {isGCP ? (
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Service Account JSON Key</label>
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-primary/30 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:text-primary shadow-sm mb-4 transition-colors">
              <Upload size={20} />
            </div>
            <p className="text-sm font-medium text-slate-600">Drag and drop your JSON key file here</p>
            <p className="text-xs text-slate-400 mt-1">or click to browse from your computer</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {fields?.map(field => (
            <SecretInput key={field} label={field} value="" onChange={() => {}} placeholder={`Enter your ${field}`} />
          ))}
          {provider === 'AWS' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Default Region</label>
              <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                <option>us-east-1 (N. Virginia)</option>
                <option>us-west-2 (Oregon)</option>
                <option>eu-central-1 (Frankfurt)</option>
                <option>ap-southeast-1 (Singapore)</option>
              </select>
            </div>
          )}
        </div>
      )}
    </div>

    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-400">
        <Shield size={14} />
        <span className="text-[10px] font-medium italic">Encrypted at rest using AES-256-GCM</span>
      </div>
      <button 
        onClick={onSave}
        className="px-6 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-slate-800 transition-all"
      >
        Save Integration
      </button>
    </div>
  </div>
);

const SSHKeyRow: React.FC<{ name: string; algo: string; fingerprint: string }> = ({ name, algo, fingerprint }) => (
  <tr className="group hover:bg-slate-50 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
          <Key size={16} />
        </div>
        <div className="text-sm font-bold text-slate-900">{name}</div>
      </div>
    </td>
    <td className="px-6 py-4 text-xs text-slate-500">{algo}</td>
    <td className="px-6 py-4 text-xs font-mono text-slate-400">{fingerprint}</td>
    <td className="px-6 py-4 text-right">
      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Copy size={14} /></button>
        <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
      </div>
    </td>
  </tr>
);

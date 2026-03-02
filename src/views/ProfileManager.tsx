import React, { useState, useRef } from 'react';
import { 
  User, 
  Shield, 
  Key, 
  Settings, 
  Camera, 
  CheckCircle2, 
  Lock, 
  Smartphone, 
  Usb, 
  Monitor, 
  Smartphone as PhoneIcon, 
  Chrome, 
  Globe, 
  Trash2, 
  Plus, 
  Copy, 
  AlertTriangle,
  ChevronRight,
  Eye,
  EyeOff,
  X,
  QrCode,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ProfileTab = 'general' | 'security' | 'tokens' | 'preferences';

interface Session {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  os: 'macos' | 'windows' | 'linux' | 'ios' | 'android';
}

interface PAT {
  id: string;
  name: string;
  created: string;
  expires: string;
  lastUsed: string;
}

const ProfileManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('general');
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPATModal, setShowPATModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const userEmail = "belghalimohammed0@gmail.com";

  const sessions: Session[] = [
    { id: '1', device: 'MacBook Pro 16"', browser: 'Chrome', ip: '192.168.1.45', location: 'San Francisco, CA', lastActive: 'Just now', isCurrent: true, os: 'macos' },
    { id: '2', device: 'iPhone 15 Pro', browser: 'Safari', ip: '172.20.10.2', location: 'San Francisco, CA', lastActive: '2 hours ago', isCurrent: false, os: 'ios' },
    { id: '3', device: 'Windows Workstation', browser: 'Edge', ip: '10.0.0.12', location: 'London, UK', lastActive: 'Yesterday', isCurrent: false, os: 'windows' },
  ];

  const tokens: PAT[] = [
    { id: '1', name: 'Nexus-CLI-Access', created: '2024-02-15', expires: '2024-08-15', lastUsed: '3 days ago' },
    { id: '2', name: 'GitHub-Action-Sync', created: '2024-01-10', expires: 'Never', lastUsed: '1 week ago' },
  ];

  const sidebarItems = [
    { id: 'general', label: 'General', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'tokens', label: 'Developer Tokens', icon: <Key size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex-1 flex bg-slate-50 overflow-hidden">
      {/* Sticky Left Navigation */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0 sticky top-0 h-full">
        <div className="p-6 border-b border-slate-200">
          <h1 className="font-serif italic text-xl tracking-tight text-slate-900">User Settings</h1>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">Identity & Security</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ProfileTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-primary/5 text-primary shadow-sm border border-primary/10' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className={activeTab === item.id ? 'text-primary' : 'text-slate-400'}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Scrollable Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-10">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* General Information */}
          {activeTab === 'general' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-8 space-y-8"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="relative group cursor-pointer">
                  <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-sm overflow-hidden flex items-center justify-center">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-bold text-slate-900">Avatar Upload</h2>
                  <p className="text-xs text-slate-500 mt-1">Drag and drop or click to change your profile picture.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue="Mohammed Belghali"
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      defaultValue={userEmail}
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-24"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">
                      <CheckCircle2 size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">Verified</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Current Role</label>
                  <input 
                    type="text" 
                    value="Super Admin"
                    readOnly
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button className="px-6 py-2.5 bg-primary text-white text-xs font-bold uppercase rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}

          {/* Account Security & 2FA */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-8 space-y-8"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
                  <p className="text-sm text-slate-500">Update your account password regularly to keep it secure.</p>
                </div>
                <div className="grid grid-cols-1 gap-6 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Current Password</label>
                    <div className="relative">
                      <input type="password" placeholder="••••••••" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><Eye size={16} /></button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">New Password</label>
                    <div className="relative">
                      <input type="password" placeholder="••••••••" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><Eye size={16} /></button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Confirm New Password</label>
                    <div className="relative">
                      <input type="password" placeholder="••••••••" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><Eye size={16} /></button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase rounded-xl hover:bg-slate-800 transition-all">
                    Update Password
                  </button>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-8 space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Two-Factor Authentication (2FA)</h2>
                    <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100">
                    <AlertTriangle size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Disabled</span>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Authenticator App</h3>
                      <p className="text-xs text-slate-500">Use apps like Google Authenticator or Authy.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShow2FAModal(true)}
                    className="px-6 py-2 bg-primary text-white text-xs font-bold uppercase rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    Enable 2FA
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Usb size={16} className="text-slate-400" />
                    <h3 className="text-sm font-bold text-slate-900">Hardware Security Keys (WebAuthn)</h3>
                  </div>
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 divide-y divide-slate-200">
                    <div className="p-4 flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <Key size={16} className="text-slate-400" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">YubiKey 5C NFC</p>
                          <p className="text-[10px] text-slate-500">Registered on Feb 12, 2024</p>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <button className="w-full p-4 text-xs font-bold text-primary hover:bg-primary/5 transition-all text-left flex items-center gap-2">
                      <Plus size={14} />
                      Register New Security Key
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Active Sessions Matrix */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Active Sessions</h2>
                    <p className="text-sm text-slate-500">Manage and revoke your active login sessions.</p>
                  </div>
                  <button className="px-4 py-2 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-lg border border-red-100 hover:bg-red-100 transition-all">
                    Sign Out of All Other Devices
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Device/Browser</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">IP Address</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Location</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Last Active</th>
                        <th className="px-8 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sessions.map((session) => (
                        <tr key={session.id} className="group hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                                {session.os === 'macos' || session.os === 'windows' ? <Monitor size={20} /> : <PhoneIcon size={20} />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-slate-900">{session.device}</span>
                                  {session.isCurrent && (
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-bold uppercase rounded border border-emerald-100">Current Session</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                  <Chrome size={10} />
                                  {session.browser}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-xs font-mono text-slate-500">{session.ip}</td>
                          <td className="px-8 py-5 text-xs text-slate-600">{session.location}</td>
                          <td className="px-8 py-5 text-xs text-slate-500">{session.lastActive}</td>
                          <td className="px-8 py-5 text-right">
                            {!session.isCurrent && (
                              <button className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline opacity-0 group-hover:opacity-100 transition-all">
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}

          {/* Developer Tokens */}
          {activeTab === 'tokens' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Personal Access Tokens</h2>
                  <p className="text-sm text-slate-500">API keys for programmatic access to BEXUS OS services.</p>
                </div>
                <button 
                  onClick={() => setShowPATModal(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-bold uppercase rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <Plus size={14} />
                  Generate New Token
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Token Name</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Created</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Expires</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Last Used</th>
                      <th className="px-8 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tokens.map((token) => (
                      <tr key={token.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                              <Key size={16} />
                            </div>
                            <span className="text-sm font-bold text-slate-900">{token.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-xs text-slate-500">{token.created}</td>
                        <td className="px-8 py-5 text-xs text-slate-500">
                          <span className={token.expires === 'Never' ? 'text-emerald-600 font-medium' : ''}>{token.expires}</span>
                        </td>
                        <td className="px-8 py-5 text-xs text-slate-500">{token.lastUsed}</td>
                        <td className="px-8 py-5 text-right">
                          <button className="p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Preferences & Danger Zone */}
          {activeTab === 'preferences' && (
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-8 space-y-8"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-900">System Preferences</h2>
                  <p className="text-sm text-slate-500">Customize your interface and localization settings.</p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Timezone</label>
                    <select className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                      <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                      <option>(GMT+00:00) UTC</option>
                      <option>(GMT+01:00) London, Lisbon</option>
                      <option>(GMT+09:00) Tokyo, Seoul</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Language</label>
                    <select className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                      <option>English (United States)</option>
                      <option>French (France)</option>
                      <option>Spanish (Spain)</option>
                      <option>German (Germany)</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                        <Monitor size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Override System Theme</h3>
                        <p className="text-xs text-slate-500">Force a specific theme regardless of OS settings.</p>
                      </div>
                    </div>
                    <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                      {['Light', 'Dark', 'System'].map((t) => (
                        <button key={t} className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${t === 'Light' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-8 space-y-8"
              >
                <div>
                  <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
                  <p className="text-sm text-red-700/60">Destructive actions that cannot be undone. Please be careful.</p>
                </div>
                <div className="flex items-center justify-between p-6 bg-white/50 rounded-2xl border border-red-200">
                  <div>
                    <h3 className="text-sm font-bold text-red-900">Leave Organization</h3>
                    <p className="text-xs text-red-700/60">You will lose access to all shared resources and projects.</p>
                  </div>
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-2.5 bg-red-600 text-white text-xs font-bold uppercase rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                  >
                    Leave Organization
                  </button>
                </div>
                <div className="flex items-center justify-between p-6 bg-white/50 rounded-2xl border border-red-200">
                  <div>
                    <h3 className="text-sm font-bold text-red-900">Delete Account</h3>
                    <p className="text-xs text-red-700/60">Permanently delete your account and all associated data.</p>
                  </div>
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-2.5 bg-red-600 text-white text-xs font-bold uppercase rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                  >
                    Delete Account
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      {/* 2FA Modal */}
      <AnimatePresence>
        {show2FAModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShow2FAModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Setup 2FA</h2>
                  <button onClick={() => setShow2FAModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                
                <div className="flex flex-col items-center gap-6 py-4">
                  <div className="w-48 h-48 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center relative">
                    <QrCode size={120} className="text-slate-900" />
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 hover:opacity-100 transition-opacity rounded-2xl">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Simulated QR</p>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Manual Setup Key</label>
                    <div className="flex gap-2">
                      <input readOnly value="JBSW Y3DP EBLX S33O" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs font-mono text-slate-600" />
                      <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-primary transition-all"><Copy size={16} /></button>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Verify 6-Digit Code</label>
                    <div className="flex justify-between gap-2">
                      {[1,2,3,4,5,6].map(i => (
                        <input key={i} type="text" maxLength={1} className="w-12 h-14 bg-white border border-slate-200 rounded-xl text-center text-xl font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                      ))}
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-primary text-white font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  Verify & Enable
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PAT Modal */}
      <AnimatePresence>
        {showPATModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPATModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Generate New Token</h2>
                  <button onClick={() => setShowPATModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                {generatedToken ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                        <CheckCircle2 size={18} />
                        Token Generated Successfully
                      </div>
                      <p className="text-xs text-emerald-600/80">Make sure to copy your personal access token now. You won't be able to see it again!</p>
                      <div className="flex gap-2 mt-2">
                        <input readOnly value={generatedToken} className="flex-1 bg-white border border-emerald-200 rounded-lg px-4 py-2 text-xs font-mono text-emerald-700" />
                        <button className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"><Copy size={16} /></button>
                      </div>
                    </div>
                    <button onClick={() => { setShowPATModal(false); setGeneratedToken(null); }} className="w-full py-3 bg-slate-900 text-white font-bold uppercase tracking-widest rounded-xl">
                      I've Saved My Token
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Token Name</label>
                        <input type="text" placeholder="e.g. CI-Runner-Token" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Expiration Date</label>
                        <select className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                          <option>7 Days</option>
                          <option>30 Days</option>
                          <option>90 Days</option>
                          <option>Never</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Scopes</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['read:containers', 'write:containers', 'read:networks', 'write:networks', 'read:iam', 'write:iam'].map(scope => (
                          <label key={scope} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                            <span className="text-xs font-mono text-slate-600">{scope}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => setGeneratedToken('bexus_pat_live_8f2k9l3m4n5p6q7r8s9t0u1v2w3x4y5z')}
                      className="w-full py-3 bg-primary text-white font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                      Generate Token
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                    <AlertTriangle size={24} />
                  </div>
                  <button onClick={() => setShowDeleteModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-900">Are you absolutely sure?</h2>
                  <p className="text-sm text-slate-500">This action is permanent and cannot be undone. Please type <span className="font-bold text-slate-900">{userEmail}</span> to confirm.</p>
                </div>

                <input 
                  type="text" 
                  value={deleteConfirmEmail}
                  onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                  placeholder={userEmail}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />

                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all">
                    Cancel
                  </button>
                  <button 
                    disabled={deleteConfirmEmail !== userEmail}
                    className="flex-1 py-3 bg-red-600 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileManager;

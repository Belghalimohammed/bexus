import React, { useState } from 'react';
import { Users, Shield, Key, ChevronRight, MoreVertical, Copy, Check, Search, Filter } from 'lucide-react';
import { Modal } from '../components/Modal';
import { UserInviteWizard } from '../components/wizards/UserInviteWizard';

export const IAMManager: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex-1 flex bg-brand-bg overflow-hidden">
      {/* Sidebar Org Switcher */}
      <div className="w-64 border-r border-brand-border bg-brand-sidebar flex flex-col">
        <div className="p-6 border-b border-brand-border">
          <label className="text-[10px] uppercase tracking-widest font-bold text-brand-text/40 mb-2 block">Organization</label>
          <select className="w-full bg-brand-text/5 border border-brand-text/10 rounded px-3 py-2 text-xs font-mono outline-none focus:border-primary/50 text-brand-text">
            <option>Personal</option>
            <option>Production</option>
            <option>Client-X</option>
          </select>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded bg-primary/10 text-primary text-xs font-medium">
            <Users size={16} />
            Users & Groups
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-brand-text/5 text-brand-text/60 text-xs font-medium transition-all">
            <Shield size={16} />
            Roles & Policies
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-brand-text/5 text-brand-text/60 text-xs font-medium transition-all">
            <Key size={16} />
            Service Accounts
          </button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-brand-border flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text/50">Identity Management</h2>
            <div className="h-4 w-px bg-brand-border" />
            <div className="flex items-center gap-2 text-[10px] font-mono text-brand-text/40">
              <Users size={12} />
              <span>24 Active Users</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text/30" size={14} />
              <input 
                type="text" 
                placeholder="Search users..."
                className="bg-brand-text/5 border border-brand-text/10 rounded-md py-1.5 pl-9 pr-4 text-[11px] font-mono outline-none focus:border-primary/50 text-brand-text"
              />
            </div>
            <button 
              onClick={() => setIsInviteOpen(true)}
              className="px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded hover:opacity-90 transition-colors"
            >
              Invite User
            </button>
          </div>
        </header>

        <Modal 
          isOpen={isInviteOpen} 
          onClose={() => setIsInviteOpen(false)} 
          title="Secure User Invitation"
        >
          <UserInviteWizard onClose={() => setIsInviteOpen(false)} />
        </Modal>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="bg-brand-sidebar border border-brand-border rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border bg-brand-text/5">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/40">User</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/40">Role</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/40">Groups</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/40">2FA</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="text-xs font-mono">
                {[
                  { name: 'Alex Rivera', email: 'alex@nexus.io', role: 'Admin', groups: 3, tfa: true },
                  { name: 'Sarah Chen', email: 'sarah@nexus.io', role: 'Dev', groups: 2, tfa: true },
                  { name: 'Mike Ross', email: 'mike@nexus.io', role: 'Dev', groups: 1, tfa: false },
                  { name: 'Emma Wilson', email: 'emma@nexus.io', role: 'Viewer', groups: 1, tfa: true },
                ].map((user, i) => (
                  <tr 
                    key={i} 
                    className="border-b border-brand-border/50 hover:bg-brand-text/5 cursor-pointer transition-colors"
                    onClick={() => setSelectedUser(user.name)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 border border-brand-text/10 flex items-center justify-center text-[10px] font-bold text-brand-text">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-brand-text">{user.name}</div>
                          <div className="text-[10px] text-brand-text/40">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        user.role === 'Admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 
                        user.role === 'Dev' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                        'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {[...Array(user.groups)].map((_, j) => (
                          <img 
                            key={j} 
                            src={`https://picsum.photos/seed/${user.name}-${j}/32/32`}
                            className="w-6 h-6 rounded-full border border-[#050505] object-cover"
                            alt="Group member"
                            referrerPolicy="no-referrer"
                          />
                        ))}
                        {user.groups > 3 && (
                          <div className="w-6 h-6 rounded-full bg-slate-800 border border-[#050505] flex items-center justify-center text-[8px] font-bold text-white/40">
                            +{user.groups - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${user.tfa ? 'bg-primary shadow-[0_0_8px_var(--primary)]' : 'bg-red-500'}`} />
                        <span className={`text-[10px] uppercase font-bold tracking-tighter ${user.tfa ? 'text-primary/60' : 'text-red-500/60'}`}>
                          {user.tfa ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-white/10 rounded transition-colors opacity-40 hover:opacity-100">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Service Accounts Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Service Accounts</h3>
              <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Create API Key</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'CI/CD Pipeline', key: 'nx_live_8f2k...9s2l', lastUsed: '2h ago' },
                { name: 'Monitoring Bot', key: 'nx_live_1a9m...4p0x', lastUsed: '14m ago' },
              ].map((sa, i) => (
                <div key={i} className="bg-brand-sidebar border border-brand-border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-brand-text mb-1">{sa.name}</div>
                    <div className="flex items-center gap-2">
                      <code className="text-[10px] text-brand-text/40 font-mono">{sa.key}</code>
                      <button 
                        onClick={() => handleCopy(sa.key)}
                        className="p-1 hover:bg-brand-text/10 rounded transition-colors"
                      >
                        {copiedKey === sa.key ? <Check size={12} className="text-primary" /> : <Copy size={12} className="text-brand-text/30" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] opacity-30 uppercase font-bold mb-1">Last Used</div>
                    <div className="text-[10px] font-mono text-blue-400">{sa.lastUsed}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Access Explorer Side Panel */}
      {selectedUser && (
        <div className="w-80 border-l border-brand-border bg-brand-sidebar flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-brand-border flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text">Access Explorer</h3>
            <button onClick={() => setSelectedUser(null)} className="text-brand-text/40 hover:text-brand-text transition-opacity">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <div className="mb-8">
              <div className="text-[10px] text-brand-text/40 uppercase font-bold mb-6 tracking-widest">Permission Lineage</div>
              <div className="space-y-0 relative">
                {/* User Node */}
                <div className="flex items-start gap-4 relative pb-6">
                  <div className="absolute left-2 top-4 bottom-0 w-px bg-brand-border" />
                  <div className="w-4 h-4 rounded-full bg-primary border-4 border-brand-bg z-10 mt-1" />
                  <div className="flex-1">
                    <div className="text-[10px] uppercase font-bold text-brand-text/40 mb-1">Identity</div>
                    <div className="text-xs font-mono text-primary">{selectedUser}</div>
                  </div>
                </div>

                {/* Group Node */}
                <div className="flex items-start gap-4 relative pb-6">
                  <div className="absolute left-2 top-4 bottom-0 w-px bg-brand-border" />
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-brand-bg z-10 mt-1" />
                  <div className="flex-1">
                    <div className="text-[10px] uppercase font-bold text-brand-text/40 mb-1">Inherited via Group</div>
                    <div className="text-xs font-mono text-blue-400">Dev-Infrastructure-Group</div>
                  </div>
                </div>

                {/* Policy Node */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-4 h-4 rounded-full bg-purple-500 border-4 border-brand-bg z-10 mt-1" />
                  <div className="flex-1">
                    <div className="text-[10px] uppercase font-bold text-brand-text/40 mb-1">Attached Policy</div>
                    <div className="text-xs font-mono text-purple-400">Restart-Permission-v2</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-brand-border">
              <div className="text-[10px] text-brand-text/40 uppercase font-bold mb-4">Effective Permissions</div>
              <div className="space-y-2">
                {['containers.restart', 'containers.logs', 'networking.view', 'iam.view_self'].map(p => (
                  <div key={p} className="flex items-center justify-between text-[10px] font-mono bg-brand-text/5 px-2 py-1 rounded text-brand-text">
                    <span>{p}</span>
                    <Check size={10} className="text-primary" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

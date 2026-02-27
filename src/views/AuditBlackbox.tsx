import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Trash2, 
  AlertTriangle, 
  User, 
  Clock, 
  Terminal,
  Lock,
  Eye,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  severity: 'critical' | 'warning' | 'info';
  details: string;
  ip: string;
}

export const AuditBlackbox: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const logs: AuditLog[] = [
    { id: '1', timestamp: '2024-03-20 15:42:01', user: 'admin@nexus.io', action: 'FORCE_DELETE_CONTAINER', resource: 'prod-db-01', severity: 'critical', details: 'Container deleted with --force flag. Data volumes preserved.', ip: '192.168.1.100' },
    { id: '2', timestamp: '2024-03-20 14:15:22', user: 'system', action: 'FAIL2BAN_BAN_IP', resource: '45.12.3.1', severity: 'warning', details: 'IP banned after 5 failed login attempts to SSH.', ip: '127.0.0.1' },
    { id: '3', timestamp: '2024-03-20 12:00:00', user: 'dev-ops-02', action: 'UPDATE_FIREWALL_RULES', resource: 'global-ingress', severity: 'info', details: 'Added CIDR 10.0.0.0/8 to whitelist.', ip: '192.168.1.105' },
    { id: '4', timestamp: '2024-03-19 23:59:59', user: 'admin@nexus.io', action: 'WIPE_SYSTEM_LOGS', resource: 'audit-ledger-v1', severity: 'critical', details: 'Attempted to clear audit logs. Action blocked by immutable ledger policy.', ip: '192.168.1.100' },
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden">
      <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400 border border-red-500/20">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h1 className="font-serif italic text-xl tracking-tight text-brand-text">Audit Blackbox</h1>
            <p className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">Immutable Compliance Ledger</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-[10px] font-bold uppercase">
            <ShieldCheck size={12} /> Ledger Encrypted
          </div>
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isGenerating ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Clock size={14} />
              </motion.div>
            ) : (
              <FileText size={14} />
            )}
            {isGenerating ? 'Generating...' : 'Compliance Report'}
          </button>
        </div>
      </header>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-brand-sidebar border border-brand-border rounded-2xl p-6 flex items-center gap-6">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shrink-0">
                <Lock size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-serif italic text-brand-text">AES-256</h3>
                <p className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Encryption Standard</p>
              </div>
            </div>
            <div className="bg-brand-sidebar border border-brand-border rounded-2xl p-6 flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shrink-0">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-serif italic text-brand-text">100%</h3>
                <p className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Integrity Verified</p>
              </div>
            </div>
            <div className="bg-brand-sidebar border border-brand-border rounded-2xl p-6 flex items-center gap-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 border border-red-500/20 shrink-0">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-serif italic text-brand-text">12</h3>
                <p className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Critical Actions (24h)</p>
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-brand-sidebar border border-brand-border rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-bg/30">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-bold text-brand-text uppercase tracking-widest">Immutable Ledger</h2>
                <div className="flex items-center gap-2 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-[10px] font-mono uppercase">
                  Read-Only Mode
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text/30" size={14} />
                  <input 
                    type="text" 
                    placeholder="Filter ledger..." 
                    className="bg-brand-bg border border-brand-border rounded-lg pl-10 pr-4 py-2 text-xs text-brand-text outline-none focus:border-primary transition-all w-64"
                  />
                </div>
                <button className="p-2 hover:bg-brand-text/5 rounded-lg text-brand-text/30 hover:text-brand-text transition-all">
                  <Filter size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-bg/20">
                    <th className="p-4 text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Timestamp</th>
                    <th className="p-4 text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">User / IP</th>
                    <th className="p-4 text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Action</th>
                    <th className="p-4 text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Resource</th>
                    <th className="p-4 text-[10px] font-bold text-brand-text/40 uppercase tracking-widest text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {logs.map((log) => (
                    <tr key={log.id} className="group hover:bg-brand-text/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Clock size={12} className="text-brand-text/30" />
                          <span className="text-[10px] font-mono text-brand-text/60">{log.timestamp}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <User size={12} className="text-brand-text/30" />
                            <span className="text-xs font-bold text-brand-text">{log.user}</span>
                          </div>
                          <span className="text-[10px] font-mono text-brand-text/30 ml-5">{log.ip}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            log.severity === 'critical' ? 'bg-red-500' :
                            log.severity === 'warning' ? 'bg-amber-500' :
                            'bg-blue-500'
                          }`} />
                          <span className={`text-[10px] font-bold uppercase tracking-tighter ${
                            log.severity === 'critical' ? 'text-red-400' :
                            log.severity === 'warning' ? 'text-amber-400' :
                            'text-blue-400'
                          }`}>
                            {log.action}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-mono text-brand-text/60">{log.resource}</span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 hover:bg-brand-text/5 rounded-lg text-brand-text/30 hover:text-primary transition-all inline-flex items-center gap-2">
                          <Eye size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-brand-bg/50 border-t border-brand-border flex items-center justify-between">
              <p className="text-[10px] text-brand-text/40 uppercase tracking-widest">
                Showing 4 of 1,284 destructive actions recorded since system initialization.
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-brand-sidebar border border-brand-border rounded-lg text-[10px] font-bold uppercase text-brand-text/60 hover:text-brand-text transition-all">
                  Previous
                </button>
                <button className="px-4 py-1.5 bg-brand-sidebar border border-brand-border rounded-lg text-[10px] font-bold uppercase text-brand-text/60 hover:text-brand-text transition-all">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

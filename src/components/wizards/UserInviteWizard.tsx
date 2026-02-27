import React, { useState } from 'react';
import { Users, Mail, Shield, Link as LinkIcon, Copy, Check, Clock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserInviteWizardProps {
  onClose: () => void;
}

type Step = 'details' | 'permissions' | 'invite';

export const UserInviteWizard: React.FC<UserInviteWizardProps> = ({ onClose }) => {
  const [step, setStep] = useState<Step>('details');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  const generateInvite = () => {
    const randomId = Math.random().toString(36).substring(7);
    setInviteLink(`https://nexus.io/invite/${randomId}`);
    setStep('invite');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 'details':
        return (
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">User Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text/30" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-brand-text/5 border border-brand-border rounded-lg pl-10 pr-4 py-3 text-sm font-mono outline-none focus:border-primary transition-all text-brand-text"
                />
              </div>
            </div>
            <button
              disabled={!email || !email.includes('@')}
              onClick={() => setStep('permissions')}
              className="w-full py-3 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Next: Set Permissions <ArrowRight size={14} />
            </button>
          </div>
        );
      case 'permissions':
        return (
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Select Role</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'admin', label: 'Administrator', desc: 'Full access to all resources' },
                  { id: 'dev', label: 'Developer', desc: 'Can manage containers and networking' },
                  { id: 'viewer', label: 'Viewer', desc: 'Read-only access to dashboards' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                      role === r.id ? 'border-primary bg-primary/5' : 'border-brand-border bg-brand-text/2 hover:border-brand-text/10'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${role === r.id ? 'border-primary bg-primary' : 'border-brand-text/20'}`}>
                      {role === r.id && <Check size={12} className="text-primary-foreground" />}
                    </div>
                    <div>
                      <div className={`text-xs font-bold uppercase tracking-wider ${role === r.id ? 'text-primary' : 'text-brand-text'}`}>{r.label}</div>
                      <div className="text-[10px] text-brand-text/40">{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('details')} className="flex-1 py-3 bg-brand-text/5 border border-brand-border text-brand-text text-xs font-bold uppercase rounded-xl hover:bg-brand-text/10 transition-all">Back</button>
              <button
                onClick={generateInvite}
                className="flex-[2] py-3 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Generate Invite Link <LinkIcon size={14} />
              </button>
            </div>
          </div>
        );
      case 'invite':
        return (
          <div className="p-8 space-y-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
              <Shield size={32} />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-brand-text uppercase tracking-widest">Secure Invite Generated</h4>
              <p className="text-[10px] text-brand-text/40 max-w-[200px] mx-auto">
                This link will expire in <span className="text-primary font-bold">24 hours</span> and can only be used once.
              </p>
            </div>

            <div className="bg-brand-text/5 border border-brand-border rounded-xl p-4 flex items-center gap-3">
              <div className="flex-1 text-[10px] font-mono text-brand-text truncate text-left">
                {inviteLink}
              </div>
              <button
                onClick={copyToClipboard}
                className={`p-2 rounded-lg transition-all ${copied ? 'bg-primary text-primary-foreground' : 'bg-brand-text/10 text-brand-text/40 hover:text-brand-text'}`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-brand-text/30 uppercase">
              <Clock size={12} />
              <span>Expires: {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-brand-text/5 border border-brand-border text-brand-text text-xs font-bold uppercase rounded-xl hover:bg-brand-text/10 transition-all"
            >
              Done
            </button>
          </div>
        );
    }
  };

  return (
    <div className="bg-brand-sidebar">
      {renderStep()}
    </div>
  );
};

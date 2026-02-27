import React, { useState, useEffect } from 'react';
import { Globe, Server, Shield, ArrowRight, Check, Loader2, Cpu, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubdomainWizardProps {
  onClose: () => void;
  onComplete: (data: any) => void;
}

type Step = 'input' | 'point' | 'security' | 'confirm';

export const SubdomainWizard: React.FC<SubdomainWizardProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState<Step>('input');
  const [subdomain, setSubdomain] = useState('');
  const [targetType, setTargetType] = useState<'container' | 'port' | 'ip'>('container');
  const [targetValue, setTargetValue] = useState('');
  const [security, setSecurity] = useState({ ssl: true, hsts: true });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 'confirm') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete({ subdomain, targetType, targetValue, security });
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  const renderStep = () => {
    switch (step) {
      case 'input':
        return (
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Subdomain Name</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  placeholder="api"
                  className="flex-1 bg-brand-text/5 border border-brand-border rounded-lg px-4 py-3 text-sm font-mono outline-none focus:border-primary transition-all text-brand-text"
                />
                <span className="text-brand-text/40 font-mono">.nexus.io</span>
              </div>
            </div>
            <button
              disabled={!subdomain}
              onClick={() => setStep('point')}
              className="w-full py-3 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Next: Point Target <ArrowRight size={14} />
            </button>
          </div>
        );
      case 'point':
        return (
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Select Target</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'container', label: 'Container', icon: <Cpu size={16} />, desc: 'Route to a running container' },
                  { id: 'port', label: 'Local Port', icon: <Server size={16} />, desc: 'Forward to a local service port' },
                  { id: 'ip', label: 'External IP', icon: <ExternalLink size={16} />, desc: 'Proxy to an external address' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTargetType(t.id as any)}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                      targetType === t.id ? 'border-primary bg-primary/5' : 'border-brand-border bg-brand-text/2 hover:border-brand-text/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${targetType === t.id ? 'bg-primary text-primary-foreground' : 'bg-brand-text/5 text-brand-text/40'}`}>
                      {t.icon}
                    </div>
                    <div>
                      <div className={`text-xs font-bold uppercase tracking-wider ${targetType === t.id ? 'text-primary' : 'text-brand-text'}`}>{t.label}</div>
                      <div className="text-[10px] text-brand-text/40">{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Target Value</label>
              <input
                type="text"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder={targetType === 'container' ? 'nexus-api-v1' : targetType === 'port' ? '3000' : '1.2.3.4'}
                className="w-full bg-brand-text/5 border border-brand-border rounded-lg px-4 py-3 text-sm font-mono outline-none focus:border-primary transition-all text-brand-text"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('input')} className="flex-1 py-3 bg-brand-text/5 border border-brand-border text-brand-text text-xs font-bold uppercase rounded-xl hover:bg-brand-text/10 transition-all">Back</button>
              <button
                disabled={!targetValue}
                onClick={() => setStep('security')}
                className="flex-[2] py-3 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Next: Security <Shield size={14} />
              </button>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Security Configuration</label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-brand-text/2 border border-brand-border rounded-xl">
                  <div>
                    <div className="text-xs font-bold text-brand-text">SSL (Auto-ACME)</div>
                    <div className="text-[9px] text-brand-text/40 uppercase">Automatic Let's Encrypt Certificate</div>
                  </div>
                  <button
                    onClick={() => setSecurity(s => ({ ...s, ssl: !s.ssl }))}
                    className={`w-10 h-5 rounded-full relative transition-all ${security.ssl ? 'bg-primary' : 'bg-brand-text/10'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${security.ssl ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-brand-text/2 border border-brand-border rounded-xl">
                  <div>
                    <div className="text-xs font-bold text-brand-text">HSTS</div>
                    <div className="text-[9px] text-brand-text/40 uppercase">Force HTTPS for 1 year</div>
                  </div>
                  <button
                    onClick={() => setSecurity(s => ({ ...s, hsts: !s.hsts }))}
                    className={`w-10 h-5 rounded-full relative transition-all ${security.hsts ? 'bg-primary' : 'bg-brand-text/10'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${security.hsts ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('point')} className="flex-1 py-3 bg-brand-text/5 border border-brand-border text-brand-text text-xs font-bold uppercase rounded-xl hover:bg-brand-text/10 transition-all">Back</button>
              <button
                onClick={() => setStep('confirm')}
                className="flex-[2] py-3 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Confirm & Deploy <Globe size={14} />
              </button>
            </div>
          </div>
        );
      case 'confirm':
        return (
          <div className="p-8 space-y-8 text-center">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-widest text-brand-text/40">Deploying Subdomain</div>
              <div className="text-xl font-mono font-bold text-primary">{subdomain}.nexus.io</div>
            </div>
            
            <div className="relative h-2 bg-brand-text/5 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="p-3 bg-brand-text/2 border border-brand-border rounded-lg">
                <div className="text-[8px] uppercase font-bold text-brand-text/30 mb-1">Target</div>
                <div className="text-[10px] font-mono text-brand-text truncate">{targetValue}</div>
              </div>
              <div className="p-3 bg-brand-text/2 border border-brand-border rounded-lg">
                <div className="text-[8px] uppercase font-bold text-brand-text/30 mb-1">Security</div>
                <div className="text-[10px] font-mono text-brand-text">{security.ssl ? 'SSL ON' : 'SSL OFF'}</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-brand-text/40 uppercase">
              <Loader2 size={12} className="animate-spin text-primary" />
              <span>Configuring Nginx & SSL...</span>
            </div>
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

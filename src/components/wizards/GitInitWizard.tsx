import React, { useState } from 'react';
import { GitBranch, Github, Globe, ArrowRight, Check, Loader2, Shield, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

interface GitInitWizardProps {
  folderName: string;
  onClose: () => void;
  onComplete: (data: any) => void;
}

type Step = 'init' | 'remote' | 'hooks' | 'confirm';

export const GitInitWizard: React.FC<GitInitWizardProps> = ({ folderName, onClose, onComplete }) => {
  const [step, setStep] = useState<Step>('init');
  const [repoName, setRepoName] = useState(folderName);
  const [remoteUrl, setRemoteUrl] = useState('');
  const [autoDeploy, setAutoDeploy] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInit = async () => {
    setIsInitializing(true);
    // Simulate git init process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsInitializing(false);
    onComplete({ repoName, remoteUrl, autoDeploy });
  };

  const renderStep = () => {
    switch (step) {
      case 'init':
        return (
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Repository Name</label>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                className="w-full bg-brand-text/5 border border-brand-border rounded-lg px-4 py-3 text-sm font-mono outline-none focus:border-primary transition-all text-brand-text"
              />
            </div>
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3">
              <Terminal size={16} className="text-primary mt-0.5" />
              <div className="text-[10px] font-mono text-brand-text/60 leading-relaxed">
                This will run <span className="text-primary">git init</span> in <span className="text-brand-text">/{folderName}</span> and create a default <span className="text-brand-text">.gitignore</span>.
              </div>
            </div>
            <button
              onClick={() => setStep('remote')}
              className="w-full py-3 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              Next: Connect Remote <ArrowRight size={14} />
            </button>
          </div>
        );
      case 'remote':
        return (
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Remote Provider</label>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center gap-3 p-3 rounded-xl border border-primary bg-primary/5 text-primary">
                  <Github size={16} />
                  <span className="text-xs font-bold uppercase">GitHub</span>
                </button>
                <button className="flex items-center gap-3 p-3 rounded-xl border border-brand-border bg-brand-text/2 text-brand-text/40 hover:border-brand-text/20 transition-all">
                  <Globe size={16} />
                  <span className="text-xs font-bold uppercase">Self-Hosted</span>
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Remote URL</label>
              <input
                type="text"
                value={remoteUrl}
                onChange={(e) => setRemoteUrl(e.target.value)}
                placeholder="https://github.com/user/repo.git"
                className="w-full bg-brand-text/5 border border-brand-border rounded-lg px-4 py-3 text-sm font-mono outline-none focus:border-primary transition-all text-brand-text"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('init')} className="flex-1 py-3 bg-brand-text/5 border border-brand-border text-brand-text text-xs font-bold uppercase rounded-xl hover:bg-brand-text/10 transition-all">Back</button>
              <button
                onClick={() => setStep('hooks')}
                className="flex-[2] py-3 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Next: Deployment Hooks <ArrowRight size={14} />
              </button>
            </div>
          </div>
        );
      case 'hooks':
        return (
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Auto-Deployment</label>
              <div className="flex items-center justify-between p-4 bg-brand-text/2 border border-brand-border rounded-xl">
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-primary" />
                  <div>
                    <div className="text-xs font-bold text-brand-text">Enable .nexus.yaml</div>
                    <div className="text-[9px] text-brand-text/40 uppercase">Auto-run hooks on push</div>
                  </div>
                </div>
                <button
                  onClick={() => setAutoDeploy(!autoDeploy)}
                  className={`w-10 h-5 rounded-full relative transition-all ${autoDeploy ? 'bg-primary' : 'bg-brand-text/10'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${autoDeploy ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </div>
            <div className="p-4 bg-brand-text/5 border border-brand-border rounded-xl">
              <div className="text-[9px] uppercase font-bold text-brand-text/30 mb-2">Preview .nexus.yaml</div>
              <pre className="text-[10px] font-mono text-brand-text/60 leading-relaxed">
{`on: push
do:
  - npm install
  - npm run build
  - pm2 restart app`}
              </pre>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('remote')} className="flex-1 py-3 bg-brand-text/5 border border-brand-border text-brand-text text-xs font-bold uppercase rounded-xl hover:bg-brand-text/10 transition-all">Back</button>
              <button
                onClick={() => setStep('confirm')}
                className="flex-[2] py-3 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Finalize Workspace <Check size={14} />
              </button>
            </div>
          </div>
        );
      case 'confirm':
        return (
          <div className="p-8 space-y-8 text-center">
            {isInitializing ? (
              <div className="py-12 space-y-6">
                <Loader2 size={48} className="text-primary animate-spin mx-auto" />
                <div className="space-y-2">
                  <div className="text-sm font-bold text-brand-text uppercase tracking-widest">Initializing Git...</div>
                  <div className="text-[10px] font-mono text-brand-text/40 uppercase tracking-widest">Setting up smart workspace</div>
                </div>
              </div>
            ) : (
              <div className="py-12 space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                  <GitBranch size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-brand-text uppercase tracking-widest">Workspace Ready</h4>
                  <p className="text-[10px] text-brand-text/40 max-w-[240px] mx-auto">
                    Folder <span className="text-primary font-bold">{folderName}</span> is now a Smart Workspace with Git integration.
                  </p>
                </div>
                <button
                  onClick={handleInit}
                  className="w-full py-3 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-xl hover:opacity-90 transition-all"
                >
                  Initialize Now
                </button>
              </div>
            )}
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

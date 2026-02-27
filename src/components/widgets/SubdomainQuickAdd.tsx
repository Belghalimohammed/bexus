import React, { useState } from 'react';
import { Globe, Plus, Loader2 } from 'lucide-react';

export const SubdomainQuickAdd: React.FC = () => {
  const [subdomain, setSubdomain] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subdomain.trim()) return;

    setIsDeploying(true);
    setStatus('Provisioning...');
    
    setTimeout(() => {
      setStatus('Configuring DNS...');
      setTimeout(() => {
        setStatus('Success!');
        setIsDeploying(false);
        setSubdomain('');
        setTimeout(() => setStatus(null), 3000);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-brand-sidebar/50 text-brand-text p-3 border border-brand-border rounded">
      <div className="flex items-center gap-2 mb-3 opacity-50">
        <Globe size={14} />
        <span className="uppercase tracking-widest text-[10px] font-bold">Subdomain Quick-Add</span>
      </div>
      
      <form onSubmit={handleDeploy} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            disabled={isDeploying}
            className="w-full bg-brand-text/5 border border-brand-border rounded px-2 py-1.5 text-xs font-mono outline-none focus:border-primary transition-colors pr-16 text-brand-text"
            placeholder="my-app"
          />
          <span className="absolute right-2 top-1.5 text-[10px] opacity-30 font-mono text-brand-text">.nexus.io</span>
        </div>
        
        <button
          type="submit"
          disabled={isDeploying || !subdomain.trim()}
          className="w-full bg-primary text-primary-foreground font-bold text-[10px] uppercase py-1.5 rounded flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isDeploying ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Deploying
            </>
          ) : (
            <>
              <Plus size={12} />
              Spin Up Instance
            </>
          )}
        </button>
      </form>

      {status && (
        <div className="mt-2 text-[10px] font-mono text-center animate-pulse text-primary">
          {status}
        </div>
      )}
    </div>
  );
};

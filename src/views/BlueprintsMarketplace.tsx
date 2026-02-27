import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Library, 
  Search, 
  Filter, 
  Plus, 
  ArrowRight, 
  Database, 
  Globe, 
  Server, 
  Cpu, 
  Code2, 
  Settings2, 
  Rocket, 
  ChevronLeft,
  Share2,
  Bookmark,
  Layout,
  Box,
  Network
} from 'lucide-react';

interface Blueprint {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'CMS' | 'Fullstack' | 'API' | 'Database';
  containers: { name: string; type: string; connections: string[] }[];
  variables: { key: string; label: string; type: string; placeholder: string }[];
}

const blueprints: Blueprint[] = [
  {
    id: 'wordpress',
    name: 'WordPress Stack',
    description: 'The world\'s most popular CMS with optimized Nginx and MariaDB.',
    icon: <Globe className="text-blue-400" />,
    category: 'CMS',
    containers: [
      { name: 'Nginx Proxy', type: 'Load Balancer', connections: ['WordPress App'] },
      { name: 'WordPress App', type: 'Application', connections: ['MariaDB'] },
      { name: 'MariaDB', type: 'Database', connections: [] },
    ],
    variables: [
      { key: 'DOMAIN_NAME', label: 'Domain Name', type: 'text', placeholder: 'example.com' },
      { key: 'DB_PASSWORD', label: 'Database Password', type: 'password', placeholder: '••••••••' },
    ]
  },
  {
    id: 'mern',
    name: 'MERN Stack',
    description: 'Modern fullstack application with MongoDB, Express, React, and Node.',
    icon: <Code2 className="text-emerald-400" />,
    category: 'Fullstack',
    containers: [
      { name: 'React Frontend', type: 'Frontend', connections: ['Node API'] },
      { name: 'Node API', type: 'Backend', connections: ['MongoDB'] },
      { name: 'MongoDB', type: 'Database', connections: [] },
    ],
    variables: [
      { key: 'JWT_SECRET', label: 'JWT Secret', type: 'password', placeholder: '••••••••' },
      { key: 'MONGO_URI', label: 'MongoDB Connection String', type: 'text', placeholder: 'mongodb://...' },
    ]
  },
  {
    id: 'rust-api',
    name: 'Rust High-Perf API',
    description: 'Blazing fast API using Actix-web and PostgreSQL.',
    icon: <Cpu className="text-orange-400" />,
    category: 'API',
    containers: [
      { name: 'Rust API', type: 'Backend', connections: ['PostgreSQL', 'Redis'] },
      { name: 'PostgreSQL', type: 'Database', connections: [] },
      { name: 'Redis', type: 'Cache', connections: [] },
    ],
    variables: [
      { key: 'API_KEY', label: 'Master API Key', type: 'password', placeholder: '••••••••' },
    ]
  },
  {
    id: 'ghost',
    name: 'Ghost Blog',
    description: 'Professional publishing platform for modern creators.',
    icon: <Layout className="text-purple-400" />,
    category: 'CMS',
    containers: [
      { name: 'Ghost App', type: 'Application', connections: ['MySQL'] },
      { name: 'MySQL', type: 'Database', connections: [] },
    ],
    variables: [
      { key: 'BLOG_URL', label: 'Blog URL', type: 'text', placeholder: 'https://blog.me' },
    ]
  }
];

export const BlueprintsMarketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'my-blueprints'>('marketplace');
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  const NodeMap = ({ blueprint }: { blueprint: Blueprint }) => (
    <div className="p-8 bg-brand-bg/50 border border-brand-border rounded-2xl relative overflow-hidden min-h-[300px] flex items-center justify-center">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <div className="flex items-center gap-12 relative z-10">
        {blueprint.containers.map((container, i) => (
          <React.Fragment key={container.name}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-sidebar border border-brand-border flex items-center justify-center text-primary shadow-xl relative group">
                <Box size={24} />
                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-primary text-primary-foreground text-[8px] font-bold rounded uppercase">
                  {container.type}
                </div>
              </div>
              <span className="text-[10px] font-bold text-brand-text uppercase tracking-widest">{container.name}</span>
            </motion.div>
            {i < blueprint.containers.length - 1 && (
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="w-12 h-px bg-gradient-to-r from-primary/50 to-primary/10 relative"
              >
                <ArrowRight size={12} className="absolute -right-1 -top-[6px] text-primary/50" />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden">
      <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Library size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text">Blueprints</h2>
            <p className="text-[10px] text-brand-text/40 uppercase font-mono">Infrastructure Library & Marketplace</p>
          </div>
        </div>

        <div className="flex bg-brand-text/5 p-1 rounded-lg border border-brand-text/10">
          <button 
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${activeTab === 'marketplace' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-brand-text/40 hover:text-brand-text'}`}
          >
            Marketplace
          </button>
          <button 
            onClick={() => setActiveTab('my-blueprints')}
            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${activeTab === 'my-blueprints' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-brand-text/40 hover:text-brand-text'}`}
          >
            My Blueprints
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <AnimatePresence mode="wait">
            {!selectedBlueprint ? (
              <motion.div 
                key="gallery"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text/30" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search blueprints..."
                      className="w-full bg-brand-sidebar border border-brand-border rounded-xl px-10 py-2.5 text-xs outline-none focus:border-primary transition-all text-brand-text"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-sidebar border border-brand-border rounded-xl text-[10px] font-bold uppercase text-brand-text/60 hover:text-brand-text transition-all">
                      <Filter size={14} />
                      Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded-xl hover:opacity-90 transition-all">
                      <Plus size={14} />
                      Custom Stack
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(activeTab === 'marketplace' ? blueprints : []).map((bp) => (
                    <motion.div
                      key={bp.id}
                      whileHover={{ y: -5 }}
                      onClick={() => setSelectedBlueprint(bp)}
                      className="bg-brand-sidebar border border-brand-border rounded-2xl p-6 cursor-pointer group hover:border-primary/30 transition-all shadow-xl hover:shadow-primary/5"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center text-2xl shadow-inner">
                          {bp.icon}
                        </div>
                        <span className="px-2 py-1 rounded bg-brand-text/5 border border-brand-text/10 text-[8px] font-bold uppercase text-brand-text/40">
                          {bp.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-brand-text mb-2 group-hover:text-primary transition-colors">{bp.name}</h3>
                      <p className="text-[11px] text-brand-text/40 leading-relaxed mb-6 line-clamp-2">
                        {bp.description}
                      </p>
                      <div className="flex items-center justify-between pt-6 border-t border-brand-border/50">
                        <div className="flex -space-x-2">
                          {bp.containers.map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-brand-bg border-2 border-brand-sidebar flex items-center justify-center">
                              <Box size={10} className="text-brand-text/40" />
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase">
                          Details
                          <ArrowRight size={12} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {activeTab === 'my-blueprints' && (
                    <div className="col-span-full py-20 text-center space-y-4">
                      <div className="w-16 h-16 bg-brand-text/5 rounded-full flex items-center justify-center mx-auto text-brand-text/20">
                        <Bookmark size={32} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-brand-text">No Saved Blueprints</h3>
                        <p className="text-[10px] text-brand-text/40 uppercase font-mono">Save your current infrastructure as a template</p>
                      </div>
                      <button className="px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-bold uppercase hover:bg-primary hover:text-white transition-all">
                        Create Template
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto space-y-12"
              >
                <button 
                  onClick={() => setSelectedBlueprint(null)}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase text-brand-text/40 hover:text-brand-text transition-all"
                >
                  <ChevronLeft size={14} />
                  Back to Marketplace
                </button>

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-brand-sidebar border border-brand-border flex items-center justify-center text-4xl shadow-2xl">
                      {selectedBlueprint.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-brand-text mb-2">{selectedBlueprint.name}</h2>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                          {selectedBlueprint.category}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-brand-text/40 uppercase font-mono">
                          <Box size={12} />
                          {selectedBlueprint.containers.length} Containers
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="p-3 bg-brand-sidebar border border-brand-border rounded-xl text-brand-text/40 hover:text-brand-text transition-all">
                      <Share2 size={18} />
                    </button>
                    <button className="p-3 bg-brand-sidebar border border-brand-border rounded-xl text-brand-text/40 hover:text-brand-text transition-all">
                      <Bookmark size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Stack Architecture Preview</div>
                  <NodeMap blueprint={selectedBlueprint} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-brand-border">
                  <div className="space-y-6">
                    <div className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Configuration Variables</div>
                    <div className="space-y-4">
                      {selectedBlueprint.variables.map((v) => (
                        <div key={v.key} className="space-y-2">
                          <label className="text-[10px] font-bold text-brand-text/60 uppercase">{v.label}</label>
                          <input 
                            type={v.type} 
                            placeholder={v.placeholder}
                            className="w-full bg-brand-sidebar border border-brand-border rounded-xl px-4 py-3 text-xs outline-none focus:border-primary transition-all text-brand-text"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Deployment Summary</div>
                    <div className="bg-brand-sidebar border border-brand-border rounded-2xl p-6 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-brand-text/40">Estimated Setup Time</span>
                        <span className="text-brand-text font-mono">~45 seconds</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-brand-text/40">Resource Usage</span>
                        <span className="text-brand-text font-mono">Low (0.5 vCPU)</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-brand-text/40">Network Exposure</span>
                        <span className="text-emerald-500 font-bold uppercase text-[10px]">Public via Ingress</span>
                      </div>
                      <div className="h-px bg-brand-border my-2" />
                      <button 
                        onClick={() => setIsDeploying(true)}
                        className="w-full py-4 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                      >
                        <Rocket size={16} />
                        Deploy Blueprint
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Deployment Modal */}
      <AnimatePresence>
        {isDeploying && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsDeploying(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-brand-sidebar border border-brand-border rounded-3xl p-10 shadow-2xl relative z-10 text-center space-y-8"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
                <Rocket size={40} className="animate-bounce" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-brand-text">Deploying Stack</h2>
                <p className="text-[10px] text-brand-text/40 uppercase font-mono tracking-widest">Provisioning infrastructure on Nexus Edge</p>
              </div>
              <div className="space-y-4">
                <div className="w-full h-1 bg-brand-text/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3 }}
                    className="h-full bg-primary"
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest">
                  <span className="text-primary">Pulling Images</span>
                  <span className="text-brand-text/20">Configuring Network</span>
                </div>
              </div>
              <div className="p-4 bg-brand-bg/50 border border-brand-border rounded-xl font-mono text-[10px] text-brand-text/40 text-left h-32 overflow-y-auto custom-scrollbar">
                <div>[10:24:51] Pulling nginx:latest...</div>
                <div>[10:24:53] Pulling mariadb:10.6...</div>
                <div>[10:24:55] Creating network nexus_wp_stack...</div>
                <div>[10:24:57] Attaching volumes...</div>
                <div className="text-primary">[10:24:59] Initializing database schema...</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

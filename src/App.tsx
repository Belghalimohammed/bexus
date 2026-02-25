/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, 
  Server, 
  Terminal, 
  Activity, 
  Lock, 
  Database, 
  Network, 
  Cpu, 
  Key, 
  FileCode, 
  LayoutDashboard,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Code,
  Zap,
  Eye,
  History,
  HardDrive,
  Search,
  UserPlus,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Copy,
  User,
  Users,
  Fingerprint,
  Globe,
  Play,
  Square,
  RotateCcw,
  Box,
  Layers,
  Trash2,
  Settings2,
  Cpu as CpuIcon,
  MemoryStick,
  Folder,
  File,
  FileText,
  Cloud,
  Clock,
  Undo2,
  Save,
  GitBranch,
  Github,
  Webhook
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Section = 'overview' | 'iam' | 'infra' | 'networking' | 'security' | 'monitoring' | 'vault' | 'warp' | 'git-ops' | 'schema';

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
    }`}
  >
    <Icon size={18} />
    <span className="text-sm font-medium">{label}</span>
    {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
  </button>
);

const Card = ({ title, icon: Icon, children, className = "" }: { title: string, icon: any, children: React.ReactNode, className?: string }) => (
  <div className={`bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6 ${className}`}>
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-lg bg-slate-800 text-emerald-400">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-semibold text-slate-100 uppercase tracking-wider text-xs">{title}</h3>
    </div>
    {children}
  </div>
);

const Gauge = ({ value, label, color = "emerald" }: { value: number, label: string, color?: string }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  
  const colorClasses: Record<string, string> = {
    emerald: "text-emerald-500",
    blue: "text-blue-500",
    amber: "text-amber-500",
    red: "text-red-500"
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-800"
          />
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={colorClasses[color] || "text-emerald-500"}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold font-mono text-slate-100">{value}%</span>
        </div>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
    </div>
  );
};

const Sparkline = () => {
  const points = [10, 25, 15, 40, 35, 50, 45, 60, 55, 70, 65, 80];
  return (
    <div className="h-16 w-full flex items-end gap-1">
      {points.map((p, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${p}%` }}
          transition={{ delay: i * 0.05, duration: 0.5 }}
          className="flex-1 bg-emerald-500/20 border-t border-emerald-500/50"
        />
      ))}
    </div>
  );
};

const CodeBlock = ({ code, language = "sql" }: { code: string, language?: string }) => (
  <div className="relative group">
    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">{language}</span>
    </div>
    <pre className="bg-black/40 border border-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
      {code}
    </pre>
  </div>
);

// --- Content Sections ---

const Overview = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Gauges */}
      <Card title="System Resources" icon={Cpu} className="md:col-span-2">
        <div className="flex justify-around items-center py-4">
          <Gauge value={42} label="CPU" color="emerald" />
          <Gauge value={68} label="RAM" color="blue" />
          <Gauge value={15} label="DISK" color="amber" />
        </div>
      </Card>

      {/* Network */}
      <Card title="Network Throughput" icon={Network}>
        <div className="space-y-4">
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-emerald-400">IN: 1.2 MB/s</span>
            <span className="text-blue-400">OUT: 450 KB/s</span>
          </div>
          <Sparkline />
        </div>
      </Card>

      {/* Service Status */}
      <Card title="Service Status" icon={Zap}>
        <div className="grid grid-cols-4 gap-4 py-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${i === 7 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
              <span className="text-[8px] text-slate-600 font-mono">S-{i+1}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Audit Logs */}
      <Card title="Recent Audit Logs" icon={History} className="md:col-span-3">
        <div className="space-y-3 max-h-48 overflow-hidden">
          {[
            { user: 'Alex', action: "restarted 'Nginx-Proxy'", time: '2m ago' },
            { user: 'System', action: "automated backup completed", time: '15m ago' },
            { user: 'Sarah', action: "updated 'Vault' secrets", time: '45m ago' },
            { user: 'Alex', action: "scaled 'API-Gateway' to 3 nodes", time: '1h ago' },
            { user: 'Root', action: "JIT elevation requested", time: '2h ago' },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between text-xs border-b border-slate-800/50 pb-2 last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">{log.user}</span>
                <span className="text-slate-400">{log.action}</span>
              </div>
              <span className="text-[10px] text-slate-600 font-mono">{log.time}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Node Topology */}
      <Card title="Node Topology" icon={Server}>
         <div className="flex flex-col items-center justify-center h-full py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mb-2">
              <Server size={20} className="text-emerald-400" />
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="w-2 h-2 rounded-full bg-slate-700" />
            </div>
            <span className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">3 Nodes Active</span>
         </div>
      </Card>
    </div>
  </div>
);

const IAMSection = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [currentOrg, setCurrentOrg] = useState('Production');

  const users = [
    { id: 1, name: 'Alex Rivera', email: 'alex@nexus.io', role: 'Admin', groups: ['Core', 'Security'], mfa: true, avatar: 'https://picsum.photos/seed/alex/100/100' },
    { id: 2, name: 'Sarah Chen', email: 'sarah@nexus.io', role: 'Dev', groups: ['Frontend', 'DevOps'], mfa: true, avatar: 'https://picsum.photos/seed/sarah/100/100' },
    { id: 3, name: 'Marcus Wright', email: 'marcus@nexus.io', role: 'Dev', groups: ['Backend'], mfa: false, avatar: 'https://picsum.photos/seed/marcus/100/100' },
  ];

  return (
    <div className="space-y-8 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Table */}
        <Card title="Users & Groups" icon={Users} className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                  <th className="pb-3 font-bold">User</th>
                  <th className="pb-3 font-bold">Role</th>
                  <th className="pb-3 font-bold">Groups</th>
                  <th className="pb-3 font-bold text-center">2FA</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {users.map((u) => (
                  <tr 
                    key={u.id} 
                    className="group hover:bg-slate-800/20 cursor-pointer transition-colors"
                    onClick={() => setSelectedUser(u)}
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border border-slate-700" referrerPolicy="no-referrer" />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-200">{u.name}</span>
                          <span className="text-[10px] text-slate-500">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'Admin' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex -space-x-2">
                        {u.groups.map((g, i) => (
                          <div key={g} className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-400" title={g}>
                            {g[0]}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      {u.mfa ? <CheckCircle2 size={14} className="text-emerald-500 mx-auto" /> : <XCircle size={14} className="text-slate-700 mx-auto" />}
                    </td>
                    <td className="py-4 text-right">
                      <button className="p-1 text-slate-600 hover:text-slate-300">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Service Accounts */}
        <Card title="Service Accounts" icon={Key}>
          <div className="space-y-4">
            <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">CI/CD Pipeline</span>
                <span className="text-[9px] text-slate-600 font-mono">Used 2m ago</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 p-2 rounded border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 truncate">nx_live_8f2k...9a1z</span>
                <button className="ml-auto p-1 text-slate-500 hover:text-emerald-400 transition-colors">
                  <Copy size={12} />
                </button>
              </div>
            </div>
            <button className="w-full py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500/20 transition-all">
              Generate New Key
            </button>
          </div>
        </Card>
      </div>

      {/* Access Explorer Panel */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-96 bg-slate-950 border-l border-slate-800 z-[70] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-100">Access Explorer</h3>
                <button onClick={() => setSelectedUser(null)} className="p-1 text-slate-500 hover:text-slate-200">
                  <XCircle size={20} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <img src={selectedUser.avatar} className="w-12 h-12 rounded-full border border-slate-700" referrerPolicy="no-referrer" />
                <div>
                  <div className="text-sm font-bold text-slate-100">{selectedUser.name}</div>
                  <div className="text-xs text-slate-500">{selectedUser.role}</div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Permission Tree</div>
                <div className="space-y-4">
                  <div className="relative pl-6 border-l border-slate-800">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
                    <div className="text-xs font-bold text-slate-300">User: {selectedUser.name}</div>
                    <div className="mt-4 pl-6 border-l border-slate-800 relative">
                      <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-950" />
                      <div className="text-xs text-slate-400">Group: {selectedUser.groups[0]}</div>
                      <div className="mt-4 pl-6 border-l border-slate-800 relative">
                        <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-slate-700 border-2 border-slate-950" />
                        <div className="text-[11px] text-slate-500">Permission: <span className="text-emerald-400 font-mono">docker:container:restart</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Policy Logic Card (Moved down) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Hybrid RBAC/ABAC Engine" icon={Shield}>
          <div className="space-y-4">
            <div className="p-4 bg-black/20 border border-slate-800 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase mb-2">Policy Logic</div>
              <div className="font-mono text-sm text-emerald-400">
                Resource:Action:Constraint
              </div>
              <div className="mt-2 text-xs text-slate-400 italic">
                "Allow user to restart docker containers only if env=dev and time &lt; 18:00"
              </div>
            </div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex gap-2"><ChevronRight size={14} className="text-emerald-500 shrink-0 mt-1" /> <span><strong className="text-slate-200">Tenants:</strong> Strict UUID-based isolation at the DB level (RLS).</span></li>
              <li className="flex gap-2"><ChevronRight size={14} className="text-emerald-500 shrink-0 mt-1" /> <span><strong className="text-zinc-200">JIT Elevation:</strong> Sudo-style requests with auto-expiry TTL (e.g., 30m).</span></li>
            </ul>
          </div>
        </Card>
        <Card title="Data Isolation Schema" icon={Database}>
          <CodeBlock code={`-- Resource Ownership
CREATE TABLE resources (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  type TEXT, -- 'container', 'network', 'volume'
  provider_id TEXT
);`} />
        </Card>
      </div>
    </div>
  );
};

const InfraSection = () => {
  const [selectedContainer, setSelectedContainer] = useState<any>(null);
  const [cpuLimit, setCpuLimit] = useState(50);
  const [memLimit, setMemLimit] = useState(512);

  const stacks = [
    {
      name: 'Nexus-Core',
      status: 'running',
      containers: [
        { id: 'c1', name: 'api-gateway', image: 'nexus/api:v1.2', status: 'running', cpu: '1.2%', mem: '128MB', ports: '80:3000' },
        { id: 'c2', name: 'auth-service', image: 'nexus/auth:v1.1', status: 'running', cpu: '0.5%', mem: '64MB', ports: '3001' },
        { id: 'c3', name: 'postgres-db', image: 'postgres:15-alpine', status: 'running', cpu: '2.1%', mem: '256MB', ports: '5432' },
      ]
    },
    {
      name: 'Monitoring-Stack',
      status: 'running',
      containers: [
        { id: 'c4', name: 'prometheus', image: 'prom/prometheus', status: 'running', cpu: '4.5%', mem: '512MB', ports: '9090' },
        { id: 'c5', name: 'grafana', image: 'grafana/grafana', status: 'running', cpu: '1.8%', mem: '180MB', ports: '3000:3000' },
      ]
    }
  ];

  const images = [
    { name: 'nexus/api', tag: 'v1.2', size: '450MB', created: '2d ago', unused: false },
    { name: 'nexus/auth', tag: 'v1.1', size: '320MB', created: '5d ago', unused: false },
    { name: 'temp/test-build', tag: 'latest', size: '1.2GB', created: '1h ago', unused: true },
    { name: 'old/legacy-app', tag: 'v0.9', size: '890MB', created: '1mo ago', unused: true },
  ];

  const totalWaste = images.filter(img => img.unused).reduce((acc, img) => acc + (img.size.includes('GB') ? parseFloat(img.size) * 1024 : parseFloat(img.size)), 0);

  return (
    <div className="space-y-8 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stack View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Stacks</h3>
            <button className="text-[10px] text-emerald-400 hover:underline">Deploy New Stack</button>
          </div>
          
          {stacks.map(stack => (
            <div key={stack.name} className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-slate-800/30 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-blue-400" />
                  <span className="text-xs font-bold text-slate-200">{stack.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-bold uppercase">Healthy</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-1 text-slate-500 hover:text-emerald-400"><RotateCcw size={12} /></button>
                  <button className="p-1 text-slate-500 hover:text-red-400"><Square size={12} /></button>
                </div>
              </div>
              <div className="p-2">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-800/30">
                    {stack.containers.map(c => (
                      <tr key={c.id} className="group hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-300">{c.name}</span>
                              <span className="text-[9px] text-slate-600 font-mono">{c.image}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-4">
                            <div className="flex flex-col">
                              <span className="text-[8px] text-slate-500 uppercase">CPU</span>
                              <span className="text-[10px] font-mono text-slate-300">{c.cpu}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[8px] text-slate-500 uppercase">MEM</span>
                              <span className="text-[10px] font-mono text-slate-300">{c.mem}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setSelectedContainer(c)}
                              className="p-1.5 bg-slate-800 border border-slate-700 rounded hover:text-emerald-400 transition-colors"
                              title="View Logs"
                            >
                              <Terminal size={12} />
                            </button>
                            <button className="p-1.5 bg-slate-800 border border-slate-700 rounded hover:text-blue-400 transition-colors">
                              <Settings2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Resource Controls & Networking */}
        <div className="space-y-6">
          <Card title="Resource Controls" icon={Settings2}>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CpuIcon size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase">CPU Shares</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">{cpuLimit}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  value={cpuLimit} 
                  onChange={(e) => setCpuLimit(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MemoryStick size={14} className="text-blue-400" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Memory Limit</span>
                  </div>
                  <span className="text-xs font-mono text-blue-400">{memLimit} MB</span>
                </div>
                <input 
                  type="range" 
                  min="128" 
                  max="2048" 
                  step="128"
                  value={memLimit} 
                  onChange={(e) => setMemLimit(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              
              <button className="w-full py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500/20 transition-all">
                Apply Live Limits
              </button>
            </div>
          </Card>

          <Card title="Visual Networking" icon={Network}>
            <div className="relative h-48 bg-black/20 border border-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              
              {/* Stylized Network Map */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-[9px] font-mono text-emerald-400">Public:80</div>
                <div className="h-4 w-px bg-slate-700" />
                <div className="flex gap-8 items-center">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <Box size={16} className="text-blue-400" />
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <Box size={16} className="text-emerald-400" />
                  </div>
                </div>
                <div className="h-4 w-px bg-slate-700" />
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <Database size={16} className="text-amber-400" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Bridge: nexus_net</span>
              <span>Subnet: 172.18.0.0/16</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Image Management */}
      <Card title="Image Management" icon={Layers}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase">Total Images</span>
                <span className="text-sm font-bold text-slate-200">12</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase">Dangling / Unused</span>
                <span className={`text-sm font-bold ${totalWaste > 1024 ? 'text-red-400' : 'text-amber-400'}`}>
                  {totalWaste > 1024 ? (totalWaste / 1024).toFixed(1) + ' GB' : totalWaste + ' MB'}
                </span>
              </div>
            </div>
            <button className={`px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
              totalWaste > 1024 
                ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse hover:bg-red-500/20' 
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
            }`}>
              <Trash2 size={14} />
              Prune Unused Images
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                  <th className="pb-3 font-bold">Repository</th>
                  <th className="pb-3 font-bold">Tag</th>
                  <th className="pb-3 font-bold">Size</th>
                  <th className="pb-3 font-bold">Created</th>
                  <th className="pb-3 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {images.map((img, i) => (
                  <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 text-xs font-bold text-slate-300">{img.name}</td>
                    <td className="py-3 text-xs font-mono text-slate-500">{img.tag}</td>
                    <td className="py-3 text-xs text-slate-400">{img.size}</td>
                    <td className="py-3 text-xs text-slate-500">{img.created}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                        img.unused ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-slate-800 text-slate-600 border border-slate-700'
                      }`}>
                        {img.unused ? 'Unused' : 'In Use'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Live Console Slide-over */}
      <AnimatePresence>
        {selectedContainer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContainer(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 h-[60vh] bg-slate-950 border-t border-slate-800 z-[70] flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <Terminal size={18} className="text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest">
                      Live Console: {selectedContainer.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono">{selectedContainer.image}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-2 py-1 bg-black/40 rounded border border-slate-800">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Streaming Logs</span>
                  </div>
                  <button onClick={() => setSelectedContainer(null)} className="p-1 text-slate-500 hover:text-slate-200">
                    <XCircle size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 p-6 font-mono text-xs text-slate-400 overflow-y-auto bg-black/40 space-y-1">
                <div className="text-emerald-500/60">Attaching to container {selectedContainer.id}...</div>
                <div className="text-slate-600">[2024-05-20 14:45:01] INFO: Starting Nexus API Gateway v1.2</div>
                <div className="text-slate-600">[2024-05-20 14:45:02] INFO: Loading configuration from /etc/nexus/config.yaml</div>
                <div className="text-slate-600">[2024-05-20 14:45:02] INFO: Connecting to Redis at 172.18.0.4:6379</div>
                <div className="text-emerald-400">[2024-05-20 14:45:03] SUCCESS: Connected to Redis</div>
                <div className="text-slate-600">[2024-05-20 14:45:03] INFO: Listening on port 3000</div>
                <div className="text-slate-300">GET /api/v1/health 200 12ms</div>
                <div className="text-slate-300">POST /api/v1/auth/login 200 45ms</div>
                <div className="text-amber-400/80">WARN: High latency detected on upstream 'auth-service' (120ms)</div>
                <div className="text-slate-300">GET /api/v1/metrics 200 8ms</div>
                <motion.div 
                  animate={{ opacity: [0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-2 h-4 bg-emerald-500 inline-block align-middle ml-1"
                />
              </div>
              
              <div className="px-6 py-3 bg-slate-900/50 border-t border-slate-800 flex gap-4">
                <input 
                  type="text" 
                  placeholder="Execute command in container..." 
                  className="flex-1 bg-black/40 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-300 focus:border-emerald-500/50 outline-none"
                />
                <button className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase hover:bg-emerald-500/20 transition-all">
                  Run
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Legacy Info (Moved down) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
        <Card title="Legacy Orchestration Info" icon={Server}>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded">
                <Code size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-200">Docker Compose VC</div>
                <div className="text-[10px] text-zinc-500">Integrated Git-sync for stack definitions</div>
              </div>
            </div>
            <p className="text-xs text-zinc-500">
              Multi-node management via the Nexus Agent. Supports both Docker and Podman (rootless).
            </p>
          </div>
        </Card>
        <Card title="Networking & Proxy" icon={Network}>
          <div className="space-y-4">
            <ul className="text-[10px] space-y-2 text-zinc-500">
              <li>• Automated Wildcard SSL via ACME (Let's Encrypt)</li>
              <li>• Visual Traffic Routing Dashboard</li>
              <li>• Custom Header Injection & WAF Rules</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

const NetworkingSection = () => {
  const [activeSubTab, setActiveSubTab] = useState<'proxy' | 'ssl' | 'inspector'>('proxy');

  const proxyHosts = [
    { domain: 'api.nexus.io', target: '172.18.0.2:3000', ssl: true, status: 'online' },
    { domain: 'dashboard.nexus.io', target: '172.18.0.5:8080', ssl: true, status: 'online' },
    { domain: 'cdn.nexus.io', target: '172.18.0.12:80', ssl: false, status: 'online' },
    { domain: 'auth.nexus.io', target: '172.18.0.3:3001', ssl: true, status: 'online' },
  ];

  const certificates = [
    { domain: 'nexus.io', provider: "Let's Encrypt", expiry: 72, autoRenew: true },
    { domain: '*.nexus.io', provider: "Let's Encrypt", expiry: 14, autoRenew: true },
    { domain: 'dev.nexus.io', provider: "ZeroSSL", expiry: 5, autoRenew: false },
  ];

  const trafficLogs = [
    { method: 'GET', path: '/api/v1/health', status: 200, latency: 12, time: 'Just now' },
    { method: 'POST', path: '/api/v1/auth/login', status: 200, latency: 45, time: '12s ago' },
    { method: 'GET', path: '/dashboard/stats', status: 200, latency: 88, time: '45s ago' },
    { method: 'PUT', path: '/api/v1/vault/rotate', status: 403, latency: 5, time: '1m ago' },
    { method: 'GET', path: '/api/v1/metrics', status: 200, latency: 150, time: '2m ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Visual Routing Flow */}
      <Card title="Visual Routing Flow" icon={Network}>
        <div className="relative py-12 flex items-center justify-between px-12 bg-black/20 border border-slate-800 rounded-xl overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <Globe size={24} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Public Internet</span>
          </div>

          <div className="flex-1 flex items-center px-4">
            <div className="h-px flex-1 bg-slate-800 relative">
              <motion.div 
                animate={{ left: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-mono text-xs font-bold">
              PORT 443
            </div>
          </div>

          <div className="flex-1 flex items-center px-4">
            <div className="h-px flex-1 bg-slate-800 relative" />
          </div>

          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center gap-1 shadow-xl">
              <Zap size={20} className="text-emerald-400" />
              <span className="text-[9px] font-bold text-slate-300">NGINX</span>
            </div>
          </div>

          <div className="flex-1 flex items-center px-4">
            <div className="h-px flex-1 bg-slate-800 relative" />
          </div>

          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 border border-blue-500/50 flex items-center justify-center">
              <Box size={20} className="text-blue-400" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Container:3000</span>
          </div>
        </div>
      </Card>

      {/* Sub-Tabs */}
      <div className="flex gap-4 border-b border-slate-800 pb-px">
        {[
          { id: 'proxy', label: 'Proxy Hosts', icon: Globe },
          { id: 'ssl', label: 'SSL Manager', icon: Lock },
          { id: 'inspector', label: 'Traffic Inspector', icon: Activity },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all relative ${
              activeSubTab === tab.id ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {activeSubTab === tab.id && (
              <motion.div layoutId="subtab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeSubTab === 'proxy' && (
            <Card title="Proxy Hosts" icon={Globe}>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                      <th className="pb-3 font-bold">Domain</th>
                      <th className="pb-3 font-bold">Target IP/Port</th>
                      <th className="pb-3 font-bold">SSL Status</th>
                      <th className="pb-3 font-bold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {proxyHosts.map((host, i) => (
                      <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 text-xs font-bold text-slate-200">{host.domain}</td>
                        <td className="py-4 text-xs font-mono text-slate-500">{host.target}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            {host.ssl ? (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-bold uppercase">
                                <Lock size={10} />
                                Secure
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700 text-[9px] font-bold uppercase">
                                <XCircle size={10} />
                                Insecure
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{host.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeSubTab === 'ssl' && (
            <Card title="SSL Certificates" icon={Lock}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {certificates.map((cert, i) => (
                  <div key={i} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-bold text-slate-200">{cert.domain}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{cert.provider}</div>
                      </div>
                      <div className={`p-1.5 rounded-lg ${cert.expiry < 15 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        <Shield size={14} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                        <span className="text-slate-500">Expiry Countdown</span>
                        <span className={cert.expiry < 15 ? 'text-red-400' : 'text-emerald-400'}>{cert.expiry} Days</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(cert.expiry / 90) * 100}%` }}
                          className={`h-full ${cert.expiry < 15 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-[9px] text-slate-600 font-mono">Auto-Renew: {cert.autoRenew ? 'ON' : 'OFF'}</span>
                      <button className="text-[9px] font-bold text-emerald-400 hover:underline">Renew Now</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeSubTab === 'inspector' && (
            <Card title="Traffic Inspector" icon={Activity}>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                      <th className="pb-3 font-bold">Method</th>
                      <th className="pb-3 font-bold">Path</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold">Latency</th>
                      <th className="pb-3 font-bold text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {trafficLogs.map((log, i) => (
                      <tr key={i} className="hover:bg-slate-800/20 transition-colors font-mono">
                        <td className="py-3">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            log.method === 'GET' ? 'text-blue-400 bg-blue-500/10' : 
                            log.method === 'POST' ? 'text-emerald-400 bg-emerald-500/10' : 
                            'text-amber-400 bg-amber-500/10'
                          }`}>
                            {log.method}
                          </span>
                        </td>
                        <td className="py-3 text-[11px] text-slate-300">{log.path}</td>
                        <td className="py-3">
                          <span className={`text-[11px] ${log.status >= 400 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`text-[11px] ${log.latency > 100 ? 'text-amber-400' : 'text-slate-500'}`}>
                            {log.latency}ms
                          </span>
                        </td>
                        <td className="py-3 text-right text-[10px] text-slate-600">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const SecuritySection = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="Web-SSH & Audit" icon={Terminal} className="md:col-span-2">
        <div className="bg-black rounded-lg p-4 font-mono text-xs text-zinc-400 border border-zinc-800 mb-4">
          <div className="text-zinc-600 mb-2"># Audit Log: User_A @ 2024-05-20 14:22:01</div>
          <div>$ sudo apt update</div>
          <div>$ rm -rf /tmp/old_logs</div>
          <div className="text-red-400/80">$ rm -rf /etc/nginx <span className="text-zinc-600 ml-2"># BLOCKED BY CHROOT</span></div>
        </div>
        <p className="text-sm text-zinc-400">
          High-performance Xterm.js terminal with <span className="text-zinc-100 italic">keystroke recording</span>. Every session is indexed into a searchable Elasticsearch/OpenSearch "Black Box" for compliance.
        </p>
      </Card>
      <Card title="The Vault" icon={Lock}>
        <div className="space-y-4">
          <div className="p-3 bg-zinc-800/50 rounded border border-zinc-700">
            <div className="text-[10px] text-zinc-500 mb-1 uppercase">Encryption</div>
            <div className="text-xs font-mono text-zinc-200">AES-256-GCM</div>
          </div>
          <div className="p-3 bg-zinc-800/50 rounded border border-zinc-700">
            <div className="text-[10px] text-zinc-500 mb-1 uppercase">Master Key</div>
            <div className="text-xs font-mono text-zinc-200">BIP39 Mnemonic / HSM</div>
          </div>
          <button className="w-full py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-xs font-bold hover:bg-red-500/20 transition-colors">
            PANIC BUTTON: ROTATE ALL
          </button>
        </div>
      </Card>
      <Card title="Zero-Trust & Compliance" icon={Shield} className="md:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="text-xs font-bold text-zinc-200 uppercase tracking-tighter">Session Management</div>
            <ul className="text-xs text-zinc-500 space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <div>
                  <span className="text-zinc-300 font-bold block">Device Fingerprinting</span>
                  <span>Hardware-bound session tokens with WebAuthn support.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <div>
                  <span className="text-zinc-300 font-bold block">Concurrent Limits</span>
                  <span>Strict limit of 3 active sessions per user account.</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="text-xs font-bold text-zinc-200 uppercase tracking-tighter">Compliance Frameworks</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'SOC2', status: 'In-Scope' },
                { name: 'GDPR', status: 'Compliant' },
                { name: 'HIPAA', status: 'Available' },
                { name: 'PCI-DSS', status: 'Level 1' }
              ].map(f => (
                <div key={f.name} className="p-3 bg-zinc-800/30 border border-zinc-800 rounded flex justify-between items-center">
                  <span className="text-[10px] font-bold text-zinc-300">{f.name}</span>
                  <span className="text-[9px] text-emerald-500 font-mono">{f.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const MonitoringSection = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Real-time Metrics" icon={Activity}>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase">CPU Load</div>
              <div className="text-xl font-mono text-emerald-400">12.4%</div>
            </div>
            <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase">RAM Usage</div>
              <div className="text-xl font-mono text-blue-400">4.2GB</div>
            </div>
          </div>
          <div className="h-24 flex items-end gap-1 px-2">
            {[40, 60, 45, 70, 85, 40, 30, 55, 90, 65, 45, 50, 60, 75].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className="flex-1 bg-emerald-500/20 border-t border-emerald-500/40"
              />
            ))}
          </div>
          <p className="text-xs text-zinc-500">
            Prometheus/Netdata exporters integrated into the Nexus Agent.
          </p>
        </div>
      </Card>
      <Card title="Predictive Analytics" icon={Eye}>
        <div className="space-y-4">
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Activity size={14} />
              <span className="text-xs font-bold uppercase">Anomaly Detected</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              "Disk Space growth pattern suggests exhaustion in <span className="text-amber-200">4.2 days</span> based on current write velocity."
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-[10px] text-zinc-500 uppercase">Logic Gates</div>
            <ul className="text-xs text-zinc-400 space-y-1">
              <li>• Memory Leak detection (Linear regression)</li>
              <li>• I/O Wait spike correlation</li>
              <li>• Network flood pattern matching</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const VaultSection = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>('.env');
  const [restorePoint, setRestorePoint] = useState(80);

  const files = [
    { name: 'config', type: 'folder', children: [
      { name: 'nginx.conf', type: 'file' },
      { name: 'redis.conf', type: 'file' },
    ]},
    { name: 'secrets', type: 'folder', children: [
      { name: '.env', type: 'file' },
      { name: 'master.key', type: 'file' },
    ]},
    { name: 'docker-compose.yml', type: 'file' },
    { name: 'package.json', type: 'file' },
  ];

  const snapshots = [
    { id: 1, time: '2024-05-20 14:00', type: 'cloud', label: 'Daily Backup (S3)' },
    { id: 2, time: '2024-05-20 12:00', type: 'local', label: 'Pre-Deployment Snapshot' },
    { id: 3, time: '2024-05-20 08:00', type: 'local', label: 'Hourly Snapshot' },
    { id: 4, time: '2024-05-19 23:59', type: 'cloud', label: 'Weekly Archive' },
  ];

  const envContent = `# Nexus Environment Configuration
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://nexus:secret@localhost:5432/nexus
GEMINI_API_KEY=sk-nexus-********************
VAULT_MASTER_KEY=0x8f2k...9a1z
REDIS_URL=redis://localhost:6379`;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Tree View Sidebar */}
        <Card title="File Explorer" icon={Folder} className="lg:col-span-1 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-1">
            {files.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2 p-1.5 hover:bg-slate-800/40 rounded cursor-pointer group">
                  {item.type === 'folder' ? <Folder size={14} className="text-blue-400" /> : <File size={14} className="text-slate-500" />}
                  <span className="text-xs text-slate-300 group-hover:text-white transition-colors">{item.name}</span>
                </div>
                {item.children && (
                  <div className="ml-4 border-l border-slate-800 space-y-1">
                    {item.children.map((child, j) => (
                      <div 
                        key={j} 
                        onClick={() => setSelectedFile(child.name)}
                        className={`flex items-center gap-2 p-1.5 hover:bg-slate-800/40 rounded cursor-pointer group ml-2 ${selectedFile === child.name ? 'bg-emerald-500/10 text-emerald-400' : ''}`}
                      >
                        <FileText size={14} className={selectedFile === child.name ? 'text-emerald-400' : 'text-slate-600'} />
                        <span className="text-xs transition-colors">{child.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Code Editor */}
        <Card title={selectedFile || 'Editor'} icon={FileCode} className="lg:col-span-3 flex flex-col h-full">
          <div className="flex-1 bg-black/40 rounded-lg border border-slate-800 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase">UTF-8</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">TypeScript</span>
              </div>
              <button className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold hover:bg-emerald-500/20 transition-all">
                <Save size={12} />
                SAVE CHANGES
              </button>
            </div>
            <div className="flex-1 p-4 font-mono text-xs leading-relaxed overflow-y-auto">
              {selectedFile === '.env' ? (
                <div className="space-y-1">
                  {envContent.split('\n').map((line, i) => (
                    <div key={i} className="flex gap-4 group">
                      <span className="w-8 text-right text-slate-700 select-none">{i + 1}</span>
                      <span className={line.startsWith('#') ? 'text-slate-600 italic' : line.includes('=') ? 'text-slate-300' : 'text-slate-400'}>
                        {line.includes('=') ? (
                          <>
                            <span className="text-blue-400">{line.split('=')[0]}</span>
                            <span className="text-slate-500">=</span>
                            <span className="text-emerald-400">{line.split('=')[1]}</span>
                          </>
                        ) : line}
                      </span>
                    </div>
                  ))}
                  <motion.div 
                    animate={{ opacity: [0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-4 bg-emerald-500 inline-block align-middle ml-12"
                  />
                </div>
              ) : (
                <div className="text-slate-600 italic">Select a file to view its contents...</div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Backup Timeline */}
        <Card title="Backup Timeline" icon={History} className="lg:col-span-2">
          <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
            {snapshots.map((snap, i) => (
              <div key={snap.id} className="relative group">
                <div className={`absolute -left-8 top-1.5 w-7 h-7 rounded-full border-2 border-slate-950 flex items-center justify-center z-10 transition-colors ${
                  i === 0 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                }`}>
                  {snap.type === 'cloud' ? <Cloud size={14} /> : <HardDrive size={14} />}
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-slate-700 transition-all cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-slate-200">{snap.label}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">{snap.time}</div>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase hover:bg-blue-500/20 transition-all flex items-center gap-2">
                    <Undo2 size={12} />
                    RESTORE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* One-Click Restore Slider */}
        <Card title="Point-in-Time Restore" icon={Clock}>
          <div className="space-y-8">
            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-center">
              <div className="text-[10px] text-blue-400 uppercase font-bold tracking-widest mb-2">Target State</div>
              <div className="text-lg font-mono text-slate-200">
                {restorePoint > 90 ? 'LATEST' : 
                 restorePoint > 60 ? 'T - 12 Hours' : 
                 restorePoint > 30 ? 'T - 24 Hours' : 'T - 48 Hours'}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Snapshot: SN-8F2K-9A1Z</div>
            </div>

            <div className="space-y-4">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={restorePoint} 
                onChange={(e) => setRestorePoint(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[9px] text-slate-600 font-mono uppercase">
                <span>48h ago</span>
                <span>24h ago</span>
                <span>12h ago</span>
                <span>Now</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
                <RotateCcw size={14} />
                INITIATE ROLLBACK
              </button>
              <p className="mt-3 text-[9px] text-slate-600 text-center italic">
                * This will stop all active containers in the stack before restoring.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const WarpSection = () => {
  const [selectedSnapshots, setSelectedSnapshots] = useState<number[]>([1, 2]);
  const [retentionDays, setRetentionDays] = useState(7);

  const snapshots = [
    { id: 1, name: 'Pre-Deployment Sync', time: '2024-05-20 14:00', delta: '+124MB', type: 'manual' },
    { id: 2, name: 'Auto-Snapshot (Hourly)', time: '2024-05-20 13:00', delta: '+12MB', type: 'auto' },
    { id: 3, name: 'Post-Update Cleanup', time: '2024-05-20 12:00', delta: '-450MB', type: 'manual' },
    { id: 4, name: 'Auto-Snapshot (Hourly)', time: '2024-05-20 11:00', delta: '+8MB', type: 'auto' },
  ];

  const diffData = [
    { file: 'nginx/conf.d/api.conf', status: 'modified', desc: 'Changed proxy_pass timeout from 30s to 60s' },
    { file: 'docker-compose.yml', status: 'modified', desc: 'Updated image nexus/api:v1.1 to v1.2' },
    { file: 'volumes/api/data/cache.db', status: 'added', desc: 'New persistent cache layer initialized' },
    { file: 'volumes/old-service/logs/', status: 'deleted', desc: 'Legacy log directory purged' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Warp Timeline */}
        <Card title="Warp Timeline" icon={History} className="lg:col-span-1">
          <div className="relative pl-8 py-4 space-y-12 before:absolute before:left-3.5 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-emerald-500 before:via-blue-500 before:to-slate-800">
            {snapshots.map((snap, i) => (
              <div key={snap.id} className="relative group">
                <div className={`absolute -left-[34px] top-1 w-4 h-4 rounded-full border-4 border-slate-950 z-10 transition-all duration-300 ${
                  selectedSnapshots.includes(snap.id) ? 'bg-emerald-400 scale-125 shadow-[0_0_15px_rgba(52,211,153,0.6)]' : 'bg-slate-700 group-hover:bg-slate-500'
                }`} />
                
                <div 
                  onClick={() => {
                    if (selectedSnapshots.includes(snap.id)) {
                      setSelectedSnapshots(selectedSnapshots.filter(id => id !== snap.id));
                    } else if (selectedSnapshots.length < 2) {
                      setSelectedSnapshots([...selectedSnapshots, snap.id]);
                    } else {
                      setSelectedSnapshots([selectedSnapshots[1], snap.id]);
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedSnapshots.includes(snap.id) 
                      ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg' 
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-200">{snap.name}</span>
                    <span className={`text-[10px] font-mono font-bold ${snap.delta.startsWith('+') ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {snap.delta}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-mono">{snap.time}</span>
                    <button className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:text-slate-950 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                      Restore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Comparison Engine */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Comparison Engine" icon={FileCode}>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Source</span>
                    <span className="text-xs font-mono text-slate-300">Snapshot #{selectedSnapshots[0] || '...'}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-700" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Target</span>
                    <span className="text-xs font-mono text-slate-300">Snapshot #{selectedSnapshots[1] || '...'}</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500/20 transition-all">
                  Generate Full Diff
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2">Changes Detected</div>
                <div className="bg-black/40 border border-slate-800 rounded-xl divide-y divide-slate-800/50">
                  {diffData.map((item, i) => (
                    <div key={i} className="p-4 flex items-center justify-between group hover:bg-slate-800/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'added' ? 'bg-emerald-400' : 
                          item.status === 'deleted' ? 'bg-rose-400' : 'bg-amber-400'
                        }`} />
                        <div className="flex flex-col">
                          <span className={`text-xs font-mono font-bold ${
                            item.status === 'added' ? 'text-emerald-400' : 
                            item.status === 'deleted' ? 'text-rose-400' : 'text-amber-400'
                          }`}>
                            {item.file}
                          </span>
                          <span className="text-[10px] text-slate-500">{item.desc}</span>
                        </div>
                      </div>
                      <button className="p-1.5 text-slate-600 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all">
                        <Eye size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Auto-Prune Settings */}
          <Card title="Auto-Prune & Retention" icon={Trash2}>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Hourly Retention</span>
                    <span className="text-xs font-mono text-emerald-400">{retentionDays} Days</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    value={retentionDays} 
                    onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 italic">
                    Keep 24 snapshots per day for the last {retentionDays} days.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Daily Retention</span>
                    <span className="text-xs font-mono text-blue-400">4 Weeks</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-lg relative">
                    <div className="absolute left-0 top-0 bottom-0 w-2/3 bg-blue-500 rounded-lg" />
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    Consolidate hourly snapshots into daily archives after {retentionDays} days.
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap size={18} className="text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-200">Smart Pruning Active</div>
                    <div className="text-[10px] text-slate-500">Automatically purging snapshots with &lt; 1% delta.</div>
                  </div>
                </div>
                <button className="text-[10px] font-bold text-emerald-400 hover:underline uppercase tracking-widest">Configure</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const GitOpsSection = () => {
  const [autoDeploy, setAutoDeploy] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState('nexus-dashboard');

  const repos = [
    { name: 'nexus-dashboard', branch: 'main', commit: '7a2b9c1', status: 'success', lastDeploy: '2m ago' },
    { name: 'nexus-api', branch: 'production', commit: 'f4e2d1a', status: 'success', lastDeploy: '1h ago' },
    { name: 'nexus-worker', branch: 'develop', commit: 'bc3d4e5', status: 'failed', lastDeploy: '15m ago' },
  ];

  const envVars = [
    { key: 'PROD_DB_URL', value: 'postgres://prod:********@db.nexus.io:5432/main', scope: 'production' },
    { key: 'STAGING_DB_URL', value: 'postgres://staging:********@localhost:5432/test', scope: 'develop' },
    { key: 'STRIPE_SECRET', value: 'sk_live_51M************************', scope: 'all' },
  ];

  const buildLogs = [
    { time: '14:02:01', msg: 'Fetching changes from origin/main...', type: 'info' },
    { time: '14:02:03', msg: 'Found new commit: 7a2b9c1 (Merge pull request #42)', type: 'info' },
    { time: '14:02:05', msg: 'Starting Docker build for nexus-dashboard...', type: 'info' },
    { time: '14:02:10', msg: 'Step 1/12 : FROM node:18-alpine', type: 'build' },
    { time: '14:02:15', msg: 'Step 2/12 : WORKDIR /app', type: 'build' },
    { time: '14:02:20', msg: 'Step 3/12 : COPY package*.json ./', type: 'build' },
    { time: '14:02:45', msg: 'Build successful. Tagged as nexus-dashboard:7a2b9c1', type: 'success' },
    { time: '14:02:46', msg: 'Updating Nginx proxy configuration...', type: 'info' },
    { time: '14:02:48', msg: 'Deployment complete. Health check: PASSED', type: 'success' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Repo Cards */}
        <div className="lg:col-span-1 space-y-4">
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2">Active Repositories</div>
          {repos.map((repo) => (
            <div 
              key={repo.name}
              onClick={() => setSelectedRepo(repo.name)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedRepo === repo.name 
                  ? 'bg-blue-500/10 border-blue-500/40 shadow-lg' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Github size={16} className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-200">{repo.name}</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${repo.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'} shadow-[0_0_8px_rgba(16,185,129,0.4)]`} />
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
                <div className="flex items-center gap-1">
                  <GitBranch size={12} />
                  <span>{repo.branch}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Code size={12} />
                  <span>{repo.commit}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[9px] text-slate-600 uppercase font-bold">Last Deploy: {repo.lastDeploy}</span>
                <ExternalLink size={12} className="text-slate-700" />
              </div>
            </div>
          ))}
          
          <button className="w-full py-3 border border-dashed border-slate-800 rounded-xl text-slate-600 hover:text-slate-400 hover:border-slate-600 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
            <UserPlus size={14} />
            Connect New Repo
          </button>
        </div>

        {/* Deployment Logs */}
        <Card title="Live Deployment Logs" icon={Terminal} className="lg:col-span-2 flex flex-col h-full">
          <div className="flex-1 bg-black/60 rounded-lg border border-slate-800 overflow-hidden flex flex-col font-mono text-[11px]">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                </div>
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Build Session: #8F2K</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-500 uppercase font-bold text-[9px]">Streaming</span>
                </div>
                <button className="text-slate-600 hover:text-slate-300 transition-colors">
                  <Copy size={12} />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-1 overflow-y-auto bg-[#050505]">
              {buildLogs.map((log, i) => (
                <div key={i} className="flex gap-4 group">
                  <span className="text-slate-700 select-none w-16">{log.time}</span>
                  <span className={`${
                    log.type === 'success' ? 'text-emerald-400' : 
                    log.type === 'build' ? 'text-blue-400' : 'text-slate-300'
                  }`}>
                    {log.msg}
                  </span>
                </div>
              ))}
              <motion.div 
                animate={{ opacity: [0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-1.5 h-3 bg-blue-500 inline-block align-middle ml-20"
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Environment Variables */}
        <Card title="Environment Variables" icon={Key} className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Production & Staging</div>
              <button className="text-[10px] font-bold text-blue-400 hover:underline uppercase tracking-widest">Add Variable</button>
            </div>
            <div className="bg-black/40 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50">
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Key</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Value</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {envVars.map((v, i) => (
                    <tr key={i} className="group hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 text-xs font-mono text-blue-400">{v.key}</td>
                      <td className="p-4 text-xs font-mono text-slate-500 relative">
                        <span className="group-hover:opacity-0 transition-opacity">••••••••••••••••</span>
                        <span className="absolute left-4 top-4 opacity-0 group-hover:opacity-100 text-slate-200 transition-opacity whitespace-nowrap bg-slate-800 px-1 rounded">
                          {v.value}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          v.scope === 'production' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          v.scope === 'develop' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                          'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                          {v.scope}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Webhooks & Auto-Deploy */}
        <Card title="Deployment Settings" icon={Webhook}>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${autoDeploy ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Zap size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Auto-Deploy</div>
                  <div className="text-[9px] text-slate-500">Deploy on every git push</div>
                </div>
              </div>
              <button 
                onClick={() => setAutoDeploy(!autoDeploy)}
                className={`w-10 h-5 rounded-full relative transition-colors ${autoDeploy ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <motion.div 
                  animate={{ x: autoDeploy ? 22 : 2 }}
                  className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2">Webhook URL</div>
              <div className="flex gap-2">
                <div className="flex-1 p-2 bg-black/40 border border-slate-800 rounded text-[10px] font-mono text-slate-500 truncate">
                  https://nexus.io/api/webhooks/deploy/8f2k-9a1z-4b3c
                </div>
                <button className="p-2 bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button className="w-full py-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2">
                <RotateCcw size={14} />
                REDEPLOY LATEST
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const SchemaSection = () => (
  <div className="space-y-8">
    <Card title="Full PostgreSQL Schema" icon={FileCode}>
      <CodeBlock code={`-- THE NEXUS: CORE SCHEMA

-- 1. IAM & Multi-Tenancy
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  plan_type VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  name VARCHAR(100),
  permissions JSONB -- { "docker:restart": true, "file:read": "restricted" }
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  mfa_secret TEXT,
  last_login TIMESTAMPTZ
);

-- 2. Infrastructure
CREATE TABLE nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  hostname VARCHAR(255),
  ip_address INET,
  agent_version VARCHAR(20),
  status VARCHAR(20) -- 'online', 'offline', 'maintenance'
);

CREATE TABLE containers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID REFERENCES nodes(id),
  external_id TEXT, -- Docker/Podman ID
  name TEXT,
  image TEXT,
  state JSONB
);

-- 3. Security & Audit
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  action TEXT,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vault_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  key_name TEXT NOT NULL,
  encrypted_value TEXT NOT NULL, -- AES-256-GCM
  nonce TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`} />
    </Card>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<Section>('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'iam': return <IAMSection />;
      case 'infra': return <InfraSection />;
      case 'networking': return <NetworkingSection />;
      case 'security': return <SecuritySection />;
      case 'monitoring': return <MonitoringSection />;
      case 'vault': return <VaultSection />;
      case 'warp': return <WarpSection />;
      case 'git-ops': return <GitOpsSection />;
      case 'schema': return <SchemaSection />;
      default: return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Zap className="text-black fill-black" size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tighter uppercase text-slate-100">The Nexus</h1>
            <p className="text-[10px] text-slate-500 font-mono">v1.0.0-enterprise</p>
          </div>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg w-96">
          <Search size={14} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Search resources... (Cmd+K)" 
            className="bg-transparent border-none outline-none text-xs text-slate-300 w-full"
          />
          <span className="text-[9px] text-slate-600 font-mono border border-slate-800 px-1 rounded">⌘K</span>
        </div>

        <div className="flex items-center gap-4">
          {/* System Health Pulse */}
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Healthy</span>
          </div>

          {/* Panic Button */}
          <button className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-[10px] font-bold hover:bg-red-500/20 transition-all flex items-center gap-2">
            <Shield size={12} />
            PANIC: KILL SSH
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 h-[calc(100vh-64px)] sticky top-16 p-4 space-y-2 bg-black/20">
          {/* Org Switcher */}
          <div className="px-2 mb-6">
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Organization</div>
            <button className="w-full flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Production</span>
              </div>
              <ChevronDown size={14} className="text-slate-500" />
            </button>
          </div>

          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-4">Architecture</div>
          <SidebarItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={Shield} label="IAM & Access" active={activeTab === 'iam'} onClick={() => setActiveTab('iam')} />
          <SidebarItem icon={Server} label="Infrastructure" active={activeTab === 'infra'} onClick={() => setActiveTab('infra')} />
          <SidebarItem icon={Globe} label="Networking" active={activeTab === 'networking'} onClick={() => setActiveTab('networking')} />
          <SidebarItem icon={Terminal} label="Security & SSH" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
          <SidebarItem icon={Activity} label="Monitoring" active={activeTab === 'monitoring'} onClick={() => setActiveTab('monitoring')} />
          <SidebarItem icon={HardDrive} label="Vault & Backups" active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} />
          <SidebarItem icon={Zap} label="Warp Snapshots" active={activeTab === 'warp'} onClick={() => setActiveTab('warp')} />
          <SidebarItem icon={GitBranch} label="Git Ops" active={activeTab === 'git-ops'} onClick={() => setActiveTab('git-ops')} />
          <div className="pt-4 mt-4 border-t border-slate-800">
            <SidebarItem icon={Database} label="DB Schema" active={activeTab === 'schema'} onClick={() => setActiveTab('schema')} />
          </div>
          
          <div className="absolute bottom-8 left-4 right-4">
            <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive size={14} className="text-zinc-500" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Vault Status</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full w-full bg-emerald-500/40" />
              </div>
              <div className="mt-2 text-[9px] text-zinc-600 font-mono">ENCRYPTED: AES-256-GCM</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-100 capitalize">
                  {activeTab.replace('-', ' ')}
                </h2>
                <p className="text-zinc-500 mt-2 text-sm max-w-2xl">
                  {activeTab === 'overview' && "The Nexus central management console architecture. High-performance, secure, and scalable."}
                  {activeTab === 'iam' && "Advanced Identity and Access Management with multi-tenant isolation and policy-based permissions."}
                  {activeTab === 'infra' && "Container orchestration and automated networking for multi-node VPS environments."}
                  {activeTab === 'networking' && "Manage Nginx proxy hosts, SSL certificates, and real-time traffic routing."}
                  {activeTab === 'security' && "Zero-trust session management, encrypted vaults, and comprehensive audit logging."}
                  {activeTab === 'monitoring' && "Real-time metrics and predictive analytics for infrastructure health and performance."}
                  {activeTab === 'vault' && "Secure file explorer, integrated code editor, and point-in-time backup restoration."}
                  {activeTab === 'warp' && "Advanced system state capture including container images, volume data, and network configs."}
                  {activeTab === 'git-ops' && "Vercel-style Git deployments with auto-deploy webhooks and branch-scoped environment variables."}
                  {activeTab === 'schema' && "PostgreSQL database schema representing the core IAM and resource ownership model."}
                </p>
              </div>

              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 p-8 mt-12 bg-black/40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-emerald-500" size={16} />
              <span className="font-bold text-sm uppercase tracking-tighter">The Nexus Architecture</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              Designed for enterprise-grade self-hosted infrastructure management. 
              Built with security-first principles and high-performance gRPC communication.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Protocols</h4>
            <ul className="text-[10px] text-zinc-600 space-y-2 font-mono">
              <li>gRPC over TLS 1.3</li>
              <li>OAuth2 + OIDC</li>
              <li>AES-256-GCM Vault</li>
              <li>ACME v2 (SSL)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Compliance</h4>
            <ul className="text-[10px] text-zinc-600 space-y-2 font-mono">
              <li>SOC2 Type II Ready</li>
              <li>GDPR Data Isolation</li>
              <li>ISO 27001 Controls</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-zinc-900 flex justify-between items-center">
          <span className="text-[10px] text-zinc-700 font-mono">© 2024 NEXUS CLOUD SYSTEMS</span>
          <div className="flex gap-4">
            <span className="text-[10px] text-zinc-700 font-mono">DOCUMENT_ID: ARCH-001-REV-A</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

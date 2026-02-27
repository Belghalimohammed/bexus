import React, { useState } from 'react';
import { Database, Search, Download, Plus, Filter, MoreVertical, Play, Table as TableIcon, Eye, Zap, ChevronRight, ChevronDown } from 'lucide-react';

interface DataExplorerProps {
  containerName: string;
  image: string;
}

export const DataExplorer: React.FC<DataExplorerProps> = ({ containerName, image }) => {
  const [activeTable, setActiveTable] = useState('users');
  const [query, setQuery] = useState('SELECT * FROM users LIMIT 100;');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['tables']));

  const toggleNode = (node: string) => {
    const next = new Set(expandedNodes);
    if (next.has(node)) next.delete(node);
    else next.add(node);
    setExpandedNodes(next);
  };

  const schema = {
    tables: ['users', 'orders', 'products', 'sessions', 'audit_logs'],
    views: ['active_users_v', 'monthly_revenue_v'],
    procedures: ['sp_cleanup_sessions', 'sp_calculate_tax']
  };
  
  const [mockData, setMockData] = useState([
    { id: 1, name: 'Alex Rivera', email: 'alex@nexus.io', role: 'Admin', created_at: '2024-01-15' },
    { id: 2, name: 'Sarah Chen', email: 'sarah@nexus.io', role: 'Dev', created_at: '2024-01-16' },
    { id: 3, name: 'Mike Ross', email: 'mike@nexus.io', role: 'Dev', created_at: '2024-01-17' },
    { id: 4, name: 'Emma Wilson', email: 'emma@nexus.io', role: 'Viewer', created_at: '2024-01-18' },
    { id: 5, name: 'James Bond', email: '007@mi6.gov', role: 'Agent', created_at: '2024-01-19' },
  ]);

  const handleCellChange = (rowIndex: number, field: string, value: string) => {
    const newData = [...mockData];
    (newData[rowIndex] as any)[field] = value;
    setMockData(newData);
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar: Tree View */}
        <div className="w-56 border-r border-brand-border bg-brand-sidebar flex flex-col">
          <div className="p-4 border-b border-brand-border">
            <div className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest mb-2">Database Schema</div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-text/30" size={12} />
              <input 
                type="text" 
                placeholder="Filter objects..."
                className="w-full bg-brand-text/5 border border-brand-text/10 rounded px-2 py-1 pl-7 text-[10px] outline-none focus:border-primary/50 text-brand-text"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {/* Tables */}
            <div>
              <button 
                onClick={() => toggleNode('tables')}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] font-bold text-brand-text/60 hover:text-brand-text transition-colors"
              >
                {expandedNodes.has('tables') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <TableIcon size={14} className="text-primary/60" />
                Tables
              </button>
              {expandedNodes.has('tables') && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {schema.tables.map(table => (
                    <button
                      key={table}
                      onClick={() => setActiveTable(table)}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-[10px] transition-all ${
                        activeTable === table ? 'bg-primary/10 text-primary font-bold' : 'text-brand-text/40 hover:bg-brand-text/5'
                      }`}
                    >
                      <div className="w-1 h-1 rounded-full bg-brand-text/20" />
                      {table}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Views */}
            <div>
              <button 
                onClick={() => toggleNode('views')}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] font-bold text-brand-text/60 hover:text-brand-text transition-colors"
              >
                {expandedNodes.has('views') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <Eye size={14} className="text-blue-400/60" />
                Views
              </button>
              {expandedNodes.has('views') && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {schema.views.map(view => (
                    <button key={view} className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-[10px] text-brand-text/40 hover:bg-brand-text/5 transition-all">
                      <div className="w-1 h-1 rounded-full bg-brand-text/20" />
                      {view}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stored Procedures */}
            <div>
              <button 
                onClick={() => toggleNode('procedures')}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] font-bold text-brand-text/60 hover:text-brand-text transition-colors"
              >
                {expandedNodes.has('procedures') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <Zap size={14} className="text-yellow-400/60" />
                Procedures
              </button>
              {expandedNodes.has('procedures') && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {schema.procedures.map(proc => (
                    <button key={proc} className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-[10px] text-brand-text/40 hover:bg-brand-text/5 transition-all">
                      <div className="w-1 h-1 rounded-full bg-brand-text/20" />
                      {proc}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content: Query & Data */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Query Editor */}
          <div className="h-32 border-b border-brand-border bg-brand-sidebar p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest flex items-center gap-2">
                <Database size={12} className="text-primary" />
                SQL Query Editor
              </div>
              <button className="flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded hover:opacity-90 transition-all">
                <Play size={12} />
                Run Query
              </button>
            </div>
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-brand-bg border border-brand-border rounded p-3 font-mono text-[11px] text-brand-text outline-none focus:border-primary/50 resize-none"
            />
          </div>

          {/* Data Grid Toolbar */}
          <div className="h-12 border-b border-brand-border bg-brand-sidebar flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <div className="text-[11px] font-bold text-brand-text">public.{activeTable}</div>
              <div className="h-4 w-px bg-brand-border" />
              <div className="text-[10px] text-brand-text/40 font-mono">5 rows found (0.02s)</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-brand-text/5 rounded text-brand-text/40 hover:text-brand-text transition-all"><Plus size={14} /></button>
              <button className="p-1.5 hover:bg-brand-text/5 rounded text-brand-text/40 hover:text-brand-text transition-all"><Filter size={14} /></button>
              <button className="p-1.5 hover:bg-brand-text/5 rounded text-brand-text/40 hover:text-brand-text transition-all"><Download size={14} /></button>
              <button className="p-1.5 hover:bg-brand-text/5 rounded text-brand-text/40 hover:text-brand-text transition-all"><MoreVertical size={14} /></button>
            </div>
          </div>

          {/* Data Grid with Inline Editing */}
          <div className="flex-1 overflow-auto custom-scrollbar bg-slate-900">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-slate-400 border-r border-slate-800">id</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-slate-400 border-r border-slate-800">name</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-slate-400 border-r border-slate-800">email</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-slate-400 border-r border-slate-800">role</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-slate-400">created_at</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-mono">
                {mockData.map((row, i) => (
                  <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors group">
                    <td className="px-4 py-2 text-cyan-400 border-r border-slate-800 bg-slate-900">{row.id}</td>
                    <td className="p-0 border-r border-slate-800 bg-slate-900 focus-within:ring-2 focus-within:ring-cyan-500 z-10">
                      <input 
                        className="w-full h-full bg-transparent px-4 py-2 outline-none text-slate-200"
                        value={row.name}
                        onChange={(e) => handleCellChange(i, 'name', e.target.value)}
                      />
                    </td>
                    <td className="p-0 border-r border-slate-800 bg-slate-900 focus-within:ring-2 focus-within:ring-cyan-500 z-10">
                      <input 
                        className="w-full h-full bg-transparent px-4 py-2 outline-none text-slate-400"
                        value={row.email}
                        onChange={(e) => handleCellChange(i, 'email', e.target.value)}
                      />
                    </td>
                    <td className="p-0 border-r border-slate-800 bg-slate-900 focus-within:ring-2 focus-within:ring-cyan-500 z-10">
                      <select 
                        className="w-full h-full bg-transparent px-4 py-2 outline-none text-slate-400 appearance-none"
                        value={row.role}
                        onChange={(e) => handleCellChange(i, 'role', e.target.value)}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Dev">Dev</option>
                        <option value="Viewer">Viewer</option>
                        <option value="Agent">Agent</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 text-slate-500 bg-slate-900">{row.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

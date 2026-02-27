import React, { useState } from 'react';
import { GitBranch, Send, ChevronDown, FileCode, Plus, Minus, GitCommit, RefreshCw, History } from 'lucide-react';
import { motion } from 'framer-motion';

interface GitWorkspaceViewProps {
  folderName: string;
}

export const GitWorkspaceView: React.FC<GitWorkspaceViewProps> = ({ folderName }) => {
  const [branch, setBranch] = useState('main');
  const [selectedFile, setSelectedFile] = useState('server.js');
  const [commitMessage, setCommitMessage] = useState('');

  const changedFiles = [
    { name: 'server.js', status: 'modified', additions: 12, deletions: 4 },
    { name: 'package.json', status: 'modified', additions: 2, deletions: 1 },
    { name: 'src/utils/auth.ts', status: 'added', additions: 45, deletions: 0 },
  ];

  const diffData = [
    { type: 'unchanged', content: "const express = require('express');" },
    { type: 'unchanged', content: "const app = express();" },
    { type: 'deletion', content: "const port = 8080;" },
    { type: 'addition', content: "const port = process.env.PORT || 3000;" },
    { type: 'unchanged', content: "" },
    { type: 'unchanged', content: "app.get('/', (req, res) => {" },
    { type: 'deletion', content: "  res.send('Hello World!');" },
    { type: 'addition', content: "  res.json({ status: 'ok', version: '2.4.1' });" },
    { type: 'unchanged', content: "});" },
    { type: 'addition', content: "" },
    { type: 'addition', content: "app.get('/health', (req, res) => res.sendStatus(200));" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden">
      {/* Git Header */}
      <header className="h-14 border-b border-brand-border bg-brand-sidebar flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <GitBranch size={16} className="text-primary" />
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-brand-text/5 border border-brand-border rounded-lg text-[11px] font-bold text-brand-text hover:border-primary/30 transition-all">
                {branch}
                <ChevronDown size={12} className="text-brand-text/40" />
              </button>
            </div>
          </div>
          <div className="h-4 w-px bg-brand-border" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-brand-text/40 uppercase">
              <GitCommit size={12} />
              <span>7a2b9c1</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-brand-text/40 uppercase">
              <History size={12} />
              <span>2 mins ago</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-brand-text/5 border border-brand-border rounded-lg text-[10px] font-bold uppercase text-brand-text/60 hover:text-brand-text transition-all">
            <RefreshCw size={12} />
            Fetch
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            <Send size={12} />
            Commit & Push
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Changes Sidebar */}
        <div className="w-64 border-r border-brand-border bg-brand-sidebar flex flex-col">
          <div className="p-4 border-b border-brand-border">
            <div className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest mb-4">Changes</div>
            <textarea 
              placeholder="Commit message..."
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              className="w-full h-20 bg-brand-bg border border-brand-border rounded-lg p-2 text-[11px] text-brand-text outline-none focus:border-primary/50 resize-none mb-2"
            />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {changedFiles.map((file, i) => (
              <button
                key={i}
                onClick={() => setSelectedFile(file.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-[11px] transition-all ${
                  selectedFile === file.name ? 'bg-primary/10 text-primary font-bold' : 'text-brand-text/60 hover:bg-brand-text/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCode size={14} className={selectedFile === file.name ? 'text-primary' : 'text-brand-text/30'} />
                  {file.name}
                </div>
                <div className="flex gap-1.5 text-[9px] font-mono">
                  <span className="text-green-500">+{file.additions}</span>
                  <span className="text-red-500">-{file.deletions}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Diff View */}
        <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden">
          <div className="h-10 border-b border-brand-border bg-brand-sidebar flex items-center px-6 justify-between">
            <div className="text-[10px] font-mono text-brand-text/40 uppercase">Diff: {selectedFile}</div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1 text-[9px] font-mono text-green-500 uppercase">
                <Plus size={10} /> 12 Additions
              </div>
              <div className="flex items-center gap-1 text-[9px] font-mono text-red-500 uppercase">
                <Minus size={10} /> 4 Deletions
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 font-mono text-[12px] leading-relaxed">
            <div className="border border-brand-border rounded-xl overflow-hidden bg-brand-sidebar shadow-xl">
              {diffData.map((line, i) => (
                <div 
                  key={i} 
                  className={`flex group ${
                    line.type === 'addition' ? 'bg-green-500/10 text-green-400' : 
                    line.type === 'deletion' ? 'bg-red-500/10 text-red-400' : 
                    'text-brand-text/60'
                  }`}
                >
                  <div className="w-12 flex-shrink-0 text-right pr-4 py-0.5 border-r border-brand-border/10 select-none opacity-20 text-[10px]">
                    {i + 1}
                  </div>
                  <div className="w-6 flex-shrink-0 flex items-center justify-center select-none opacity-40">
                    {line.type === 'addition' ? '+' : line.type === 'deletion' ? '-' : ' '}
                  </div>
                  <div className="flex-1 px-4 py-0.5 whitespace-pre">
                    {line.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

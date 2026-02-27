import React, { useState } from 'react';
import { Folder, FileCode, ChevronRight, ChevronDown, Search, Download, Trash2, Upload, FileText, MoreVertical } from 'lucide-react';

interface ContainerFileExplorerProps {
  containerName: string;
  workdir?: string;
}

export const ContainerFileExplorer: React.FC<ContainerFileExplorerProps> = ({ containerName, workdir = '/app' }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>('index.js');
  const [isExpanded, setIsExpanded] = useState(true);

  const files = [
    { name: 'src', type: 'folder', active: false, children: [
      { name: 'index.js', type: 'file', active: true },
      { name: 'utils.js', type: 'file', active: false },
      { name: 'config.json', type: 'file', active: false },
    ]},
    { name: 'node_modules', type: 'folder', active: false, children: [] },
    { name: 'package.json', type: 'file', active: false },
    { name: 'Dockerfile', type: 'file', active: false },
    { name: '.env', type: 'file', active: false },
  ];

  return (
    <div className="flex-1 flex bg-brand-bg overflow-hidden">
      {/* File Explorer Sidebar */}
      <div className="w-64 border-r border-brand-border bg-brand-sidebar flex flex-col">
        <div className="p-4 border-b border-brand-border">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] uppercase font-bold text-brand-text/40 tracking-widest">Container FS</div>
            <div className="flex gap-2">
              <Upload size={14} className="text-brand-text/30 hover:text-brand-text cursor-pointer transition-colors" />
              <Download size={14} className="text-brand-text/30 hover:text-brand-text cursor-pointer transition-colors" />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-text/30" size={12} />
            <input 
              type="text" 
              placeholder="Search files..."
              className="w-full bg-brand-text/5 border border-brand-text/10 rounded px-2 py-1.5 pl-7 text-[10px] font-mono outline-none focus:border-primary/50 text-brand-text"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          <div className="space-y-1">
            <div 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-2 py-1.5 text-brand-text/60 hover:text-brand-text transition-colors cursor-pointer group"
            >
              <ChevronDown size={14} className={`transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
              <Folder size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">{workdir}</span>
            </div>
            
            {isExpanded && (
              <div className="ml-4 space-y-1 border-l border-brand-text/5">
                {files.map((item, i) => (
                  <div key={i}>
                    <div 
                      className={`flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer transition-all ${
                        item.active ? 'bg-primary/10 text-primary' : 'text-brand-text/40 hover:text-brand-text hover:bg-brand-text/5'
                      }`}
                      onClick={() => item.type === 'file' && setSelectedFile(item.name)}
                    >
                      {item.type === 'folder' ? <ChevronRight size={12} className="text-brand-text/30" /> : <div className="w-3" />}
                      {item.type === 'folder' ? <Folder size={14} className="text-blue-400/60" /> : <FileCode size={14} className="text-purple-400/60" />}
                      <span className="text-[11px] font-medium truncate">{item.name}</span>
                    </div>
                    {item.children && item.children.length > 0 && (
                      <div className="ml-6 space-y-1">
                        {item.children.map((child, j) => (
                          <div 
                            key={j}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer transition-all ${
                              selectedFile === child.name ? 'bg-primary/10 text-primary' : 'text-brand-text/40 hover:text-brand-text hover:bg-brand-text/5'
                            }`}
                            onClick={() => setSelectedFile(child.name)}
                          >
                            <div className="w-3" />
                            <FileCode size={14} className="text-purple-400/60" />
                            <span className="text-[11px] font-medium truncate">{child.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor/Viewer */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-12 border-b border-brand-border flex items-center justify-between px-6 bg-brand-sidebar">
          <div className="flex items-center gap-3">
            <FileText size={14} className="text-primary" />
            <div className="text-[11px] font-bold text-brand-text">{selectedFile || 'Select a file'}</div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-brand-text/5 rounded text-brand-text/40 hover:text-brand-text transition-all"><Download size={14} /></button>
            <button className="p-1.5 hover:bg-brand-text/5 rounded text-brand-text/40 hover:text-brand-text transition-all"><Trash2 size={14} className="text-red-500/60" /></button>
            <button className="p-1.5 hover:bg-brand-text/5 rounded text-brand-text/40 hover:text-brand-text transition-all"><MoreVertical size={14} /></button>
          </div>
        </header>
        <div className="flex-1 bg-brand-bg p-4 font-mono text-[11px] overflow-auto custom-scrollbar leading-relaxed">
          <div className="text-brand-text/80">
            {selectedFile === 'index.js' ? (
              <pre>
{`const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(\`Example app listening at http://localhost:\${port}\`);
});`}
              </pre>
            ) : (
              <div className="text-brand-text/40 italic">Binary file or large content hidden in preview.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

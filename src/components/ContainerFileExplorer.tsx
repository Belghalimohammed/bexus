import React, { useState, useEffect } from 'react';
import { Folder, FileCode, ChevronRight, ChevronDown, Search, Download, Trash2, Upload, FileText, MoreVertical, AlertTriangle, Save } from 'lucide-react';
import { usePresence } from '../contexts/PresenceContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ContainerFileExplorerProps {
  containerName: string;
  workdir?: string;
}

export const ContainerFileExplorer: React.FC<ContainerFileExplorerProps> = ({ containerName, workdir = '/app' }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>('index.js');
  const [isExpanded, setIsExpanded] = useState(true);
  const [envContent, setEnvContent] = useState('DB_HOST=localhost\nDB_PORT=5432\nSTRIPE_KEY=sk_test_51Mz...');
  const { users } = usePresence();

  const activeUsers = users.filter(u => u.location === 'file-explorer' && u.activeFile === selectedFile);
  const hasCollision = selectedFile === '.env' && activeUsers.length > 0;

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
          
          <div className="flex items-center gap-4">
            {/* Presence Avatars */}
            <div className="flex -space-x-2">
              {activeUsers.map(user => (
                <div 
                  key={user.id}
                  className="w-6 h-6 rounded-full border-2 border-brand-sidebar flex items-center justify-center text-[8px] font-bold text-white shadow-lg"
                  style={{ backgroundColor: user.color }}
                  title={`${user.name} is viewing this file`}
                >
                  {user.name.charAt(0)}
                </div>
              ))}
            </div>

            <div className="h-4 w-px bg-brand-border" />

            <div className="flex items-center gap-3">
              {selectedFile === '.env' && (
                <button 
                  disabled={hasCollision}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                    hasCollision 
                      ? 'bg-red-500/10 text-red-500 border border-red-500/20 cursor-not-allowed' 
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  <Save size={12} />
                  Save Changes
                </button>
              )}
              <button className="p-1.5 hover:bg-brand-text/5 rounded text-brand-text/40 hover:text-brand-text transition-all"><Download size={14} /></button>
              <button className="p-1.5 hover:bg-brand-text/5 rounded text-brand-text/40 hover:text-brand-text transition-all"><Trash2 size={14} className="text-red-500/60" /></button>
              <button className="p-1.5 hover:bg-brand-text/5 rounded text-brand-text/40 hover:text-brand-text transition-all"><MoreVertical size={14} /></button>
            </div>
          </div>
        </header>

        {hasCollision && (
          <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-2 flex items-center gap-3">
            <AlertTriangle size={14} className="text-red-500" />
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
              Collision Warning: {activeUsers[0].name} is currently editing this file. Save locked.
            </span>
          </div>
        )}

        <div className="flex-1 bg-brand-bg p-4 font-mono text-[11px] overflow-auto custom-scrollbar leading-relaxed relative">
          {selectedFile === '.env' && activeUsers.length > 0 && (
            <div 
              className="absolute pointer-events-none border-l-2 z-10"
              style={{ 
                left: '100px', 
                top: '40px', 
                height: '1.5em', 
                borderColor: activeUsers[0].color,
                backgroundColor: `${activeUsers[0].color}22`
              }}
            >
              <div 
                className="absolute -top-4 left-0 px-1 py-0.5 rounded text-[8px] text-white whitespace-nowrap"
                style={{ backgroundColor: activeUsers[0].color }}
              >
                {activeUsers[0].name}
              </div>
            </div>
          )}

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
            ) : selectedFile === '.env' ? (
              <textarea 
                value={envContent}
                onChange={(e) => setEnvContent(e.target.value)}
                className="w-full h-full bg-transparent outline-none resize-none"
                spellCheck={false}
              />
            ) : (
              <div className="text-brand-text/40 italic">Binary file or large content hidden in preview.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

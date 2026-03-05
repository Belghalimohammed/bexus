import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Mention from '@tiptap/extension-mention';
import { 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  Plus, 
  Search, 
  Hash, 
  Code, 
  List, 
  CheckSquare, 
  Heading1, 
  Heading2, 
  Cpu, 
  Box, 
  Activity, 
  Terminal,
  MoreVertical,
  Trash2,
  Edit3,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Custom Slash Menu Extension Logic ---
// For simplicity in this demo, we'll use a custom floating menu component 
// that reacts to the '/' character.

interface DocNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: DocNode[];
  isOpen?: boolean;
}

const INITIAL_DOCS: DocNode[] = [
  {
    id: '1',
    name: 'Incident Post-Mortems',
    type: 'folder',
    isOpen: true,
    children: [
      { id: '1-1', name: '2024-02-15 DB Outage', type: 'file' },
      { id: '1-2', name: '2024-01-10 API Latency', type: 'file' },
    ]
  },
  {
    id: '2',
    name: 'Deployment Guides',
    type: 'folder',
    children: [
      { id: '2-1', name: 'Production Rollout', type: 'file' },
      { id: '2-2', name: 'Staging Sync', type: 'file' },
    ]
  },
  { id: '3', name: 'Infrastructure Runbook', type: 'file' },
];

const FileTreeItem: React.FC<{ node: DocNode; level: number; activeId: string; onSelect: (id: string) => void }> = ({ node, level, activeId, onSelect }) => {
  const [isOpen, setIsOpen] = useState(node.isOpen || false);
  const isFolder = node.type === 'folder';
  const isActive = activeId === node.id;

  return (
    <div className="select-none">
      <div
        onClick={() => {
          if (isFolder) setIsOpen(!isOpen);
          else onSelect(node.id);
        }}
        className={`flex items-center gap-2 py-1.5 px-3 rounded-lg cursor-pointer transition-all group ${
          isActive ? 'bg-primary/5 text-primary' : 'hover:bg-slate-100 text-slate-600'
        }`}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          {isFolder ? (
            isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />
          ) : (
            <FileText size={14} className={isActive ? 'text-primary' : 'text-slate-400'} />
          )}
        </div>
        {isFolder && <Folder size={14} className="text-slate-400 fill-slate-400/10" />}
        <span className={`text-xs font-medium truncate ${isActive ? 'font-bold' : ''}`}>{node.name}</span>
      </div>
      {isFolder && isOpen && node.children && (
        <div className="mt-0.5">
          {node.children.map((child) => (
            <FileTreeItem key={child.id} node={child} level={level + 1} activeId={activeId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export const WikiEditor: React.FC = () => {
  const [activeDocId, setActiveDocId] = useState('3');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Type '/' for commands...",
      }),
    ],
    content: `
      <h1>Infrastructure Runbook</h1>
      <p>This document outlines the core infrastructure maintenance procedures for BEXUS OS.</p>
      <h2>Weekly Maintenance</h2>
      <ul data-type="taskList">
        <li data-checked="true">Check disk usage on all nodes</li>
        <li data-checked="false">Rotate staging credentials</li>
        <li data-checked="false">Verify backup integrity</li>
      </ul>
      <pre><code># Check cluster health
kubectl get nodes
kubectl get pods -A</code></pre>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[500px] p-12',
      },
      handleKeyDown: (view, event) => {
        if (event.key === '/') {
          const { selection } = view.state;
          const coords = view.coordsAtPos(selection.from);
          setMenuPos({ top: coords.bottom + 10, left: coords.left });
          setShowSlashMenu(true);
        } else if (event.key === 'Escape') {
          setShowSlashMenu(false);
        }
        return false;
      },
    },
  });

  const insertCommand = (command: string) => {
    if (!editor) return;
    
    // Remove the '/' character
    const { from } = editor.state.selection;
    editor.commands.deleteRange({ from: from - 1, to: from });

    switch (command) {
      case 'h1': editor.chain().focus().toggleHeading({ level: 1 }).run(); break;
      case 'h2': editor.chain().focus().toggleHeading({ level: 2 }).run(); break;
      case 'code': editor.chain().focus().toggleCodeBlock().run(); break;
      case 'todo': editor.chain().focus().toggleBulletList().run(); break; // Simplified for demo
      case 'metric': 
        editor.chain().focus().insertContent(`
          <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl my-4 flex items-center gap-4 not-prose">
            <div class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div>
              <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest m-0">Live CPU Gauge</p>
              <p class="text-xl font-bold text-emerald-900 m-0">42.8%</p>
            </div>
          </div>
        `).run(); 
        break;
      case 'container':
        editor.chain().focus().insertContent(`
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold uppercase text-slate-600 my-2 not-prose">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            nginx-gateway:up
          </div>
        `).run();
        break;
    }
    setShowSlashMenu(false);
  };

  return (
    <div className="h-full flex">
      {/* Wiki Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Runbooks & Wiki</h2>
            <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-primary border border-slate-200">
              <Plus size={14} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search docs..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="space-y-1">
            {INITIAL_DOCS.map((doc) => (
              <FileTreeItem key={doc.id} node={doc} level={0} activeId={activeDocId} onSelect={setActiveDocId} />
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>32 Documents</span>
            <span className="text-primary">8.4 MB</span>
          </div>
        </div>
      </aside>

      {/* Editor Area */}
      <div className="flex-1 bg-white overflow-y-auto custom-scrollbar relative">
        <div className="max-w-4xl mx-auto min-h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-12 border-b border-slate-50 shrink-0">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Folder size={12} />
              Deployment Guides
              <ChevronRight size={10} />
              <span className="text-slate-900">Infrastructure Runbook</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><Share2 size={18} /></button>
              <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><MoreVertical size={18} /></button>
            </div>
          </div>
          
          <EditorContent editor={editor} />
        </div>

        {/* Slash Menu */}
        <AnimatePresence>
          {showSlashMenu && (
            <>
              <div className="fixed inset-0 z-[80]" onClick={() => setShowSlashMenu(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                style={{ top: menuPos.top, left: menuPos.left }}
                className="fixed z-[90] w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 overflow-hidden"
              >
                <div className="px-3 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                  Basic Elements
                </div>
                <div className="space-y-0.5">
                  <button onClick={() => insertCommand('h1')} className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all group text-left">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Heading1 size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Heading 1</p>
                      <p className="text-[10px] text-slate-400">Large section title</p>
                    </div>
                  </button>
                  <button onClick={() => insertCommand('h2')} className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all group text-left">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Heading2 size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Heading 2</p>
                      <p className="text-[10px] text-slate-400">Medium section title</p>
                    </div>
                  </button>
                  <button onClick={() => insertCommand('code')} className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all group text-left">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Code size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Code Block</p>
                      <p className="text-[10px] text-slate-400">Syntax highlighted code</p>
                    </div>
                  </button>
                </div>

                <div className="px-3 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mt-2 mb-1">
                  Nexus Elements
                </div>
                <div className="space-y-0.5">
                  <button onClick={() => insertCommand('metric')} className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all group text-left">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <Activity size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Live Metric</p>
                      <p className="text-[10px] text-slate-400">Embed a CPU/RAM gauge</p>
                    </div>
                  </button>
                  <button onClick={() => insertCommand('container')} className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all group text-left">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Box size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Container Status</p>
                      <p className="text-[10px] text-slate-400">Embed a live status pill</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

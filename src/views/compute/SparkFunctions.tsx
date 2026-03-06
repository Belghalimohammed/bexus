import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Zap, 
  FileCode, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  Plus, 
  Search, 
  Play, 
  Rocket, 
  Globe, 
  Copy, 
  Terminal, 
  Settings, 
  Database, 
  Cpu, 
  Activity, 
  Trash2, 
  MoreVertical,
  Code,
  Package,
  Hash,
  CheckCircle2,
  X,
  Send,
  Sparkles,
  ShieldAlert,
  Zap as ZapIcon,
  MessageSquareCode,
  ShieldCheck,
  BrainCircuit,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface FunctionFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FunctionFile[];
  code?: string;
  isOpen?: boolean;
}

const INITIAL_FILES: FunctionFile[] = [
  {
    id: '1',
    name: 'Auth',
    type: 'folder',
    isOpen: true,
    children: [
      { id: '1-1', name: 'validate-token.ts', type: 'file', code: `export default async function (req, res) {\n  const token = req.headers.authorization;\n  if (!token) return res.status(401).json({ error: 'Unauthorized' });\n  \n  return res.json({ valid: true, user: 'admin' });\n}` },
      { id: '1-2', name: 'login-proxy.js', type: 'file', code: `module.exports = async (req, res) => {\n  console.log('Logging in...');\n  return res.send('OK');\n}` },
    ]
  },
  { id: '2', name: 'process-image.ts', type: 'file', code: `import sharp from 'sharp';\n\nexport default async function (req, res) {\n  // Image processing logic\n  return res.json({ status: 'processed' });\n}` },
  { id: '3', name: 'webhook-receiver.js', type: 'file', code: `module.exports = (req, res) => {\n  console.log('Webhook received:', req.body);\n  res.status(200).end();\n}` },
];

const FileTreeItem: React.FC<{ 
  node: FunctionFile; 
  level: number; 
  activeId: string; 
  onSelect: (node: FunctionFile) => void 
}> = ({ node, level, activeId, onSelect }) => {
  const [isOpen, setIsOpen] = useState(node.isOpen || false);
  const isFolder = node.type === 'folder';
  const isActive = activeId === node.id;

  return (
    <div className="select-none">
      <div
        onClick={() => {
          if (isFolder) setIsOpen(!isOpen);
          else onSelect(node);
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
            <FileCode size={14} className={isActive ? 'text-primary' : 'text-slate-400'} />
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

export const SparkFunctions: React.FC = () => {
  const [activeFile, setActiveFile] = useState<FunctionFile>(INITIAL_FILES[0].children![0]);
  const [code, setCode] = useState(activeFile.code || '');
  const [ghostText, setGhostText] = useState('');
  const [activeTab, setActiveTab] = useState<'editor' | 'env' | 'npm' | 'middleware'>('editor');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [testPayload, setTestPayload] = useState('{\n  "name": "Nexus User",\n  "action": "test"\n}');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSemanticRoutingEnabled, setIsSemanticRoutingEnabled] = useState(false);

  useEffect(() => {
    if (activeFile.code) setCode(activeFile.code);
    setGhostText('');
  }, [activeFile]);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Write a serverless function in ${activeFile.name.endsWith('.ts') ? 'TypeScript' : 'JavaScript'} based on this request: ${aiPrompt}. Return ONLY the code, no markdown blocks.`,
      });
      const generatedCode = response.text || '';
      setCode(generatedCode);
      setAiPrompt('');
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleGenerateTestCases = async () => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on this serverless function code:\n\n${code}\n\nGenerate 3 JSON test payloads: 1. Happy Path, 2. Malformed Data, 3. Injection Attack. Return ONLY a JSON object with keys "happy", "malformed", "attack".`,
        config: { responseMimeType: "application/json" }
      });
      const cases = JSON.parse(response.text || '{}');
      setTestPayload(JSON.stringify(cases.happy, null, 2));
      setTestResult(`AI Generated 3 test cases. Currently showing: Happy Path.\n\nOther cases available:\n\nMalformed: ${JSON.stringify(cases.malformed)}\n\nAttack: ${JSON.stringify(cases.attack)}`);
    } catch (error) {
      console.error("Test generation failed:", error);
    }
  };

  const handleAiAction = async (action: 'optimize' | 'comments' | 'security') => {
    const prompts = {
      optimize: "Optimize this code for performance and readability.",
      comments: "Add helpful JSDoc comments to this code.",
      security: "Find and fix any security flaws in this code."
    };
    
    setIsAiGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `${prompts[action]}\n\nCode:\n${code}\n\nReturn ONLY the improved code, no markdown.`,
      });
      setCode(response.text || code);
    } catch (error) {
      console.error("AI Action failed:", error);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setDeployUrl(null);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployUrl(`https://spark.nexus.os/v1/fn/${activeFile.name.split('.')[0]}`);
    }, 2000);
  };

  const handleTest = () => {
    setTestResult('Running test...');
    setTimeout(() => {
      setTestResult(JSON.stringify({
        status: 200,
        data: {
          message: "Function executed successfully",
          timestamp: new Date().toISOString(),
          received: JSON.parse(testPayload)
        }
      }, null, 2));
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0 z-10">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <Zap size={20} className="fill-current" />
          </div>
          <div>
            <h1 className="font-serif italic text-xl tracking-tight text-slate-900">The Spark</h1>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1 font-bold">Serverless Compute Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {deployUrl && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600"
            >
              <Globe size={14} />
              <span className="text-[10px] font-mono font-bold truncate max-w-[200px]">{deployUrl}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(deployUrl)}
                className="p-1 hover:bg-emerald-100 rounded transition-colors"
              >
                <Copy size={12} />
              </button>
            </motion.div>
          )}
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold uppercase transition-all shadow-lg ${
              isDeploying 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'
            }`}
          >
            {isDeploying ? <Activity size={14} className="animate-spin" /> : <Rocket size={14} />}
            {isDeploying ? 'Deploying...' : 'Deploy Function'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Functions</h2>
              <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-primary border border-slate-200">
                <Plus size={14} />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            <div className="space-y-1">
              {INITIAL_FILES.map((doc) => (
                <FileTreeItem 
                  key={doc.id} 
                  node={doc} 
                  level={0} 
                  activeId={activeFile.id} 
                  onSelect={setActiveFile} 
                />
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>8 Functions</span>
              <span className="text-emerald-500">All Healthy</span>
            </div>
          </div>
        </aside>

        {/* Editor Area */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Tabs */}
          <div className="h-12 border-b border-slate-200 flex items-center px-6 bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
                  activeTab === 'editor' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Code size={12} />
                Editor
              </button>
              <button
                onClick={() => setActiveTab('env')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
                  activeTab === 'env' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Hash size={12} />
                Env Variables
              </button>
              <button
                onClick={() => setActiveTab('npm')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
                  activeTab === 'npm' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Package size={12} />
                NPM Packages
              </button>
              <button
                onClick={() => setActiveTab('middleware')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
                  activeTab === 'middleware' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <BrainCircuit size={12} />
                Middleware
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* AI Prompt Header */}
            <div className="px-6 py-4 bg-white border-b border-slate-100 shrink-0">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
                <div className="relative flex items-center gap-3 bg-white border border-indigo-500/30 rounded-2xl px-4 py-2 shadow-sm">
                  <Bot size={18} className="text-indigo-600" />
                  <input 
                    type="text" 
                    placeholder="Nexus AI Developer: Describe the function you want to build..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400"
                  />
                  <button 
                    onClick={handleAiGenerate}
                    disabled={isAiGenerating}
                    className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                {activeTab === 'editor' && (
                  <motion.div
                    key="editor"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <div className="absolute inset-0">
                      <Editor
                        height="100%"
                        defaultLanguage="typescript"
                        value={code}
                        onMount={(editor, monaco) => {
                          editor.onKeyDown((e) => {
                            if (e.keyCode === monaco.KeyCode.Tab && ghostText) {
                              e.preventDefault();
                              e.stopPropagation();
                              const position = editor.getPosition();
                              if (position) {
                                editor.executeEdits('ai-ghost-text', [{
                                  range: {
                                    startLineNumber: position.lineNumber,
                                    startColumn: position.column,
                                    endLineNumber: position.lineNumber,
                                    endColumn: position.column
                                  },
                                  text: '\n  ' + ghostText.replace('// AI Suggestion: ', ''),
                                  forceMoveMarkers: true
                                }]);
                              }
                              setGhostText('');
                            }
                          });
                        }}
                        onChange={(v) => {
                          setCode(v || '');
                          // Simulate Ghost Text
                          if (v && v.length > code.length && v.endsWith('\n')) {
                            setGhostText('// AI Suggestion: Add error handling here...');
                          } else {
                            setGhostText('');
                          }
                        }}
                        theme="light"
                        options={{
                          minimap: { enabled: false },
                          fontSize: 13,
                          fontFamily: 'JetBrains Mono',
                          padding: { top: 20 },
                          scrollBeyondLastLine: false,
                          lineNumbers: 'on',
                          roundedSelection: false,
                          readOnly: false,
                          cursorStyle: 'line',
                          automaticLayout: true,
                          inlineSuggest: {
                            enabled: true
                          }
                        }}
                      />
                      
                      {/* AI Action Bar */}
                      <div className="absolute top-4 right-8 flex items-center gap-2 p-1 bg-white/80 backdrop-blur border border-slate-200 rounded-xl shadow-xl z-10">
                        <button 
                          onClick={() => handleAiAction('optimize')}
                          className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-indigo-50 rounded-lg text-[10px] font-bold text-slate-600 hover:text-indigo-600 transition-all"
                        >
                          <ZapIcon size={12} />
                          Optimize
                        </button>
                        <div className="w-px h-4 bg-slate-200" />
                        <button 
                          onClick={() => handleAiAction('comments')}
                          className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-indigo-50 rounded-lg text-[10px] font-bold text-slate-600 hover:text-indigo-600 transition-all"
                        >
                          <MessageSquareCode size={12} />
                          Comments
                        </button>
                        <div className="w-px h-4 bg-slate-200" />
                        <button 
                          onClick={() => handleAiAction('security')}
                          className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-rose-50 rounded-lg text-[10px] font-bold text-slate-600 hover:text-rose-600 transition-all"
                        >
                          <ShieldCheck size={12} />
                          Security
                        </button>
                      </div>

                      {/* Ghost Text Simulation Overlay */}
                      {ghostText && (
                        <div className="absolute top-[20px] left-[60px] pointer-events-none text-slate-400 font-mono text-[13px] opacity-50">
                          {ghostText}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'env' && (
                  <motion.div
                    key="env"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 p-8 space-y-4 overflow-y-auto custom-scrollbar"
                  >
                    <h3 className="text-sm font-bold text-slate-900">Environment Variables</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'DATABASE_URL', value: 'postgresql://nexus:***@db-prod:5432/main' },
                        { key: 'API_SECRET', value: 'sk_live_****************' },
                      ].map((env, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <input 
                            type="text" 
                            value={env.key} 
                            readOnly
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono font-bold text-slate-600"
                          />
                          <input 
                            type="text" 
                            value={env.value} 
                            readOnly
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono text-slate-400"
                          />
                          <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      ))}
                      <button className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-4">
                        <Plus size={14} />
                        Add Variable
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'npm' && (
                  <motion.div
                    key="npm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 p-8 space-y-6 overflow-y-auto custom-scrollbar"
                  >
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-slate-900">NPM Packages</h3>
                      <p className="text-xs text-slate-400">Add dependencies to your function bundle.</p>
                    </div>
                    
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search packages (e.g. lodash, axios)..." 
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {['sharp', 'axios', 'lodash', 'jsonwebtoken'].map(pkg => (
                        <div key={pkg} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-bold text-indigo-600">
                          {pkg}
                          <button className="hover:text-indigo-800"><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'middleware' && (
                  <motion.div
                    key="middleware"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 p-8 space-y-8 overflow-y-auto custom-scrollbar"
                  >
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-slate-900">Middleware Configuration</h3>
                      <p className="text-xs text-slate-400">Configure AI-driven request processing and routing.</p>
                    </div>

                    <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                            <BrainCircuit size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">Enable AI Semantic Routing</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Route by intent, not path</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsSemanticRoutingEnabled(!isSemanticRoutingEnabled)}
                          className={`w-12 h-6 rounded-full transition-all relative ${isSemanticRoutingEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isSemanticRoutingEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>

                      {isSemanticRoutingEnabled && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4 pt-4 border-t border-indigo-100"
                        >
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Routing Logic</label>
                            <div className="p-4 bg-white border border-indigo-100 rounded-xl space-y-3">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-600 font-medium">If intent is <span className="text-indigo-600 font-bold">"Angry Customer"</span></span>
                                <ChevronRight size={14} className="text-slate-300" />
                                <span className="text-slate-600 font-medium">Route to <span className="text-indigo-600 font-bold">slack-webhook.js</span></span>
                              </div>
                              <div className="h-px bg-slate-50" />
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-600 font-medium">If intent is <span className="text-indigo-600 font-bold">"Feature Request"</span></span>
                                <ChevronRight size={14} className="text-slate-300" />
                                <span className="text-slate-600 font-medium">Route to <span className="text-indigo-600 font-bold">jira-sync.ts</span></span>
                              </div>
                            </div>
                          </div>
                          <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                            <Plus size={14} />
                            Add Semantic Rule
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Test Console */}
            <div className="h-72 border-t border-slate-200 flex flex-col bg-slate-50/50 shrink-0">
              <div className="h-10 border-b border-slate-200 flex items-center justify-between px-6 bg-white">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Test Console</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleGenerateTestCases}
                    className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
                  >
                    <Sparkles size={12} />
                    Generate Edge Cases (AI)
                  </button>
                  <div className="w-px h-4 bg-slate-200" />
                  <button 
                    onClick={handleTest}
                    className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
                  >
                    <Play size={12} className="fill-current" />
                    Run Test
                  </button>
                </div>
              </div>
              <div className="flex-1 flex overflow-hidden">
                <div className="w-1/2 border-r border-slate-200 flex flex-col">
                  <div className="px-6 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Payload (JSON)</div>
                  <div className="flex-1 p-4">
                    <textarea 
                      value={testPayload}
                      onChange={e => setTestPayload(e.target.value)}
                      className="w-full h-full bg-white border border-slate-200 rounded-xl p-4 text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
                    />
                  </div>
                </div>
                <div className="w-1/2 flex flex-col">
                  <div className="px-6 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Output</div>
                  <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                    {testResult ? (
                      <pre className="text-[11px] font-mono text-slate-600 bg-white border border-slate-200 rounded-xl p-4 whitespace-pre-wrap">
                        {testResult}
                      </pre>
                    ) : (
                      <div className="h-full flex items-center justify-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        No output yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

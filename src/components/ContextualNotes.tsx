import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, User, Clock, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  url: string;
}

export const ContextualNotes: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      author: 'Mohammed',
      content: 'Hey @Sarah, I updated the SSL certs for this domain, monitor the logs for any handshake errors.',
      timestamp: '2 hours ago',
      url: window.location.pathname,
    },
    {
      id: '2',
      author: 'Sarah',
      content: 'On it! Metrics look stable so far.',
      timestamp: '1 hour ago',
      url: window.location.pathname,
    }
  ]);
  const [newNote, setNewNote] = useState('');

  const currentPath = window.location.pathname;
  const filteredNotes = notes.filter(n => n.url === currentPath);

  const addNote = () => {
    if (!newNote.trim()) return;
    const note: Note = {
      id: Math.random().toString(36).substr(2, 9),
      author: 'Admin',
      content: newNote,
      timestamp: 'Just now',
      url: currentPath,
    };
    setNotes([...notes, note]);
    setNewNote('');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 group"
        title="Contextual Notes"
      >
        <MessageSquare size={24} />
        {filteredNotes.length > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {filteredNotes.length}
          </span>
        )}
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-[70] flex flex-col border-l border-slate-200"
            >
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare size={18} className="text-primary" />
                    Contextual Notes
                  </h2>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">
                    Pinned to: <span className="text-primary">{currentPath}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {filteredNotes.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                      <Hash size={32} />
                    </div>
                    <p className="text-sm font-medium text-slate-500">No notes for this page yet.<br/>Be the first to leave one!</p>
                  </div>
                ) : (
                  filteredNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 shadow-sm relative group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-[10px] font-bold text-yellow-800">
                            {note.author[0]}
                          </div>
                          <span className="text-xs font-bold text-yellow-900">{note.author}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-yellow-600/60 font-medium">
                          <Clock size={10} />
                          {note.timestamp}
                        </div>
                      </div>
                      <p className="text-sm text-yellow-900/80 leading-relaxed">
                        {note.content.split(/(@\w+)/).map((part, i) => 
                          part.startsWith('@') ? (
                            <span key={i} className="font-bold text-primary underline decoration-primary/30 cursor-pointer">{part}</span>
                          ) : part
                        )}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-slate-200 bg-slate-50/50">
                <div className="relative">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Type a note... use @ to tag teammates"
                    className="w-full bg-white border border-slate-200 rounded-2xl p-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[100px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        addNote();
                      }
                    }}
                  />
                  <button
                    onClick={addNote}
                    disabled={!newNote.trim()}
                    className="absolute bottom-4 right-4 p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

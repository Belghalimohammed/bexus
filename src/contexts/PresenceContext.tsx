import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface UserPresence {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  location: string; // e.g., 'file-explorer', 'db-spreadsheet', 'canvas'
  activeFile?: string;
  selection?: { start: number; end: number };
}

interface PresenceContextType {
  users: UserPresence[];
  currentUser: UserPresence;
  updateLocation: (location: string, activeFile?: string) => void;
  updateSelection: (selection: { start: number; end: number }) => void;
}

const PresenceContext = createContext<PresenceContextType | undefined>(undefined);

const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const PresenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser] = useState<UserPresence>({
    id: 'user-1',
    name: 'Admin (You)',
    color: '#10b981',
    x: 0,
    y: 0,
    location: 'dashboard'
  });

  const [users, setUsers] = useState<UserPresence[]>([
    { id: 'user-2', name: 'Alex - DevOps', color: '#ec4899', x: 200, y: 300, location: 'file-explorer', activeFile: '.env' },
    { id: 'user-3', name: 'Sarah - SecOps', color: '#8b5cf6', x: 500, y: 150, location: 'db-spreadsheet' },
    { id: 'user-4', name: 'Mike - Architect', color: '#3b82f6', x: 800, y: 600, location: 'canvas' },
  ]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // In a real app, we'd emit this to a socket
    };

    // Simulate other users moving
    const interval = setInterval(() => {
      setUsers(prev => prev.map(u => ({
        ...u,
        x: u.x + (Math.random() * 10 - 5),
        y: u.y + (Math.random() * 10 - 5),
      })));
    }, 100);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const updateLocation = useCallback((location: string, activeFile?: string) => {
    // Update local state and emit
  }, []);

  const updateSelection = useCallback((selection: { start: number; end: number }) => {
    // Update local state and emit
  }, []);

  return (
    <PresenceContext.Provider value={{ users, currentUser, updateLocation, updateSelection }}>
      {children}
    </PresenceContext.Provider>
  );
};

export const usePresence = () => {
  const context = useContext(PresenceContext);
  if (!context) throw new Error('usePresence must be used within PresenceProvider');
  return context;
};

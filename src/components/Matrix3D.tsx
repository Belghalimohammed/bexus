import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, ZoomIn, ZoomOut, RefreshCcw, Box, Cpu, Database, Server } from 'lucide-react';

interface Node3D {
  id: string;
  name: string;
  type: 'server' | 'database' | 'gateway';
  x: number;
  y: number;
  z: number;
  cpu: number;
  ram: number;
  containers: { id: string; color: string; name: string }[];
}

export const Matrix3D: React.FC = () => {
  const [rotation, setRotation] = useState(45);
  const [zoom, setZoom] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<Node3D | null>(null);

  const nodes: Node3D[] = useMemo(() => [
    { 
      id: 'n1', name: 'Nexus-Alpha', type: 'server', x: -150, y: -150, z: 0, cpu: 42, ram: 68,
      containers: [
        { id: 'c1', color: 'bg-cyan-400', name: 'api-gateway' },
        { id: 'c2', color: 'bg-magenta-400', name: 'auth-svc' }
      ]
    },
    { 
      id: 'n2', name: 'Nexus-Beta', type: 'database', x: 150, y: -150, z: 0, cpu: 12, ram: 85,
      containers: [
        { id: 'c3', color: 'bg-emerald-400', name: 'postgres-db' }
      ]
    },
    { 
      id: 'n3', name: 'Nexus-Gamma', type: 'gateway', x: 0, y: 150, z: 0, cpu: 25, ram: 30,
      containers: [
        { id: 'c4', color: 'bg-amber-400', name: 'redis-cache' },
        { id: 'c5', color: 'bg-indigo-400', name: 'worker-node' }
      ]
    }
  ], []);

  const connections = [
    { from: 'n1', to: 'n2', color: 'cyan' },
    { from: 'n1', to: 'n3', color: 'magenta' },
    { from: 'n2', to: 'n3', color: 'cyan' }
  ];

  const resetView = () => {
    setRotation(45);
    setZoom(1);
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden perspective-[2000px]">
      {/* Glowing Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1e293b 1px, transparent 1px),
            linear-gradient(to bottom, #1e293b 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          transform: `rotateX(60deg) rotateZ(${rotation}deg) scale(${zoom})`,
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />

      {/* 3D Scene Container */}
      <div 
        className="absolute inset-0 flex items-center justify-center preserve-3d"
        style={{
          transform: `rotateX(60deg) rotateZ(${rotation}deg) scale(${zoom})`,
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Connections (Laser Lines) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {connections.map((conn, i) => {
            const fromNode = nodes.find(n => n.id === conn.from)!;
            const toNode = nodes.find(n => n.id === conn.to)!;
            return (
              <motion.line
                key={i}
                x1={fromNode.x + 500} // Offset for center
                y1={fromNode.y + 500}
                x2={toNode.x + 500}
                y2={toNode.y + 500}
                stroke={conn.color === 'cyan' ? '#22d3ee' : '#e879f9'}
                strokeWidth="2"
                strokeDasharray="10 10"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -100 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
              />
            );
          })}
        </svg>

        {/* Nodes (Cubes) */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute preserve-3d cursor-pointer group"
            style={{
              transform: `translate3d(${node.x}px, ${node.y}px, ${node.z}px)`,
            }}
            onMouseEnter={() => setHoveredNode(node)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Server Cube */}
            <div className="relative w-32 h-32 preserve-3d">
              {/* Cube Faces */}
              <div className="absolute inset-0 bg-slate-800/50 backdrop-blur-md border border-white/10 translate-z-[16px]" />
              <div className="absolute inset-0 bg-slate-800/40 backdrop-blur-md border border-white/10 -translate-z-[16px]" />
              <div className="absolute inset-0 bg-slate-800/30 backdrop-blur-md border border-white/10 origin-left rotate-y-90 -translate-x-[16px]" />
              <div className="absolute inset-0 bg-slate-800/30 backdrop-blur-md border border-white/10 origin-right -rotate-y-90 translate-x-[16px]" />
              <div className="absolute inset-0 bg-slate-800/60 backdrop-blur-md border border-white/10 origin-top -rotate-x-90 -translate-y-[16px]" />
              <div className="absolute inset-0 bg-slate-800/20 backdrop-blur-md border border-white/10 origin-bottom rotate-x-90 translate-y-[16px]" />
              
              {/* Node Label (on top face) */}
              <div className="absolute inset-0 flex items-center justify-center -rotate-x-90 translate-y-[-16px] pointer-events-none">
                <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">{node.name}</span>
              </div>
            </div>

            {/* Container Blocks (Stacked) */}
            <div className="absolute top-0 left-0 w-32 h-32 preserve-3d translate-z-[48px]">
              {node.containers.map((container, idx) => (
                <div 
                  key={container.id}
                  className={`absolute left-4 top-4 w-24 h-24 preserve-3d transition-transform duration-500 group-hover:translate-z-[20px]`}
                  style={{ transform: `translateZ(${idx * 30}px)` }}
                >
                  <div className={`absolute inset-0 ${container.color} opacity-60 border border-white/20 translate-z-[12px]`} />
                  <div className={`absolute inset-0 ${container.color} opacity-40 border border-white/20 -translate-z-[12px]`} />
                  <div className={`absolute inset-0 ${container.color} opacity-30 border border-white/20 origin-left rotate-y-90 -translate-x-[12px]`} />
                  <div className={`absolute inset-0 ${container.color} opacity-30 border border-white/20 origin-right -rotate-y-90 translate-x-[12px]`} />
                  <div className={`absolute inset-0 ${container.color} opacity-50 border border-white/20 origin-top -rotate-x-90 -translate-y-[12px]`} />
                  <div className={`absolute inset-0 ${container.color} opacity-20 border border-white/20 origin-bottom rotate-x-90 translate-y-[12px]`} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip (2D Overlay) */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 pointer-events-none bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[200px]"
            style={{
              left: '50%',
              top: '40%',
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {hoveredNode.type === 'server' ? <Server size={16} /> : hoveredNode.type === 'database' ? <Database size={16} /> : <Box size={16} />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{hoveredNode.name}</h3>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{hoveredNode.type}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-white/40 uppercase">CPU Usage</span>
                  <span className="text-primary">{hoveredNode.cpu}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${hoveredNode.cpu}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-white/40 uppercase">RAM Usage</span>
                  <span className="text-emerald-400">{hoveredNode.ram}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${hoveredNode.ram}%` }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Controls */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-4 bg-slate-900/50 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setRotation(prev => prev + 45)}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
            title="Rotate View"
          >
            <RotateCw size={20} />
          </button>
          <button 
            onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <button 
            onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          <div className="h-px bg-white/10 my-1" />
          <button 
            onClick={resetView}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
            title="Reset View"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-2000 { perspective: 2000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .translate-z-16 { transform: translateZ(16px); }
        .-translate-z-16 { transform: translateZ(-16px); }
        .rotate-y-90 { transform: rotateY(90deg); }
        .-rotate-y-90 { transform: rotateY(-90deg); }
        .rotate-x-90 { transform: rotateX(90deg); }
        .-rotate-x-90 { transform: rotateX(-90deg); }
        .translate-z-48 { transform: translateZ(48px); }
        .translate-z-12 { transform: translateZ(12px); }
        .-translate-z-12 { transform: translateZ(-12px); }
        .translate-z-20 { transform: translateZ(20px); }
      `}} />
    </div>
  );
};

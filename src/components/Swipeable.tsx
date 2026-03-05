import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Square, RotateCcw } from 'lucide-react';

interface SwipeableProps {
  children: React.ReactNode;
  onLeftSwipe: () => void;
  onRightSwipe: () => void;
  leftLabel?: string;
  rightLabel?: string;
}

export const Swipeable: React.FC<SwipeableProps> = ({ 
  children, 
  onLeftSwipe, 
  onRightSwipe,
  leftLabel = "Stop",
  rightLabel = "Restart"
}) => {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ["#ef4444", "transparent", "#3b82f6"]
  );
  const opacityLeft = useTransform(x, [-100, -50], [1, 0]);
  const opacityRight = useTransform(x, [50, 100], [0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -100) {
      onLeftSwipe();
    } else if (info.offset.x > 100) {
      onRightSwipe();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Background Actions */}
      <motion.div 
        style={{ background }}
        className="absolute inset-0 flex items-center justify-between px-6 z-0"
      >
        <motion.div style={{ opacity: opacityRight }} className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest">
          <RotateCcw size={16} />
          {rightLabel}
        </motion.div>
        <motion.div style={{ opacity: opacityLeft }} className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest">
          {leftLabel}
          <Square size={16} fill="currentColor" />
        </motion.div>
      </motion.div>

      {/* Foreground Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        style={{ x }}
        onDragEnd={handleDragEnd}
        className="relative z-10 bg-white"
      >
        {children}
      </motion.div>
    </div>
  );
};

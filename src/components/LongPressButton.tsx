import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LongPressButtonProps {
  onConfirm: () => void;
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export const LongPressButton: React.FC<LongPressButtonProps> = ({ 
  onConfirm, 
  children, 
  className = "", 
  duration = 3000 
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  const startPress = () => {
    setIsPressing(true);
    startTimeRef.current = Date.now();
    setProgress(0);
    
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(timerRef.current);
        onConfirm();
        setIsPressing(false);
        setProgress(0);
      }
    }, 50);
  };

  const endPress = () => {
    clearInterval(timerRef.current);
    setIsPressing(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <button
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      className={`relative overflow-hidden ${className}`}
    >
      <div className="relative z-10">{children}</div>
      {isPressing && (
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="absolute inset-0 bg-white/20 z-0"
          style={{ transition: 'width 0.05s linear' }}
        />
      )}
    </button>
  );
};

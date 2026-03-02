import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTour } from '../contexts/TourContext';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export const TourOverlay: React.FC = () => {
  const { isTourActive, currentStepIndex, steps, nextStep, prevStep, stopTour } = useTour();
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (!isTourActive) return;

    const updateSpotlight = () => {
      const element = document.getElementById(currentStep.targetId);
      if (element) {
        setSpotlightRect(element.getBoundingClientRect());
      }
    };

    // Small delay to allow for route navigation and layout shifts
    const timer = setTimeout(updateSpotlight, 300);
    window.addEventListener('resize', updateSpotlight);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateSpotlight);
    };
  }, [isTourActive, currentStepIndex, currentStep.targetId]);

  if (!isTourActive || !spotlightRect) return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
      {/* Backdrop with hole */}
      <motion.div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          clipPath: `polygon(
            0% 0%, 
            0% 100%, 
            ${spotlightRect.left}px 100%, 
            ${spotlightRect.left}px ${spotlightRect.top}px, 
            ${spotlightRect.right}px ${spotlightRect.top}px, 
            ${spotlightRect.right}px ${spotlightRect.bottom}px, 
            ${spotlightRect.left}px ${spotlightRect.bottom}px, 
            ${spotlightRect.left}px 100%, 
            100% 100%, 
            100% 0%
          )`
        }}
      />

      {/* Glowing Ring */}
      <motion.div 
        className="absolute border-2 border-primary rounded-lg shadow-[0_0_20px_var(--primary)]"
        initial={false}
        animate={{
          top: spotlightRect.top - 4,
          left: spotlightRect.left - 4,
          width: spotlightRect.width + 8,
          height: spotlightRect.height + 8,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      />

      {/* Popover Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            top: spotlightRect.top + spotlightRect.height / 2,
            left: spotlightRect.right + 24
          }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="absolute w-80 bg-white rounded-2xl shadow-2xl p-6 pointer-events-auto -translate-y-1/2"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <button 
              onClick={stopTour}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">{currentStep.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {currentStep.content}
          </p>

          <div className="flex items-center justify-between">
            <button 
              onClick={stopTour}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest"
            >
              Skip Tour
            </button>
            <div className="flex gap-2">
              <button 
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-xs uppercase shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
              >
                {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                {currentStepIndex < steps.length - 1 && <ChevronRight size={16} />}
              </button>
            </div>
          </div>

          {/* Arrow */}
          <div className="absolute top-1/2 -left-2 w-4 h-4 bg-white rotate-45 -translate-y-1/2 shadow-[-4px_4px_8px_rgba(0,0,0,0.05)]" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface TourStep {
  id: string;
  targetId: string; // The HTML ID of the element to spotlight
  title: string;
  content: string;
  route: string; // The route to navigate to for this step
}

interface TourContextType {
  isTourActive: boolean;
  currentStepIndex: number;
  steps: TourStep[];
  startTour: () => void;
  stopTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode; onNavigate: (route: string) => void }> = ({ children, onNavigate }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: TourStep[] = [
    {
      id: 'dashboard',
      targetId: 'nav-dashboard',
      title: 'Command Center',
      content: 'This is your central hub for all system operations. Monitor real-time vitals, recent activity, and quick actions from here.',
      route: 'dashboard'
    },
    {
      id: 'canvas',
      targetId: 'nav-canvas',
      title: 'The Infinity Canvas',
      content: 'Visualize your entire infrastructure in a zoomable, pannable 2D or 3D workspace. Drag and drop containers, monitor network flows, and manage nodes spatially.',
      route: 'canvas'
    },
    {
      id: 'orchestrator',
      targetId: 'nav-orchestrator',
      title: 'Orchestrator',
      content: 'Manage your container stacks and pods. Access live logs, interactive shells, and a smart file explorer for every container.',
      route: 'orchestrator'
    },
    {
      id: 'waf',
      targetId: 'nav-networking',
      title: 'Aegis WAF',
      content: 'Protect your applications with our Web Application Firewall. Monitor global threats in real-time and configure geo-blocking or rate limiting.',
      route: 'networking'
    },
    {
      id: 'forge',
      targetId: 'nav-gitops',
      title: 'Forge CI/CD',
      content: 'Automate your deployments with visual pipeline editing. Connect your repositories and watch your code transform into infrastructure.',
      route: 'gitops'
    },
    {
      id: 'hypervisor',
      targetId: 'nav-hypervisor',
      title: 'Hypervisor VM',
      content: 'Run full virtual machines alongside your containers. Allocate resources and access raw graphical desktops via our integrated noVNC console.',
      route: 'hypervisor'
    },
    {
      id: 'aidoctor',
      targetId: 'nav-aidoctor',
      title: 'AI Doctor',
      content: 'The brain of Nexus OS. Our AI behavioral analysis detects anomalies and suggests optimizations to keep your system healthy.',
      route: 'aidoctor'
    }
  ];

  const startTour = useCallback(() => {
    setIsTourActive(true);
    setCurrentStepIndex(0);
    onNavigate(steps[0].route);
  }, [onNavigate]);

  const stopTour = useCallback(() => {
    setIsTourActive(false);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onNavigate(steps[nextIndex].route);
    } else {
      stopTour();
    }
  }, [currentStepIndex, steps.length, onNavigate, stopTour]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onNavigate(steps[prevIndex].route);
    }
  }, [currentStepIndex, onNavigate]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
      onNavigate(steps[index].route);
    }
  }, [steps.length, onNavigate]);

  return (
    <TourContext.Provider value={{ isTourActive, currentStepIndex, steps, startTour, stopTour, nextStep, prevStep, goToStep }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) throw new Error('useTour must be used within TourProvider');
  return context;
};

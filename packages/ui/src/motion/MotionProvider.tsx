'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { shouldReduceAnimations } from './useGPUOptimization';
import { useAdaptiveQuality } from './usePerformanceMonitor';

type MotionPolicy = 'subtle' | 'standard' | 'expressive';
type MotionQuality = 'high' | 'medium' | 'low';

interface MotionSettings {
  policy: MotionPolicy;
  quality: MotionQuality;
  reducedMotion: boolean;
  autoAdjust: boolean;
  gpuAcceleration: boolean;
}

interface MotionContextValue extends MotionSettings {
  setPolicy: (policy: MotionPolicy) => void;
  setAutoAdjust: (enabled: boolean) => void;
  setGPUAcceleration: (enabled: boolean) => void;
  resetToDefaults: () => void;
}

const MotionContext = createContext<MotionContextValue | undefined>(undefined);

interface MotionProviderProps {
  children: React.ReactNode;
  defaultPolicy?: MotionPolicy;
  autoAdjust?: boolean;
}

/**
 * Global motion settings provider
 * Manages motion policy, quality, and performance optimizations
 */
export function MotionProvider({
  children,
  defaultPolicy = 'standard',
  autoAdjust = true,
}: MotionProviderProps) {
  const prefersReducedMotion = useReducedMotion();
  const { quality, shouldSimplify } = useAdaptiveQuality({ enabled: autoAdjust });

  const [settings, setSettings] = useState<MotionSettings>({
    policy: defaultPolicy,
    quality: 'high',
    reducedMotion: false,
    autoAdjust,
    gpuAcceleration: true,
  });

  // Check for reduced motion preference
  useEffect(() => {
    const shouldReduce = prefersReducedMotion || shouldReduceAnimations();

    setSettings((prev) => ({
      ...prev,
      reducedMotion: shouldReduce,
      policy: shouldReduce ? 'subtle' : prev.policy,
    }));

    // Update HTML data attribute
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute(
        'data-motion',
        shouldReduce ? 'subtle' : settings.policy
      );
    }
  }, [prefersReducedMotion, settings.policy]);

  // Auto-adjust quality based on performance
  useEffect(() => {
    if (!settings.autoAdjust) return;

    setSettings((prev) => ({
      ...prev,
      quality,
      policy: shouldSimplify ? 'subtle' : prev.policy,
    }));
  }, [quality, shouldSimplify, settings.autoAdjust]);

  // Apply motion policy to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-motion', settings.policy);

      // Store preference
      try {
        localStorage.setItem('motion-policy', settings.policy);
      } catch (error) {
        console.error('Failed to save motion policy to localStorage:', error);
      }
    }
  }, [settings.policy]);

  // Load saved preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedPolicy = localStorage.getItem('motion-policy');
        if (savedPolicy && ['subtle', 'standard', 'expressive'].includes(savedPolicy)) {
          setSettings((prev) => ({ ...prev, policy: savedPolicy as MotionPolicy }));
        }
      } catch (error) {
        console.error('Failed to load motion policy from localStorage:', error);
      }
    }
  }, []);

  const value: MotionContextValue = {
    ...settings,
    setPolicy: (policy) => {
      setSettings((prev) => ({ ...prev, policy }));
    },
    setAutoAdjust: (enabled) => {
      setSettings((prev) => ({ ...prev, autoAdjust: enabled }));
    },
    setGPUAcceleration: (enabled) => {
      setSettings((prev) => ({ ...prev, gpuAcceleration: enabled }));
    },
    resetToDefaults: () => {
      setSettings({
        policy: defaultPolicy,
        quality: 'high',
        reducedMotion: prefersReducedMotion,
        autoAdjust: true,
        gpuAcceleration: true,
      });

      try {
        localStorage.removeItem('motion-policy');
      } catch (error) {
        console.error('Failed to remove motion policy from localStorage:', error);
      }
    },
  };

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

/**
 * Hook to access motion settings
 */
export function useMotionSettings() {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error('useMotionSettings must be used within MotionProvider');
  }
  return context;
}

/**
 * Component for debugging motion settings
 */
export function MotionDebugPanel() {
  const settings = useMotionSettings();
  const [show, setShow] = useState(false);

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-4 right-4 p-2 bg-surface-raised rounded-lg shadow-lg text-xs z-50"
        aria-label="Show motion debug panel"
      >
        Motion Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-surface-raised rounded-lg shadow-lg text-xs z-50 min-w-[200px]">
      <button
        onClick={() => setShow(false)}
        className="absolute top-2 right-2 text-text-secondary hover:text-text"
        aria-label="Close debug panel"
      >
        ×
      </button>

      <h3 className="font-bold mb-2">Motion Settings</h3>

      <div className="space-y-1">
        <div>
          Policy: <span className="font-mono">{settings.policy}</span>
        </div>
        <div>
          Quality: <span className="font-mono">{settings.quality}</span>
        </div>
        <div>
          Reduced: <span className="font-mono">{settings.reducedMotion ? 'Yes' : 'No'}</span>
        </div>
        <div>
          Auto-adjust: <span className="font-mono">{settings.autoAdjust ? 'On' : 'Off'}</span>
        </div>
        <div>
          GPU: <span className="font-mono">{settings.gpuAcceleration ? 'On' : 'Off'}</span>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <button
          onClick={() => settings.setPolicy('subtle')}
          className="block w-full text-left px-2 py-1 hover:bg-surface-dim rounded"
        >
          Set Subtle
        </button>
        <button
          onClick={() => settings.setPolicy('standard')}
          className="block w-full text-left px-2 py-1 hover:bg-surface-dim rounded"
        >
          Set Standard
        </button>
        <button
          onClick={() => settings.setPolicy('expressive')}
          className="block w-full text-left px-2 py-1 hover:bg-surface-dim rounded"
        >
          Set Expressive
        </button>
        <button
          onClick={() => settings.resetToDefaults()}
          className="block w-full text-left px-2 py-1 hover:bg-surface-dim rounded text-error"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}

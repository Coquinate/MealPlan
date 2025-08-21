'use client';

import { useState, useCallback, useRef } from 'react';

interface FloatingElementsState {
  showParticles: boolean;
  isAnimating: boolean;
}

interface FloatingElementsActions {
  trigger: () => void;
  hide: () => void;
  reset: () => void;
}

export type FloatingElementsReturn = FloatingElementsState & FloatingElementsActions;

/**
 * Hook pentru gestionarea elementelor flotante și animațiilor
 * Controlează afișarea particulelor pe success și cleanup-ul animațiilor
 */
export function useFloatingElements(): FloatingElementsReturn {
  const [showParticles, setShowParticles] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const trigger = useCallback(() => {
    // Evită triggering multiple
    if (isAnimating) return;

    setIsAnimating(true);
    setShowParticles(true);

    // Cleanup timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Auto-hide după 3 secunde
    timeoutRef.current = setTimeout(() => {
      setShowParticles(false);
      setIsAnimating(false);
    }, 3000);
  }, [isAnimating]);

  const hide = useCallback(() => {
    setShowParticles(false);
    setIsAnimating(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    hide();
  }, [hide]);

  return {
    showParticles,
    isAnimating,
    trigger,
    hide,
    reset,
  };
}
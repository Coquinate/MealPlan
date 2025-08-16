'use client';

import { useEffect, useState } from 'react';

export type MotionPolicy = 'subtle' | 'standard' | 'expressive';

/**
 * Hook to read and update the motion policy
 * Controls animation intensity across the app
 */
export function useMotionPolicy() {
  const [policy, setPolicy] = useState<MotionPolicy>(() => {
    if (typeof document === 'undefined') return 'subtle';
    return (document.documentElement.getAttribute('data-motion') as MotionPolicy) || 'subtle';
  });

  useEffect(() => {
    // Update the DOM attribute when policy changes
    document.documentElement.setAttribute('data-motion', policy);
  }, [policy]);

  // Read policy from DOM on mount to sync with SSR
  useEffect(() => {
    const currentPolicy = document.documentElement.getAttribute('data-motion') as MotionPolicy;
    if (currentPolicy && currentPolicy !== policy) {
      setPolicy(currentPolicy);
    }
  }, []);

  return [policy, setPolicy] as const;
}

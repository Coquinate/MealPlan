'use client';

import React, { ReactNode } from 'react';
import { LazyMotion, domAnimation, domMax, m } from 'motion/react';

// Re-export the lazy motion component for use in other components
export { m } from 'motion/react';

/**
 * Motion Provider pentru basic animations și gestures
 * Bundle size: +15kb (animations, gestures, hover/focus)
 */
export const MotionProvider = ({ children }: { children: ReactNode }) => (
  <LazyMotion features={domAnimation} strict>
    {children}
  </LazyMotion>
);

/**
 * Motion Provider Max pentru advanced features
 * Bundle size: +25kb (toate features + drag + layout animations)  
 */
export const MotionProviderMax = ({ children }: { children: ReactNode }) => (
  <LazyMotion features={domMax} strict>
    {children}
  </LazyMotion>
);

/**
 * Motion configuration constants
 */
export const motionConfig = {
  // Standard durations în secunde
  duration: {
    instant: 0,
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
  },
  
  // Standard easing functions
  easing: {
    // Framer Motion v12 easing presets
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    spring: { type: 'spring', stiffness: 300, damping: 30 },
    smooth: { type: 'spring', stiffness: 100, damping: 20 },
    bouncy: { type: 'spring', stiffness: 400, damping: 10 },
  },
  
  // Stagger configurations
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15,
  },
} as const;


'use client';

import React from 'react';
import { useScroll, useSpring, useTransform } from 'motion/react';
import { m } from '../../../motion/config';

export function ScrollProgress() {
  // Use Framer Motion's useScroll for smooth tracking
  const { scrollYProgress } = useScroll();
  
  // Add spring physics for smoother animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Transform to percentage for aria-valuenow
  const progressPercentage = useTransform(scaleX, [0, 1], [0, 100]);
  
  return (
    <m.div 
      className="fixed top-0 left-0 w-full h-1 bg-border-light z-50"
      role="progressbar"
      aria-valuenow={Math.round(progressPercentage.get())}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progres citire pagină"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <m.div 
        className="h-full bg-gradient-primary origin-left"
        style={{ scaleX }}
      />
    </m.div>
  );
}
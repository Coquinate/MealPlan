'use client';

import React from 'react';
import { cn } from '../../utils/cn';
import { useReducedMotion } from '../../motion/useReducedMotion';

interface LogoBreathingProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  glowEffect?: boolean;
}

/**
 * Logo breathing animation wrapper
 * Adds subtle breathing effect to logos and brand elements
 */
export function LogoBreathing({
  children,
  className = '',
  animate = true,
  glowEffect = false,
}: LogoBreathingProps) {
  const prefersReducedMotion = useReducedMotion();

  const shouldAnimate = animate && !prefersReducedMotion;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        shouldAnimate && 'anim-logo-breathe',
        className
      )}
    >
      {children}

      {/* Optional glow effect */}
      {glowEffect && shouldAnimate && (
        <>
          {/* Inner glow */}
          <div
            className="absolute inset-0 rounded-full opacity-30 blur-md pointer-events-none"
            style={{
              background: 'radial-gradient(circle, var(--color-primary-warm) 0%, transparent 70%)',
              animation: 'pulse-glow 4s ease-in-out infinite',
            }}
          />

          {/* Outer glow */}
          <div
            className="absolute inset-[-20%] rounded-full opacity-20 blur-xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, var(--color-accent-coral) 0%, transparent 60%)',
              animation: 'pulse-glow 4s ease-in-out infinite',
              animationDelay: '2s',
            }}
          />
        </>
      )}
    </div>
  );
}

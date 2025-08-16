'use client';

import React from 'react';
import { cn } from '../../utils/cn';
import { useReducedMotion } from '../../motion/useReducedMotion';

interface LoadingDotsProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

/**
 * Animated loading dots with stagger effect
 * Used for loading states in buttons, forms, and content areas
 */
export function LoadingDots({
  className = '',
  size = 'md',
  color = 'currentColor',
}: LoadingDotsProps) {
  const prefersReducedMotion = useReducedMotion();

  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const dotClass = cn(
    'rounded-full',
    sizeClasses[size],
    !prefersReducedMotion && 'anim-loading-dot'
  );

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <span
        className={dotClass}
        style={{
          backgroundColor: color,
          animationDelay: '0ms',
        }}
      />
      <span
        className={dotClass}
        style={{
          backgroundColor: color,
          animationDelay: '150ms',
        }}
      />
      <span
        className={dotClass}
        style={{
          backgroundColor: color,
          animationDelay: '300ms',
        }}
      />
    </div>
  );
}

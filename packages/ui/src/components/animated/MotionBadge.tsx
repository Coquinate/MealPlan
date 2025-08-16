'use client';

import React from 'react';
import { cn } from '../../utils/cn';
import { useReducedMotion } from '../../motion/useReducedMotion';

interface MotionBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  animate?: boolean;
  pulse?: boolean;
  bounce?: boolean;
}

/**
 * Animated badge component with bounce and pulse effects
 * Used for status indicators, counts, and notifications
 */
export function MotionBadge({
  children,
  className = '',
  variant = 'default',
  animate = true,
  pulse = false,
  bounce = false,
}: MotionBadgeProps) {
  const prefersReducedMotion = useReducedMotion();

  const variantClasses = {
    default: 'bg-primary-warm text-inverse',
    success: 'bg-success text-inverse',
    warning: 'bg-warning text-inverse',
    error: 'bg-error text-inverse',
    info: 'bg-info text-inverse',
  };

  const animationClasses =
    !prefersReducedMotion && animate ? cn(pulse && 'anim-pulse', bounce && 'anim-bounce-in') : '';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full',
        variantClasses[variant],
        animationClasses,
        className
      )}
    >
      {children}
    </span>
  );
}

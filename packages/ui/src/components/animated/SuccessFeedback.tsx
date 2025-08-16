'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { useReducedMotion } from '../../motion/useReducedMotion';
import { SuccessCheck } from './SuccessCheck';

interface SuccessFeedbackProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
  duration?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Success feedback component with bounce animation
 * Shows success checkmark with optional message
 */
export function SuccessFeedback({
  show,
  message = 'Success!',
  onComplete,
  duration = 2000,
  className = '',
  size = 'md',
}: SuccessFeedbackProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const textSizeClasses = {
    sm: 'text-sm mt-2',
    md: 'text-base mt-3',
    lg: 'text-lg mt-4',
  };

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsAnimating(true);

      // Auto-hide after duration
      const hideTimer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setIsVisible(false);
          if (onComplete) {
            onComplete();
          }
        }, 300);
      }, duration);

      return () => clearTimeout(hideTimer);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [show, duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center z-[9999]',
        'pointer-events-none',
        className
      )}
    >
      <div
        className={cn(
          'bg-surface-raised rounded-xl shadow-2xl',
          'flex flex-col items-center justify-center',
          sizeClasses[size],
          isAnimating && !prefersReducedMotion ? 'anim-success-bounce opacity-100' : 'opacity-0',
          'transition-opacity duration-300'
        )}
      >
        <div className={!prefersReducedMotion ? 'anim-scale-in' : ''}>
          <SuccessCheck size={size} color="var(--color-success)" />
        </div>

        {message && (
          <p
            className={cn(
              'font-semibold text-text',
              textSizeClasses[size],
              !prefersReducedMotion && 'anim-fade-in'
            )}
            style={{ animationDelay: '200ms' }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

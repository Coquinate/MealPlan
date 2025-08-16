'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { LoadingDots } from '../animated/LoadingDots';
import { useReducedMotion } from '../../motion/useReducedMotion';

interface RouteLoaderProps {
  loading?: boolean;
  delay?: number;
  className?: string;
  fullScreen?: boolean;
  variant?: 'linear' | 'circular' | 'dots';
}

/**
 * Route loading indicator that appears during navigation
 * Can be used as a top bar, overlay, or inline loader
 */
export function RouteLoader({
  loading = false,
  delay = 300,
  className = '',
  fullScreen = false,
  variant = 'linear',
}: RouteLoaderProps) {
  const [showLoader, setShowLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    if (loading) {
      // Delay showing loader to avoid flash on fast loads
      timer = setTimeout(() => {
        setShowLoader(true);
        setProgress(20);

        // Simulate progress
        if (variant === 'linear') {
          let currentProgress = 20;
          progressTimer = setInterval(() => {
            currentProgress = Math.min(currentProgress + Math.random() * 10, 90);
            setProgress(currentProgress);
          }, 200);
        }
      }, delay);
    } else {
      // Complete and hide
      setProgress(100);
      setTimeout(() => {
        setShowLoader(false);
        setProgress(0);
      }, 300);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [loading, delay, variant]);

  if (!showLoader && !loading) return null;

  if (variant === 'linear') {
    return (
      <div
        className={cn('fixed top-0 left-0 right-0 z-[9999] h-1 bg-surface-dim/20', className)}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className={cn(
            'h-full bg-gradient-to-r from-primary-warm to-accent-coral',
            'transition-all duration-300 ease-out',
            prefersReducedMotion && 'transition-none'
          )}
          style={{ width: `${progress}%` }}
        />

        {/* Glow effect */}
        {!prefersReducedMotion && (
          <div
            className="absolute top-0 right-0 h-full w-32 bg-gradient-to-r from-transparent to-white/30 blur-lg"
            style={{
              transform: `translateX(${progress}%)`,
              marginLeft: '-128px',
            }}
          />
        )}
      </div>
    );
  }

  if (variant === 'circular') {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div
        className={cn(
          fullScreen
            ? 'fixed inset-0 flex items-center justify-center bg-surface/80 backdrop-blur-sm z-[9999]'
            : 'inline-flex items-center justify-center',
          className
        )}
      >
        <svg
          className="w-12 h-12 -rotate-90"
          viewBox="0 0 100 100"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            opacity="0.2"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn('transition-all duration-300', prefersReducedMotion && 'transition-none')}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary-warm)" />
              <stop offset="100%" stopColor="var(--color-accent-coral)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Dots variant
  return (
    <div
      className={cn(
        fullScreen
          ? 'fixed inset-0 flex items-center justify-center bg-surface/80 backdrop-blur-sm z-[9999]'
          : 'inline-flex items-center justify-center',
        className
      )}
    >
      <LoadingDots size="lg" />
    </div>
  );
}

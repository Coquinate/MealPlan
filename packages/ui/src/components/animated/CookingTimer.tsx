'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../../motion/useReducedMotion';
import { useMotionPolicy } from '../../motion/useMotionPolicy';

interface CookingTimerProps {
  duration: number; // Duration in seconds
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

/**
 * Animated cooking timer with circular progress and pulse effect
 * Shows remaining time and pulses during countdown
 */
export function CookingTimer({
  duration,
  onComplete,
  size = 'md',
  showText = true,
  className = '',
}: CookingTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const [motionPolicy] = useMotionPolicy();

  const sizes = {
    sm: { width: 48, radius: 18, stroke: 3 },
    md: { width: 72, radius: 28, stroke: 4 },
    lg: { width: 96, radius: 38, stroke: 5 },
  };

  const { width, radius, stroke } = sizes[size];
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / duration) * circumference;

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft <= 0 && onComplete) {
        onComplete();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isActive, onComplete, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine if we should pulse based on motion policy
  const shouldPulse = !prefersReducedMotion && motionPolicy !== 'subtle' && isActive;

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <div className={`relative ${shouldPulse ? 'anim-cooking-timer' : ''}`}>
        <svg width={width} height={width} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            opacity={0.2}
          />
          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="oklch(70% 0.18 20)" // Coral accent
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            style={{
              transition: prefersReducedMotion ? 'none' : 'stroke-dashoffset 1s linear',
            }}
          />
        </svg>
        {showText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`font-mono text-${
                size === 'sm' ? 'xs' : size === 'md' ? 'sm' : 'base'
              } font-medium`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>
      {isActive && (
        <button
          onClick={() => setIsActive(false)}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Anulează
        </button>
      )}
    </div>
  );
}

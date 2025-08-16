'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '../../utils/cn';
import { useReducedMotion } from '../../motion/useReducedMotion';

interface CountdownTimerProps {
  duration: number; // Duration in seconds
  onComplete?: () => void;
  autoStart?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showHours?: boolean;
  showMilliseconds?: boolean;
}

/**
 * Countdown timer with digit flip animation
 * Used for cooking timers, preparation countdowns, etc.
 */
export function CountdownTimer({
  duration,
  onComplete,
  autoStart = true,
  className = '',
  size = 'md',
  showHours = false,
  showMilliseconds = false,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 1000); // Convert to milliseconds
  const [isRunning, setIsRunning] = useState(autoStart);
  const [prevDigits, setPrevDigits] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const onCompleteRef = useRef(onComplete);
  const prefersReducedMotion = useReducedMotion();

  // Keep callback ref up to date
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const sizeClasses = {
    sm: 'text-2xl min-w-[24px]',
    md: 'text-4xl min-w-[36px]',
    lg: 'text-6xl min-w-[48px]',
  };

  // Parse time into components
  const getTimeComponents = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10); // Show only 2 digits

    return { hours, minutes, seconds, milliseconds };
  };

  // Format digits with leading zeros
  const formatDigits = (time: ReturnType<typeof getTimeComponents>) => {
    const digits: string[] = [];

    if (showHours || time.hours > 0) {
      digits.push(...time.hours.toString().padStart(2, '0').split(''));
      digits.push(':');
    }

    digits.push(...time.minutes.toString().padStart(2, '0').split(''));
    digits.push(':');
    digits.push(...time.seconds.toString().padStart(2, '0').split(''));

    if (showMilliseconds) {
      digits.push('.');
      digits.push(...time.milliseconds.toString().padStart(2, '0').split(''));
    }

    return digits;
  };

  const currentDigits = formatDigits(getTimeComponents(timeLeft));

  // Timer logic
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0 && onCompleteRef.current) {
        onCompleteRef.current();
      }
      return;
    }

    const updateInterval = showMilliseconds ? 10 : 100;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = Math.max(0, prev - updateInterval);
        if (newTime === 0) {
          setIsRunning(false);
        }
        return newTime;
      });
    }, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, showMilliseconds]);

  // Track digit changes for animation
  useEffect(() => {
    setPrevDigits(currentDigits);
  }, [currentDigits.join('')]);

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 1000);
  };

  return (
    <div className={cn('inline-flex flex-col items-center gap-4', className)}>
      {/* Timer Display */}
      <div className="flex items-center font-mono">
        {currentDigits.map((digit, index) => {
          const isColon = digit === ':' || digit === '.';
          const hasChanged = prevDigits[index] !== digit;

          if (isColon) {
            return (
              <span key={index} className={cn(sizeClasses[size], 'mx-1 text-text-secondary')}>
                {digit}
              </span>
            );
          }

          return (
            <span
              key={index}
              className={cn(
                sizeClasses[size],
                'relative inline-block text-center font-bold',
                'bg-surface-raised rounded-lg shadow-lg p-2',
                hasChanged && !prefersReducedMotion && 'anim-digit-flip'
              )}
              style={{
                minWidth: size === 'sm' ? '32px' : size === 'md' ? '48px' : '64px',
              }}
            >
              {digit}

              {/* Flip animation helper */}
              {hasChanged && !prefersReducedMotion && (
                <span
                  className="absolute inset-0 flex items-center justify-center bg-surface-raised rounded-lg"
                  style={{
                    animation: 'digit-flip 0.6s ease-out',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {prevDigits[index]}
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={handleToggle}
          className={cn(
            'px-4 py-2 rounded-button',
            'bg-primary text-inverse',
            'hover:bg-primary-600 active:scale-95',
            'transition-all duration-200'
          )}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>

        <button
          onClick={handleReset}
          className={cn(
            'px-4 py-2 rounded-button',
            'bg-surface-raised text-text',
            'hover:bg-surface-dim active:scale-95',
            'transition-all duration-200'
          )}
          aria-label="Reset timer"
        >
          Reset
        </button>
      </div>

      {/* Progress Ring */}
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r="60"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            opacity="0.2"
          />
          <circle
            cx="64"
            cy="64"
            r="60"
            stroke="url(#timer-gradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 60}`}
            strokeDashoffset={`${2 * Math.PI * 60 * (1 - timeLeft / (duration * 1000))}`}
            className={cn('transition-all duration-100', prefersReducedMotion && 'transition-none')}
          />
          <defs>
            <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary-warm)" />
              <stop offset="100%" stopColor="var(--color-accent-coral)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Pulse effect when running */}
        {isRunning && !prefersReducedMotion && (
          <div className="absolute inset-0 rounded-full anim-cooking-timer" />
        )}
      </div>
    </div>
  );
}

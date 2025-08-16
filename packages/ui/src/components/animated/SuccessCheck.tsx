'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../../motion/useReducedMotion';

interface SuccessCheckProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  onComplete?: () => void;
  className?: string;
}

/**
 * Animated success checkmark with SVG path animation
 * Falls back to simple fade for reduced motion
 */
export function SuccessCheck({
  size = 'md',
  color = 'currentColor',
  onComplete,
  className = '',
}: SuccessCheckProps) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const sizes = {
    sm: 24,
    md: 48,
    lg: 64,
    xl: 96,
  };

  const sizeValue = sizes[size];
  const strokeWidth = sizeValue / 24; // Scale stroke with size

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible && onComplete) {
      // Call onComplete after animation duration
      const duration = prefersReducedMotion ? 100 : 800;
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) {
    // Simple fade for reduced motion
    return (
      <div className={`inline-flex ${className}`}>
        <svg
          width={sizeValue}
          height={sizeValue}
          viewBox="0 0 24 24"
          fill="none"
          className={`transition-opacity duration-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <path
            d="M20 6L9 17L4 12"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex ${className}`}>
      <svg
        width={sizeValue}
        height={sizeValue}
        viewBox="0 0 24 24"
        fill="none"
        className={`${isVisible ? 'anim-success-check' : 'opacity-0'}`}
      >
        <path
          d="M20 6L9 17L4 12"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="24"
          strokeDashoffset={isVisible ? '0' : '24'}
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        />
      </svg>
    </div>
  );
}

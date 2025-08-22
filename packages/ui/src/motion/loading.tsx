'use client';

import { m } from './config';
import { LazyMotion, domAnimation } from 'motion/react';
import { ReactNode, Suspense } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Modern shimmer effect variants for skeleton screens
 * Based on Material Design 3 and 2024/2025 best practices
 */
const shimmerVariants = {
  initial: { x: '-100%' },
  animate: { 
    x: '100%',
    transition: {
      duration: 1.5,
      ease: 'linear' as const,
      repeat: Infinity
    }
  }
};

/**
 * Progressive loading variants with staggered animation
 * Timing: 300ms for content appearance, staggered by 100ms per item
 */
const progressiveVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number] // Material Design 3 emphasis curve
    }
  })
};

/**
 * Pulse animation for simple loading states
 * Respects prefers-reduced-motion
 */
const pulseVariants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      ease: 'easeInOut' as const,
      repeat: Infinity
    }
  }
};

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'shimmer' | 'pulse' | 'none';
}

/**
 * Skeleton component for loading states
 * Supports multiple variants and animation types
 */
export function Skeleton({ 
  width = '100%', 
  height = '1rem',
  className = '',
  variant = 'text',
  animation = 'shimmer'
}: SkeletonProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const baseClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };
  
  const baseStyle = {
    width: variant === 'circular' ? height : width,
    height
  };
  
  if (animation === 'none' || shouldReduceMotion) {
    return (
      <div 
        className={`bg-gray-200 ${baseClasses[variant]} ${className}`}
        style={baseStyle}
        aria-busy="true"
        aria-label="Loading"
      />
    );
  }
  
  return (
    <LazyMotion features={domAnimation} strict>
      <div 
        className={`relative overflow-hidden bg-gray-200 ${baseClasses[variant]} ${className}`}
        style={baseStyle}
        aria-busy="true"
        aria-label="Loading"
      >
        {animation === 'shimmer' && (
          <m.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
        )}
        {animation === 'pulse' && (
          <m.div
            className="absolute inset-0 bg-white"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          />
        )}
      </div>
    </LazyMotion>
  );
}

interface SkeletonCardProps {
  showAvatar?: boolean;
  lines?: number;
  className?: string;
}

/**
 * Skeleton card component for content loading
 * Common pattern for card-based layouts
 */
export function SkeletonCard({ 
  showAvatar = true,
  lines = 3,
  className = ''
}: SkeletonCardProps) {
  return (
    <div className={`p-4 rounded-lg bg-white shadow-sm ${className}`}>
      <div className="flex items-start space-x-3">
        {showAvatar && (
          <Skeleton 
            variant="circular" 
            height="40px"
            animation="pulse"
          />
        )}
        <div className="flex-1 space-y-2">
          <Skeleton width="75%" height="1rem" />
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton 
              key={i}
              width={i === lines - 1 ? '50%' : '100%'}
              height="0.875rem"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProgressiveListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  skeleton?: ReactNode;
  className?: string;
}

/**
 * Progressive list component with staggered loading animation
 * Each item appears with a slight delay for smooth loading experience
 */
export function ProgressiveList<T extends { id: string | number }>({ 
  items, 
  renderItem,
  skeleton = <SkeletonCard />,
  className = ''
}: ProgressiveListProps<T>) {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <Suspense fallback={skeleton}>
      <LazyMotion features={domAnimation} strict>
        <div className={`space-y-4 ${className}`}>
          {items.map((item, i) => (
            <m.div
              key={item.id}
              custom={i}
              variants={shouldReduceMotion ? {} : progressiveVariants}
              initial="hidden"
              animate="visible"
            >
              {renderItem(item, i)}
            </m.div>
          ))}
        </div>
      </LazyMotion>
    </Suspense>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Modern loading spinner with smooth animation
 * Uses CSS transforms for optimal performance
 */
export function LoadingSpinner({ 
  size = 'md', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={`${sizes[size]} ${className}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: 'linear',
          repeat: Infinity
        }}
        aria-label="Loading"
        role="status"
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </m.div>
    </LazyMotion>
  );
}

interface LoadingDotsProps {
  className?: string;
}

/**
 * Animated loading dots indicator
 * Material Design 3 style with staggered animation
 */
export function MotionLoadingDots({ className = '' }: LoadingDotsProps) {
  const dotVariants = {
    initial: { y: 0 },
    animate: (i: number) => ({
      y: [-5, 0, -5],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        delay: i * 0.1,
        ease: [0.4, 0, 0.6, 1] as [number, number, number, number]
      }
    })
  };
  
  return (
    <LazyMotion features={domAnimation} strict>
      <div className={`flex space-x-1 ${className}`} aria-label="Loading" role="status">
        {[0, 1, 2].map((i) => (
          <m.div
            key={i}
            custom={i}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            className="w-2 h-2 bg-current rounded-full"
          />
        ))}
      </div>
    </LazyMotion>
  );
}

/**
 * Export all loading components for convenience
 */
export const loadingComponents = {
  Skeleton,
  SkeletonCard,
  ProgressiveList,
  LoadingSpinner,
  MotionLoadingDots
};
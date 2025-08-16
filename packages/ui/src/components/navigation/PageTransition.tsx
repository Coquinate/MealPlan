'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { useReducedMotion } from '../../motion/useReducedMotion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  transitionKey?: string;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale';
  duration?: 'fast' | 'normal' | 'slow';
}

/**
 * Page transition wrapper that animates content changes
 * Works with React Router or Next.js navigation
 */
export function PageTransition({
  children,
  className = '',
  transitionKey,
  animation = 'fade',
  duration = 'normal',
}: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayContent, setDisplayContent] = useState(children);
  const prefersReducedMotion = useReducedMotion();

  const durationMap = {
    fast: 'duration-2',
    normal: 'duration-3',
    slow: 'duration-4',
  };

  const durationMs = {
    fast: 200,
    normal: 300,
    slow: 400,
  };

  const animationMap = {
    fade: {
      enter: 'anim-fade-in',
      exit: 'anim-exit-fade',
    },
    'slide-up': {
      enter: 'anim-slide-up-in',
      exit: 'anim-exit-slide-up',
    },
    'slide-down': {
      enter: 'anim-slide-down-in',
      exit: 'opacity-0',
    },
    scale: {
      enter: 'anim-scale-in',
      exit: 'anim-scale-out',
    },
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayContent(children);
      return;
    }

    // Detect content change
    if (transitionKey !== undefined) {
      setIsTransitioning(true);

      // Exit animation
      const exitTimer = setTimeout(() => {
        setDisplayContent(children);

        // Enter animation
        const enterTimer = setTimeout(() => {
          setIsTransitioning(false);
        }, 50);

        return () => clearTimeout(enterTimer);
      }, durationMs[duration]);

      return () => clearTimeout(exitTimer);
    } else {
      setDisplayContent(children);
    }
  }, [transitionKey, children, prefersReducedMotion, duration]);

  const currentAnimation = animationMap[animation];
  const animationClass = isTransitioning ? currentAnimation.exit : currentAnimation.enter;

  return (
    <div
      ref={containerRef}
      className={cn(
        'page-transition',
        !prefersReducedMotion && animationClass,
        !prefersReducedMotion && durationMap[duration],
        className
      )}
      style={{
        viewTransitionName: transitionKey ? `page-${transitionKey}` : undefined,
      }}
    >
      {displayContent}
    </div>
  );
}

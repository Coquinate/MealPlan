'use client';

import { useEffect, useRef } from 'react';

interface GPUOptimizationOptions {
  enableGPU?: boolean;
  cleanupDelay?: number;
  properties?: string[];
}

/**
 * Hook for managing GPU optimization with will-change
 * Automatically cleans up will-change to prevent memory leaks
 */
export function useGPUOptimization(
  elementRef: React.RefObject<HTMLElement>,
  options: GPUOptimizationOptions = {}
) {
  const { enableGPU = true, cleanupDelay = 500, properties = ['transform', 'opacity'] } = options;

  const cleanupTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!enableGPU || !elementRef.current) return;

    const element = elementRef.current;

    // Apply will-change for GPU acceleration
    const applyWillChange = () => {
      element.style.willChange = properties.join(', ');

      // Schedule cleanup
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }

      cleanupTimerRef.current = setTimeout(() => {
        if (element) {
          element.style.willChange = 'auto';
        }
      }, cleanupDelay);
    };

    // Remove will-change
    const removeWillChange = () => {
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }
      element.style.willChange = 'auto';
    };

    // Listen for animation/transition events
    const handleAnimationStart = () => applyWillChange();
    const handleAnimationEnd = () => removeWillChange();
    const handleTransitionStart = () => applyWillChange();
    const handleTransitionEnd = () => removeWillChange();

    // Mouse events for hover effects
    const handleMouseEnter = () => {
      if (element.classList.contains('hover-lift') || element.classList.contains('hover-scale')) {
        applyWillChange();
      }
    };

    const handleMouseLeave = () => {
      removeWillChange();
    };

    element.addEventListener('animationstart', handleAnimationStart);
    element.addEventListener('animationend', handleAnimationEnd);
    element.addEventListener('transitionstart', handleTransitionStart as any);
    element.addEventListener('transitionend', handleTransitionEnd);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('animationstart', handleAnimationStart);
      element.removeEventListener('animationend', handleAnimationEnd);
      element.removeEventListener('transitionstart', handleTransitionStart as any);
      element.removeEventListener('transitionend', handleTransitionEnd);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);

      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }

      element.style.willChange = 'auto';
    };
  }, [elementRef, enableGPU, cleanupDelay, properties]);
}

/**
 * Utility to check if device should use reduced animations
 * Based on device capabilities and user preferences
 */
export function shouldReduceAnimations(): boolean {
  if (typeof window === 'undefined') return false;

  // Check user preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }

  // Check device memory (if available)
  const nav = navigator as any;
  if (nav.deviceMemory && nav.deviceMemory < 4) {
    return true;
  }

  // Check connection speed
  const connection = (nav.connection || nav.mozConnection || nav.webkitConnection) as any;
  if (connection) {
    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return true;
    }
  }

  // Check for low-end mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    // Check viewport size (small screens often mean lower-end devices)
    if (window.innerWidth < 768 && window.devicePixelRatio < 2) {
      return true;
    }
  }

  return false;
}

/**
 * Force browser to use GPU for element
 * Use sparingly as it increases memory usage
 */
export function forceGPUAcceleration(element: HTMLElement) {
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
}

/**
 * Remove forced GPU acceleration
 */
export function removeGPUAcceleration(element: HTMLElement) {
  element.style.transform = '';
  element.style.backfaceVisibility = '';
  element.style.perspective = '';
}

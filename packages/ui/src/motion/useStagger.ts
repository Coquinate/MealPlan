'use client';

import { useLayoutEffect, RefObject } from 'react';

/**
 * Hook to apply stagger animation indexes to children
 * Works with CSS animations that use --stagger-index variable
 */
export function useStagger(
  containerRef: RefObject<HTMLElement>,
  options?: {
    enabled?: boolean;
    startDelay?: number;
  }
) {
  const { enabled = true, startDelay = 0 } = options || {};

  useLayoutEffect(() => {
    if (!enabled) return;

    const element = containerRef.current;
    if (!element) return;

    // Add stagger attribute to container
    element.setAttribute('data-stagger', '');

    // Set start delay if provided
    if (startDelay > 0) {
      element.style.setProperty('--stagger-delay', `${startDelay}ms`);
    }

    // Helper function to update stagger indexes
    const updateStaggerIndexes = () => {
      const children = Array.from(element.children);
      children.forEach((child, index) => {
        (child as HTMLElement).style.setProperty('--stagger-index', String(index));
      });
    };

    // Initial assignment of stagger indexes
    updateStaggerIndexes();

    // Throttle function to prevent excessive updates
    let throttleTimeout: NodeJS.Timeout | null = null;
    const throttledUpdate = () => {
      if (throttleTimeout) return;
      
      throttleTimeout = setTimeout(() => {
        updateStaggerIndexes();
        throttleTimeout = null;
      }, 100); // 100ms throttle delay
    };

    // Observe children changes with throttled callback
    const observer = new MutationObserver(throttledUpdate);
    observer.observe(element, { childList: true });

    return () => {
      observer.disconnect();
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
      element.removeAttribute('data-stagger');
      element.style.removeProperty('--stagger-delay');
    };
  }, [containerRef, enabled, startDelay]);
}

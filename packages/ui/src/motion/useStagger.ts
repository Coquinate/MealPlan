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

    // Assign stagger indexes to children
    const children = Array.from(element.children);
    children.forEach((child, index) => {
      (child as HTMLElement).style.setProperty('--stagger-index', String(index));
    });

    // Observe children changes
    const observer = new MutationObserver(() => {
      const newChildren = Array.from(element.children);
      newChildren.forEach((child, index) => {
        (child as HTMLElement).style.setProperty('--stagger-index', String(index));
      });
    });

    observer.observe(element, { childList: true });

    return () => {
      observer.disconnect();
      element.removeAttribute('data-stagger');
      element.style.removeProperty('--stagger-delay');
    };
  }, [containerRef, enabled, startDelay]);
}

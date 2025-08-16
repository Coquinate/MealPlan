'use client';

import { useReducedMotion } from './useReducedMotion';
import { useMotionPolicy } from './useMotionPolicy';

/**
 * Create a ripple effect on click
 * @param event - Mouse event from click
 * @param element - Element to add ripple to
 */
export function createRipple(event: React.MouseEvent | MouseEvent, element: HTMLElement) {
  // Check if we should add ripple
  const motionPolicy = document.documentElement.getAttribute('data-motion') || 'subtle';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Skip ripple for subtle mode or reduced motion
  if (motionPolicy === 'subtle' || prefersReducedMotion) {
    return;
  }

  // Ensure element has ripple container class
  if (!element.classList.contains('ripple-container')) {
    element.classList.add('ripple-container');
  }

  const rect = element.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';

  // Calculate position relative to element
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Set size based on element dimensions
  const size = Math.max(rect.width, rect.height) * 2;
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  element.appendChild(ripple);

  // Remove ripple after animation
  const handleAnimationEnd = () => {
    ripple.remove();
  };

  ripple.addEventListener('animationend', handleAnimationEnd);
  ripple.addEventListener('animationcancel', handleAnimationEnd);

  // Fallback cleanup after 1 second
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.remove();
    }
  }, 1000);
}

/**
 * Attach ripple effect to an element
 * Disabled in subtle mode and reduced motion
 */
export function attachRipple(element: HTMLElement): (() => void) | undefined {
  // Check if we should add ripple
  const motionPolicy = element.closest('html')?.getAttribute('data-motion') || 'subtle';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Skip ripple for subtle mode or reduced motion
  if (motionPolicy === 'subtle' || prefersReducedMotion) {
    return undefined;
  }

  // Add ripple container class
  element.classList.add('ripple-container');

  const handleClick = (event: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    // Calculate position relative to element
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Set size based on element dimensions
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    element.appendChild(ripple);

    // Remove ripple after animation
    const handleAnimationEnd = () => {
      ripple.remove();
    };

    ripple.addEventListener('animationend', handleAnimationEnd);
    ripple.addEventListener('animationcancel', handleAnimationEnd);
  };

  element.addEventListener('click', handleClick);

  // Return cleanup function
  return () => {
    element.removeEventListener('click', handleClick);
    element.classList.remove('ripple-container');
  };
}

/**
 * React hook for ripple effect
 */
export function useRipple() {
  const [motionPolicy] = useMotionPolicy();
  const prefersReducedMotion = useReducedMotion();

  const addRipple = (element: HTMLElement | null) => {
    if (!element) return;
    if (motionPolicy === 'subtle' || prefersReducedMotion) return;

    return attachRipple(element);
  };

  return { addRipple, enabled: motionPolicy !== 'subtle' && !prefersReducedMotion };
}

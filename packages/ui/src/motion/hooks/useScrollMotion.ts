'use client';

import { 
  useScroll, 
  useTransform, 
  useInView, 
  useMotionValue,
  useSpring,
  MotionValue 
} from 'motion/react';
import { useRef, RefObject, useEffect, useDeferredValue, useTransition } from 'react';

/**
 * Hook pentru scroll animations cu Framer Motion v12
 * Convertit din v0 use-scroll-animation.ts
 */
export function useScrollMotion(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: threshold 
  });

  return { 
    ref, 
    isVisible: isInView 
  };
}

/**
 * Advanced scroll progress hook cu Framer Motion v12 useScroll API
 */
export function useScrollProgress(
  container?: RefObject<HTMLElement>,
  options?: { useDeferred?: boolean }
) {
  const { scrollYProgress } = useScroll({
    container: container,
    offset: ['start start', 'end end']
  });

  // React 19: Use deferred value for heavy scroll calculations
  const deferredProgress = useDeferredValue(scrollYProgress);
  const activeProgress = options?.useDeferred ? deferredProgress : scrollYProgress;

  // Smooth spring animation pentru progress
  const smoothProgress = useSpring(activeProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return {
    scrollYProgress,
    smoothProgress,
    deferredProgress,
    isDeferred: options?.useDeferred
  };
}

/**
 * Parallax scroll effect hook
 */
export function useParallaxScroll(
  outputRange: [number, number] = [0, -50]
) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], outputRange);
  
  return { 
    ref, 
    y 
  };
}

/**
 * Scroll-triggered fade in animation
 */
export function useScrollFadeIn(
  threshold = 0.3,
  delay = 0
) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: threshold 
  });

  const opacity = useMotionValue(0);
  const y = useMotionValue(20);

  // Animate când devine vizibil
  if (isInView) {
    opacity.set(1);
    y.set(0);
  }

  const springOpacity = useSpring(opacity, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const springY = useSpring(y, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return {
    ref,
    style: {
      opacity: springOpacity,
      y: springY
    }
  };
}

/**
 * Scroll-linked scale animation
 */
export function useScrollScale(
  inputRange: [number, number] = [0, 1],
  outputRange: [number, number] = [1, 1.2]
) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const scale = useTransform(scrollYProgress, inputRange, outputRange);

  return {
    ref,
    scale
  };
}

/**
 * Scroll velocity hook pentru momentum-based animations
 */
export function useScrollVelocity() {
  const { scrollY } = useScroll();
  const scrollVelocity = useMotionValue(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTime.current;
      const scrollDelta = latest - lastScrollY.current;
      
      if (timeDelta > 0) {
        const velocity = scrollDelta / timeDelta;
        scrollVelocity.set(velocity);
      }
      
      lastScrollY.current = latest;
      lastTime.current = currentTime;
    });

    return () => unsubscribe();
  }, [scrollY, scrollVelocity]);

  return scrollVelocity;
}

/**
 * Sticky header behavior hook
 */
export function useStickyHeader(
  threshold = 100
) {
  const { scrollY } = useScroll();
  const isSticky = useMotionValue(false);

  scrollY.on('change', (latest) => {
    isSticky.set(latest > threshold);
  });

  return isSticky;
}

/**
 * React 19 Concurrent Motion Hook
 * Combines useTransition with motion animations for non-blocking updates
 */
export function useConcurrentAnimation() {
  const [isPending, startTransition] = useTransition();
  
  const animateWithTransition = (callback: () => void) => {
    startTransition(() => {
      callback();
    });
  };
  
  return {
    isPending,
    animateWithTransition,
    style: isPending ? { opacity: 0.7, transition: 'opacity 0.2s' } : {}
  };
}

/**
 * Deferred Motion Hook for expensive animations
 * Uses useDeferredValue to prevent blocking user input
 */
export function useDeferredMotion<T>(value: T) {
  const deferredValue = useDeferredValue(value);
  const isStale = value !== deferredValue;
  
  return {
    value: deferredValue,
    isStale,
    style: isStale ? { opacity: 0.5, transition: 'opacity 0.2s' } : {}
  };
}

/**
 * Export all hooks pentru convenience
 */
export const scrollHooks = {
  useScrollMotion,
  useScrollProgress,
  useParallaxScroll,
  useScrollFadeIn,
  useScrollScale,
  useScrollVelocity,
  useStickyHeader,
  useConcurrentAnimation,
  useDeferredMotion,
};
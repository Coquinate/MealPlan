'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { useReducedMotion } from '../../motion/useReducedMotion';

interface GlassNavProps {
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
  transparent?: boolean;
}

/**
 * Glass morphism navigation bar with scroll effects
 * Adapts appearance based on scroll position
 */
export function GlassNav({
  children,
  className = '',
  sticky = true,
  transparent = false,
}: GlassNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sticky) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrolled = scrollY > 10;
      setIsScrolled(scrolled);

      // Calculate scroll progress for indicator
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollY / docHeight) * 100, 100);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky]);

  const baseClasses = cn(
    'relative z-50 transition-all',
    prefersReducedMotion ? 'duration-0' : 'duration-300'
  );

  const glassClasses = cn(
    transparent && !isScrolled
      ? 'bg-transparent border-transparent'
      : 'glass backdrop-blur-md border-b border-surface-dim/30',
    isScrolled && 'shadow-lg'
  );

  const stickyClasses = sticky ? 'sticky top-0 left-0 right-0' : '';

  return (
    <nav
      className={cn(baseClasses, glassClasses, stickyClasses, className)}
      role="navigation"
      aria-label="Main navigation"
    >
      {children}

      {/* Scroll progress indicator */}
      {sticky && !prefersReducedMotion && (
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary-warm to-accent-coral transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}

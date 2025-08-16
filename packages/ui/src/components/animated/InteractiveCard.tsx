'use client';

import React, { useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { useReducedMotion } from '../../motion/useReducedMotion';
import { createRipple } from '../../motion/ripple';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  interactive?: boolean;
  variant?: 'default' | 'glass' | 'elevated';
  disableRipple?: boolean;
}

/**
 * Interactive card component with hover states and ripple effects
 * Used for meal cards, recipe cards, and other interactive content
 */
export function InteractiveCard({
  children,
  className = '',
  onClick,
  href,
  interactive = true,
  variant = 'default',
  disableRipple = false,
}: InteractiveCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const isClickable = onClick || href;
  const isAnchor = href && !onClick;

  const handleActivation = (e?: React.MouseEvent) => {
    if (onClick) {
      onClick(e!);
    } else if (href && !isAnchor) {
      window.location.href = href;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!disableRipple && !prefersReducedMotion && isClickable) {
      const card = isAnchor ? anchorRef.current : divRef.current;
      if (card) {
        createRipple(e, card);
      }
    }
    if (onClick) {
      handleActivation(e);
    }
  };

  const handleMouseDown = () => {
    if (isClickable) setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleActivation();
    }
  };

  const variantClasses = {
    default: 'bg-surface border border-surface-dim shadow-sm',
    glass: 'glass',
    elevated: 'bg-surface-raised shadow-lg',
  };

  const interactiveClasses =
    isClickable && interactive ? 'cursor-pointer hover-lift active-scale transition-all' : '';

  const pressedClasses = isPressed && !prefersReducedMotion ? 'scale-[0.98]' : '';

  const cardClassName = cn(
    'relative overflow-hidden rounded-card p-space-md',
    variantClasses[variant],
    interactiveClasses,
    pressedClasses,
    className
  );

  const commonContent = (
    <>
      {children}

      {/* Hover glow effect for elevated cards */}
      {variant === 'elevated' && !prefersReducedMotion && (
        <div className="absolute inset-0 rounded-card opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-warm/10 to-accent-coral/10" />
        </div>
      )}
    </>
  );

  // Render as anchor tag if href is provided without onClick
  if (isAnchor) {
    return (
      <a
        ref={anchorRef}
        href={href}
        className={cardClassName}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
      >
        {commonContent}
      </a>
    );
  }

  // Render as div for all other cases
  return (
    <div
      ref={divRef}
      className={cardClassName}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      {commonContent}
    </div>
  );
}

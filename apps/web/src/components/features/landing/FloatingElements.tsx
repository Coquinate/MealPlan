import React from 'react';

export interface FloatingOrbConfig {
  size: 'sm' | 'md' | 'lg' | 'xl';
  color: 'coral' | 'warm' | 'coral-soft' | 'primary';
  position: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  animationDelay?: number;
  animationDuration?: number;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
}

interface FloatingElementsProps {
  /**
   * Configuration for floating orbs
   * Default provides 3 balanced orbs if not specified
   */
  orbs?: FloatingOrbConfig[];
  /**
   * Additional CSS classes for the container
   */
  className?: string;
  /**
   * Z-index offset for layering
   */
  zIndexOffset?: number;
}

/**
 * Modern Hearth Floating Elements Component
 * Reusable decorative floating orbs for glass morphism backgrounds
 * Phase 1 Foundation - Extracted from inline implementations
 */
export function FloatingElements({
  orbs,
  className = '',
  zIndexOffset = 0,
}: FloatingElementsProps) {
  // Default orb configuration matching Modern Hearth design
  const defaultOrbs: FloatingOrbConfig[] = [
    {
      size: 'lg',
      color: 'coral',
      position: { top: '-0.5rem', right: '-0.5rem' },
      animationDelay: 0,
      animationDuration: 10,
      blur: 'xl',
    },
    {
      size: 'md',
      color: 'warm',
      position: { bottom: '-1rem', left: '-1rem' },
      animationDelay: 5,
      animationDuration: 12,
      blur: 'lg',
    },
    {
      size: 'sm',
      color: 'coral-soft',
      position: { top: '-0.25rem', left: '-0.25rem' },
      animationDelay: 2,
      animationDuration: 8,
      blur: 'md',
    },
  ];

  const orbsToRender = orbs || defaultOrbs;

  // Size mappings
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  // Color mappings with Modern Hearth palette
  const colorClasses = {
    coral: 'bg-accent-coral/20',
    warm: 'bg-primary-warm/30',
    'coral-soft': 'bg-accent-coral-soft/40',
    primary: 'bg-primary/25',
  };

  // Blur mappings
  const blurClasses = {
    sm: 'blur-sm',
    md: 'blur-md',
    lg: 'blur-lg',
    xl: 'blur-xl',
  };

  return (
    <div
      className={`absolute -inset-4 pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ zIndex: zIndexOffset }}
    >
      {orbsToRender.map((orb, index) => {
        const positionStyles: React.CSSProperties = {};

        // Apply position styles
        if (orb.position.top !== undefined) positionStyles.top = orb.position.top;
        if (orb.position.right !== undefined) positionStyles.right = orb.position.right;
        if (orb.position.bottom !== undefined) positionStyles.bottom = orb.position.bottom;
        if (orb.position.left !== undefined) positionStyles.left = orb.position.left;

        return (
          <div
            key={`orb-${index}`}
            className={`
              floating-orb absolute rounded-full animate-float
              ${sizeClasses[orb.size]}
              ${colorClasses[orb.color]}
              ${blurClasses[orb.blur || 'lg']}
            `}
            style={{
              ...positionStyles,
              animationDelay: `${orb.animationDelay || 0}s`,
              animationDuration: `${orb.animationDuration || 20}s`,
            }}
            aria-label={`Decorative orb ${index + 1}`}
          />
        );
      })}
    </div>
  );
}

/**
 * Preset configurations for common use cases
 */
export const FloatingOrbPresets = {
  // Subtle configuration for forms and inputs
  subtle: [
    {
      size: 'md' as const,
      color: 'coral' as const,
      position: { top: '0', right: '0' },
      animationDelay: 0,
      animationDuration: 12,
      blur: 'lg' as const,
    },
    {
      size: 'sm' as const,
      color: 'warm' as const,
      position: { bottom: '0', left: '0' },
      animationDelay: 6,
      animationDuration: 10,
      blur: 'md' as const,
    },
  ],

  // Standard configuration for cards
  standard: [
    {
      size: 'lg' as const,
      color: 'coral' as const,
      position: { top: '-0.5rem', right: '-0.5rem' },
      animationDelay: 0,
      animationDuration: 10,
      blur: 'xl' as const,
    },
    {
      size: 'md' as const,
      color: 'warm' as const,
      position: { bottom: '-1rem', left: '-1rem' },
      animationDelay: 5,
      animationDuration: 12,
      blur: 'lg' as const,
    },
    {
      size: 'sm' as const,
      color: 'coral-soft' as const,
      position: { top: '-0.25rem', left: '-0.25rem' },
      animationDelay: 2,
      animationDuration: 8,
      blur: 'md' as const,
    },
  ],

  // Expressive configuration for hero sections
  expressive: [
    {
      size: 'xl' as const,
      color: 'coral' as const,
      position: { top: '-2rem', right: '-2rem' },
      animationDelay: 0,
      animationDuration: 8,
      blur: 'xl' as const,
    },
    {
      size: 'lg' as const,
      color: 'warm' as const,
      position: { bottom: '-1.5rem', left: '-1.5rem' },
      animationDelay: 2,
      animationDuration: 10,
      blur: 'xl' as const,
    },
    {
      size: 'md' as const,
      color: 'coral-soft' as const,
      position: { top: '20%', left: '-1rem' },
      animationDelay: 4,
      animationDuration: 12,
      blur: 'lg' as const,
    },
    {
      size: 'md' as const,
      color: 'primary' as const,
      position: { bottom: '30%', right: '-1rem' },
      animationDelay: 3,
      animationDuration: 9,
      blur: 'lg' as const,
    },
  ],
};

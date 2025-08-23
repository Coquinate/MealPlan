'use client';

import * as React from 'react';
import LogoQ from './LogoQ';
import { cn } from '../../utils/cn';

type LogoLockupProps = {
  variant?: 'horizontal' | 'vertical' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: boolean;
  animated?: boolean;
  className?: string;
  showTagline?: boolean;
};

/**
 * Coquinate Logo Lockup - Combines logo with brand name
 * 
 * Variants:
 * - horizontal: Logo and text side by side (navigation)
 * - vertical: Logo above text (footer, hero sections)
 * - compact: Logo only on mobile, full on desktop
 */
export function LogoLockup({
  variant = 'horizontal',
  size = 'md',
  gradient = true,
  animated = false,
  className,
  showTagline = false,
}: LogoLockupProps) {
  const sizeConfig = {
    sm: {
      logo: 'w-6 h-6',
      text: 'text-xl',
      tagline: 'text-xs',
      gap: 'gap-2',
    },
    md: {
      logo: 'w-8 h-8',
      text: 'text-2xl',
      tagline: 'text-sm',
      gap: 'gap-3',
    },
    lg: {
      logo: 'w-12 h-12',
      text: 'text-3xl',
      tagline: 'text-base',
      gap: 'gap-4',
    },
    xl: {
      logo: 'w-16 h-16',
      text: 'text-4xl',
      tagline: 'text-lg',
      gap: 'gap-4',
    },
  };

  const config = sizeConfig[size];
  const isVertical = variant === 'vertical';
  const isCompact = variant === 'compact';

  // Gradient text classes matching logo colors - removed as we handle it inline now
  const textGradientClass = gradient
    ? 'bg-gradient-to-r from-[#2AA6A0] to-[#E96E68] bg-clip-text text-transparent'
    : '';

  const containerClass = cn(
    'inline-flex items-center',
    isVertical ? 'flex-col text-center' : config.gap,
    animated && 'transition-all duration-300 hover:scale-105',
    className
  );

  const logoWrapperClass = cn(
    config.logo,
    'flex-shrink-0',
    animated && 'anim-logo-breathe'
  );

  const textClass = cn(
    'font-display font-bold tracking-tight',
    config.text,
    textGradientClass
  );

  const taglineClass = cn(
    'text-neutral-600 dark:text-neutral-400 font-sans',
    config.tagline,
    isVertical ? 'mt-1' : 'ml-2'
  );

  return (
    <div className={cn(
      containerClass,
      'group' // Add group class for hover effects
    )}>
      {/* Logo */}
      <div className={cn(
        logoWrapperClass,
        'transition-transform duration-300 group-hover:rotate-12' // Add rotation on hover
      )}>
        <LogoQ 
          gradient={gradient} 
          className="w-full h-full"
          title="Coquinate Logo"
        />
      </div>

      {/* Text Content */}
      <div className={cn(
        'flex',
        isVertical ? 'flex-col items-center' : 'flex-col justify-center',
        isCompact && 'hidden sm:flex'
      )}>
        {gradient ? (
          // Gradient version with hover color inversion
          <span className={cn(
            'font-display font-bold tracking-tight transition-all duration-300',
            config.text,
            textGradientClass,
            // On hover, change gradient direction for inversion effect
            'group-hover:from-[#E96E68] group-hover:to-[#2AA6A0]'
          )}>
            Coquinate
          </span>
        ) : (
          // Non-gradient version with explicit color inversion
          <span className={cn(
            'font-display font-bold tracking-tight transition-colors duration-300',
            config.text,
            // Normal state: teal with coral q
            'text-primary',
            // Hover state: inverted colors
            'group-hover:text-accent-coral'
          )}>
            Co<span className={cn(
              'transition-colors duration-300',
              'text-accent-coral', // Normal: coral
              'group-hover:text-primary' // Hover: teal
            )}>q</span>uinate
          </span>
        )}
        
        {showTagline && (
          <span className={taglineClass}>
            Planificare mese inteligentă
          </span>
        )}
      </div>

      {/* Mobile-only compact text */}
      {isCompact && (
        <span className={cn(
          'font-display font-bold tracking-tight transition-colors duration-300 sm:hidden',
          config.text,
          'text-primary',
          'group-hover:text-accent-coral'
        )}>
          C<span className={cn(
            'transition-colors duration-300',
            'text-accent-coral',
            'group-hover:text-primary'
          )}>Q</span>
        </span>
      )}
    </div>
  );
}

/**
 * Animated Logo for splash screens and loading states
 */
export function LogoLockupAnimated({
  size = 'xl',
  className,
}: Pick<LogoLockupProps, 'size' | 'className'>) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn(
      'transition-all duration-1000 ease-out',
      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
      className
    )}>
      <LogoLockup
        variant="vertical"
        size={size}
        gradient={true}
        animated={true}
        showTagline={true}
      />
    </div>
  );
}
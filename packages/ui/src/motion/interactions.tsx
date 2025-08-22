'use client';

import { m } from './config';
import { LazyMotion, domAnimation } from 'motion/react';
import { ReactNode, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Material Design 3 State Layer Pattern
 * Timing: 150ms for hover in, 75ms for hover out
 */
const hoverVariants = {
  initial: { 
    scale: 1,
    backgroundColor: 'transparent'
  },
  hover: {
    scale: 1.02,
    backgroundColor: 'rgba(103, 80, 164, 0.08)', // State layer with 8% opacity
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number] // Material Design 3 emphasis curve
    }
  },
  tap: {
    scale: 0.98,
    transition: { 
      duration: 0.075,
      ease: [0.4, 0, 0.6, 1] as [number, number, number, number]
    }
  }
};

/**
 * Subtle lift animation for cards
 * Creates depth perception on hover
 */
const liftVariants = {
  initial: {
    y: 0,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  },
  hover: {
    y: -4,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
    }
  }
};

/**
 * Glow effect for interactive elements
 * Subtle highlight on hover
 */
const glowVariants = {
  initial: {
    boxShadow: '0 0 0 0 rgba(103, 80, 164, 0)'
  },
  hover: {
    boxShadow: '0 0 20px 5px rgba(103, 80, 164, 0.2)',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
    }
  }
};

/**
 * Icon rotation for action buttons
 * Playful micro-interaction
 */
const iconRotateVariants = {
  initial: { rotate: 0 },
  hover: {
    rotate: 15,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
    }
  },
  tap: {
    rotate: -15,
    transition: {
      duration: 0.1
    }
  }
};

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'lift' | 'scale' | 'glow';
  disabled?: boolean;
}

/**
 * Interactive card component with hover animations
 * Supports multiple animation variants
 */
export function MotionInteractiveCard({ 
  children, 
  className = '',
  onClick,
  variant = 'lift',
  disabled = false
}: InteractiveCardProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const variants = {
    lift: liftVariants,
    scale: hoverVariants,
    glow: glowVariants
  };
  
  if (disabled || shouldReduceMotion) {
    return (
      <div 
        className={`rounded-lg p-4 ${className}`}
        onClick={disabled ? undefined : onClick}
        style={{ cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default' }}
      >
        {children}
      </div>
    );
  }
  
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={`rounded-lg p-4 ${className}`}
        variants={variants[variant]}
        initial="initial"
        whileHover="hover"
        whileTap={onClick ? "tap" : undefined}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

interface HoverButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

/**
 * Button component with hover feedback
 * Material Design 3 state layer implementation
 */
export function HoverButton({
  children,
  className = '',
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false
}: HoverButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100'
  };
  
  const buttonVariants = {
    initial: { scale: 1 },
    hover: shouldReduceMotion ? {} : { 
      scale: 1.05,
      transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.075 }
    }
  };
  
  return (
    <LazyMotion features={domAnimation} strict>
      <m.button
        className={`
          rounded-lg font-medium transition-colors
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        variants={buttonVariants}
        initial="initial"
        whileHover={disabled ? undefined : "hover"}
        whileTap={disabled ? undefined : "tap"}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      >
        {children}
      </m.button>
    </LazyMotion>
  );
}

interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  ariaLabel: string;
}

/**
 * Icon button with rotation animation
 * Playful micro-interaction for action buttons
 */
export function IconButton({
  icon,
  onClick,
  className = '',
  size = 'md',
  disabled = false,
  ariaLabel
}: IconButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  return (
    <LazyMotion features={domAnimation} strict>
      <m.button
        className={`
          rounded-full flex items-center justify-center
          bg-gray-100 hover:bg-gray-200 transition-colors
          ${sizeClasses[size]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        whileHover={disabled || shouldReduceMotion ? undefined : { scale: 1.1 }}
        whileTap={disabled ? undefined : { scale: 0.9 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        <m.div
          variants={shouldReduceMotion ? {} : iconRotateVariants}
          initial="initial"
          animate={isHovered ? "hover" : "initial"}
        >
          {icon}
        </m.div>
      </m.button>
    </LazyMotion>
  );
}

interface HoverImageProps {
  src: string;
  alt: string;
  className?: string;
  zoomOnHover?: boolean;
}

/**
 * Image component with zoom on hover
 * Smooth scale animation for image galleries
 */
export function HoverImage({
  src,
  alt,
  className = '',
  zoomOnHover = true
}: HoverImageProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const imageVariants = {
    initial: { scale: 1 },
    hover: {
      scale: zoomOnHover && !shouldReduceMotion ? 1.05 : 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      }
    }
  };
  
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div 
        className={`overflow-hidden rounded-lg ${className}`}
        whileHover="hover"
      >
        <m.img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          variants={imageVariants}
          initial="initial"
        />
      </m.div>
    </LazyMotion>
  );
}

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Tooltip component with fade animation
 * Shows additional information on hover
 */
export function Tooltip({
  children,
  content,
  position = 'top'
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };
  
  const tooltipVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.1 }
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.15,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      }
    }
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <LazyMotion features={domAnimation} strict>
        <m.div
          className={`
            absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded
            pointer-events-none whitespace-nowrap
            ${positionClasses[position]}
          `}
          variants={tooltipVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {content}
        </m.div>
      </LazyMotion>
    </div>
  );
}

/**
 * Export all interaction components for convenience
 */
export const interactionComponents = {
  MotionInteractiveCard,
  HoverButton,
  IconButton,
  HoverImage,
  Tooltip
};
'use client';

import React, { useRef, ReactNode } from 'react';
import { useStagger } from '../../motion/useStagger';
import { useReducedMotion } from '../../motion/useReducedMotion';

interface StaggerListProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale';
  startDelay?: number;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Container that applies stagger animation to its children
 * Each child will animate in sequence with a delay
 */
export function StaggerList({
  children,
  className = '',
  animation = 'slide-up',
  startDelay = 0,
  as: Component = 'div',
}: StaggerListProps) {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Apply stagger effect
  useStagger(containerRef, {
    enabled: !prefersReducedMotion,
    startDelay,
  });

  const animationClasses = {
    fade: 'anim-fade-in',
    'slide-up': 'anim-slide-up-in',
    'slide-down': 'anim-slide-down-in',
    scale: 'anim-scale-in',
  };

  const animationClass = prefersReducedMotion ? '' : animationClasses[animation];

  // Clone children to add animation classes
  const animatedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;

    const childElement = child as React.ReactElement<{ className?: string }>;
    return React.cloneElement(childElement, {
      className: `${childElement.props.className || ''} ${animationClass}`,
      key: childElement.key || index,
    });
  });

  return (
    <Component ref={containerRef as React.RefObject<HTMLElement>} className={className}>
      {animatedChildren}
    </Component>
  );
}

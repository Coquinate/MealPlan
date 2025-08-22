'use client';

import { m } from '../../motion/config';
import { ReactNode } from 'react';

interface GrainShimmerProps {
  children: ReactNode;
  className?: string;
}

export function GrainShimmer({ children, className = '' }: GrainShimmerProps) {
  // Noise pattern mai vizibil - folosim un pattern mai intens
  const noisePattern = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAWElEQVQoU41SSQ4AIAjz/59GJ0ajA+I4tKWF4H5Y7B8BAERkVQJEJJeqJMdDj3SLQIRUOhHtpK7qCCAiV8+vUhwAIrKqASIyX59Ie+SaQKT2P75vE94+Xz9d+gDhJBPJpIHriwAAAABJRU5ErkJggg==";

  return (
    <div className={`relative ${className}`}>
      {/* Grain overlay - mai intens și cu blend mode mai subtil */}
      <div 
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url("${noisePattern}")`,
          backgroundRepeat: 'repeat',
        }}
        aria-hidden
      />
      
      {/* Content with shimmer animation */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

interface ShimmerHeadlineProps {
  children: ReactNode;
  className?: string;
}

export function ShimmerHeadline({ children, className = '' }: ShimmerHeadlineProps) {
  return (
    <m.span
      className={`inline-block ${className}`}
      style={{
        // Gradient mai pronunțat cu culori compatibile cross-browser
        backgroundImage: "linear-gradient(90deg, #2aa6a0, #e96e68, #2aa6a0, #e96e68, #2aa6a0)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        backgroundSize: "300% 100%", // Gradient mai mare pentru efect mai dramatic
      }}
      animate={{ 
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
      }}
      transition={{ 
        duration: 12, // Puțin mai rapid pentru mai multă vitalitate
        repeat: Infinity, 
        ease: "easeInOut" // Easing mai smooth
      }}
    >
      {children}
    </m.span>
  );
}
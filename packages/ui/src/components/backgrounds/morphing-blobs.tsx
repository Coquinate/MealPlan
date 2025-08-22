'use client';

import { motion } from 'motion/react';
import { useMemo } from 'react';

interface MorphingBlobsProps {
  className?: string;
  variant?: 'hero' | 'subtle' | 'vibrant';
}

export function MorphingBlobs({ 
  className = '', 
  variant = 'hero' 
}: MorphingBlobsProps) {
  const colors = useMemo(() => {
    switch (variant) {
      case 'vibrant':
        return {
          blob1: 'oklch(75% 0.15 160)', // Verde vibrant
          blob2: 'oklch(70% 0.18 50)',  // Portocaliu cald
          blob3: 'oklch(65% 0.2 20)',   // Roșu-portocaliu
        };
      case 'subtle':
        return {
          blob1: 'oklch(85% 0.05 160)', // Verde foarte deschis
          blob2: 'oklch(82% 0.08 50)',  // Portocaliu pal
          blob3: 'oklch(80% 0.06 20)',  // Roșu foarte deschis
        };
      default: // hero
        return {
          blob1: 'oklch(78% 0.12 160)', // Verde medium
          blob2: 'oklch(75% 0.15 50)',  // Portocaliu medium
          blob3: 'oklch(72% 0.13 20)',  // Roșu-portocaliu medium
        };
    }
  }, [variant]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
        
        <g filter="url(#goo)" opacity="0.5">
          {/* Blob 1 - Verde */}
          <motion.circle
            initial={{ cx: '20%', cy: '30%', r: '15%' }}
            fill={colors.blob1}
            animate={{
              cx: ['20%', '30%', '25%', '20%'],
              cy: ['30%', '40%', '35%', '30%'],
              r: ['15%', '18%', '16%', '15%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Blob 2 - Portocaliu */}
          <motion.circle
            initial={{ cx: '70%', cy: '60%', r: '20%' }}
            fill={colors.blob2}
            animate={{
              cx: ['70%', '65%', '75%', '70%'],
              cy: ['60%', '55%', '65%', '60%'],
              r: ['20%', '22%', '19%', '20%'],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
          
          {/* Blob 3 - Roșu */}
          <motion.circle
            initial={{ cx: '50%', cy: '80%', r: '12%' }}
            fill={colors.blob3}
            animate={{
              cx: ['50%', '55%', '45%', '50%'],
              cy: ['80%', '75%', '82%', '80%'],
              r: ['12%', '15%', '13%', '12%'],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 4,
            }}
          />
          
          {/* Blob 4 - Accent mic */}
          <motion.circle
            initial={{ cx: '85%', cy: '20%', r: '8%' }}
            fill={colors.blob1}
            animate={{
              cx: ['85%', '80%', '88%', '85%'],
              cy: ['20%', '25%', '18%', '20%'],
              r: ['8%', '10%', '9%', '8%'],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
        </g>
      </svg>
      
      {/* Gradient overlay pentru blend mai bun */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/40 pointer-events-none" />
    </div>
  );
}
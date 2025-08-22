'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface KitchenSteamProps {
  className?: string;
  variant?: 'subtle' | 'medium' | 'intense';
  position?: 'bottom' | 'center' | 'top';
}

export function KitchenSteam({ 
  className = '', 
  variant = 'medium',
  position = 'bottom' 
}: KitchenSteamProps) {
  
  const steamConfig = useMemo(() => {
    const configs = {
      subtle: {
        count: 3,
        opacity: 0.3,
        blur: 8,
        speed: 25,
      },
      medium: {
        count: 5,
        opacity: 0.4,
        blur: 10,
        speed: 20,
      },
      intense: {
        count: 8,
        opacity: 0.5,
        blur: 12,
        speed: 15,
      },
    };
    return configs[variant];
  }, [variant]);

  const getStartY = () => {
    switch (position) {
      case 'top': return '10%';
      case 'center': return '50%';
      case 'bottom': 
      default: return '90%';
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="steam-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation={steamConfig.blur} />
          </filter>
          
          <linearGradient id="steam-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgb(156, 163, 175)" stopOpacity="0" />
            <stop offset="30%" stopColor="rgb(156, 163, 175)" stopOpacity="0.8" />
            <stop offset="70%" stopColor="rgb(209, 213, 219)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(243, 244, 246)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <g filter="url(#steam-blur)" opacity={steamConfig.opacity}>
          {Array.from({ length: steamConfig.count }).map((_, index) => {
            const delay = index * 2;
            const xBase = 15 + (index * 70 / steamConfig.count);
            const duration = steamConfig.speed + (Math.random() * 10 - 5);
            
            return (
              <motion.path
                key={index}
                d={`M ${xBase} 100 Q ${xBase + 10} 70, ${xBase - 5} 40 T ${xBase + 15} 0`}
                stroke="url(#steam-gradient)"
                strokeWidth="40"
                fill="none"
                strokeLinecap="round"
                initial={{ 
                  pathLength: 0,
                  opacity: 0,
                  y: getStartY()
                }}
                animate={{
                  pathLength: [0, 0.6, 1],
                  opacity: [0, 0.8, 0],
                  y: [getStartY(), '50%', '-20%'],
                }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            );
          })}
          
          {/* Particule de abur suplimentare pentru efect mai organic */}
          {Array.from({ length: Math.floor(steamConfig.count * 1.5) }).map((_, index) => {
            const delay = index * 1.5;
            const xPos = 10 + (index * 80 / (steamConfig.count * 1.5));
            const size = 8 + Math.random() * 12;
            
            return (
              <motion.circle
                key={`particle-${index}`}
                r={size}
                fill="white"
                initial={{ 
                  cx: `${xPos}%`,
                  cy: getStartY(),
                  opacity: 0,
                  scale: 0.5
                }}
                animate={{
                  cy: [getStartY(), '50%', '-10%'],
                  opacity: [0, 0.6, 0],
                  scale: [0.5, 1.2, 0.8],
                  cx: [
                    `${xPos}%`,
                    `${xPos + (Math.random() * 10 - 5)}%`,
                    `${xPos + (Math.random() * 20 - 10)}%`
                  ]
                }}
                transition={{
                  duration: steamConfig.speed + Math.random() * 5,
                  delay,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </g>
      </svg>
      
      {/* Gradient overlay pentru blend mai natural */}
      {position === 'bottom' && (
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/30 to-transparent" />
      )}
    </div>
  );
}
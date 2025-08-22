'use client';

import { motion } from 'motion/react';
import { useMemo } from 'react';

interface FloatingFoodParticlesProps {
  className?: string;
  variant?: 'subtle' | 'medium' | 'vibrant';
}

export function FloatingFoodParticles({ 
  className = '', 
  variant = 'medium' 
}: FloatingFoodParticlesProps) {
  
  const particles = useMemo(() => {
    const configs = {
      subtle: {
        count: 8,
        emojis: ['🥗', '🥕', '🍅', '🥦', '🌽', '🥒'],
        opacity: 0.3,
        size: 'text-2xl',
      },
      medium: {
        count: 12,
        emojis: ['🍲', '🥘', '🍳', '🥙', '🌮', '🍕', '🥗', '🍜'],
        opacity: 0.5,
        size: 'text-3xl',
      },
      vibrant: {
        count: 16,
        emojis: ['🍔', '🍕', '🌮', '🍰', '🍩', '🧁', '🍪', '🍓', '🥐', '🧀'],
        opacity: 0.7,
        size: 'text-4xl',
      },
    };
    
    const config = configs[variant];
    
    return Array.from({ length: config.count }).map((_, index) => ({
      id: index,
      emoji: config.emojis[index % config.emojis.length],
      initialX: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: config.opacity,
      size: config.size,
    }));
  }, [variant]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${particle.size}`}
          style={{
            left: `${particle.initialX}%`,
          }}
          initial={{ 
            y: '110%',
            rotate: 0,
            opacity: 0,
          }}
          animate={{
            y: '-10%',
            rotate: [0, 180, -180, 360],
            opacity: [0, particle.opacity, particle.opacity, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
            opacity: {
              times: [0, 0.1, 0.9, 1],
            },
          }}
        >
          <motion.span
            animate={{
              x: [
                '0%',
                `${20 * Math.sin(particle.id)}%`,
                `${-20 * Math.sin(particle.id)}%`,
                '0%',
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="block"
          >
            {particle.emoji}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}
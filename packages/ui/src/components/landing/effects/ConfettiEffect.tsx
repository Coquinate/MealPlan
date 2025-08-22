'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { m } from '../../../motion/config';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
}

export interface ConfettiEffectProps {
  trigger: boolean;
  particleCount?: number;
  duration?: number;
}

export function ConfettiEffect({ 
  trigger, 
  particleCount = 50,
  duration = 3000 
}: ConfettiEffectProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    console.log('ConfettiEffect trigger:', trigger);
    if (!trigger) {
      setConfetti([]);
      return;
    }

    console.log('Creating confetti with', particleCount, 'particles');
    // Folosim doar design tokens pentru culori
    const colors = [
      '#FF6B6B',  // Red/coral
      '#FFA500',  // Orange  
      '#FFD700',  // Gold
      '#32CD32',  // Green
      '#4169E1',  // Blue
      '#9370DB',  // Purple
    ];

    const newConfetti: ConfettiPiece[] = [];
    for (let i = 0; i < particleCount; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100, // percentage
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 12 + 8, // Mărit de la 4-12px la 8-20px
        delay: Math.random() * 0.5,
      });
    }

    setConfetti(newConfetti);

    const timeout = setTimeout(() => {
      setConfetti([]);
    }, duration);

    return () => {
      clearTimeout(timeout);
    };
  }, [trigger, particleCount, duration]);

  return (
    <AnimatePresence>
      {confetti.length > 0 && (
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 9999 }}
          aria-live="polite"
          aria-label="Animație confetti de sărbătoare"
          role="img"
        >
          {confetti.map((piece) => (
            <m.div
              key={piece.id}
              className="absolute rounded-sm"
              style={{
                left: `${piece.x}%`,
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color,
                boxShadow: `0 0 6px ${piece.color}`,
              }}
              initial={{ 
                y: -20,
                opacity: 1,
                rotate: 0,
                scale: 0
              }}
              animate={{ 
                y: window.innerHeight + 100,
                opacity: [1, 1, 0],
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                scale: 1,
                x: [
                  `${piece.x}%`,
                  `${piece.x + (Math.random() - 0.5) * 30}%`,
                  `${piece.x + (Math.random() - 0.5) * 50}%`
                ]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: duration / 1000,
                delay: piece.delay,
                ease: [0.45, 0.05, 0.55, 0.95],
                rotate: {
                  duration: duration / 1000,
                  repeat: Infinity,
                  ease: "linear"
                },
                x: {
                  times: [0, 0.5, 1],
                  type: "keyframes"
                }
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
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
    if (!trigger) {
      setConfetti([]);
      return;
    }

    // Folosim doar design tokens pentru culori
    const colors = [
      'var(--accent-coral)',
      'var(--primary-warm)', 
      'var(--accent-coral-soft)',
      'var(--warning-500)',
      'var(--error-500)',
      'var(--success-500)',
    ];

    const newConfetti: ConfettiPiece[] = [];
    for (let i = 0; i < particleCount; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100, // percentage
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
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
          className="fixed inset-0 pointer-events-none z-50"
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
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
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
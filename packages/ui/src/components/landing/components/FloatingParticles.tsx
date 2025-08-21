"use client"

import { useMemo } from "react"
import { useReducedMotion } from "framer-motion"
import { m } from "../../../motion/config"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number // Animation duration in seconds
  colorClass: string // Tailwind color class
  delay: number // Animation delay for staggered effect
}

interface FloatingParticlesProps {
  count?: number
  className?: string
  baseColor?: "primary-warm" | "accent-coral" | "neutral"
}

/**
 * Floating particles animation component for decorative backgrounds.
 * Optimized for performance with reduced particle count and accessibility support.
 */
export function FloatingParticles({ 
  count = 8, // Reduced from 15 for better performance
  className = "",
  baseColor = "primary-warm"
}: FloatingParticlesProps) {
  const shouldReduceMotion = useReducedMotion()
  
  // Generate particles once with useMemo, no state updates needed
  const particles = useMemo<Particle[]>(() => {
    const newParticles: Particle[] = []
    
    // Define color variants for each base color
    const colorVariants = {
      "primary-warm": [
        "bg-primary-warm/10",
        "bg-primary-warm-light/15", 
        "bg-primary-warm-dark/20",
        "bg-primary-warm/25"
      ],
      "accent-coral": [
        "bg-accent-coral-100/20",
        "bg-accent-coral-200/25",
        "bg-accent-coral-300/15",
        "bg-accent-coral-soft/30"
      ],
      "neutral": [
        "bg-gray-300/10",
        "bg-gray-400/15",
        "bg-gray-500/10",
        "bg-gray-600/5"
      ]
    }
    
    const colors = colorVariants[baseColor] || colorVariants["primary-warm"]
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: 110 + Math.random() * 20, // Start below viewport
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.3 + 0.1,
        duration: Math.random() * 20 + 30, // 30-50s animation duration
        colorClass: colors[i % colors.length], // Cycle through color variants
        delay: Math.random() * 20, // Random delay up to 20s
      })
    }
    return newParticles
  }, [count, baseColor])

  // Don't render particles if user prefers reduced motion
  if (shouldReduceMotion) {
    return null
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <m.div
          key={particle.id}
          className={`absolute rounded-full will-change-transform blur-sm ${particle.colorClass}`}
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          initial={{ 
            y: `${particle.y}%`,
            opacity: 0,
            scale: 0
          }}
          animate={{ 
            y: [
              `${particle.y}%`,
              "-20%"
            ],
            opacity: [0, particle.opacity, particle.opacity, 0],
            scale: [0, 1, 1, 0.8]
          }}
          transition={{
            y: {
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
              delay: particle.delay
            },
            opacity: {
              duration: particle.duration,
              repeat: Infinity,
              times: [0, 0.1, 0.9, 1],
              delay: particle.delay
            },
            scale: {
              duration: particle.duration,
              repeat: Infinity,
              times: [0, 0.1, 0.9, 1],
              delay: particle.delay
            }
          }}
        />
      ))}
    </div>
  )
}
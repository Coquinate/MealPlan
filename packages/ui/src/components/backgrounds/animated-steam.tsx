'use client';

import { useEffect, useRef } from 'react';

interface AnimatedSteamProps {
  className?: string;
  variant?: 'subtle' | 'medium' | 'intense';
  position?: 'bottom' | 'center' | 'top';
}

interface SteamParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export function AnimatedSteam({ 
  className = '', 
  variant = 'medium',
  position = 'bottom' 
}: AnimatedSteamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<SteamParticle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * 2; // Higher resolution for clarity
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2); // Scale back for crisp rendering
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Enhanced steam configuration for better visibility
    const config = {
      subtle: {
        particleCount: 30,
        spawnRate: 4,
        maxOpacity: 0.5,
        speed: 1.2,
        sizeRange: [20, 50],
        color: { r: 255, g: 255, b: 255 }, // White steam
      },
      medium: {
        particleCount: 50,
        spawnRate: 6,
        maxOpacity: 0.7,
        speed: 1.5,
        sizeRange: [30, 80],
        color: { r: 240, g: 248, b: 255 }, // Slightly blue-white
      },
      intense: {
        particleCount: 80,
        spawnRate: 10,
        maxOpacity: 0.9,
        speed: 2.0,
        sizeRange: [40, 120],
        color: { r: 230, g: 240, b: 250 }, // More visible blue-white
      },
    }[variant];

    // Get spawn position - spread across width for better visibility
    const getSpawnPosition = () => {
      const baseY = position === 'top' ? canvas.height * 0.1 
                  : position === 'center' ? canvas.height * 0.5 
                  : canvas.height * 0.9;
      
      // Spawn from multiple points for fuller effect
      return {
        x: Math.random() * canvas.width,
        y: baseY + (Math.random() - 0.5) * 50
      };
    };

    // Create enhanced particle with more visible properties
    const createParticle = (): SteamParticle => {
      const size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]);
      const spawn = getSpawnPosition();
      return {
        x: spawn.x,
        y: spawn.y,
        vx: (Math.random() - 0.5) * config.speed * 2,
        vy: position === 'top' ? config.speed * (1 + Math.random()) 
           : -config.speed * (1 + Math.random()),
        size,
        opacity: 0,
        life: 0,
        maxLife: 150 + Math.random() * 150,
      };
    };

    // Initialize with more particles
    for (let i = 0; i < config.particleCount; i++) {
      const particle = createParticle();
      // Stagger initial life for immediate visibility
      particle.life = Math.random() * 50;
      particlesRef.current.push(particle);
    }

    let frameCount = 0;

    // Enhanced animation loop
    const animate = () => {
      // Semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn new particles more frequently
      if (frameCount % Math.floor(30 / config.spawnRate) === 0) {
        // Remove dead particles
        particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);
        
        // Add new particles to maintain count
        while (particlesRef.current.length < config.particleCount) {
          particlesRef.current.push(createParticle());
        }
      }

      // Update and draw particles with enhanced visibility
      particlesRef.current.forEach(particle => {
        // Update particle physics
        particle.life++;
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Enhanced wavy motion for more organic movement
        particle.vx += Math.sin(particle.life * 0.05) * 0.3;
        particle.vx *= 0.98; // Slight damping
        
        // Stronger upward/downward drift
        if (position === 'bottom') {
          particle.vy -= 0.05; // Accelerate upward
        } else if (position === 'top') {
          particle.vy += 0.05; // Accelerate downward
        }
        
        // Enhanced fade in and out
        const lifeRatio = particle.life / particle.maxLife;
        if (lifeRatio < 0.1) {
          particle.opacity = (lifeRatio / 0.1) * config.maxOpacity;
        } else if (lifeRatio > 0.6) {
          particle.opacity = ((1 - lifeRatio) / 0.4) * config.maxOpacity;
        } else {
          particle.opacity = config.maxOpacity;
        }

        // Draw multiple layers for more visible steam
        for (let layer = 0; layer < 3; layer++) {
          const layerSize = particle.size * (1 + layer * 0.3);
          const layerOpacity = particle.opacity * (0.3 - layer * 0.1);
          
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, layerSize
          );
          
          // More visible gradient with color
          const { r, g, b } = config.color;
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${layerOpacity})`);
          gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${layerOpacity * 0.6})`);
          gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${layerOpacity * 0.3})`);
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, layerSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Add glow effect for intense variant
        if (variant === 'intense' && particle.opacity > 0.5) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = `rgba(${config.color.r}, ${config.color.g}, ${config.color.b}, 0.5)`;
          ctx.fillStyle = `rgba(${config.color.r}, ${config.color.g}, ${config.color.b}, ${particle.opacity * 0.3})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      frameCount++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [variant, position]);

  return (
    <canvas 
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ 
        mixBlendMode: variant === 'intense' ? 'screen' : 'normal',
        opacity: variant === 'subtle' ? 0.7 : 1
      }}
    />
  );
}
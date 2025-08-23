'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

type LogoQDotsProps = {
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'static' | 'animated' | 'interactive';
  colorScheme?: 'gradient' | 'mono' | 'adaptive';
  className?: string;
  showGrid?: boolean;
};

/**
 * Weekly Rhythm Logo - Dynamic Week
 * Represents 7 days of the week in a connected circle
 * Symbolizes efficient weekly planning and time management
 */
export function LogoWeeklyRhythm({
  size = 'md',
  variant = 'static',
  colorScheme = 'gradient',
  className,
  showLabels = true,
}: {
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'static' | 'animated' | 'interactive';
  colorScheme?: 'gradient' | 'mono' | 'adaptive';
  className?: string;
  showLabels?: boolean;
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  // HD Size configuration EXACTE din HTML-ul care funcționa perfect
  // For xxs, we render at 2x internal resolution (96px) but display at 48px for sharpness
  const sizeConfig: Record<string, {
    viewBox: number;
    baseRadius: number;
    daySize: number;
    centerSize: number;
    strokeWidth: number;
    displaySize?: number;
  }> = {
    xxs: { viewBox: 96, baseRadius: 32, daySize: 6, centerSize: 4, strokeWidth: 2, displaySize: 48 },
    xs: { viewBox: 64, baseRadius: 22, daySize: 4, centerSize: 2.5, strokeWidth: 1.5 },
    sm: { viewBox: 128, baseRadius: 46, daySize: 7, centerSize: 5, strokeWidth: 3 },
    md: { viewBox: 192, baseRadius: 69, daySize: 10, centerSize: 8, strokeWidth: 5 },
    lg: { viewBox: 256, baseRadius: 92, daySize: 13, centerSize: 10, strokeWidth: 6 },
    xl: { viewBox: 384, baseRadius: 138, daySize: 20, centerSize: 15, strokeWidth: 8 },
  };

  const config = sizeConfig[size];
  const center = config.viewBox / 2;
  
  // Coral + Teal color palette - conceptul final HD
  const coralTealColors = [
    '#FF6B6B', // coral vibrant
    '#2AA6A0', // teal primary  
    '#FFB3B3', // coral deschis
    '#4DB6AC', // teal mediu
    '#FFCCCB', // coral pastel
    '#80CBC4', // teal deschis
    '#FF7F7F', // coral intens
  ];

  // 6 days cu pozițiile exacte din mockup - formă de "C" cu GAP în stânga
  const days = [
    { 
      label: 'L', 
      name: 'Luni', 
      angle: 0, // sus
      color: coralTealColors[0], // coral vibrant
      radiusOffset: 1.0
    },
    { 
      label: 'Ma', 
      name: 'Marți', 
      angle: 51.43, // sus-dreapta
      color: coralTealColors[1], // teal primary
      radiusOffset: 1.0
    },
    { 
      label: 'Mi', 
      name: 'Miercuri', 
      angle: 102.86, // dreapta
      color: coralTealColors[2], // coral deschis
      radiusOffset: 1.0
    },
    { 
      label: 'J', 
      name: 'Joi', 
      angle: 154.29, // jos-dreapta
      color: coralTealColors[3], // teal mediu
      radiusOffset: 1.0
    },
    { 
      label: 'V', 
      name: 'Vineri', 
      angle: 205.71, // jos
      color: coralTealColors[4], // coral pastel
      radiusOffset: 1.0
    },
    { 
      label: 'S', 
      name: 'Sâmbătă', 
      angle: 257.14, // jos-stânga
      color: coralTealColors[5], // teal deschis
      radiusOffset: 1.0
    },
    // Eliminat Duminica (308.57° - sus-stânga) pentru GAP în forma de "C"
  ];

  // C-shape dots pentru versiunea statică (6 puncte pe contur + 1 în gaură)
  const cShapeDots = [
    { x: center, y: center - config.baseRadius, color: coralTealColors[0] }, // sus
    { x: center + config.baseRadius * 0.707, y: center - config.baseRadius * 0.707, color: coralTealColors[1] }, // sus-dreapta
    { x: center + config.baseRadius * 0.707, y: center + config.baseRadius * 0.707, color: coralTealColors[2] }, // jos-dreapta  
    { x: center, y: center + config.baseRadius, color: coralTealColors[3] }, // jos
    { x: center - config.baseRadius * 0.707, y: center + config.baseRadius * 0.707, color: coralTealColors[4] }, // jos-stânga
    { x: center - config.baseRadius * 0.707, y: center - config.baseRadius * 0.707, color: coralTealColors[5] }, // sus-stânga
  ];
  
  // Bula în gaura C-ului (în stânga)
  const cGapDot = { 
    x: center - config.baseRadius * 0.4, 
    y: center, 
    color: coralTealColors[6] 
  };

  const calculatePosition = (angle: number, radiusOffset: number) => {
    const adjustedRadius = config.baseRadius * radiusOffset;
    const radian = (angle - 90) * (Math.PI / 180); // -90 to start from top
    return {
      x: center + Math.cos(radian) * adjustedRadius,
      y: center + Math.sin(radian) * adjustedRadius,
    };
  };

  const gradientId = `coralGradient-${size}`;
  const connectionGradientId = `connectionGradient-${size}`;

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        variant === 'interactive' && 'cursor-pointer',
        className
      )}
      onMouseEnter={variant === 'interactive' ? () => setIsHovered(true) : undefined}
      onMouseLeave={variant === 'interactive' ? () => setIsHovered(false) : undefined}
    >
      <svg
        width={config.displaySize || config.viewBox}
        height={config.displaySize || config.viewBox}
        viewBox={`0 0 ${config.viewBox} ${config.viewBox}`}
        className="w-full h-full"
        style={{ 
          maxWidth: '100%', 
          height: 'auto',
          ...(size === 'xxs' && { 
            transform: 'translateZ(0)',
            filter: 'contrast(1.1)',
            willChange: 'transform',
            contain: 'layout style paint',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden'
          }) // Enhanced rendering for sharpness
        }}
        shapeRendering={size === 'xxs' ? 'crispEdges' : 'auto'}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* HD Coral + Teal gradient pentru puncte */}
          <radialGradient id={gradientId} cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFB3B3" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#2AA6A0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.8" />
          </radialGradient>

          {/* HD Gradient pentru conexiuni - coral + teal */}
          <linearGradient id={connectionGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFCCCB" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#80CBC4" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FF7F7F" stopOpacity="0.1" />
          </linearGradient>

          {/* HD Filter pentru glow - mai puternic */}
          <filter id="subtleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Conexiuni subtile între puncte - nu ca la ceas */}
        {variant !== 'static' && (
          <g className="connection-lines" opacity="0.3">
            {days.map((day, index) => {
              const nextDay = days[(index + 1) % days.length];
              const pos1 = calculatePosition(day.angle, day.radiusOffset);
              const pos2 = calculatePosition(nextDay.angle, nextDay.radiusOffset);
              
              return (
                <path
                  key={`connection-${index}`}
                  d={`M ${pos1.x} ${pos1.y} Q ${center} ${center} ${pos2.x} ${pos2.y}`}
                  stroke={`url(#${connectionGradientId})`}
                  strokeWidth="0.5"
                  fill="none"
                  className="transition-all duration-700"
                />
              );
            })}
          </g>
        )}

        {/* Versiunea STATICĂ: C-shape din bule */}
        {variant === 'static' && (
          <g className="c-shape-static">
            {/* 6 puncte pe conturul C-ului */}
            {cShapeDots.map((dot, index) => (
              <g key={`c-dot-group-${index}`}>
                {/* Shadow circle for edge definition (dual-stroke technique) */}
                {size === 'xxs' && (
                  <circle
                    cx={Math.round(dot.x)}
                    cy={Math.round(dot.y)}
                    r={config.daySize + 0.5}
                    fill="none"
                    stroke="black"
                    strokeWidth="0.5"
                    opacity="0.15"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
                {/* Main colored circle */}
                <circle
                  key={`c-dot-${index}`}
                  cx={Math.round(dot.x)}
                  cy={Math.round(dot.y)}
                  r={config.daySize}
                  fill={dot.color}
                  stroke={dot.color}
                  strokeWidth={size === 'xxs' ? "2" : "1"}
                  filter={size === 'xxs' ? undefined : "url(#subtleGlow)"}
                  vectorEffect="non-scaling-stroke"
                  className="transition-all duration-500"
                />
              </g>
            ))}
            
            {/* Bula în gaura C-ului */}
            <circle
              cx={cGapDot.x}
              cy={cGapDot.y}
              r={config.daySize * 0.85}
              fill={cGapDot.color}
              stroke={cGapDot.color}
              strokeWidth="1.5"
              filter="url(#subtleGlow)"
              opacity="0.8"
            />
            
            {/* Punct central dublu HD */}
            <circle
              cx={center}
              cy={center}
              r={config.centerSize}
              fill="#FF8E8E"
              opacity="0.8"
            />
            <circle
              cx={center}
              cy={center}
              r={config.centerSize * 0.6}
              fill="white"
              opacity="0.9"
            />
          </g>
        )}

        {/* Versiunea ANIMATĂ: Weekly Rhythm cu rotire */}
        {variant !== 'static' && (
          <g 
            className={cn(
              'weekly-dots transition-all duration-1000',
              (variant === 'animated' || (variant === 'interactive' && isHovered)) && 'animate-spin'
            )}
            style={{ 
              animationDirection: 'reverse', // rotire inversă față de ace
              animationDuration: '12s', // mai lent ca să fie observabil
              transformOrigin: `${center}px ${center}px`
            }}
          >
            {days.map((day, index) => {
              const pos = calculatePosition(day.angle, day.radiusOffset);
              const isWeekend = day.label === 'S' || day.label === 'D';
              
              return (
                <g key={day.label}>
                  {/* Shadow circle for edge definition at xxs size */}
                  {size === 'xxs' && (
                    <circle
                      cx={Math.round(pos.x)}
                      cy={Math.round(pos.y)}
                      r={config.daySize + 0.5}
                      fill="none"
                      stroke="black"
                      strokeWidth="0.5"
                      opacity="0.15"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                  {/* Punctul pentru zi HD */}
                  <circle
                    cx={size === 'xxs' ? Math.round(pos.x) : pos.x}
                    cy={size === 'xxs' ? Math.round(pos.y) : pos.y}
                    r={config.daySize}
                    fill={day.color}
                    stroke={day.color}
                    strokeWidth={size === 'xxs' ? "2" : "1.5"}
                    filter={size === 'xxs' ? undefined : "url(#subtleGlow)"}
                    vectorEffect="non-scaling-stroke"
                    className={cn(
                      'transition-all duration-500',
                      'animate-pulse', // întotdeauna animate pentru variant !== 'static'
                      isWeekend && 'opacity-85' // weekend-ul puțin mai transparent
                    )}
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      animationDuration: '3s',
                    }}
                  />
                  
                  {/* Etichetele zilelor HD */}
                  {showLabels && (
                    <text
                      x={pos.x}
                      y={pos.y + config.daySize * 0.15}
                      textAnchor="middle"
                      className="font-semibold"
                      style={{ 
                        fontSize: `${config.daySize * 0.6}px`,
                        fill: 'white',
                        fontFamily: 'Inter, system-ui, sans-serif'
                      }}
                    >
                      {day.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* Clock hands HD - rotire normală, opusă punctelor */}
        {variant !== 'static' && (
          <g className="clock-hands">
            {/* Ac rapid HD - coral */}
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={center - config.baseRadius * 0.6}
              stroke="#FF6B6B"
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              opacity="0.7"
              vectorEffect="non-scaling-stroke"
              className={cn(
                'transition-all duration-500',
                (variant === 'animated' || (variant === 'interactive' && isHovered)) && 'animate-spin'
              )}
              style={{ 
                animationDuration: '8s', // rapid
                transformOrigin: `${center}px ${center}px`
              }}
            />
            
            {/* Ac lent HD - teal */}
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={center - config.baseRadius * 0.4}
              stroke="#2AA6A0"
              strokeWidth={config.strokeWidth + 1}
              strokeLinecap="round" 
              opacity="0.6"
              vectorEffect="non-scaling-stroke"
              className={cn(
                'transition-all duration-500',
                (variant === 'animated' || (variant === 'interactive' && isHovered)) && 'animate-spin'
              )}
              style={{ 
                animationDuration: '15s', // lent
                transformOrigin: `${center}px ${center}px`
              }}
            />
            
            {/* Punct central HD dublu */}
            <circle
              cx={center}
              cy={center}
              r={config.centerSize}
              fill="#FF8E8E"
              opacity="0.8"
            />
            <circle
              cx={center}
              cy={center}
              r={config.centerSize * 0.6}
              fill="white"
              opacity="0.9"
            />
          </g>
        )}
      </svg>
    </div>
  );
}

/**
 * Q-Dots Matrix Logo - Simple version for basic functionality
 */
export function LogoQDots({
  size = 'md',
  variant = 'static',
  colorScheme = 'gradient',
  className,
}: {
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'static' | 'animated' | 'interactive';
  colorScheme?: 'gradient' | 'mono' | 'adaptive';
  className?: string;
}) {
  const sizeConfig = {
    xxs: { viewBox: 18, dotSize: 1, gap: 2 },
    xs: { viewBox: 24, dotSize: 1.5, gap: 3 },
    sm: { viewBox: 32, dotSize: 2, gap: 4 },
    md: { viewBox: 48, dotSize: 3, gap: 6 },
    lg: { viewBox: 64, dotSize: 4, gap: 8 },
    xl: { viewBox: 96, dotSize: 6, gap: 12 },
  };

  const config = sizeConfig[size];

  return (
    <svg
      viewBox={`0 0 ${config.viewBox} ${config.viewBox}`}
      className={cn('logo-q-dots', className)}
      role="img"
      aria-label="Coquinate Q-Dots Logo"
    >
      <circle
        cx={config.viewBox / 2}
        cy={config.viewBox / 2}
        r={config.dotSize * 3}
        fill="#2AA6A0"
      />
    </svg>
  );
}

/**
 * Q-Dots Logo with Coquinate text lockup - Simple version
 */
export function LogoQDotsLockup({
  variant = 'horizontal',
  size = 'md',
  animated = false,
  showTagline = false,
  className,
}: {
  variant?: 'horizontal' | 'vertical' | 'compact';
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showTagline?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <LogoQDots size={size} />
      <span className="font-display font-bold text-2xl text-primary-warm">
        <span className="font-thin">Co</span>
        <span className="font-bold">Q</span>
        <span className="font-normal">uinate</span>
      </span>
    </div>
  );
}

/**
 * Weekly Rhythm Logo with Coquinate text lockup - Simple version
 */
export function LogoWeeklyRhythmLockup({
  variant = 'horizontal',
  size = 'md',
  animated = false,
  showTagline = false,
  className,
}: {
  variant?: 'horizontal' | 'vertical' | 'compact';
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showTagline?: boolean;
  className?: string;
}) {
  // Size configurations for text - increased by 20% more
  const sizeConfig = {
    xxs: 'text-2xl',    // increased from text-xl
    xs: 'text-3xl',     // increased from text-2xl
    sm: 'text-4xl',     // increased from text-3xl
    md: 'text-5xl',     // increased from text-4xl
    lg: 'text-6xl',     // increased from text-5xl
    xl: 'text-7xl',     // increased from text-6xl
  };

  const textSize = sizeConfig[size] || sizeConfig.md;

  return (
    <div className={cn(
      'inline-flex items-center gap-4 group', // Increased gap from 3 to 4 for more spacing
      className
    )}>
      {/* Logo icon with rotation on hover */}
      <div className="transition-transform duration-300 group-hover:rotate-12">
        <LogoWeeklyRhythm size={size} variant={animated ? 'animated' : 'static'} />
      </div>
      
      {/* Text with color inversion on hover */}
      <span className={cn(
        'font-display font-bold tracking-tight transition-colors duration-300',
        textSize,
        // Normal state: teal with coral q
        'text-primary',
        // Hover state: coral text
        'group-hover:text-accent-coral'
      )}>
        Co<span className={cn(
          'transition-colors duration-300',
          'text-accent-coral', // Normal: coral
          'group-hover:text-primary' // Hover: teal
        )}>q</span>uinate
      </span>
    </div>
  );
}
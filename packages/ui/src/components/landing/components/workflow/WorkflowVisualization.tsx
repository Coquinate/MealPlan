"use client"

import { IconChefHat, IconFileText, IconStack2 } from "@tabler/icons-react"
import { WorkflowStep } from "./WorkflowStep"
import { WorkflowTimeline } from "./WorkflowTimeline"
import { LazyMotion, domAnimation, useReducedMotion } from "motion/react"
import { m } from "../../../../motion/config"
import { useI18nWithFallback } from "../../../../hooks/useI18nWithFallback"
import { useTransition, useDeferredValue, useState } from "react"

export interface WorkflowVisualizationProps {
  className?: string
  showTitle?: boolean
}

/**
 * Complete workflow visualization component with responsive design.
 * Shows timeline on mobile and floating steps with SVG path on desktop.
 * 
 * @param className - Additional CSS classes for the container
 * @param showTitle - Whether to show the section title
 */
export function WorkflowVisualization({ 
  className = "", 
  showTitle = true 
}: WorkflowVisualizationProps) {
  const { t } = useI18nWithFallback("landing" as any)
  const shouldReduceMotion = useReducedMotion()
  
  // React 19: Use transition for non-blocking animation updates
  const [isPending, startTransition] = useTransition()
  const [activeStep, setActiveStep] = useState(0)
  
  // Handle step changes with concurrent rendering
  const handleStepChange = (step: number) => {
    startTransition(() => {
      setActiveStep(step)
    })
  }

  // Dynamic workflow steps using i18n keys
  const workflowSteps = [
    {
      id: "sunday",
      icon: <IconChefHat size={12} className="text-accent-coral" />,
      title: t("workflow.cook_sunday.title", "Gătești Duminică"),
      description: t("workflow.cook_sunday.description", "Prepari o masă principală"),
      alignment: "left" as const
    },
    {
      id: "monday",
      icon: <IconFileText size={12} className="text-accent-coral" />,
      title: t("workflow.reuse_monday.title", "Refolosești Luni"),
      description: t("workflow.reuse_monday.description", "Transformi într-un prânz rapid"),
      alignment: "right" as const
    },
    {
      id: "tuesday",
      icon: <IconStack2 size={12} className="text-accent-coral" />,
      title: t("workflow.reinvent_tuesday.title", "Reinventezi Marți"),
      description: t("workflow.reinvent_tuesday.description", "Creezi o cină nouă"),
      alignment: "left" as const
    }
  ]

  // Dynamic desktop steps using i18n keys
  const desktopSteps = [
    {
      icon: <IconChefHat size={18} className="text-accent-coral" />,
      title: t("workflow.cook_sunday.title", "Gătești Duminică"),
      description: t("workflow.cook_sunday.description", "Prepari o masă principală."),
      position: { top: "15%", left: "20%" },
      animationDelay: 0
    },
    {
      icon: <IconFileText size={18} className="text-accent-coral" />,
      title: t("workflow.reuse_monday.title", "Refolosești Luni"),
      description: t("workflow.reuse_monday.description", "Transformi într-un prânz rapid."),
      position: { top: "45%", left: "0%" },
      animationDelay: 1000
    },
    {
      icon: <IconStack2 size={18} className="text-accent-coral" />,
      title: t("workflow.reinvent_tuesday.title", "Reinventezi Marți"),
      description: t("workflow.reinvent_tuesday.description", "Creezi o cină nouă."),
      position: { top: "75%", left: "30%" },
      animationDelay: 2000
    }
  ]

  // Container animation for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  // Step floating animation - respects reduced motion preference
  const floatingVariants = {
    initial: { y: 0 },
    animate: shouldReduceMotion ? { y: 0 } : {
      y: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      }
    }
  }

  // SVG Path animation
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
        opacity: { duration: 0.5 }
      }
    }
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div 
        className={`relative w-full ${className}`}
        style={isPending ? { opacity: 0.7, transition: 'opacity 0.2s' } : {}}>
        {/* Mobile View */}
        <m.div 
          className="block lg:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
        {showTitle && (
          <m.div 
            className="text-center mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-display text-lg font-semibold text-gray-900 mb-1">
              {t("workflow.title", "Cum funcționează?")}
            </h3>
            <p className="text-xs text-gray-600">
              {t("workflow.subtitle", "Un singur efort, trei mese delicioase")}
            </p>
          </m.div>
        )}
        
        <WorkflowTimeline steps={workflowSteps} />
      </m.div>

      {/* Desktop View */}
      <m.div 
        className="hidden lg:block relative w-full min-h-[600px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Background Path with Logo Dots Animation - Optimized for Sharpness */}
        <svg
          className="absolute top-0 left-0 w-full h-full z-0"
          viewBox="0 0 300 300"
          preserveAspectRatio="xMidYMid meet"
          shapeRendering="geometricPrecision"
          style={{
            transform: 'translateZ(0)',           // Force GPU rendering
            filter: 'contrast(1.05)',             // Slight edge enhancement
            willChange: 'transform',              // Optimize for transforms
            contain: 'layout style paint',        // Isolate rendering
            WebkitBackfaceVisibility: 'hidden',   // Prevent flicker
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Define filters and gradients */}
          <defs>
            {/* Enhanced glow with sharper definition */}
            <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="coloredBlur"/>
              <feConvolveMatrix 
                in="coloredBlur"
                order="3"
                kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"
                divisor="1"
                result="sharpened"
              />
              <feMerge>
                <feMergeNode in="sharpened"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Edge definition filter */}
            <filter id="edgeEnhance">
              <feMorphology operator="dilate" radius="0.5"/>
              <feGaussianBlur stdDeviation="0.5"/>
              <feComponentTransfer>
                <feFuncA type="discrete" tableValues="0 .5 .5 .5 1"/>
              </feComponentTransfer>
            </filter>
            
            {/* Coral-Teal gradient inspired by logo */}
            <radialGradient id="coralTealGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="100%" stopColor="#2AA6A0" />
            </radialGradient>
          </defs>
          
          {/* Base static dashed path - optimized */}
          <m.path
            d="M 87 45 C 60 80, 45 110, 27 135 C 10 160, 40 190, 80 210 C 100 220, 110 235, 117 290"
            className="stroke-gray-200 dark:stroke-accent-coral-400"
            fill="transparent"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.3"
            variants={pathVariants}
            initial="hidden"
            animate="visible"
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Animated Logo Dots flowing along path */}
          {!shouldReduceMotion && (
            <>
              {/* Invisible path for animation reference */}
              <path
                id="animationPath"
                d="M 87 45 C 60 80, 45 110, 27 135 C 10 160, 40 190, 80 210 C 100 220, 110 235, 117 290"
                fill="transparent"
              />
              
              {/* Weekly Rhythm dots with day initials - 7 days of the week */}
              {[
                { label: 'L', name: 'Luni', color: '#FF6B6B', delay: 0 },         // coral vibrant
                { label: 'Ma', name: 'Marți', color: '#2AA6A0', delay: 0.8 },     // teal primary
                { label: 'Mi', name: 'Miercuri', color: '#FFB3B3', delay: 1.6 },  // coral light
                { label: 'J', name: 'Joi', color: '#4DB6AC', delay: 2.4 },        // teal medium
                { label: 'V', name: 'Vineri', color: '#FFCCCB', delay: 3.2 },     // coral pastel
                { label: 'S', name: 'Sâmbătă', color: '#80CBC4', delay: 4 },      // teal light
                { label: 'D', name: 'Duminică', color: '#FF7F7F', delay: 4.8 },   // coral intense
              ].map((day, index) => (
                <g key={`flowing-day-${index}`}>
                  {/* Dual-stroke technique - Shadow circle for edge definition */}
                  <circle 
                    r="8.5" 
                    fill="none"
                    stroke="black"
                    strokeWidth="0.5"
                    opacity="0.15"
                    vectorEffect="non-scaling-stroke"
                  >
                    <animateMotion 
                      dur="7s" 
                      repeatCount="indefinite"
                      begin={`${day.delay}s`}
                      rotate="auto"
                    >
                      <mpath href="#animationPath" />
                    </animateMotion>
                  </circle>
                  
                  {/* Glow effect for each dot */}
                  <circle r="8" fill={day.color} opacity="0.2" filter="url(#dotGlow)">
                    <animateMotion 
                      dur="7s" 
                      repeatCount="indefinite"
                      begin={`${day.delay}s`}
                      rotate="auto"
                    >
                      <mpath href="#animationPath" />
                    </animateMotion>
                  </circle>
                  
                  {/* Main rotating group for dot and text */}
                  <g>
                    <animateMotion 
                      dur="7s" 
                      repeatCount="indefinite"
                      begin={`${day.delay}s`}
                      rotate="0"
                    >
                      <mpath href="#animationPath" />
                    </animateMotion>
                    
                    {/* Self rotation animation */}
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 0 0"
                      to="360 0 0"
                      dur="4s"
                      repeatCount="indefinite"
                      begin={`${day.delay}s`}
                      additive="sum"
                    />
                    
                    {/* Main colored dot with stroke for edge definition */}
                    <circle 
                      r="6" 
                      fill={day.color} 
                      stroke={day.color}
                      strokeWidth="1"
                      opacity="0.95"
                      vectorEffect="non-scaling-stroke"
                    >
                      {/* Pulsing animation */}
                      <animate
                        attributeName="r"
                        values="6;7;6"
                        dur="2s"
                        repeatCount="indefinite"
                        begin={`${day.delay}s`}
                      />
                    </circle>
                    
                    {/* Day initial text - enhanced contrast with shadow */}
                    <text
                      x="0"
                      y="2"
                      textAnchor="middle"
                      fill="white"
                      fontSize="5"
                      fontWeight="700"
                      fontFamily="Inter, system-ui, sans-serif"
                      opacity="1"
                      style={{
                        paintOrder: 'stroke fill',
                        stroke: day.color,
                        strokeWidth: '0.25px',
                        strokeLinejoin: 'round',
                        textShadow: '0 0 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      {day.label}
                    </text>
                  </g>
                </g>
              ))}
              
              {/* Additional trail effect - smaller fading dots - optimized */}
              {[0.4, 1.2, 2, 2.8, 3.6, 4.4, 5.2].map((delay, i) => (
                <g key={`trail-${i}`}>
                  {/* Shadow for trail dots */}
                  <circle 
                    r="3" 
                    fill="none"
                    stroke="black"
                    strokeWidth="0.25"
                    opacity="0.05"
                    vectorEffect="non-scaling-stroke"
                  >
                    <animateMotion 
                      dur="7s" 
                      repeatCount="indefinite"
                      begin={`${delay}s`}
                    >
                      <mpath href="#animationPath" />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;0.1;0"
                      dur="3.5s"
                      repeatCount="indefinite"
                      begin={`${delay}s`}
                    />
                  </circle>
                  {/* Main trail dot */}
                  <circle 
                    r="2.5" 
                    fill={i % 2 === 0 ? '#FF6B6B' : '#2AA6A0'}
                    opacity="0"
                    vectorEffect="non-scaling-stroke"
                  >
                    <animateMotion 
                      dur="7s" 
                      repeatCount="indefinite"
                      begin={`${delay}s`}
                    >
                      <mpath href="#animationPath" />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;0.3;0"
                      dur="3.5s"
                      repeatCount="indefinite"
                      begin={`${delay}s`}
                    />
                  </circle>
                </g>
              ))}
            </>
          )}
        </svg>

        {/* Desktop Steps */}
        {desktopSteps.map((step, index) => (
          <m.div
            key={index}
            className="absolute w-68 h-[90px] z-10 cursor-pointer"
            style={step.position}
            variants={floatingVariants}
            initial="initial"
            animate="animate"
            whileHover={{ 
              y: -10,
              transition: { duration: 0.2 }
            }}
            custom={index}
            transition={shouldReduceMotion ? {
              delay: index * 0.5,
              duration: 0,
              repeat: 0
            } : {
              delay: index * 0.5,
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <WorkflowStep
              icon={step.icon}
              title={step.title}
              description={step.description}
              size="md"
              animationDelay={step.animationDelay}
              className="hover:shadow-xl hover:border-primary-300 h-full"
            />
          </m.div>
        ))}
      </m.div>
    </div>
    </LazyMotion>
  )
}
"use client"

import { IconArrowDown } from "@tabler/icons-react"
import { ReactNode } from "react"
import { LazyMotion, domAnimation } from "motion/react"
import { m } from "../../../../motion/config"

interface TimelineStep {
  id: string
  icon: ReactNode
  title: string
  description: string
  alignment: "left" | "right"
}

interface WorkflowTimelineProps {
  steps: TimelineStep[]
  className?: string
  showArrows?: boolean
  dotColors?: string[]
}

/**
 * Timeline component for displaying workflow steps with animated transitions.
 * Renders steps alternating left and right with connecting lines and arrows.
 * 
 * @param steps - Array of timeline steps to display
 * @param className - Additional CSS classes for the container
 * @param showArrows - Whether to show arrows between steps
 * @param dotColors - Array of Tailwind color classes for timeline dots
 */
export function WorkflowTimeline({
  steps,
  className = "",
  showArrows = true,
  dotColors = ["bg-accent-coral-500", "bg-primary-600", "bg-accent-coral-500"]
}: WorkflowTimelineProps) {
  // Container animation variants for staggered children
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

  // Step animation variants
  const stepVariants: any = {
    hidden: { 
      opacity: 0,
      x: (custom: "left" | "right") => custom === "left" ? -30 : 30
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
      }
    }
  }

  // Dot animation variants
  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20
      }
    }
  }

  // Arrow animation variants
  const arrowVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20
      }
    }
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div 
        className={`relative max-w-xs mx-auto ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
      {/* Timeline Line with animated height */}
      <m.div 
        className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-accent-coral-500 via-primary-600 to-accent-coral-500 opacity-30"
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      {/* Steps */}
      {steps.map((step, index) => (
        <m.div key={step.id} variants={containerVariants}>
          {/* Step */}
          <div className="relative flex items-center mb-3">
            {/* Left side */}
            <div className={`w-1/2 ${step.alignment === "left" ? "pr-2 text-right" : ""}`}>
              {step.alignment === "left" && (
                <m.div 
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 shadow-md hover:shadow-lg transition-shadow"
                  custom="left"
                  variants={stepVariants}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-end gap-1.5 mb-1">
                    <span className="font-display font-semibold text-[10px] xs:text-xs text-gray-800 dark:text-gray-200 text-right line-clamp-2">{step.title}</span>
                    <m.div 
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg w-7 h-7 xs:w-8 xs:h-8 flex items-center justify-center shadow-sm flex-shrink-0"
                      whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
                    >
                      {step.icon}
                    </m.div>
                  </div>
                  <p className="text-[10px] xs:text-xs text-gray-600 dark:text-gray-400 text-right leading-tight line-clamp-2">{step.description}</p>
                </m.div>
              )}
            </div>

            {/* Timeline Dot */}
            <m.div 
              className={`absolute left-1/2 transform -translate-x-1/2 w-3 h-3 ${dotColors[index % dotColors.length]} rounded-full border-2 border-white shadow-lg z-10 ring-2 ring-white/50`}
              variants={dotVariants}
              whileHover={{ 
                scale: 1.5,
                transition: { type: "spring" as const, stiffness: 400, damping: 15 }
              }}
            />

            {/* Right side */}
            <div className={`w-1/2 ${step.alignment === "right" ? "pl-2" : ""}`}>
              {step.alignment === "right" && (
                <m.div 
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 shadow-md hover:shadow-lg transition-shadow"
                  custom="right"
                  variants={stepVariants}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <m.div 
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg w-7 h-7 xs:w-8 xs:h-8 flex items-center justify-center shadow-sm flex-shrink-0"
                      whileHover={{ rotate: -360, transition: { duration: 0.5 } }}
                    >
                      {step.icon}
                    </m.div>
                    <span className="font-display font-semibold text-[10px] xs:text-xs text-gray-800 dark:text-gray-200 line-clamp-2">{step.title}</span>
                  </div>
                  <p className="text-[10px] xs:text-xs text-gray-600 dark:text-gray-400 leading-tight line-clamp-2">{step.description}</p>
                </m.div>
              )}
            </div>
          </div>

          {/* Arrow between steps */}
          {showArrows && index < steps.length - 1 && (
            <m.div 
              className="flex justify-center mb-2"
              variants={arrowVariants}
            >
              <m.div 
                className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full p-1.5 shadow-sm"
                whileHover={{ 
                  scale: 1.2,
                  rotate: 180,
                  transition: { 
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }
                }}
              >
                <IconArrowDown size={14} className="text-primary-600 dark:text-primary-400" />
              </m.div>
            </m.div>
          )}
        </m.div>
      ))}
      </m.div>
    </LazyMotion>
  )
}
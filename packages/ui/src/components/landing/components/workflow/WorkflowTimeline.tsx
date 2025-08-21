"use client"

import { IconArrowDown } from "@tabler/icons-react"
import { ReactNode } from "react"
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
                  className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
                  custom="left"
                  variants={stepVariants}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-end gap-1.5 mb-0.5">
                    <span className="font-display font-semibold text-xs">{step.title}</span>
                    <m.div 
                      className="bg-accent-coral-100 rounded-md w-6 h-6 flex items-center justify-center"
                      whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
                    >
                      {step.icon}
                    </m.div>
                  </div>
                  <p className="text-xs text-gray-600 text-right">{step.description}</p>
                </m.div>
              )}
            </div>

            {/* Timeline Dot */}
            <m.div 
              className={`absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 ${dotColors[index % dotColors.length]} rounded-full border-2 border-white shadow-sm z-10`}
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
                  className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
                  custom="right"
                  variants={stepVariants}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <m.div 
                      className="bg-accent-coral-100 rounded-md w-6 h-6 flex items-center justify-center"
                      whileHover={{ rotate: -360, transition: { duration: 0.5 } }}
                    >
                      {step.icon}
                    </m.div>
                    <span className="font-display font-semibold text-xs">{step.title}</span>
                  </div>
                  <p className="text-xs text-gray-600">{step.description}</p>
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
                className="bg-gray-100 rounded-full p-1"
                whileHover={{ 
                  scale: 1.2,
                  backgroundColor: "rgb(229 231 235)", // gray-200
                  transition: { duration: 0.2 }
                }}
              >
                <IconArrowDown size={12} className="text-primary-600" />
              </m.div>
            </m.div>
          )}
        </m.div>
      ))}
    </m.div>
  )
}
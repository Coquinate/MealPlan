"use client"

import { ReactNode } from "react"
import { m } from "../../../../motion/config"

export interface WorkflowStepProps {
  icon: ReactNode
  title: string
  description: string
  alignment?: "left" | "right" | "center"
  isActive?: boolean
  animationDelay?: number
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: {
    container: "p-2",
    iconWrapper: "w-6 h-6",
    title: "text-xs",
    description: "text-xs",
    gap: "gap-1.5"
  },
  md: {
    container: "p-3",
    iconWrapper: "w-8 h-8",
    title: "text-sm",
    description: "text-xs",
    gap: "gap-2"
  },
  lg: {
    container: "p-4",
    iconWrapper: "w-10 h-10",
    title: "text-base",
    description: "text-sm",
    gap: "gap-3"
  }
}

/**
 * Individual workflow step component with icon and description.
 * Supports multiple sizes and animated reveal effects with spring physics.
 * 
 * @param icon - React node containing the step icon
 * @param title - Step title text
 * @param description - Step description text
 * @param alignment - Text alignment within the step
 * @param isActive - Whether the step is currently active
 * @param animationDelay - Delay before animation starts (in ms)
 * @param className - Additional CSS classes
 * @param size - Size variant of the step
 */
export function WorkflowStep({
  icon,
  title,
  description,
  alignment = "left",
  isActive = false,
  animationDelay = 0,
  className = "",
  size = "md"
}: WorkflowStepProps) {
  const sizes = sizeClasses[size]
  
  const alignmentClasses = {
    left: "flex-row",
    right: "flex-row-reverse text-right",
    center: "flex-col text-center items-center"
  }

  // Animation variants for staggered reveal
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: animationDelay / 1000,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
      }
    }
  }

  return (
    <m.div
      className={`
        bg-white dark:bg-black
        border-2 border-gray-200 dark:border-accent-coral-400
        rounded-lg ${sizes.container}
        shadow-sm dark:shadow-xl dark:shadow-accent-coral-400/30
        ${isActive ? "border-primary-600 bg-primary-50 dark:bg-gray-950 dark:border-accent-coral-300" : ""}
        ${className}
      `}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        scale: 1.03,
        y: -8,
        boxShadow: "0 0 40px oklch(70% 0.18 20 / 0.4), 0 20px 40px oklch(0% 0 0 / 0.2)",
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`flex items-center ${sizes.gap} ${alignmentClasses[alignment]}`}>
        <m.div 
          className={`
            bg-accent-coral-100 dark:bg-accent-coral-900/40
            rounded-lg ${sizes.iconWrapper} 
            flex items-center justify-center
          `}
          whileHover={{ 
            scale: isActive ? 1.15 : 1.1,
            rotate: [0, -5, 5, 0],
            transition: { 
              rotate: { duration: 0.5 },
              scale: { duration: 0.2 }
            }
          }}
          animate={isActive ? { scale: 1.1 } : {}}
        >
          {icon}
        </m.div>
        <div className={alignment === "center" ? "" : "flex-1"}>
          <h4 className={`font-display font-semibold ${sizes.title} text-gray-900 dark:text-white mb-0.5`}>
            {title}
          </h4>
          <p className={`${sizes.description} text-gray-600 dark:text-gray-300`}>
            {description}
          </p>
        </div>
      </div>
    </m.div>
  )
}
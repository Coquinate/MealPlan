"use client"

import { IconChefHat, IconFileText, IconStack2 } from "@tabler/icons-react"
import { WorkflowStep } from "./WorkflowStep"
import { WorkflowTimeline } from "./WorkflowTimeline"
import { useReducedMotion } from "motion/react"
import { m } from "../../../../motion/config"
import { useI18nWithFallback } from "../../../../hooks/useI18nWithFallback"

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
      icon: <IconChefHat size={20} className="text-accent-coral" />,
      title: t("workflow.cook_sunday.title", "Gătești Duminică"),
      description: t("workflow.cook_sunday.description", "Prepari o masă principală."),
      position: { top: "0", left: "20%" },
      animationDelay: 0
    },
    {
      icon: <IconFileText size={20} className="text-accent-coral" />,
      title: t("workflow.reuse_monday.title", "Refolosești Luni"),
      description: t("workflow.reuse_monday.description", "Transformi într-un prânz rapid."),
      position: { top: "45%", left: "0" },
      animationDelay: 1000
    },
    {
      icon: <IconStack2 size={20} className="text-accent-coral" />,
      title: t("workflow.reinvent_tuesday.title", "Reinventezi Marți"),
      description: t("workflow.reinvent_tuesday.description", "Creezi o cină nouă."),
      position: { top: "80%", left: "40%" },
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
    <div className={`relative w-full ${className}`}>
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
        className="hidden lg:block relative w-full min-h-96"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Background Path */}
        <svg
          className="absolute top-0 left-0 w-full h-full z-0"
          viewBox="0 0 300 300"
          preserveAspectRatio="xMidYMid meet"
        >
          <m.path
            d="M 110 40 C 40 100, 40 150, 85 175 C 130 200, 180 240, 210 280"
            className="stroke-gray-200"
            fill="transparent"
            strokeWidth="2"
            strokeDasharray="4 4"
            variants={pathVariants}
            initial="hidden"
            animate="visible"
          />
        </svg>

        {/* Desktop Steps */}
        {desktopSteps.map((step, index) => (
          <m.div
            key={index}
            className="absolute w-56 z-10 cursor-pointer"
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
              size="lg"
              animationDelay={step.animationDelay}
              className="hover:shadow-xl hover:border-primary-300"
            />
          </m.div>
        ))}
      </m.div>
    </div>
  )
}
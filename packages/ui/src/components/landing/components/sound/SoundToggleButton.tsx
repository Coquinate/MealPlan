"use client"

import { IconVolume2, IconVolumeOff } from "@tabler/icons-react"
import { useSoundPreferences } from "./useSoundPreferences"
import { useAudioEngine } from "./useAudioEngine"
import { AnimatePresence } from "motion/react"
import { m } from "../../../../motion/config"

interface SoundToggleButtonProps {
  className?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  size?: "sm" | "md" | "lg"
}

const positionClasses = {
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4"
}

const sizeClasses = {
  sm: "p-2",
  md: "p-3",
  lg: "p-4"
}

const iconSizes = {
  sm: 18,
  md: 20,
  lg: 24
}

export function SoundToggleButton({ 
  className = "", 
  position = "bottom-right",
  size = "md" 
}: SoundToggleButtonProps) {
  const { soundEnabled, toggleSound, isLoading } = useSoundPreferences()
  const { playClickSound } = useAudioEngine()

  const handleClick = () => {
    const newState = toggleSound()
    if (newState) {
      // Play a click sound when enabling sound
      setTimeout(() => playClickSound(), 50)
    }
  }

  if (isLoading) {
    return null // Don't render until we know the state
  }

  return (
    <m.button
      onClick={handleClick}
      className={`
        fixed ${positionClasses[position]} 
        bg-surface-raised/80 backdrop-blur-md 
        border border-border 
        rounded-full ${sizeClasses[size]} 
        shadow-lg z-50
        group hover:bg-surface-raised/90
        ${className}
      `}
      title={soundEnabled ? "Dezactivează sunetele" : "Activează sunetele"}
      aria-label={soundEnabled ? "Dezactivează sunetele" : "Activează sunetele"}
      aria-pressed={soundEnabled}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ 
        scale: 1.1
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      <AnimatePresence mode="wait">
        {soundEnabled ? (
          <m.div
            key="volume-on"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IconVolume2 
              size={iconSizes[size]} 
              className="text-primary-600 group-hover:text-primary-700" 
            />
          </m.div>
        ) : (
          <m.div
            key="volume-off"
            initial={{ rotate: 180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -180, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IconVolumeOff 
              size={iconSizes[size]} 
              className="text-gray-400 group-hover:text-gray-600" 
            />
          </m.div>
        )}
      </AnimatePresence>
    </m.button>
  )
}
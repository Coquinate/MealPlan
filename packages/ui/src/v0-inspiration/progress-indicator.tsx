"use client"

import { useState, useEffect } from "react"
import { IconUsers, IconTrendingUp } from "@tabler/icons-react"

export function ProgressIndicator() {
  const [signupCount, setSignupCount] = useState(0)
  const targetCount = 500
  const currentCount = 347 // Simulated current signup count

  useEffect(() => {
    // Animate the counter on mount
    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = currentCount / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= currentCount) {
        setSignupCount(currentCount)
        clearInterval(timer)
      } else {
        setSignupCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [currentCount])

  const progressPercentage = (signupCount / targetCount) * 100

  return (
    <div className="bg-gradient-to-r from-[var(--accent-coral-soft)]/10 to-[var(--primary-warm)]/10 border border-[var(--accent-coral-soft)]/20 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-[var(--accent-coral-soft)] rounded-full p-1.5">
            <IconUsers size={16} className="text-[var(--accent-coral)]" />
          </div>
          <span className="font-semibold text-sm text-[var(--text-primary)]">
            {signupCount} din {targetCount} locuri ocupate
          </span>
        </div>
        <div className="flex items-center gap-1 text-[var(--accent-coral)] text-xs font-medium">
          <IconTrendingUp size={12} />
          <span>{targetCount - signupCount} rămase</span>
        </div>
      </div>

      <div className="w-full bg-[var(--border-light)] rounded-full h-2 mb-2">
        <div
          className="bg-gradient-to-r from-[var(--accent-coral)] to-[var(--primary-warm)] h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <p className="text-xs text-[var(--text-muted)] text-center">
        <strong className="text-[var(--accent-coral)]">{Math.round(progressPercentage)}%</strong> din locurile gratuite
        sunt deja rezervate
      </p>
    </div>
  )
}

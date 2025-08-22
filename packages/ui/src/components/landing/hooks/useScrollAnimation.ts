import { useRef } from "react"
import { useInView, useAnimation } from "motion/react"
import { useEffect } from "react"

interface ScrollAnimationReturn {
  ref: React.RefObject<HTMLElement | null>
  isVisible: boolean
  controls: ReturnType<typeof useAnimation>
}

export function useScrollAnimation(threshold = 0.1): ScrollAnimationReturn {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { 
    once: true, 
    amount: threshold 
  })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return { 
    ref, 
    isVisible: isInView,
    controls 
  }
}

// Export additional scroll utilities for convenience
export { useScroll, useTransform, useSpring } from "motion/react"
"use client"

import { useCallback } from "react"

interface ToneOptions {
  frequency: number
  duration: number
  delay?: number
  gain?: number
}

// Global singleton AudioContext
let globalAudioContext: AudioContext | null = null

const getAudioContext = (): AudioContext => {
  if (!globalAudioContext) {
    globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return globalAudioContext
}

export function useAudioEngine() {

  const playTone = useCallback(({ frequency, duration, delay = 0, gain = 0.1 }: ToneOptions) => {
    const audioContext = getAudioContext()
    
    setTimeout(() => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(gain, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    }, delay)
  }, [getAudioContext])

  const playSuccessSound = useCallback(() => {
    try {
      const soundEnabled = localStorage.getItem("coquinate-sound-enabled") === "true"
      if (!soundEnabled) return
    } catch (error) {
      console.warn("Failed to read sound preferences:", error)
      return
    }

    // Play a pleasant success chord (C5, E5, G5)
    playTone({ frequency: 523.25, duration: 0.2, delay: 0 })    // C5
    playTone({ frequency: 659.25, duration: 0.2, delay: 100 })  // E5
    playTone({ frequency: 783.99, duration: 0.3, delay: 200 })  // G5
  }, [playTone])

  const playClickSound = useCallback(() => {
    try {
      const soundEnabled = localStorage.getItem("coquinate-sound-enabled") === "true"
      if (!soundEnabled) return
    } catch (error) {
      console.warn("Failed to read sound preferences:", error)
      return
    }

    // Simple click sound
    playTone({ frequency: 880, duration: 0.05, gain: 0.05 }) // A5
  }, [playTone])

  const playErrorSound = useCallback(() => {
    try {
      const soundEnabled = localStorage.getItem("coquinate-sound-enabled") === "true"
      if (!soundEnabled) return
    } catch (error) {
      console.warn("Failed to read sound preferences:", error)
      return
    }

    // Error sound (minor chord)
    playTone({ frequency: 440, duration: 0.15, delay: 0 })    // A4
    playTone({ frequency: 528, duration: 0.15, delay: 50 })   // C5
    playTone({ frequency: 660, duration: 0.2, delay: 100 })   // E5
  }, [playTone])

  return {
    playSuccessSound,
    playClickSound,
    playErrorSound,
    playTone
  }
}

// Export standalone function for backward compatibility
export function playSuccessSound() {
  try {
    const soundEnabled = localStorage.getItem("coquinate-sound-enabled") === "true"
    if (!soundEnabled) return
  } catch (error) {
    console.warn("Failed to read sound preferences:", error)
    return
  }

  const audioContext = getAudioContext()

  const playTone = (frequency: number, duration: number, delay = 0) => {
    setTimeout(() => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    }, delay)
  }

  playTone(523.25, 0.2, 0)    // C5
  playTone(659.25, 0.2, 100)  // E5
  playTone(783.99, 0.3, 200)  // G5
}
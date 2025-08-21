"use client"

import { useState, useEffect } from "react"
import { IconVolume2, IconVolumeX } from "@tabler/icons-react"

export function SoundToggle() {
  const [soundEnabled, setSoundEnabled] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("coquinate-sound-enabled")
    setSoundEnabled(saved === "true")
  }, [])

  const toggleSound = () => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    localStorage.setItem("coquinate-sound-enabled", newState.toString())
  }

  return (
    <button
      onClick={toggleSound}
      className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-md border border-white/30 rounded-full p-3 shadow-lg hover:bg-white/90 transition-all duration-200 z-50"
      title={soundEnabled ? "Dezactivează sunetele" : "Activează sunetele"}
    >
      {soundEnabled ? (
        <IconVolume2 size={20} className="text-[var(--primary-warm)]" />
      ) : (
        <IconVolumeX size={20} className="text-[var(--text-muted)]" />
      )}
    </button>
  )
}

export function playSuccessSound() {
  const soundEnabled = localStorage.getItem("coquinate-sound-enabled") === "true"
  if (!soundEnabled) return

  // Create a simple success sound using Web Audio API
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

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

  // Play a pleasant success chord
  playTone(523.25, 0.2, 0) // C5
  playTone(659.25, 0.2, 100) // E5
  playTone(783.99, 0.3, 200) // G5
}

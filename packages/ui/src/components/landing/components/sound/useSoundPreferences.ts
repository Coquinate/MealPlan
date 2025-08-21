"use client"

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "coquinate-sound-enabled"

export function useSoundPreferences() {
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      setSoundEnabled(saved === "true")
    } catch (error) {
      console.warn("Failed to read sound preferences from localStorage:", error)
      setSoundEnabled(false) // Default to false if localStorage fails
    } finally {
      setIsLoading(false)
    }
  }, [])

  const toggleSound = useCallback(() => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    try {
      localStorage.setItem(STORAGE_KEY, newState.toString())
    } catch (error) {
      console.warn("Failed to save sound preferences to localStorage:", error)
    }
    return newState
  }, [soundEnabled])

  const getSoundEnabled = useCallback(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true"
    } catch (error) {
      console.warn("Failed to read sound preferences from localStorage:", error)
      return false
    }
  }, [])

  return {
    soundEnabled,
    toggleSound,
    getSoundEnabled,
    isLoading
  }
}
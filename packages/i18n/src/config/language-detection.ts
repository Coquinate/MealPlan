/**
 * Client-side language detection and persistence
 * Handles browser storage, URL parameters, and user preferences
 */

import React from 'react'
import i18n from './i18n'
import type { TranslationNamespace } from './hooks'

export interface LanguageDetectionOptions {
  /** Supported language codes */
  supportedLanguages: string[]
  /** Default fallback language */
  defaultLanguage: string
  /** Whether to persist language choice */
  persistLanguage: boolean
  /** Storage method for persistence */
  storageMethod: 'localStorage' | 'sessionStorage' | 'cookie'
  /** Cookie/storage key name */
  storageKey: string
  /** Cookie expiration days (only for cookie storage) */
  cookieExpirationDays: number
  /** Whether to detect from URL parameters */
  detectFromUrl: boolean
  /** URL parameter name to check */
  urlParameter: string
  /** Whether to detect from browser language */
  detectFromBrowser: boolean
}

const defaultOptions: LanguageDetectionOptions = {
  supportedLanguages: ['ro', 'en'],
  defaultLanguage: 'ro',
  persistLanguage: true,
  storageMethod: 'localStorage',
  storageKey: 'coquinate-language',
  cookieExpirationDays: 365,
  detectFromUrl: true,
  urlParameter: 'lang',
  detectFromBrowser: true
}

/**
 * Language detection and persistence manager
 * Handles all aspects of language detection and user preference storage
 */
export class LanguageManager {
  private options: LanguageDetectionOptions
  private currentLanguage: string
  private listeners: Set<(language: string) => void> = new Set()

  constructor(options: Partial<LanguageDetectionOptions> = {}) {
    this.options = { ...defaultOptions, ...options }
    this.currentLanguage = this.options.defaultLanguage
  }

  /**
   * Initialize language detection
   * Runs through detection priority and sets initial language
   * 
   * @returns Promise resolving to detected language
   */
  async initialize(): Promise<string> {
    const detectedLanguage = this.detectLanguage()
    await this.changeLanguage(detectedLanguage)
    return detectedLanguage
  }

  /**
   * Detect language from various sources
   * Priority: URL -> Stored preference -> Browser -> Default
   * 
   * @returns Detected language code
   */
  detectLanguage(): string {
    // 1. Check URL parameters
    if (this.options.detectFromUrl) {
      const urlLanguage = this.getLanguageFromUrl()
      if (urlLanguage && this.isLanguageSupported(urlLanguage)) {
        return urlLanguage
      }
    }

    // 2. Check stored preference
    if (this.options.persistLanguage) {
      const storedLanguage = this.getStoredLanguage()
      if (storedLanguage && this.isLanguageSupported(storedLanguage)) {
        return storedLanguage
      }
    }

    // 3. Check browser language
    if (this.options.detectFromBrowser) {
      const browserLanguage = this.getBrowserLanguage()
      if (browserLanguage && this.isLanguageSupported(browserLanguage)) {
        return browserLanguage
      }
    }

    // 4. Default language
    return this.options.defaultLanguage
  }

  /**
   * Change current language
   * Updates i18next, persists choice, and notifies listeners
   * 
   * @param language - Language code to switch to
   * @returns Promise resolving when language change is complete
   */
  async changeLanguage(language: string): Promise<void> {
    if (!this.isLanguageSupported(language)) {
      console.warn(`Language '${language}' not supported. Using default.`)
      language = this.options.defaultLanguage
    }

    if (this.currentLanguage === language) {
      return // No change needed
    }

    try {
      // Update i18next
      await i18n.changeLanguage(language)
      
      // Update internal state
      this.currentLanguage = language
      
      // Persist choice
      if (this.options.persistLanguage) {
        this.storeLanguage(language)
      }
      
      // Update document language attribute
      if (typeof document !== 'undefined') {
        document.documentElement.lang = language
      }
      
      // Notify listeners
      this.notifyListeners(language)
      
      console.log(`Language changed to: ${language}`)
    } catch (error) {
      console.error('Error changing language:', error)
      throw error
    }
  }

  /**
   * Get current language
   * @returns Current language code
   */
  getCurrentLanguage(): string {
    return this.currentLanguage
  }

  /**
   * Check if language is supported
   * @param language - Language code to check
   * @returns True if language is supported
   */
  isLanguageSupported(language: string): boolean {
    return this.options.supportedLanguages.includes(language)
  }

  /**
   * Get all supported languages
   * @returns Array of supported language codes
   */
  getSupportedLanguages(): string[] {
    return [...this.options.supportedLanguages]
  }

  /**
   * Add language change listener
   * @param listener - Callback function for language changes
   * @returns Function to remove the listener
   */
  addLanguageChangeListener(listener: (language: string) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Preload translation namespaces for better performance
   * @param namespaces - Namespaces to preload
   * @param language - Language to preload (defaults to current)
   * @returns Promise resolving when preloading is complete
   */
  async preloadNamespaces(
    namespaces: TranslationNamespace[],
    language?: string
  ): Promise<void> {
    const targetLanguage = language || this.currentLanguage
    
    try {
      await Promise.all(
        namespaces.map(ns => 
          new Promise<void>((resolve, reject) => {
            i18n.loadNamespaces(ns, (err) => {
              if (err) reject(err)
              else resolve()
            })
          })
        )
      )
      console.log(`Preloaded namespaces for ${targetLanguage}:`, namespaces)
    } catch (error) {
      console.error('Error preloading namespaces:', error)
    }
  }

  // Private methods

  private getLanguageFromUrl(): string | null {
    if (typeof window === 'undefined') return null
    
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(this.options.urlParameter)
  }

  private getBrowserLanguage(): string | null {
    if (typeof navigator === 'undefined') return null
    
    const browserLang = navigator.language || navigator.languages?.[0]
    return browserLang ? browserLang.split('-')[0] : null
  }

  private getStoredLanguage(): string | null {
    if (typeof window === 'undefined') return null
    
    switch (this.options.storageMethod) {
      case 'localStorage':
        return localStorage.getItem(this.options.storageKey)
      
      case 'sessionStorage':
        return sessionStorage.getItem(this.options.storageKey)
      
      case 'cookie':
        return this.getCookie(this.options.storageKey)
      
      default:
        return null
    }
  }

  private storeLanguage(language: string): void {
    if (typeof window === 'undefined') return
    
    switch (this.options.storageMethod) {
      case 'localStorage':
        localStorage.setItem(this.options.storageKey, language)
        break
      
      case 'sessionStorage':
        sessionStorage.setItem(this.options.storageKey, language)
        break
      
      case 'cookie':
        this.setCookie(this.options.storageKey, language, this.options.cookieExpirationDays)
        break
    }
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    
    return null
  }

  private setCookie(name: string, value: string, days: number): void {
    if (typeof document === 'undefined') return
    
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  }

  private notifyListeners(language: string): void {
    this.listeners.forEach(listener => {
      try {
        listener(language)
      } catch (error) {
        console.error('Error in language change listener:', error)
      }
    })
  }
}

// Default language manager instance
export const languageManager = new LanguageManager()

// Convenience functions
export const detectLanguage = () => languageManager.detectLanguage()
export const changeLanguage = (language: string) => languageManager.changeLanguage(language)
export const getCurrentLanguage = () => languageManager.getCurrentLanguage()
export const isLanguageSupported = (language: string) => languageManager.isLanguageSupported(language)
export const addLanguageChangeListener = (listener: (language: string) => void) => 
  languageManager.addLanguageChangeListener(listener)

/**
 * React hook for language management
 * Provides current language and change function with automatic re-renders
 * 
 * @returns Object with current language and change function
 */
export function useLanguageManager() {
  const [currentLanguage, setCurrentLanguage] = React.useState(() => 
    languageManager.getCurrentLanguage()
  )

  React.useEffect(() => {
    // Initialize language detection
    languageManager.initialize().catch(console.error)
    
    // Listen for language changes
    return languageManager.addLanguageChangeListener(setCurrentLanguage)
  }, [])

  const handleLanguageChange = React.useCallback(
    async (language: string) => {
      try {
        await languageManager.changeLanguage(language)
      } catch (error) {
        console.error('Failed to change language:', error)
      }
    },
    []
  )

  return {
    currentLanguage,
    changeLanguage: handleLanguageChange,
    supportedLanguages: languageManager.getSupportedLanguages(),
    isLanguageSupported: languageManager.isLanguageSupported
  }
}


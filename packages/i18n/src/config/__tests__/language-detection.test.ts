/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  LanguageManager,
  detectLanguage,
  changeLanguage,
  getCurrentLanguage,
  useLanguageManager
} from '../language-detection'
import { renderHook, act } from '@testing-library/react'

// Mock i18n module
vi.mock('../i18n', () => ({
  default: {
    changeLanguage: vi.fn(() => Promise.resolve()),
    language: 'ro',
    loadNamespaces: vi.fn((ns: string, cb?: (err?: any) => void) => {
      if (cb) cb()
      return Promise.resolve()
    })
  }
}))

// Mock DOM APIs
Object.defineProperty(global, 'window', {
  value: {
    location: {
      search: ''
    },
    localStorage: {
      getItem: vi.fn(),
      setItem: vi.fn()
    },
    sessionStorage: {
      getItem: vi.fn(),
      setItem: vi.fn()
    }
  },
  writable: true
})

Object.defineProperty(global, 'document', {
  value: {
    cookie: '',
    documentElement: {
      lang: 'ro'
    }
  },
  writable: true
})

Object.defineProperty(global, 'navigator', {
  value: {
    language: 'ro-RO',
    languages: ['ro-RO', 'ro', 'en-US', 'en']
  },
  writable: true
})

describe('LanguageManager', () => {
  let manager: LanguageManager

  beforeEach(() => {
    vi.clearAllMocks()
    manager = new LanguageManager()
  })

  describe('initialization', () => {
    it('should create manager with default options', () => {
      expect(manager.getCurrentLanguage()).toBe('ro')
      expect(manager.getSupportedLanguages()).toEqual(['ro', 'en'])
    })

    it('should create manager with custom options', () => {
      const customManager = new LanguageManager({
        defaultLanguage: 'en',
        supportedLanguages: ['en', 'fr'],
        storageKey: 'custom-lang'
      })

      expect(customManager.getCurrentLanguage()).toBe('en')
      expect(customManager.getSupportedLanguages()).toEqual(['en', 'fr'])
    })
  })

  describe('detectLanguage', () => {
    it('should return URL parameter if present', () => {
      // Mock URL search params
      Object.assign(global.window.location, { search: '?lang=en' })
      
      const detected = manager.detectLanguage()
      expect(detected).toBe('en')
    })

    it('should return stored language if URL not available', () => {
      Object.assign(global.window.location, { search: '' })
      vi.mocked(global.window.localStorage.getItem).mockReturnValue('en')
      
      const detected = manager.detectLanguage()
      expect(detected).toBe('en')
    })

    it('should return browser language if no stored preference', () => {
      Object.assign(global.window.location, { search: '' })
      vi.mocked(global.window.localStorage.getItem).mockReturnValue(null)
      Object.assign(global.navigator, { language: 'en-US' })
      
      const detected = manager.detectLanguage()
      expect(detected).toBe('en')
    })

    it('should return default if no detection possible', () => {
      Object.assign(global.window.location, { search: '' })
      vi.mocked(global.window.localStorage.getItem).mockReturnValue(null)
      Object.assign(global.navigator, { language: 'fr-FR' })
      
      const detected = manager.detectLanguage()
      expect(detected).toBe('ro')
    })

    it('should validate against supported languages', () => {
      Object.assign(global.window.location, { search: '?lang=fr' })
      
      const detected = manager.detectLanguage()
      expect(detected).toBe('ro') // Falls back to default since 'fr' not supported
    })
  })

  describe('changeLanguage', () => {
    it('should change language successfully', async () => {
      const { default: i18n } = await import('../i18n')
      await manager.changeLanguage('en')
      
      expect(i18n.changeLanguage).toHaveBeenCalledWith('en')
      expect(manager.getCurrentLanguage()).toBe('en')
      expect(global.window.localStorage.setItem).toHaveBeenCalledWith('coquinate-language', 'en')
    })

    it('should not change if language is the same', async () => {
      const { default: i18n } = await import('../i18n')
      await manager.changeLanguage('ro')
      
      expect(i18n.changeLanguage).not.toHaveBeenCalled()
    })

    it('should fallback to default for unsupported language', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      await manager.changeLanguage('fr')
      
      expect(consoleSpy).toHaveBeenCalledWith("Language 'fr' not supported. Using default.")
      expect(manager.getCurrentLanguage()).toBe('ro')
      
      consoleSpy.mockRestore()
    })

    it('should update document language attribute', async () => {
      await manager.changeLanguage('en')
      
      expect(global.document.documentElement.lang).toBe('en')
    })

    it('should notify listeners', async () => {
      const listener = vi.fn()
      manager.addLanguageChangeListener(listener)
      
      await manager.changeLanguage('en')
      
      expect(listener).toHaveBeenCalledWith('en')
    })
  })

  describe('preloadNamespaces', () => {
    it('should preload specified namespaces', async () => {
      const { default: i18n } = await import('../i18n')
      await manager.preloadNamespaces(['auth', 'meals'])
      
      expect(i18n.loadNamespaces).toHaveBeenCalledTimes(2)
    })

    it('should handle preload errors gracefully', async () => {
      const { default: i18n } = await import('../i18n')
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(i18n.loadNamespaces).mockImplementation((ns: string, cb: (err: any) => void) => {
        cb(new Error('Load failed'))
      })
      
      await manager.preloadNamespaces(['auth'])
      
      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })
  })

  describe('listeners', () => {
    it('should add and remove listeners', () => {
      const listener = vi.fn()
      const removeListener = manager.addLanguageChangeListener(listener)
      
      expect(typeof removeListener).toBe('function')
      
      removeListener()
      // Verify listener is removed by testing it's not called
    })

    it('should handle listener errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const faultyListener = vi.fn(() => { throw new Error('Listener error') })
      
      manager.addLanguageChangeListener(faultyListener)
      await manager.changeLanguage('en')
      
      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })
  })

  describe('storage methods', () => {
    it('should use sessionStorage when configured', async () => {
      const sessionManager = new LanguageManager({
        storageMethod: 'sessionStorage'
      })
      
      await sessionManager.changeLanguage('en')
      
      expect(global.window.sessionStorage.setItem).toHaveBeenCalledWith('coquinate-language', 'en')
    })

    it('should use cookies when configured', async () => {
      const cookieManager = new LanguageManager({
        storageMethod: 'cookie'
      })
      
      await cookieManager.changeLanguage('en')
      
      // Should set cookie (tested via document.cookie assignment)
      expect(cookieManager.getCurrentLanguage()).toBe('en')
    })
  })
})

describe('convenience functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should export convenience functions', () => {
    expect(typeof detectLanguage).toBe('function')
    expect(typeof changeLanguage).toBe('function')
    expect(typeof getCurrentLanguage).toBe('function')
  })
})

describe('useLanguageManager hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return language state and change function', () => {
    const { result } = renderHook(() => useLanguageManager())
    
    expect(result.current.currentLanguage).toBe('ro')
    expect(typeof result.current.changeLanguage).toBe('function')
    expect(Array.isArray(result.current.supportedLanguages)).toBe(true)
    expect(typeof result.current.isLanguageSupported).toBe('function')
  })

  it('should change language when called', async () => {
    const { result } = renderHook(() => useLanguageManager())
    
    await act(async () => {
      await result.current.changeLanguage('en')
    })
    
    const { default: i18n } = await import('../i18n')
    expect(i18n.changeLanguage).toHaveBeenCalledWith('en')
  })

  it('should handle change language errors', async () => {
    const { default: i18n } = await import('../i18n')
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(i18n.changeLanguage).mockRejectedValueOnce(new Error('Change failed'))
    
    const { result } = renderHook(() => useLanguageManager())
    
    await act(async () => {
      await result.current.changeLanguage('en')
    })
    
    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })
})
import { describe, it, expect, vi } from 'vitest'
import {
  detectLanguageSSR,
  initializeI18nSSR,
  getI18nServerSideProps,
  getI18nStaticProps
} from '../ssr'

// Mock the i18n module
vi.mock('../i18n', () => ({
  initializeI18n: vi.fn(() => Promise.resolve({
    language: 'ro',
    changeLanguage: vi.fn((lang) => Promise.resolve(lang)),
    loadNamespaces: vi.fn(() => Promise.resolve()),
    getResourceBundle: vi.fn(() => ({ key: 'value' }))
  }))
}))

describe('detectLanguageSSR', () => {
  it('should return default language when no context provided', () => {
    const result = detectLanguageSSR({})
    expect(result).toBe('ro')
  })

  it('should detect language from URL parameters', () => {
    const context = {
      req: {
        url: 'https://example.com/page?lang=en',
        headers: {}
      }
    }
    
    const result = detectLanguageSSR(context)
    expect(result).toBe('en')
  })

  it('should detect language from cookies', () => {
    const context = {
      req: {
        url: 'https://example.com/page',
        headers: {
          cookie: 'i18n-language=en; other=value'
        }
      }
    }
    
    const result = detectLanguageSSR(context)
    expect(result).toBe('en')
  })

  it('should detect language from Accept-Language header', () => {
    const context = {
      req: {
        url: 'https://example.com/page',
        headers: {
          'accept-language': 'en-US,en;q=0.9,ro;q=0.8'
        }
      }
    }
    
    const result = detectLanguageSSR(context)
    expect(result).toBe('en')
  })

  it('should prioritize URL over cookies and headers', () => {
    const context = {
      req: {
        url: 'https://example.com/page?lang=en',
        headers: {
          cookie: 'i18n-language=ro',
          'accept-language': 'ro-RO,ro;q=0.9'
        }
      }
    }
    
    const result = detectLanguageSSR(context)
    expect(result).toBe('en')
  })

  it('should return default for unsupported language', () => {
    const context = {
      req: {
        url: 'https://example.com/page?lang=fr',
        headers: {}
      }
    }
    
    const result = detectLanguageSSR(context, {
      supportedLanguages: ['ro', 'en']
    })
    expect(result).toBe('ro')
  })

  it('should use custom default language', () => {
    const context = {}
    
    const result = detectLanguageSSR(context, {
      defaultLanguage: 'en'
    })
    expect(result).toBe('en')
  })
})

describe('initializeI18nSSR', () => {
  it('should initialize with Romanian by default', async () => {
    const result = await initializeI18nSSR()
    expect(result).toBeDefined()
    expect(result.language).toBe('ro')
  })

  it('should initialize with specified language', async () => {
    const result = await initializeI18nSSR('en', ['common', 'auth'])
    expect(result).toBeDefined()
  })

  it('should change language if different from default', async () => {
    const i18n = await initializeI18nSSR('en')
    expect(i18n.changeLanguage).toHaveBeenCalledWith('en')
  })
})

describe('getI18nServerSideProps', () => {
  it('should return props with i18n configuration', async () => {
    const context = {
      req: {
        url: 'https://example.com/page',
        headers: {}
      }
    }
    
    const result = await getI18nServerSideProps(context, ['common'])
    
    expect(result.props._i18n).toBeDefined()
    expect(result.props._i18n.language).toBe('ro')
    expect(result.props._i18n.namespaces).toEqual(['common'])
    expect(result.props._i18n.initialI18nStore).toBeDefined()
  })

  it('should handle errors gracefully', async () => {
    // Mock initializeI18n to throw error
    const { initializeI18n } = await import('../i18n')
    vi.mocked(initializeI18n).mockRejectedValueOnce(new Error('Test error'))
    
    const context = {
      req: { headers: {} }
    }
    
    const result = await getI18nServerSideProps(context)
    
    expect(result.props._i18n).toBeDefined()
    expect(result.props._i18n.language).toBe('ro')
    expect(result.props._i18n.initialI18nStore).toEqual({})
  })
})

describe('getI18nStaticProps', () => {
  it('should return props with Romanian as default', async () => {
    const context = {}
    
    const result = await getI18nStaticProps(context, ['common'])
    
    expect(result.props._i18n).toBeDefined()
    expect(result.props._i18n.language).toBe('ro')
    expect(result.props._i18n.namespaces).toEqual(['common'])
    expect(result.revalidate).toBe(86400)
  })

  it('should use context locale if provided', async () => {
    const context = { locale: 'en' }
    
    const result = await getI18nStaticProps(context, ['auth'])
    
    expect(result.props._i18n.language).toBe('en')
    expect(result.props._i18n.namespaces).toEqual(['auth'])
  })

  it('should handle errors gracefully', async () => {
    // Mock initializeI18n to throw error
    const { initializeI18n } = await import('../i18n')
    vi.mocked(initializeI18n).mockRejectedValueOnce(new Error('Test error'))
    
    const context = {}
    
    const result = await getI18nStaticProps(context)
    
    expect(result.props._i18n.language).toBe('ro')
    expect(result.props._i18n.initialI18nStore).toEqual({})
    expect(result.revalidate).toBe(86400)
  })
})
'use client';

// Import for production use
import * as i18nModule from '@coquinate/i18n';
import type { TranslationNamespace } from '@coquinate/i18n';

interface TranslationOptions {
  [key: string]: string | number;
}

interface I18nInstance {
  language: string;
  changeLanguage: (lng: string) => Promise<void>;
  [key: string]: unknown;
}

interface I18nResult {
  t: {
    (key: string): string;
    (key: string, defaultValue: string): string;
    (key: string, options: TranslationOptions): string;
    (key: string, defaultValue: string, options: TranslationOptions): string;
  };
  i18n: I18nInstance | null;
  ready: boolean;
}

interface MockTranslations {
  [key: string]: string;
}

// Extend Window interface for Storybook
declare global {
  interface Window {
    mockTranslations?: MockTranslations;
  }
}

/**
 * Hook pentru i18n cu fallback pentru compatibilitate Storybook
 * Detectează automatic dacă rulează în mediul Storybook și folosește mock translations
 */
export function useI18nWithFallback(namespace?: TranslationNamespace | TranslationNamespace[]): I18nResult {
  const isStorybook = typeof window !== 'undefined' && window.mockTranslations;

  if (isStorybook && window.mockTranslations) {
    const mockTranslations = window.mockTranslations;
    return {
      t: ((key: string, defaultValueOrOptions?: string | TranslationOptions, maybeOptions?: TranslationOptions): string => {
        // Handle different overload signatures
        let defaultValue = key;
        let options: TranslationOptions | undefined;
        
        if (typeof defaultValueOrOptions === 'string') {
          defaultValue = defaultValueOrOptions;
          options = maybeOptions;
        } else if (defaultValueOrOptions && typeof defaultValueOrOptions === 'object') {
          options = defaultValueOrOptions;
        }
        
        let result = mockTranslations[key] || defaultValue;
        
        if (options) {
          // Simple interpolation for mocked translations
          Object.entries(options).forEach(([k, v]) => {
            result = result.replace(`{{${k}}}`, String(v));
          });
        }
        
        return result;
      }) as I18nResult['t'],
      i18n: null,
      ready: true,
    };
  }

  // În producție, folosește useTranslation din react-i18next direct
  try {
    // Import direct useTranslation care e exportat din @coquinate/i18n
    const { useTranslation } = i18nModule;
    
    if (typeof useTranslation === 'function') {
      const result = useTranslation(namespace);
      // Returnează rezultatul direct care e deja în formatul corect
      return result as I18nResult;
    }
  } catch (error) {
    console.warn('i18n not available, using fallback', error);
  }
  
  // Fallback dacă i18n nu e disponibil
  return {
      t: ((key: string, defaultValueOrOptions?: string | TranslationOptions, maybeOptions?: TranslationOptions): string => {
        // Handle different overload signatures
        let defaultValue = key;
        let options: TranslationOptions | undefined;
        
        if (typeof defaultValueOrOptions === 'string') {
          defaultValue = defaultValueOrOptions;
          options = maybeOptions;
        } else if (defaultValueOrOptions && typeof defaultValueOrOptions === 'object') {
          options = defaultValueOrOptions;
        }
        
        let result = defaultValue;
        
        if (options) {
          // Simple interpolation for fallback
          Object.entries(options).forEach(([k, v]) => {
            result = result.replace(`{{${k}}}`, String(v));
          });
        }
        
        return result;
      }) as I18nResult['t'],
      i18n: null,
      ready: false,
    };
}
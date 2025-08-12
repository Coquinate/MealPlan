import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import resources (will be created in next task)
import roCommon from '../locales/ro/common.json'
import roAuth from '../locales/ro/auth.json'
import roMeals from '../locales/ro/meals.json'
import roShopping from '../locales/ro/shopping.json'
import roAdmin from '../locales/ro/admin.json'
import roRecipes from '../locales/ro/recipes.json'
import roSettings from '../locales/ro/settings.json'

import enCommon from '../locales/en/common.json'
import enAuth from '../locales/en/auth.json'
import enMeals from '../locales/en/meals.json'
import enShopping from '../locales/en/shopping.json'
import enAdmin from '../locales/en/admin.json'
import enRecipes from '../locales/en/recipes.json'
import enSettings from '../locales/en/settings.json'

// Romanian pluralization rules
const romanianPluralRules = {
  rule: (count: number) => {
    if (count === 1) return 0 // singular
    if (count === 0 || (count % 100 > 0 && count % 100 < 20)) return 1 // few
    return 2 // many
  }
}

/**
 * Initialize i18next with Romanian locale configuration
 * Configures primary Romanian language with English fallback structure
 * 
 * @returns Promise<typeof i18n> - Configured i18next instance
 */
export const initializeI18n = async () => {
  await i18n
    .use(initReactI18next)
    .init({
      // Primary language configuration
      lng: 'ro', // Romanian as primary
      fallbackLng: 'en', // English fallback for development
      
      // Namespace configuration
      defaultNS: 'common',
      ns: ['common', 'auth', 'meals', 'shopping', 'admin', 'recipes', 'settings'],
      
      // Debug configuration
      debug: process.env.NODE_ENV === 'development',
      
      // Interpolation configuration for dynamic content
      interpolation: {
        escapeValue: false, // React already escapes values
        format: (value, format, _lng) => {
          // Custom formatters for Romanian locale
          if (format === 'uppercase') return value.toUpperCase()
          if (format === 'lowercase') return value.toLowerCase()
          if (format === 'currency') {
            return new Intl.NumberFormat('ro-RO', { 
              style: 'currency', 
              currency: 'RON' 
            }).format(value)
          }
          if (format === 'number') {
            return new Intl.NumberFormat('ro-RO').format(value)
          }
          if (format === 'date') {
            return new Intl.DateTimeFormat('ro-RO', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit' 
            }).format(new Date(value))
          }
          if (format === 'time') {
            return new Intl.DateTimeFormat('ro-RO', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }).format(new Date(value))
          }
          return value
        }
      },
      
      // React configuration
      react: {
        useSuspense: false, // Disable Suspense to avoid SSR issues
        bindI18n: 'languageChanged loaded',
        bindI18nStore: 'added removed',
        transEmptyNodeValue: '', // Empty fallback for missing keys
        transSupportBasicHtmlNodes: true, // Support basic HTML in translations
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em'] // Allowed HTML tags
      },
      
      // Pluralization rules for Romanian
      pluralSeparator: '_',
      contextSeparator: '@',
      nsSeparator: ':',
      keySeparator: '.',
      
      // Resources configuration
      resources: {
        ro: {
          common: roCommon,
          auth: roAuth,
          meals: roMeals,
          shopping: roShopping,
          admin: roAdmin,
          recipes: roRecipes,
          settings: roSettings
        },
        en: {
          common: enCommon,
          auth: enAuth,
          meals: enMeals,
          shopping: enShopping,
          admin: enAdmin,
          recipes: enRecipes,
          settings: enSettings
        }
      },
      
      // Missing key handling for development
      saveMissing: process.env.NODE_ENV === 'development',
      missingKeyHandler: (lng, ns, key, _fallbackValue) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Missing translation key: ${ns}:${key} for language: ${lng}`)
        }
      },
      
      // Loading configuration
      load: 'languageOnly', // Load only primary language code (ro, not ro-RO)
      
      // Cache configuration
      initImmediate: false // Allow synchronous initialization
    })

  // Add Romanian pluralization rules
  i18n.services.pluralResolver.addRule('ro', romanianPluralRules)
  
  return i18n
}

export default i18n
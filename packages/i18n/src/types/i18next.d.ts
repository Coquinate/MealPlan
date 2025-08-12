import 'i18next'
import type { 
  CommonTranslations,
  AuthTranslations, 
  MealsTranslations,
  ShoppingTranslations,
  AdminTranslations,
  RecipesTranslations,
  SettingsTranslations
} from './translations'

/**
 * TypeScript module augmentation for i18next
 * Provides type safety for translation keys and namespaces
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    /**
     * Default namespace used when no namespace is specified
     */
    defaultNS: 'common'
    
    /**
     * Available translation resources organized by namespace
     * This ensures type safety when accessing translation keys
     */
    resources: {
      common: CommonTranslations
      auth: AuthTranslations
      meals: MealsTranslations
      shopping: ShoppingTranslations
      admin: AdminTranslations
      recipes: RecipesTranslations
      settings: SettingsTranslations
    }
    
    /**
     * Return type for translations
     * Set to 'preserve' to maintain string literal types
     */
    returnNull: false
    
    /**
     * Return an empty string instead of key when translation is missing
     * This prevents showing internal translation keys to users
     */
    returnEmptyString: false
    
    /**
     * Allow usage of arrays in translation functions
     * Useful for pluralization and list formatting
     */
    returnObjects: true
    
    /**
     * Join arrays with this separator when returnObjects is false
     */
    joinArrays: false
    
    /**
     * Default interpolation format
     */
    interpolation: {
      format: (value: any, format: string | undefined, lng: string | undefined) => string
    }
    
    /**
     * Available interpolation options for type safety
     */
    interpolationPrefix: '{{'
    interpolationSuffix: '}}'
    
    /**
     * Nesting character for accessing nested translation keys
     */
    nsSeparator: ':'
    keySeparator: '.'
    
    /**
     * Fallback language when translation is missing
     */
    fallbackLng: 'ro'
    
    /**
     * Available languages in the application
     */
    supportedLngs: ['ro', 'en']
  }
}
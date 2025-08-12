/**
 * Translation type re-exports for i18next declaration merging
 * This file provides a clean interface between generated types and i18next declarations
 */

// Import all generated translation types
export type {
  AdminTranslations,
  AdminTranslationKeys,
  AuthTranslations,
  AuthTranslationKeys,
  CommonTranslations,
  CommonTranslationKeys,
  MealsTranslations,
  MealsTranslationKeys,
  RecipesTranslations,
  RecipesTranslationKeys,
  SettingsTranslations,
  SettingsTranslationKeys,
  ShoppingTranslations,
  ShoppingTranslationKeys,
  AllNamespaces,
  AllTranslationKeys,
  NamespaceTranslationKeys,
  NamespacedKey
} from './generated'

// Import TranslationNamespace from config to avoid conflicts
import type { TranslationNamespace } from '../config/hooks'

// Re-export for internal use
export type { TranslationNamespace }

/**
 * Utility type for getting translation keys for a specific namespace
 * Enables IDE auto-completion when using translation functions
 * 
 * @example
 * type CommonKeys = TranslationKeys<'common'>
 * // Result: 'button.save' | 'button.cancel' | 'loading' | ...
 */
export type TranslationKeys<T extends TranslationNamespace> = string

/**
 * Translation function type with namespace support
 * Provides type-safe translation key access
 */
export type TranslationFunction<T extends TranslationNamespace = 'common'> = (
  key: TranslationKeys<T>,
  options?: {
    /** Values for interpolation */
    values?: Record<string, any>
    /** Default value if translation is missing */
    defaultValue?: string
    /** Count for pluralization */
    count?: number
    /** Context for contextual translations */
    context?: string
    /** Return objects instead of strings */
    returnObjects?: boolean
    /** Replace missing keys with the key itself */
    returnKey?: boolean
  }
) => string

/**
 * Namespace configuration type for IDE support
 * Used in i18next configuration to ensure type safety
 */
export interface NamespaceConfig {
  /** Default namespace when none is specified */
  defaultNS: TranslationNamespace
  /** All available namespaces */
  namespaces: TranslationNamespace[]
  /** Namespace separator character */
  nsSeparator: string
  /** Key separator character for nested keys */
  keySeparator: string
}

/**
 * Translation interpolation values type
 * Ensures type safety for dynamic values in translations
 */
export type InterpolationValues = Record<string, string | number | boolean | null | undefined>

/**
 * Translation options type for enhanced IDE support
 * Provides comprehensive configuration options for translation functions
 */
export interface TranslationOptions {
  /** Values for string interpolation */
  values?: InterpolationValues
  /** Default value to use if translation is missing */
  defaultValue?: string
  /** Count for pluralization rules */
  count?: number
  /** Context key for contextual translations */
  context?: string
  /** Language override for this specific translation */
  lng?: string
  /** Return objects instead of strings */
  returnObjects?: boolean
  /** Namespace override */
  ns?: TranslationNamespace
}

/**
 * Type guard to check if a string is a valid translation namespace
 * Useful for runtime validation and IDE assistance
 * 
 * @param value - String to check
 * @returns True if value is a valid namespace
 */
export function isValidNamespace(value: string): value is TranslationNamespace {
  const validNamespaces: TranslationNamespace[] = [
    'common', 'auth', 'meals', 'shopping', 'admin', 'recipes', 'settings'
  ]
  return validNamespaces.includes(value as TranslationNamespace)
}

/**
 * Type helper for creating translation key mappings
 * Useful for creating type-safe translation key constants
 */
export type CreateTranslationMap<T extends TranslationNamespace> = {
  readonly [K in TranslationKeys<T>]: K
}
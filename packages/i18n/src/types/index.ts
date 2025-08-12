/**
 * Type definitions for i18n package
 * Provides TypeScript support and IDE integration for translations
 */

// Generated types from translation JSON files
export * from './generated'

// Core translation types and utilities for IDE support
export type {
  TranslationKeys,
  TranslationFunction,
  TranslationOptions,
  InterpolationValues,
  NamespaceConfig,
  CreateTranslationMap
} from './translations'

// Utility functions
export { isValidNamespace } from './translations'

// Translation key utilities and constants for IDE support
export * from './keys'

// Legacy types for backward compatibility
export type TranslationValues = Record<string, string | number | boolean>

export interface I18nConfig {
  debug?: boolean
  fallbackLng?: string
  defaultNS?: string
  ns?: string[]
  interpolation?: {
    escapeValue?: boolean
  }
}
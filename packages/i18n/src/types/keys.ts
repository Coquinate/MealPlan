/**
 * Translation Key Types for IDE Auto-completion
 * 
 * This file provides centralized access to all translation key types
 * for better IDE support and auto-completion across the project.
 * 
 * Usage Examples:
 * ```typescript
 * import type { CommonKeys, AuthKeys, MealsKeys } from '@coquinate/i18n/types/keys'
 * 
 * // Use in components for type-safe translation keys
 * const key: CommonKeys = 'button.save' // ✅ Valid
 * const invalid: CommonKeys = 'invalid.key' // ❌ TypeScript error
 * ```
 */

// Import specific types to use in this file
import type {
  AdminTranslationKeys,
  AuthTranslationKeys, 
  CommonTranslationKeys,
  MealsTranslationKeys,
  RecipesTranslationKeys,
  SettingsTranslationKeys,
  ShoppingTranslationKeys,
  AllNamespaces as AllNamespacesType,
  AllTranslationKeys
} from './generated'

// Re-export all translation key types from generated types with aliases
export type AdminKeys = AdminTranslationKeys
export type AuthKeys = AuthTranslationKeys 
export type CommonKeys = CommonTranslationKeys
export type MealsKeys = MealsTranslationKeys
export type RecipesKeys = RecipesTranslationKeys
export type SettingsKeys = SettingsTranslationKeys
export type ShoppingKeys = ShoppingTranslationKeys
export type { AllTranslationKeys, AllNamespacesType as AllNamespaces }

// Re-export translation interface types
export type {
  AdminTranslations,
  AuthTranslations,
  CommonTranslations, 
  MealsTranslations,
  RecipesTranslations,
  SettingsTranslations,
  ShoppingTranslations
} from './generated'

// Re-export utility types
export type { 
  TranslationNamespace,
  TranslationKeys,
  TranslationFunction,
  TranslationOptions,
  InterpolationValues
} from './translations'

/**
 * Namespace to keys mapping for programmatic access
 * Useful for dynamic key validation and IDE auto-completion
 * 
 * @example
 * ```typescript
 * import { NAMESPACE_KEYS } from '@coquinate/i18n/types/keys'
 * 
 * // Get all keys for a specific namespace
 * type CommonKeysOnly = typeof NAMESPACE_KEYS.common[number]
 * ```
 */
export const NAMESPACE_KEYS = {
  common: [
    // Buttons
    'button.save', 'button.cancel', 'button.delete', 'button.edit',
    'button.add', 'button.submit', 'button.close', 'button.back',
    'button.next', 'button.previous', 'button.confirm', 'button.loading',
    // Labels
    'label.required', 'label.optional', 'label.search', 'label.filter',
    'label.sort', 'label.actions', 'label.status', 'label.date',
    'label.time', 'label.name', 'label.description',
    // Messages
    'message.loading', 'message.error', 'message.success', 'message.noData',
    'message.notFound', 'message.unauthorized', 'message.forbidden', 'message.serverError'
  ],
  auth: [
    'login.title', 'login.email', 'login.password', 'login.submit', 'login.forgotPassword',
    'register.title', 'register.firstName', 'register.lastName', 'register.email',
    'register.password', 'register.confirmPassword', 'register.submit',
    'errors.required', 'errors.invalidEmail', 'errors.passwordTooShort',
    'errors.passwordsDontMatch', 'errors.loginFailed', 'errors.registrationFailed'
  ],
  meals: [
    'title', 'weekView.title', 'weekView.previousWeek', 'weekView.nextWeek',
    'mealCard.breakfast', 'mealCard.lunch', 'mealCard.dinner', 'mealCard.snack',
    'mealCard.addMeal', 'mealCard.editMeal', 'mealCard.removeMeal',
    'planning.title', 'planning.selectRecipe', 'planning.customMeal'
  ],
  shopping: [
    'title', 'categories.vegetables', 'categories.fruits', 'categories.meat',
    'categories.dairy', 'categories.grains', 'categories.spices', 'categories.other',
    'item.add', 'item.edit', 'item.delete', 'item.checked', 'item.unchecked',
    'item.quantity', 'item.unit', 'actions.clearCompleted', 'actions.checkAll', 'actions.uncheckAll'
  ],
  admin: [
    'title', 'navigation.dashboard', 'navigation.recipes', 'navigation.mealPlans',
    'navigation.users', 'navigation.settings', 'recipes.title', 'recipes.add',
    'recipes.edit', 'recipes.delete', 'recipes.publish', 'recipes.unpublish',
    'mealPlans.title', 'mealPlans.create', 'mealPlans.edit', 'mealPlans.delete', 'mealPlans.assign'
  ],
  recipes: [
    'title', 'details.ingredients', 'details.instructions', 'details.nutrition',
    'details.prepTime', 'details.cookTime', 'details.servings', 'details.difficulty',
    'actions.save', 'actions.share', 'actions.print', 'actions.addToMealPlan'
  ],
  settings: [
    'title', 'profile.title', 'profile.name', 'profile.email', 'profile.avatar',
    'household.title', 'household.members', 'household.dietaryRestrictions',
    'notifications.title', 'notifications.email', 'notifications.push', 'notifications.sms'
  ]
} as const

/**
 * Type-safe namespace key checker
 * Validates if a key exists in a specific namespace at runtime
 * 
 * @param namespace - Translation namespace
 * @param key - Translation key to check
 * @returns True if key exists in namespace
 * 
 * @example
 * ```typescript
 * import { isValidKeyForNamespace } from '@coquinate/i18n/types/keys'
 * 
 * const isValid = isValidKeyForNamespace('common', 'button.save') // true
 * const isInvalid = isValidKeyForNamespace('common', 'invalid.key') // false
 * ```
 */
export function isValidKeyForNamespace(
  namespace: keyof typeof NAMESPACE_KEYS,
  key: string
): boolean {
  return (NAMESPACE_KEYS[namespace] as readonly string[]).includes(key)
}

/**
 * Get all available keys for a namespace
 * Useful for building dynamic UIs or validation
 * 
 * @param namespace - Translation namespace
 * @returns Array of all translation keys in the namespace
 * 
 * @example
 * ```typescript
 * import { getKeysForNamespace } from '@coquinate/i18n/types/keys'
 * 
 * const commonKeys = getKeysForNamespace('common')
 * // Returns: ['button.save', 'button.cancel', ...]
 * ```
 */
export function getKeysForNamespace<T extends keyof typeof NAMESPACE_KEYS>(
  namespace: T
): readonly string[] {
  return NAMESPACE_KEYS[namespace]
}

/**
 * Translation key builder helper
 * Provides type-safe key construction for dynamic scenarios
 * 
 * @example
 * ```typescript
 * import { buildKey } from '@coquinate/i18n/types/keys'
 * 
 * const key = buildKey('common', 'button', 'save') // 'common:button.save'
 * ```
 */
export function buildKey(
  namespace: AllNamespacesType,
  ...segments: string[]
): string {
  const keyPath = segments.join('.')
  return `${namespace}:${keyPath}`
}

/**
 * Parse translation key into components
 * Useful for debugging and key management
 * 
 * @param fullKey - Full translation key with namespace
 * @returns Object with namespace and key components
 * 
 * @example
 * ```typescript
 * import { parseKey } from '@coquinate/i18n/types/keys'
 * 
 * const parsed = parseKey('common:button.save')
 * // Returns: { namespace: 'common', key: 'button.save', segments: ['button', 'save'] }
 * ```
 */
export function parseKey(fullKey: string): {
  namespace: string
  key: string
  segments: string[]
} {
  const [namespace, key] = fullKey.split(':')
  const segments = key ? key.split('.') : []
  
  return {
    namespace: namespace || 'common',
    key: key || fullKey,
    segments
  }
}

/**
 * Namespace-specific key type guards
 * Provides runtime type checking for translation keys
 */
export const KeyTypeGuards = {
  isCommonKey: (key: string): key is CommonKeys => 
    isValidKeyForNamespace('common', key),
    
  isAuthKey: (key: string): key is AuthKeys => 
    isValidKeyForNamespace('auth', key),
    
  isMealsKey: (key: string): key is MealsKeys => 
    isValidKeyForNamespace('meals', key),
    
  isShoppingKey: (key: string): key is ShoppingKeys => 
    isValidKeyForNamespace('shopping', key),
    
  isAdminKey: (key: string): key is AdminKeys => 
    isValidKeyForNamespace('admin', key),
    
  isRecipesKey: (key: string): key is RecipesKeys => 
    isValidKeyForNamespace('recipes', key),
    
  isSettingsKey: (key: string): key is SettingsKeys => 
    isValidKeyForNamespace('settings', key)
} as const

/**
 * Type-safe translation key constants
 * Pre-defined constants for commonly used translation keys
 * Prevents typos and provides better IDE support
 * 
 * @example
 * ```typescript
 * import { TRANSLATION_KEYS } from '@coquinate/i18n/types/keys'
 * import { useTranslation } from '@coquinate/i18n'
 * 
 * const { t } = useTranslation('common')
 * const saveText = t(TRANSLATION_KEYS.COMMON.BUTTON_SAVE) // Type-safe!
 * ```
 */
export const TRANSLATION_KEYS = {
  COMMON: {
    // Buttons
    BUTTON_SAVE: 'button.save' as CommonKeys,
    BUTTON_CANCEL: 'button.cancel' as CommonKeys,
    BUTTON_DELETE: 'button.delete' as CommonKeys,
    BUTTON_EDIT: 'button.edit' as CommonKeys,
    BUTTON_ADD: 'button.add' as CommonKeys,
    BUTTON_SUBMIT: 'button.submit' as CommonKeys,
    BUTTON_CLOSE: 'button.close' as CommonKeys,
    BUTTON_BACK: 'button.back' as CommonKeys,
    BUTTON_NEXT: 'button.next' as CommonKeys,
    BUTTON_PREVIOUS: 'button.previous' as CommonKeys,
    BUTTON_CONFIRM: 'button.confirm' as CommonKeys,
    BUTTON_LOADING: 'button.loading' as CommonKeys,
    
    // Messages
    MESSAGE_LOADING: 'message.loading' as CommonKeys,
    MESSAGE_ERROR: 'message.error' as CommonKeys,
    MESSAGE_SUCCESS: 'message.success' as CommonKeys,
    MESSAGE_NO_DATA: 'message.noData' as CommonKeys,
    MESSAGE_NOT_FOUND: 'message.notFound' as CommonKeys,
    MESSAGE_UNAUTHORIZED: 'message.unauthorized' as CommonKeys,
    MESSAGE_FORBIDDEN: 'message.forbidden' as CommonKeys,
    MESSAGE_SERVER_ERROR: 'message.serverError' as CommonKeys,
  },
  
  AUTH: {
    LOGIN_TITLE: 'login.title' as AuthKeys,
    LOGIN_EMAIL: 'login.email' as AuthKeys,
    LOGIN_PASSWORD: 'login.password' as AuthKeys,
    REGISTER_TITLE: 'register.title' as AuthKeys,
    ERROR_REQUIRED: 'errors.required' as AuthKeys,
    ERROR_INVALID_EMAIL: 'errors.invalidEmail' as AuthKeys,
    ERROR_LOGIN_FAILED: 'errors.loginFailed' as AuthKeys
  }
} as const
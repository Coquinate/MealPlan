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
import type {
  AdminTranslationKeys,
  AuthTranslationKeys,
  CommonTranslationKeys,
  MealsTranslationKeys,
  RecipesTranslationKeys,
  SettingsTranslationKeys,
  ShoppingTranslationKeys,
  AllNamespaces as AllNamespacesType,
  AllTranslationKeys,
} from './generated';
export type AdminKeys = AdminTranslationKeys;
export type AuthKeys = AuthTranslationKeys;
export type CommonKeys = CommonTranslationKeys;
export type MealsKeys = MealsTranslationKeys;
export type RecipesKeys = RecipesTranslationKeys;
export type SettingsKeys = SettingsTranslationKeys;
export type ShoppingKeys = ShoppingTranslationKeys;
export type { AllTranslationKeys, AllNamespacesType as AllNamespaces };
export type {
  AdminTranslations,
  AuthTranslations,
  CommonTranslations,
  MealsTranslations,
  RecipesTranslations,
  SettingsTranslations,
  ShoppingTranslations,
} from './generated';
export type {
  TranslationNamespace,
  TranslationKeys,
  TranslationFunction,
  TranslationOptions,
  InterpolationValues,
} from './translations';
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
export declare const NAMESPACE_KEYS: {
  readonly common: readonly [
    'button.save',
    'button.cancel',
    'button.delete',
    'button.edit',
    'button.add',
    'button.submit',
    'button.close',
    'button.back',
    'button.next',
    'button.previous',
    'button.confirm',
    'button.loading',
    'label.required',
    'label.optional',
    'label.search',
    'label.filter',
    'label.sort',
    'label.actions',
    'label.status',
    'label.date',
    'label.time',
    'label.name',
    'label.description',
    'message.loading',
    'message.error',
    'message.success',
    'message.noData',
    'message.notFound',
    'message.unauthorized',
    'message.forbidden',
    'message.serverError',
  ];
  readonly auth: readonly [
    'login.title',
    'login.email',
    'login.password',
    'login.submit',
    'login.forgotPassword',
    'register.title',
    'register.firstName',
    'register.lastName',
    'register.email',
    'register.password',
    'register.confirmPassword',
    'register.submit',
    'errors.required',
    'errors.invalidEmail',
    'errors.passwordTooShort',
    'errors.passwordsDontMatch',
    'errors.loginFailed',
    'errors.registrationFailed',
  ];
  readonly meals: readonly [
    'title',
    'weekView.title',
    'weekView.previousWeek',
    'weekView.nextWeek',
    'mealCard.breakfast',
    'mealCard.lunch',
    'mealCard.dinner',
    'mealCard.snack',
    'mealCard.addMeal',
    'mealCard.editMeal',
    'mealCard.removeMeal',
    'planning.title',
    'planning.selectRecipe',
    'planning.customMeal',
  ];
  readonly shopping: readonly [
    'title',
    'categories.vegetables',
    'categories.fruits',
    'categories.meat',
    'categories.dairy',
    'categories.grains',
    'categories.spices',
    'categories.other',
    'item.add',
    'item.edit',
    'item.delete',
    'item.checked',
    'item.unchecked',
    'item.quantity',
    'item.unit',
    'actions.clearCompleted',
    'actions.checkAll',
    'actions.uncheckAll',
  ];
  readonly admin: readonly [
    'title',
    'navigation.dashboard',
    'navigation.recipes',
    'navigation.mealPlans',
    'navigation.users',
    'navigation.settings',
    'recipes.title',
    'recipes.add',
    'recipes.edit',
    'recipes.delete',
    'recipes.publish',
    'recipes.unpublish',
    'mealPlans.title',
    'mealPlans.create',
    'mealPlans.edit',
    'mealPlans.delete',
    'mealPlans.assign',
  ];
  readonly recipes: readonly [
    'title',
    'details.ingredients',
    'details.instructions',
    'details.nutrition',
    'details.prepTime',
    'details.cookTime',
    'details.servings',
    'details.difficulty',
    'actions.save',
    'actions.share',
    'actions.print',
    'actions.addToMealPlan',
  ];
  readonly settings: readonly [
    'title',
    'profile.title',
    'profile.name',
    'profile.email',
    'profile.avatar',
    'household.title',
    'household.members',
    'household.dietaryRestrictions',
    'notifications.title',
    'notifications.email',
    'notifications.push',
    'notifications.sms',
  ];
};
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
export declare function isValidKeyForNamespace(
  namespace: keyof typeof NAMESPACE_KEYS,
  key: string
): boolean;
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
export declare function getKeysForNamespace<T extends keyof typeof NAMESPACE_KEYS>(
  namespace: T
): readonly string[];
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
export declare function buildKey(namespace: AllNamespacesType, ...segments: string[]): string;
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
export declare function parseKey(fullKey: string): {
  namespace: string;
  key: string;
  segments: string[];
};
/**
 * Namespace-specific key type guards
 * Provides runtime type checking for translation keys
 */
export declare const KeyTypeGuards: {
  readonly isCommonKey: (key: string) => key is CommonKeys;
  readonly isAuthKey: (key: string) => key is AuthKeys;
  readonly isMealsKey: (key: string) => key is MealsKeys;
  readonly isShoppingKey: (key: string) => key is ShoppingKeys;
  readonly isAdminKey: (key: string) => key is AdminKeys;
  readonly isRecipesKey: (key: string) => key is RecipesKeys;
  readonly isSettingsKey: (key: string) => key is SettingsKeys;
};
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
export declare const TRANSLATION_KEYS: {
  readonly COMMON: {
    readonly BUTTON_SAVE: CommonKeys;
    readonly BUTTON_CANCEL: CommonKeys;
    readonly BUTTON_DELETE: CommonKeys;
    readonly BUTTON_EDIT: CommonKeys;
    readonly BUTTON_ADD: CommonKeys;
    readonly BUTTON_SUBMIT: CommonKeys;
    readonly BUTTON_CLOSE: CommonKeys;
    readonly BUTTON_BACK: CommonKeys;
    readonly BUTTON_NEXT: CommonKeys;
    readonly BUTTON_PREVIOUS: CommonKeys;
    readonly BUTTON_CONFIRM: CommonKeys;
    readonly BUTTON_LOADING: CommonKeys;
    readonly MESSAGE_LOADING: CommonKeys;
    readonly MESSAGE_ERROR: CommonKeys;
    readonly MESSAGE_SUCCESS: CommonKeys;
    readonly MESSAGE_NO_DATA: CommonKeys;
    readonly MESSAGE_NOT_FOUND: CommonKeys;
    readonly MESSAGE_UNAUTHORIZED: CommonKeys;
    readonly MESSAGE_FORBIDDEN: CommonKeys;
    readonly MESSAGE_SERVER_ERROR: CommonKeys;
  };
  readonly AUTH: {
    readonly LOGIN_TITLE: AuthKeys;
    readonly LOGIN_EMAIL: AuthKeys;
    readonly LOGIN_PASSWORD: AuthKeys;
    readonly REGISTER_TITLE: AuthKeys;
    readonly ERROR_REQUIRED: AuthKeys;
    readonly ERROR_INVALID_EMAIL: AuthKeys;
    readonly ERROR_LOGIN_FAILED: AuthKeys;
  };
};
//# sourceMappingURL=keys.d.ts.map

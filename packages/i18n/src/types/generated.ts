/**
 * Generated TypeScript types for i18n translations
 * 
 * This file is auto-generated. DO NOT EDIT MANUALLY.
 * Run 'pnpm run generate-types' to regenerate.
 * 
 * Generated on: 2025-08-11T21:35:08.210Z
 */

// Generated types for admin namespace

interface AdminTranslationsNavigation {
  "dashboard": string
  "recipes": string
  "mealPlans": string
  "users": string
  "settings": string
}

interface AdminTranslationsRecipes {
  "title": string
  "add": string
  "edit": string
  "delete": string
  "publish": string
  "unpublish": string
}

interface AdminTranslationsMealPlans {
  "title": string
  "create": string
  "edit": string
  "delete": string
  "assign": string
}

interface AdminTranslations {
  "title": string
  "navigation": AdminTranslationsNavigation
  "recipes": AdminTranslationsRecipes
  "mealPlans": AdminTranslationsMealPlans
}

export type AdminTranslationKeys = 'title' | 'navigation.dashboard' | 'navigation.recipes' | 'navigation.mealPlans' | 'navigation.users' | 'navigation.settings' | 'recipes.title' | 'recipes.add' | 'recipes.edit' | 'recipes.delete' | 'recipes.publish' | 'recipes.unpublish' | 'mealPlans.title' | 'mealPlans.create' | 'mealPlans.edit' | 'mealPlans.delete' | 'mealPlans.assign'

export type { AdminTranslations }

// Generated types for auth namespace

interface AuthTranslationsLogin {
  "title": string
  "email": string
  "password": string
  "submit": string
  "forgotPassword": string
  "noAccount": string
  "createAccount": string
}

interface AuthTranslationsRegister {
  "title": string
  "name": string
  "email": string
  "password": string
  "confirmPassword": string
  "submit": string
  "hasAccount": string
  "backToLogin": string
}

interface AuthTranslationsErrors {
  "invalidCredentials": string
  "emailRequired": string
  "passwordRequired": string
  "passwordTooShort": string
  "passwordMismatch": string
}

interface AuthTranslations {
  "login": AuthTranslationsLogin
  "register": AuthTranslationsRegister
  "errors": AuthTranslationsErrors
}

export type AuthTranslationKeys = 'login.title' | 'login.email' | 'login.password' | 'login.submit' | 'login.forgotPassword' | 'login.noAccount' | 'login.createAccount' | 'register.title' | 'register.name' | 'register.email' | 'register.password' | 'register.confirmPassword' | 'register.submit' | 'register.hasAccount' | 'register.backToLogin' | 'errors.invalidCredentials' | 'errors.emailRequired' | 'errors.passwordRequired' | 'errors.passwordTooShort' | 'errors.passwordMismatch'

export type { AuthTranslations }

// Generated types for common namespace

interface CommonTranslationsButton {
  "save": string
  "cancel": string
  "delete": string
  "edit": string
  "add": string
  "submit": string
  "close": string
  "back": string
  "next": string
  "previous": string
  "confirm": string
  "loading": string
}

interface CommonTranslationsLabel {
  "required": string
  "optional": string
  "search": string
  "filter": string
  "sort": string
  "actions": string
  "status": string
  "date": string
  "time": string
  "name": string
  "description": string
}

interface CommonTranslationsMessage {
  "loading": string
  "error": string
  "success": string
  "noData": string
  "notFound": string
  "unauthorized": string
  "forbidden": string
  "serverError": string
}

interface CommonTranslations {
  "button": CommonTranslationsButton
  "label": CommonTranslationsLabel
  "message": CommonTranslationsMessage
}

export type CommonTranslationKeys = 'button.save' | 'button.cancel' | 'button.delete' | 'button.edit' | 'button.add' | 'button.submit' | 'button.close' | 'button.back' | 'button.next' | 'button.previous' | 'button.confirm' | 'button.loading' | 'label.required' | 'label.optional' | 'label.search' | 'label.filter' | 'label.sort' | 'label.actions' | 'label.status' | 'label.date' | 'label.time' | 'label.name' | 'label.description' | 'message.loading' | 'message.error' | 'message.success' | 'message.noData' | 'message.notFound' | 'message.unauthorized' | 'message.forbidden' | 'message.serverError'

export type { CommonTranslations }

// Generated types for meals namespace

interface MealsTranslationsWeekView {
  "title": string
  "today": string
  "tomorrow": string
  "yesterday": string
}

interface MealsTranslationsMealCard {
  "breakfast": string
  "lunch": string
  "dinner": string
  "snack": string
  "servings": string
  "servings_other": string
  "cookTime": string
  "addMeal": string
  "editMeal": string
  "removeMeal": string
}

interface MealsTranslationsPlanning {
  "addToWeek": string
  "removeFromWeek": string
  "moveMeal": string
  "duplicateMeal": string
}

interface MealsTranslations {
  "title": string
  "weekView": MealsTranslationsWeekView
  "mealCard": MealsTranslationsMealCard
  "planning": MealsTranslationsPlanning
}

export type MealsTranslationKeys = 'title' | 'weekView.title' | 'weekView.today' | 'weekView.tomorrow' | 'weekView.yesterday' | 'mealCard.breakfast' | 'mealCard.lunch' | 'mealCard.dinner' | 'mealCard.snack' | 'mealCard.servings' | 'mealCard.servings_other' | 'mealCard.cookTime' | 'mealCard.addMeal' | 'mealCard.editMeal' | 'mealCard.removeMeal' | 'planning.addToWeek' | 'planning.removeFromWeek' | 'planning.moveMeal' | 'planning.duplicateMeal'

export type { MealsTranslations }

// Generated types for recipes namespace

interface RecipesTranslationsDetails {
  "ingredients": string
  "instructions": string
  "nutrition": string
  "servings": string
  "prepTime": string
  "cookTime": string
  "totalTime": string
  "difficulty": string
}

interface RecipesTranslationsDifficulty {
  "easy": string
  "medium": string
  "hard": string
}

interface RecipesTranslationsActions {
  "favorite": string
  "unfavorite": string
  "share": string
  "print": string
  "addToMealPlan": string
}

interface RecipesTranslations {
  "title": string
  "details": RecipesTranslationsDetails
  "difficulty": RecipesTranslationsDifficulty
  "actions": RecipesTranslationsActions
}

export type RecipesTranslationKeys = 'title' | 'details.ingredients' | 'details.instructions' | 'details.nutrition' | 'details.servings' | 'details.prepTime' | 'details.cookTime' | 'details.totalTime' | 'details.difficulty' | 'difficulty.easy' | 'difficulty.medium' | 'difficulty.hard' | 'actions.favorite' | 'actions.unfavorite' | 'actions.share' | 'actions.print' | 'actions.addToMealPlan'

export type { RecipesTranslations }

// Generated types for settings namespace

interface SettingsTranslationsSections {
  "profile": string
  "preferences": string
  "household": string
  "notifications": string
  "privacy": string
  "subscription": string
}

interface SettingsTranslationsProfile {
  "name": string
  "email": string
  "phone": string
  "avatar": string
  "save": string
}

interface SettingsTranslationsPreferences {
  "language": string
  "timezone": string
  "dietary": string
  "allergies": string
  "cuisineTypes": string
}

interface SettingsTranslationsNotifications {
  "email": string
  "push": string
  "mealReminders": string
  "shoppingReminders": string
}

interface SettingsTranslations {
  "title": string
  "sections": SettingsTranslationsSections
  "profile": SettingsTranslationsProfile
  "preferences": SettingsTranslationsPreferences
  "notifications": SettingsTranslationsNotifications
}

export type SettingsTranslationKeys = 'title' | 'sections.profile' | 'sections.preferences' | 'sections.household' | 'sections.notifications' | 'sections.privacy' | 'sections.subscription' | 'profile.name' | 'profile.email' | 'profile.phone' | 'profile.avatar' | 'profile.save' | 'preferences.language' | 'preferences.timezone' | 'preferences.dietary' | 'preferences.allergies' | 'preferences.cuisineTypes' | 'notifications.email' | 'notifications.push' | 'notifications.mealReminders' | 'notifications.shoppingReminders'

export type { SettingsTranslations }

// Generated types for shopping namespace

interface ShoppingTranslationsCategories {
  "vegetables": string
  "fruits": string
  "meat": string
  "dairy": string
  "grains": string
  "spices": string
  "other": string
}

interface ShoppingTranslationsItem {
  "add": string
  "edit": string
  "delete": string
  "checked": string
  "unchecked": string
  "quantity": string
  "unit": string
}

interface ShoppingTranslationsActions {
  "clearCompleted": string
  "checkAll": string
  "uncheckAll": string
}

interface ShoppingTranslations {
  "title": string
  "categories": ShoppingTranslationsCategories
  "item": ShoppingTranslationsItem
  "actions": ShoppingTranslationsActions
}

export type ShoppingTranslationKeys = 'title' | 'categories.vegetables' | 'categories.fruits' | 'categories.meat' | 'categories.dairy' | 'categories.grains' | 'categories.spices' | 'categories.other' | 'item.add' | 'item.edit' | 'item.delete' | 'item.checked' | 'item.unchecked' | 'item.quantity' | 'item.unit' | 'actions.clearCompleted' | 'actions.checkAll' | 'actions.uncheckAll'

export type { ShoppingTranslations }

// Union types for all namespaces
export type AllNamespaces = 'admin' | 'auth' | 'common' | 'meals' | 'recipes' | 'settings' | 'shopping'

export type AllTranslationKeys = AdminTranslationKeys | AuthTranslationKeys | CommonTranslationKeys | MealsTranslationKeys | RecipesTranslationKeys | SettingsTranslationKeys | ShoppingTranslationKeys

// Namespace to keys mapping
export interface NamespaceTranslationKeys {
  'admin': AdminTranslationKeys
  'auth': AuthTranslationKeys
  'common': CommonTranslationKeys
  'meals': MealsTranslationKeys
  'recipes': RecipesTranslationKeys
  'settings': SettingsTranslationKeys
  'shopping': ShoppingTranslationKeys
}

// Utility type for namespaced translation keys
export type NamespacedKey<T extends AllNamespaces> = NamespaceTranslationKeys[T]


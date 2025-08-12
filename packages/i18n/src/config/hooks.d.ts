export type TranslationNamespace = 'common' | 'auth' | 'meals' | 'shopping' | 'admin' | 'recipes' | 'settings';
export type TranslationKey = string;
/**
 * Type-safe useTranslation hook with namespace support
 *
 * Provides Romanian translations with TypeScript autocompletion and IDE support.
 * Wraps react-i18next's useTranslation hook with enhanced type safety for our
 * specific namespace structure.
 *
 * @param {string | string[]} [ns] - Translation namespace(s) to use.
 *   Available namespaces: 'common', 'auth', 'meals', 'shopping', 'admin', 'recipes', 'settings'.
 *   Defaults to 'common' if not specified.
 *
 * @param {object} [options] - i18next translation options
 * @param {string} [options.lng] - Language override for this hook
 * @param {boolean} [options.useSuspense] - Enable React Suspense support
 * @param {string} [options.keyPrefix] - Prefix for all translation keys
 *
 * @returns {object} Translation object containing:
 *   - t: Translation function for the specified namespace(s)
 *   - i18n: i18next instance for advanced usage
 *   - ready: Boolean indicating if translations are loaded
 *
 * @example
 * ```typescript
 * // Basic usage with default 'common' namespace
 * const { t } = useTranslation()
 * const saveText = t('button.save') // "Salvează"
 *
 * // Specific namespace
 * const { t } = useTranslation('auth')
 * const loginTitle = t('login.title') // "Autentificare"
 *
 * // Multiple namespaces
 * const { t } = useTranslation(['common', 'auth'])
 * const save = t('common:button.save')
 * const login = t('auth:login.title')
 *
 * // With options
 * const { t, ready } = useTranslation('meals', { lng: 'en' })
 * if (ready) {
 *   const mealsTitle = t('title') // Uses English instead of Romanian
 * }
 * ```
 *
 * @see {@link useCommonTranslations} For pre-configured common translations
 * @see {@link https://react.i18next.com/latest/usetranslation-hook} react-i18next documentation
 */
interface UseTranslationOptions {
    keyPrefix?: string;
    useSuspense?: boolean;
}
interface TranslationFunction {
    (key: string, options?: Record<string, unknown>): string;
    (key: string, defaultValue: string, options?: Record<string, unknown>): string;
}
interface UseTranslationResult {
    t: TranslationFunction;
    i18n: any;
    ready: boolean;
}
export declare const useTranslation: (ns?: TranslationNamespace | TranslationNamespace[], options?: UseTranslationOptions) => UseTranslationResult;
/**
 * Hook for accessing common translations across the app
 *
 * Pre-configured translation hook specifically for the 'common' namespace,
 * providing easy access to frequently used UI elements like buttons, labels,
 * and messages without needing to specify the namespace repeatedly.
 *
 * @returns {object} Object containing:
 *   - t: Raw translation function for custom keys
 *   - ready: Boolean indicating if translations are loaded
 *   - i18n: i18next instance for advanced usage
 *   - buttons: Pre-configured button text functions
 *   - labels: Pre-configured label text functions
 *   - messages: Pre-configured message text functions
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { buttons, labels, messages } = useCommonTranslations()
 *
 * // Button texts
 * const saveButton = buttons.save() // "Salvează"
 * const cancelButton = buttons.cancel() // "Anulează"
 * const deleteButton = buttons.delete() // "Șterge"
 *
 * // Label texts
 * const requiredLabel = labels.required() // "Obligatoriu"
 * const optionalLabel = labels.optional() // "Opțional"
 *
 * // Message texts
 * const loadingMessage = messages.loading() // "Se încarcă..."
 * const errorMessage = messages.error() // "A apărut o eroare"
 * const successMessage = messages.success() // "Operațiune reușită"
 *
 * // Custom keys using the t function
 * const { t } = useCommonTranslations()
 * const customText = t('some.custom.key')
 *
 * // Check if translations are ready
 * const { ready } = useCommonTranslations()
 * if (!ready) {
 *   return <LoadingSpinner />
 * }
 * ```
 *
 * @see {@link useTranslation} For general translation hook with namespace support
 */
export declare const useCommonTranslations: () => {
    t: import("i18next").TFunction<"common", undefined>;
    ready: boolean;
    i18n: import("i18next").i18n;
    buttons: {
        save: () => string;
        cancel: () => string;
        delete: () => string;
        edit: () => string;
        add: () => string;
        submit: () => string;
        close: () => string;
        back: () => string;
        next: () => string;
        previous: () => string;
        confirm: () => string;
        loading: () => string;
    };
    labels: {
        required: () => string;
        optional: () => string;
        search: () => string;
        filter: () => string;
        sort: () => string;
        actions: () => string;
        status: () => string;
        date: () => string;
        time: () => string;
        name: () => string;
        description: () => string;
    };
    messages: {
        loading: () => string;
        error: () => string;
        success: () => string;
        noData: () => string;
        notFound: () => string;
        unauthorized: () => string;
        forbidden: () => string;
        serverError: () => string;
    };
};
/**
 * Hook for formatting values using Romanian locale conventions
 *
 * Provides consistent formatting functions that follow Romanian locale standards
 * for dates, times, numbers, currency, and cooking-specific measurements.
 * All formatters use the 'ro-RO' locale for proper Romanian formatting.
 *
 * This hook wraps the standalone formatters from utils/formatters and adds
 * i18n-aware functionality for translations that require context.
 *
 * @returns {object} Object containing formatting functions:
 *   - formatDate: Format dates in DD.MM.YYYY format
 *   - formatTime: Format times in 24-hour format (HH:mm)
 *   - formatDateTime: Format date and time together
 *   - formatNumber: Format numbers with Romanian decimal separators
 *   - formatCurrency: Format currency in Romanian Lei (RON)
 *   - formatServings: Format serving counts with i18n pluralization
 *   - formatCookTime: Format cooking/prep times in hours and minutes
 *   - formatIngredientAmount: Format ingredient quantities with units
 *   - formatRelativeTime: Format relative time with i18n support
 *   - formatPercentage: Format percentage values
 *   - formatTemperature: Format temperature for cooking
 *   - formatFileSize: Format file sizes with appropriate units
 *
 * @example
 * ```typescript
 * const formatters = useRomanianFormatters()
 *
 * // Date formatting (DD.MM.YYYY)
 * const date = formatters.formatDate(new Date(2024, 0, 15))
 * // Result: "15.01.2024"
 *
 * // Time formatting (24-hour format)
 * const time = formatters.formatTime(new Date(2024, 0, 1, 14, 30))
 * // Result: "14:30"
 *
 * // DateTime formatting
 * const dateTime = formatters.formatDateTime(new Date(2024, 0, 15, 14, 30))
 * // Result: "15.01.2024 14:30"
 *
 * // Number formatting (Romanian decimal separators)
 * const number = formatters.formatNumber(1234.56)
 * // Result: "1.234,56"
 *
 * // Currency formatting (RON)
 * const price = formatters.formatCurrency(25.50)
 * // Result: "25,50 RON"
 *
 * // Cooking-specific formatting with i18n support
 * const servings = formatters.formatServings(4)
 * // Result: "4 porții" (with proper Romanian pluralization)
 *
 * const cookTime = formatters.formatCookTime(90)
 * // Result: "1h 30min"
 *
 * const ingredient = formatters.formatIngredientAmount(250, 'g')
 * // Result: "250g"
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat} Intl.DateTimeFormat
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat} Intl.NumberFormat
 * @see {@link ../utils/formatters} Standalone formatters module
 */
export declare const useRomanianFormatters: () => {
    formatDate: any;
    formatTime: any;
    formatDateTime: any;
    formatNumber: any;
    formatCurrency: any;
    formatCookTime: any;
    formatIngredientAmount: any;
    formatRelativeTime: any;
    formatPercentage: any;
    formatTemperature: any;
    formatFileSize: any;
    formatServings: (servings: number) => any;
};
export {};
//# sourceMappingURL=hooks.d.ts.map
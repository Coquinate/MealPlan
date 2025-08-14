import React from 'react';
import { useTranslation as useI18nextTranslation } from 'react-i18next';
export const useTranslation = (ns, options) => {
  return useI18nextTranslation(ns, options);
};
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
export const useCommonTranslations = () => {
  const { t, ready, i18n } = useI18nextTranslation('common');
  return {
    t,
    ready,
    i18n,
    // Common UI elements
    buttons: {
      save: () => t('button.save'),
      cancel: () => t('button.cancel'),
      delete: () => t('button.delete'),
      edit: () => t('button.edit'),
      add: () => t('button.add'),
      submit: () => t('button.submit'),
      close: () => t('button.close'),
      back: () => t('button.back'),
      next: () => t('button.next'),
      previous: () => t('button.previous'),
      confirm: () => t('button.confirm'),
      loading: () => t('button.loading'),
    },
    // Common labels
    labels: {
      required: () => t('label.required'),
      optional: () => t('label.optional'),
      search: () => t('label.search'),
      filter: () => t('label.filter'),
      sort: () => t('label.sort'),
      actions: () => t('label.actions'),
      status: () => t('label.status'),
      date: () => t('label.date'),
      time: () => t('label.time'),
      name: () => t('label.name'),
      description: () => t('label.description'),
    },
    // Common messages
    messages: {
      loading: () => t('message.loading'),
      error: () => t('message.error'),
      success: () => t('message.success'),
      noData: () => t('message.noData'),
      notFound: () => t('message.notFound'),
      unauthorized: () => t('message.unauthorized'),
      forbidden: () => t('message.forbidden'),
      serverError: () => t('message.serverError'),
    },
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
export const useRomanianFormatters = () => {
  const { i18n } = useI18nextTranslation();
  // Import formatters dynamically to avoid circular dependencies
  const formatters = React.useMemo(() => {
    const {
      formatDate,
      formatTime,
      formatDateTime,
      formatNumber,
      formatCurrency,
      formatCookTime,
      formatServings,
      formatIngredientAmount,
      formatRelativeTime,
      formatPercentage,
      formatTemperature,
      formatFileSize,
    } = require('../utils/formatters'); // eslint-disable-line @typescript-eslint/no-require-imports
    return {
      formatDate,
      formatTime,
      formatDateTime,
      formatNumber,
      formatCurrency,
      formatCookTime,
      formatIngredientAmount,
      formatRelativeTime,
      formatPercentage,
      formatTemperature,
      formatFileSize,
      // i18n-aware servings formatter
      formatServings: (servings) => {
        // Try to use translation first, fallback to standalone formatter
        try {
          return i18n.t('common:servings', {
            count: servings,
            defaultValue: formatServings(servings),
          });
        } catch (error) {
          // Fallback to standalone formatter if translation fails
          return formatServings(servings);
        }
      },
    };
  }, [i18n]);
  return formatters;
};

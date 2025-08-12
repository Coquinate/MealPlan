/**
 * Romanian Locale Formatters
 *
 * This module provides formatting utilities that follow Romanian locale conventions
 * for dates, times, numbers, currency, and cooking-specific measurements.
 * All formatters use the 'ro-RO' locale for proper Romanian formatting.
 *
 * @example
 * ```typescript
 * import { formatDate, formatCurrency, formatCookTime } from '@coquinate/i18n/utils/formatters'
 *
 * const date = formatDate(new Date()) // "15.01.2024"
 * const price = formatCurrency(25.50) // "25,50 RON"
 * const time = formatCookTime(90) // "1h 30min"
 * ```
 */
/**
 * Romanian locale constant for consistent formatting
 */
export declare const ROMANIAN_LOCALE = "ro-RO";
/**
 * Date formatting options for Romanian locale
 */
export declare const ROMANIAN_DATE_OPTIONS: Intl.DateTimeFormatOptions;
/**
 * Time formatting options for Romanian locale (24-hour format)
 */
export declare const ROMANIAN_TIME_OPTIONS: Intl.DateTimeFormatOptions;
/**
 * DateTime formatting options for Romanian locale
 */
export declare const ROMANIAN_DATETIME_OPTIONS: Intl.DateTimeFormatOptions;
/**
 * Format dates using Romanian locale conventions (DD.MM.YYYY)
 *
 * @param date - Date to format (Date object, string, or number)
 * @returns Formatted date string in DD.MM.YYYY format
 *
 * @example
 * ```typescript
 * const formatted = formatDate(new Date(2024, 0, 15))
 * // Result: "15.01.2024"
 *
 * const fromString = formatDate("2024-01-15")
 * // Result: "15.01.2024"
 * ```
 */
export declare function formatDate(date: Date | string | number): string;
/**
 * Format times using Romanian locale conventions (24-hour format)
 *
 * @param date - Date/time to format (Date object, string, or number)
 * @returns Formatted time string in HH:mm format
 *
 * @example
 * ```typescript
 * const formatted = formatTime(new Date(2024, 0, 1, 14, 30))
 * // Result: "14:30"
 *
 * const fromString = formatTime("2024-01-01T14:30:00")
 * // Result: "14:30"
 * ```
 */
export declare function formatTime(date: Date | string | number): string;
/**
 * Format date and time together using Romanian locale conventions
 *
 * @param date - Date/time to format (Date object, string, or number)
 * @returns Formatted date and time string in DD.MM.YYYY HH:mm format
 *
 * @example
 * ```typescript
 * const formatted = formatDateTime(new Date(2024, 0, 15, 14, 30))
 * // Result: "15.01.2024 14:30"
 * ```
 */
export declare function formatDateTime(date: Date | string | number): string;
/**
 * Format numbers using Romanian locale conventions
 * Uses dot (.) as thousands separator and comma (,) as decimal separator
 *
 * @param number - Number to format
 * @param options - Optional Intl.NumberFormatOptions for customization
 * @returns Formatted number string
 *
 * @example
 * ```typescript
 * const formatted = formatNumber(1234.56)
 * // Result: "1.234,56"
 *
 * const withDecimals = formatNumber(1234.567, { maximumFractionDigits: 2 })
 * // Result: "1.234,57"
 * ```
 */
export declare function formatNumber(number: number, options?: Intl.NumberFormatOptions): string;
/**
 * Format currency amounts in Romanian Lei (RON)
 *
 * @param amount - Amount to format
 * @param options - Optional currency formatting options
 * @returns Formatted currency string
 *
 * @example
 * ```typescript
 * const formatted = formatCurrency(25.50)
 * // Result: "25,50 RON"
 *
 * const withSymbol = formatCurrency(100, { currencyDisplay: 'symbol' })
 * // Result: "100,00 lei"
 * ```
 */
export declare function formatCurrency(amount: number, options?: Intl.NumberFormatOptions): string;
/**
 * Format cooking time from minutes to readable format
 * Converts minutes to hours and minutes for better UX
 *
 * @param minutes - Total cooking time in minutes
 * @returns Formatted cooking time string
 *
 * @example
 * ```typescript
 * const shortTime = formatCookTime(30)
 * // Result: "30min"
 *
 * const longTime = formatCookTime(90)
 * // Result: "1h 30min"
 *
 * const exactHours = formatCookTime(120)
 * // Result: "2h"
 * ```
 */
export declare function formatCookTime(minutes: number): string;
/**
 * Format serving counts for recipes with proper Romanian pluralization
 *
 * @param servings - Number of servings
 * @param unit - Unit type for servings (defaults to 'portions')
 * @returns Formatted servings string with proper pluralization
 *
 * @example
 * ```typescript
 * const single = formatServings(1)
 * // Result: "1 porție"
 *
 * const multiple = formatServings(4)
 * // Result: "4 porții"
 *
 * const withCustomUnit = formatServings(2, 'persoane')
 * // Result: "2 persoane"
 * ```
 */
export declare function formatServings(servings: number, unit?: string): string;
/**
 * Common cooking measurement units in Romanian
 */
export declare const COOKING_UNITS: {
    readonly kg: "kg";
    readonly g: "g";
    readonly mg: "mg";
    readonly l: "l";
    readonly ml: "ml";
    readonly dl: "dl";
    readonly cup: "ceașcă";
    readonly cups: "cești";
    readonly tbsp: "lingură";
    readonly tbsps: "linguri";
    readonly tsp: "linguriță";
    readonly tsps: "lingurite";
    readonly piece: "bucată";
    readonly pieces: "bucăți";
    readonly bunch: "legătură";
    readonly bunches: "legături";
    readonly ova: "ou";
    readonly ova_pl: "ouă";
};
/**
 * Format ingredient amounts with proper Romanian units and formatting
 *
 * @param amount - Numeric amount of the ingredient
 * @param unit - Unit of measurement (e.g., 'g', 'ml', 'cup', etc.)
 * @param ingredient - Optional ingredient name for context-aware formatting
 * @returns Formatted ingredient amount string
 *
 * @example
 * ```typescript
 * const basic = formatIngredientAmount(250, 'g')
 * // Result: "250g"
 *
 * const withSpace = formatIngredientAmount(2, 'cups')
 * // Result: "2 cești"
 *
 * const decimal = formatIngredientAmount(1.5, 'cup')
 * // Result: "1,5 ceașcă"
 *
 * const eggs = formatIngredientAmount(3, 'pieces', 'ouă')
 * // Result: "3 ouă"
 * ```
 */
export declare function formatIngredientAmount(amount: number, unit: string, ingredient?: string): string;
/**
 * Format relative time using Romanian locale
 * Shows how long ago or in how long relative to now
 *
 * @param date - Date to format relative to now
 * @returns Formatted relative time string in Romanian
 *
 * @example
 * ```typescript
 * const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
 * const relative = formatRelativeTime(pastDate)
 * // Result: "acum 2 ore"
 *
 * const futureDate = new Date(Date.now() + 30 * 60 * 1000) // 30 min from now
 * const future = formatRelativeTime(futureDate)
 * // Result: "peste 30 de minute"
 * ```
 */
export declare function formatRelativeTime(date: Date | string | number): string;
/**
 * Format percentage values using Romanian locale conventions
 *
 * @param value - Percentage value (0.15 for 15%)
 * @param options - Optional formatting options
 * @returns Formatted percentage string
 *
 * @example
 * ```typescript
 * const percentage = formatPercentage(0.15)
 * // Result: "15%"
 *
 * const precise = formatPercentage(0.1567, { maximumFractionDigits: 2 })
 * // Result: "15,67%"
 * ```
 */
export declare function formatPercentage(value: number, options?: Intl.NumberFormatOptions): string;
/**
 * Format temperature for cooking applications
 *
 * @param temperature - Temperature value
 * @param unit - Temperature unit ('C' or 'F')
 * @returns Formatted temperature string
 *
 * @example
 * ```typescript
 * const celsius = formatTemperature(180, 'C')
 * // Result: "180°C"
 *
 * const fahrenheit = formatTemperature(350, 'F')
 * // Result: "350°F"
 * ```
 */
export declare function formatTemperature(temperature: number, unit?: 'C' | 'F'): string;
/**
 * Format file size with appropriate Romanian units
 *
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 *
 * @example
 * ```typescript
 * const small = formatFileSize(1024)
 * // Result: "1,00 KB"
 *
 * const large = formatFileSize(1048576)
 * // Result: "1,00 MB"
 * ```
 */
export declare function formatFileSize(bytes: number, decimals?: number): string;
/**
 * All formatting functions grouped for easy export
 * Useful for importing all formatters at once
 */
export declare const formatters: {
    readonly formatDate: typeof formatDate;
    readonly formatTime: typeof formatTime;
    readonly formatDateTime: typeof formatDateTime;
    readonly formatNumber: typeof formatNumber;
    readonly formatCurrency: typeof formatCurrency;
    readonly formatCookTime: typeof formatCookTime;
    readonly formatServings: typeof formatServings;
    readonly formatIngredientAmount: typeof formatIngredientAmount;
    readonly formatRelativeTime: typeof formatRelativeTime;
    readonly formatPercentage: typeof formatPercentage;
    readonly formatTemperature: typeof formatTemperature;
    readonly formatFileSize: typeof formatFileSize;
};
/**
 * Type definition for the formatters object
 */
export type Formatters = typeof formatters;
/**
 * Default export for convenience
 */
export default formatters;
//# sourceMappingURL=formatters.d.ts.map
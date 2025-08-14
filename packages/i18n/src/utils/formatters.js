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
export const ROMANIAN_LOCALE = 'ro-RO';
/**
 * Date formatting options for Romanian locale
 */
export const ROMANIAN_DATE_OPTIONS = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
};
/**
 * Time formatting options for Romanian locale (24-hour format)
 */
export const ROMANIAN_TIME_OPTIONS = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
};
/**
 * DateTime formatting options for Romanian locale
 */
export const ROMANIAN_DATETIME_OPTIONS = {
  ...ROMANIAN_DATE_OPTIONS,
  ...ROMANIAN_TIME_OPTIONS,
};
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
export function formatDate(date) {
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    return new Intl.DateTimeFormat(ROMANIAN_LOCALE, ROMANIAN_DATE_OPTIONS).format(dateObj);
  } catch (error) {
    return 'Invalid Date';
  }
}
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
export function formatTime(date) {
  return new Intl.DateTimeFormat(ROMANIAN_LOCALE, ROMANIAN_TIME_OPTIONS).format(new Date(date));
}
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
export function formatDateTime(date) {
  return new Intl.DateTimeFormat(ROMANIAN_LOCALE, ROMANIAN_DATETIME_OPTIONS).format(new Date(date));
}
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
export function formatNumber(number, options) {
  return new Intl.NumberFormat(ROMANIAN_LOCALE, options).format(number);
}
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
export function formatCurrency(amount, options) {
  return new Intl.NumberFormat(ROMANIAN_LOCALE, {
    style: 'currency',
    currency: 'RON',
    ...options,
  }).format(amount);
}
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
export function formatCookTime(minutes) {
  if (minutes <= 0) return '0min';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0 && remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}min`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}min`;
  }
}
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
export function formatServings(servings, unit = 'porții') {
  if (servings === 1) {
    // Singular form - convert 'porții' to 'porție' for common case
    const singularUnit = unit === 'porții' ? 'porție' : unit;
    return `${servings} ${singularUnit}`;
  }
  return `${servings} ${unit}`;
}
/**
 * Common cooking measurement units in Romanian
 */
export const COOKING_UNITS = {
  // Weight
  kg: 'kg',
  g: 'g',
  mg: 'mg',
  // Volume
  l: 'l',
  ml: 'ml',
  dl: 'dl',
  // Cooking measurements
  cup: 'ceașcă',
  cups: 'cești',
  tbsp: 'lingură',
  tbsps: 'linguri',
  tsp: 'linguriță',
  tsps: 'lingurite',
  // Count
  piece: 'bucată',
  pieces: 'bucăți',
  bunch: 'legătură',
  bunches: 'legături',
  // Traditional Romanian measurements
  ova: 'ou',
  ova_pl: 'ouă',
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
export function formatIngredientAmount(amount, unit, ingredient) {
  // Handle special cases for eggs in Romanian
  if (ingredient?.toLowerCase().includes('ou') || unit === 'ova') {
    return amount === 1 ? `${amount} ou` : `${amount} ouă`;
  }
  // Format the amount with Romanian decimal formatting
  const formattedAmount = amount % 1 === 0 ? amount.toString() : formatNumber(amount);
  // Map unit to Romanian equivalent
  const romanianUnit = COOKING_UNITS[unit] || unit;
  // Units that should be attached without space (metric units)
  const attachedUnits = ['g', 'kg', 'ml', 'l', 'dl', 'mg'];
  if (attachedUnits.includes(unit)) {
    return `${formattedAmount}${romanianUnit}`;
  }
  // Handle pluralization for Romanian cooking units
  if (amount !== 1) {
    const pluralUnit = getPluralCookingUnit(romanianUnit, amount);
    return `${formattedAmount} ${pluralUnit}`;
  }
  return `${formattedAmount} ${romanianUnit}`;
}
/**
 * Get plural form of Romanian cooking units
 *
 * @param unit - Singular unit in Romanian
 * @param amount - Amount to determine pluralization
 * @returns Plural form of the unit
 */
function getPluralCookingUnit(unit, amount) {
  if (amount === 1) return unit;
  const pluralMap = {
    ceașcă: 'cești',
    lingură: 'linguri',
    linguriță: 'lingurite',
    bucată: 'bucăți',
    legătură: 'legături',
    ou: 'ouă',
  };
  return pluralMap[unit] || unit;
}
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
export function formatRelativeTime(date) {
  const rtf = new Intl.RelativeTimeFormat(ROMANIAN_LOCALE, {
    numeric: 'auto',
    style: 'long',
  });
  const now = new Date();
  const target = new Date(date);
  const diffInMilliseconds = target.getTime() - now.getTime();
  // Calculate different time units
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  // Choose appropriate unit based on magnitude
  if (Math.abs(diffInDays) >= 1) {
    return rtf.format(diffInDays, 'day');
  } else if (Math.abs(diffInHours) >= 1) {
    return rtf.format(diffInHours, 'hour');
  } else {
    return rtf.format(diffInMinutes, 'minute');
  }
}
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
export function formatPercentage(value, options) {
  return new Intl.NumberFormat(ROMANIAN_LOCALE, {
    style: 'percent',
    ...options,
  }).format(value);
}
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
export function formatTemperature(temperature, unit = 'C') {
  const formattedTemp = formatNumber(temperature, { maximumFractionDigits: 0 });
  return `${formattedTemp}°${unit}`;
}
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
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  const formattedValue = formatNumber(value, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${formattedValue} ${sizes[i]}`;
}
/**
 * All formatting functions grouped for easy export
 * Useful for importing all formatters at once
 */
export const formatters = {
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
};
/**
 * Default export for convenience
 */
export default formatters;

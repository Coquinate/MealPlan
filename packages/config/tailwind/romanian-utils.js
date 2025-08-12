/**
 * Romanian Localization Utilities
 * Formatting functions for Romanian locale
 * @module romanian-utils
 */

import { romanianFormats } from './design-tokens.js'

/**
 * Format number according to Romanian standards
 * @param {number} value - The number to format
 * @param {number} precision - Decimal precision (default: 2)
 * @returns {string} Formatted number
 */
export function formatRomanianNumber(value, precision = romanianFormats.numberFormat.precision) {
  return new Intl.NumberFormat(romanianFormats.numberFormat.locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value)
}

/**
 * Format currency in Romanian LEI
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency
 */
export function formatRomanianCurrency(amount) {
  const formatted = new Intl.NumberFormat(romanianFormats.currencyFormat.locale, {
    style: 'currency',
    currency: romanianFormats.currencyFormat.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  
  // Ensure proper spacing and suffix position
  if (romanianFormats.currencyFormat.position === 'suffix') {
    return formatted.replace('RON', 'lei').replace(/(\d)\s*lei/, '$1 lei')
  }
  return formatted
}

/**
 * Format date according to Romanian standards
 * @param {Date|string} date - The date to format
 * @param {string} format - Format type: 'short', 'long', 'dayMonth', 'weekday', 'time'
 * @returns {string} Formatted date
 */
export function formatRomanianDate(date, format = 'short') {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const options = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    dayMonth: { day: 'numeric', month: 'short' },
    weekday: { weekday: 'long' },
    time: { hour: '2-digit', minute: '2-digit', hour12: false },
  }
  
  if (format === 'short') {
    // Custom format for DD.MM.YYYY
    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const year = dateObj.getFullYear()
    return `${day}.${month}.${year}`
  }
  
  return new Intl.DateTimeFormat(romanianFormats.dateFormat.locale, options[format]).format(dateObj)
}

/**
 * Format time in 24-hour format
 * @param {Date|string} time - The time to format
 * @returns {string} Formatted time (HH:mm)
 */
export function formatRomanianTime(time) {
  const timeObj = typeof time === 'string' ? new Date(time) : time
  const hours = timeObj.getHours().toString().padStart(2, '0')
  const minutes = timeObj.getMinutes().toString().padStart(2, '0')
  return `${hours}${romanianFormats.timeFormat.separator}${minutes}`
}

/**
 * Get Romanian day name
 * @param {number} dayIndex - Day index (0-6, 0 = Sunday)
 * @returns {string} Romanian day name
 */
export function getRomanianDayName(dayIndex) {
  const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă']
  return days[dayIndex]
}

/**
 * Get Romanian month name
 * @param {number} monthIndex - Month index (0-11)
 * @returns {string} Romanian month name
 */
export function getRomanianMonthName(monthIndex) {
  const months = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ]
  return months[monthIndex]
}

/**
 * Format quantity with unit for recipes
 * @param {number} quantity - The quantity
 * @param {string} unit - The unit (g, kg, ml, l, etc.)
 * @returns {string} Formatted quantity with unit
 */
export function formatQuantityWithUnit(quantity, unit) {
  const formattedQty = formatRomanianNumber(quantity, quantity % 1 === 0 ? 0 : 1)
  return `${formattedQty} ${unit}`
}

/**
 * Format serving size
 * @param {number} servings - Number of servings
 * @returns {string} Formatted serving text
 */
export function formatServings(servings) {
  if (servings === 1) return '1 porție'
  if (servings < 20) return `${servings} porții`
  return `${servings} de porții`
}

/**
 * Format cooking time
 * @param {number} minutes - Cooking time in minutes
 * @returns {string} Formatted time string
 */
export function formatCookingTime(minutes) {
  if (minutes < 60) {
    return minutes === 1 ? '1 minut' : `${minutes} minute`
  }
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  let result = hours === 1 ? '1 oră' : `${hours} ore`
  
  if (mins > 0) {
    result += mins === 1 ? ' și 1 minut' : ` și ${mins} minute`
  }
  
  return result
}

// Export all utilities as a single object for convenience
export const romanianUtils = {
  formatNumber: formatRomanianNumber,
  formatCurrency: formatRomanianCurrency,
  formatDate: formatRomanianDate,
  formatTime: formatRomanianTime,
  getDayName: getRomanianDayName,
  getMonthName: getRomanianMonthName,
  formatQuantityWithUnit,
  formatServings,
  formatCookingTime,
}

export default romanianUtils
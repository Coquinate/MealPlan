/**
 * Unit tests for Romanian locale formatters
 * Tests all formatting functions for correct Romanian locale behavior
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'

import {
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
  ROMANIAN_LOCALE,
  COOKING_UNITS,
  formatters
} from '../formatters'

// Mock current time for consistent relative time tests
const MOCK_NOW = new Date('2024-01-15T12:00:00Z')

describe('Romanian Formatters', () => {
  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(MOCK_NOW)
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  describe('formatDate', () => {
    it('should format dates in Romanian DD.MM.YYYY format', () => {
      const testDate = new Date(2024, 0, 15) // January 15, 2024
      expect(formatDate(testDate)).toBe('15.01.2024')
    })

    it('should handle string date inputs', () => {
      expect(formatDate('2024-01-15')).toBe('15.01.2024')
    })

    it('should handle timestamp inputs', () => {
      const timestamp = new Date(2024, 0, 15).getTime()
      expect(formatDate(timestamp)).toBe('15.01.2024')
    })

    it('should use zero-padded months and days', () => {
      const testDate = new Date(2024, 4, 5) // May 5, 2024
      expect(formatDate(testDate)).toBe('05.05.2024')
    })
  })

  describe('formatTime', () => {
    it('should format times in 24-hour format', () => {
      const testDate = new Date(2024, 0, 1, 14, 30, 0)
      expect(formatTime(testDate)).toBe('14:30')
    })

    it('should use zero-padded hours and minutes', () => {
      const testDate = new Date(2024, 0, 1, 9, 5, 0)
      expect(formatTime(testDate)).toBe('09:05')
    })

    it('should handle midnight correctly', () => {
      const testDate = new Date(2024, 0, 1, 0, 0, 0)
      expect(formatTime(testDate)).toBe('00:00')
    })

    it('should handle noon correctly', () => {
      const testDate = new Date(2024, 0, 1, 12, 0, 0)
      expect(formatTime(testDate)).toBe('12:00')
    })
  })

  describe('formatDateTime', () => {
    it('should format date and time together', () => {
      const testDate = new Date(2024, 0, 15, 14, 30, 0)
      const result = formatDateTime(testDate)
      expect(result).toMatch(/15\.01\.2024.*14:30/)
    })

    it('should handle edge cases', () => {
      const testDate = new Date(2024, 11, 31, 23, 59, 59)
      const result = formatDateTime(testDate)
      expect(result).toMatch(/31\.12\.2024.*23:59/)
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with Romanian locale separators', () => {
      expect(formatNumber(1234.56)).toBe('1.234,56')
    })

    it('should handle whole numbers', () => {
      expect(formatNumber(1234)).toBe('1.234')
    })

    it('should handle small decimals', () => {
      expect(formatNumber(0.56)).toBe('0,56')
    })

    it('should handle large numbers', () => {
      expect(formatNumber(1234567.89)).toBe('1.234.567,89')
    })

    it('should accept custom formatting options', () => {
      const result = formatNumber(1234.567, { maximumFractionDigits: 2 })
      expect(result).toBe('1.234,57')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency in Romanian Lei', () => {
      const result = formatCurrency(25.50)
      expect(result).toMatch(/25,50.*RON/)
    })

    it('should handle whole amounts', () => {
      const result = formatCurrency(100)
      expect(result).toMatch(/100,00.*RON/)
    })

    it('should handle small amounts', () => {
      const result = formatCurrency(0.99)
      expect(result).toMatch(/0,99.*RON/)
    })

    it('should accept custom currency options', () => {
      const result = formatCurrency(100, { minimumFractionDigits: 0 })
      expect(result).toMatch(/100.*RON/)
    })
  })

  describe('formatCookTime', () => {
    it('should format minutes only for short times', () => {
      expect(formatCookTime(30)).toBe('30min')
    })

    it('should format hours and minutes for longer times', () => {
      expect(formatCookTime(90)).toBe('1h 30min')
    })

    it('should format exact hours', () => {
      expect(formatCookTime(120)).toBe('2h')
    })

    it('should handle zero time', () => {
      expect(formatCookTime(0)).toBe('0min')
    })

    it('should handle negative time', () => {
      expect(formatCookTime(-30)).toBe('0min')
    })

    it('should handle very long times', () => {
      expect(formatCookTime(300)).toBe('5h')
    })

    it('should handle times over 24 hours', () => {
      expect(formatCookTime(1500)).toBe('25h')
    })
  })

  describe('formatServings', () => {
    it('should format single serving with singular form', () => {
      expect(formatServings(1)).toBe('1 porție')
    })

    it('should format multiple servings with plural form', () => {
      expect(formatServings(4)).toBe('4 porții')
    })

    it('should accept custom unit names', () => {
      expect(formatServings(2, 'persoane')).toBe('2 persoane')
    })

    it('should handle singular custom units correctly', () => {
      expect(formatServings(1, 'persoane')).toBe('1 persoane')
    })

    it('should handle edge cases', () => {
      expect(formatServings(0)).toBe('0 porții')
      expect(formatServings(100)).toBe('100 porții')
    })
  })

  describe('formatIngredientAmount', () => {
    it('should format basic metric units without spaces', () => {
      expect(formatIngredientAmount(250, 'g')).toBe('250g')
      expect(formatIngredientAmount(500, 'ml')).toBe('500ml')
    })

    it('should format cooking units with spaces', () => {
      expect(formatIngredientAmount(2, 'cups')).toBe('2 cești')
      expect(formatIngredientAmount(1, 'cup')).toBe('1 ceașcă')
    })

    it('should handle decimal amounts with Romanian formatting', () => {
      // 1.5 is plural in Romanian, so it should be 'cești'
      expect(formatIngredientAmount(1.5, 'cup')).toBe('1,5 cești')
    })

    it('should handle special cases for eggs', () => {
      expect(formatIngredientAmount(1, 'pieces', 'ouă')).toBe('1 ou')
      expect(formatIngredientAmount(3, 'pieces', 'ouă')).toBe('3 ouă')
      expect(formatIngredientAmount(2, 'ova')).toBe('2 ouă')
    })

    it('should map cooking units correctly', () => {
      expect(formatIngredientAmount(1, 'tbsp')).toBe('1 lingură')
      expect(formatIngredientAmount(2, 'tbsps')).toBe('2 linguri')
      expect(formatIngredientAmount(1, 'tsp')).toBe('1 linguriță')
      expect(formatIngredientAmount(3, 'tsps')).toBe('3 lingurite')
    })

    it('should use original unit if not mapped', () => {
      expect(formatIngredientAmount(5, 'unknownunit')).toBe('5 unknownunit')
    })
  })

  describe('formatRelativeTime', () => {
    it('should format recent times', () => {
      const fiveMinutesAgo = new Date(MOCK_NOW.getTime() - 5 * 60 * 1000)
      const result = formatRelativeTime(fiveMinutesAgo)
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
    })

    it('should format hours ago', () => {
      const twoHoursAgo = new Date(MOCK_NOW.getTime() - 2 * 60 * 60 * 1000)
      const result = formatRelativeTime(twoHoursAgo)
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
    })

    it('should format days ago', () => {
      const twoDaysAgo = new Date(MOCK_NOW.getTime() - 2 * 24 * 60 * 60 * 1000)
      const result = formatRelativeTime(twoDaysAgo)
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle future times', () => {
      const inTwoHours = new Date(MOCK_NOW.getTime() + 2 * 60 * 60 * 1000)
      const result = formatRelativeTime(inTwoHours)
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      const result = formatPercentage(0.15)
      expect(result).toMatch(/15.*%/)
    })

    it('should handle decimal percentages', () => {
      const result = formatPercentage(0.1567)
      // Romanian locale may round to 16%, so test for percentage format
      expect(result).toMatch(/1[56].*%/)
    })

    it('should accept formatting options', () => {
      const result = formatPercentage(0.1567, { maximumFractionDigits: 1 })
      expect(result).toMatch(/15.*%/)
    })

    it('should handle zero and one', () => {
      expect(formatPercentage(0)).toMatch(/0.*%/)
      expect(formatPercentage(1)).toMatch(/100.*%/)
    })
  })

  describe('formatTemperature', () => {
    it('should format Celsius by default', () => {
      expect(formatTemperature(180)).toBe('180°C')
    })

    it('should format Fahrenheit when specified', () => {
      expect(formatTemperature(350, 'F')).toBe('350°F')
    })

    it('should handle decimal temperatures', () => {
      expect(formatTemperature(98.6, 'F')).toBe('99°F') // Rounded
    })

    it('should handle negative temperatures', () => {
      expect(formatTemperature(-10, 'C')).toBe('-10°C')
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(512)).toBe('512,00 Bytes')
    })

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1,00 KB')
    })

    it('should format megabytes', () => {
      expect(formatFileSize(1048576)).toBe('1,00 MB')
    })

    it('should format gigabytes', () => {
      expect(formatFileSize(1073741824)).toBe('1,00 GB')
    })

    it('should handle zero size', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
    })

    it('should respect custom decimal places', () => {
      expect(formatFileSize(1536, 1)).toBe('1,5 KB')
    })

    it('should handle large files', () => {
      const oneTerabyte = 1024 * 1024 * 1024 * 1024
      expect(formatFileSize(oneTerabyte)).toBe('1,00 TB')
    })
  })

  describe('COOKING_UNITS constants', () => {
    it('should have correct Romanian translations', () => {
      expect(COOKING_UNITS.cup).toBe('ceașcă')
      expect(COOKING_UNITS.cups).toBe('cești')
      expect(COOKING_UNITS.tbsp).toBe('lingură')
      expect(COOKING_UNITS.tbsps).toBe('linguri')
      expect(COOKING_UNITS.tsp).toBe('linguriță')
      expect(COOKING_UNITS.tsps).toBe('lingurite')
    })

    it('should have metric units unchanged', () => {
      expect(COOKING_UNITS.g).toBe('g')
      expect(COOKING_UNITS.kg).toBe('kg')
      expect(COOKING_UNITS.ml).toBe('ml')
      expect(COOKING_UNITS.l).toBe('l')
    })

    it('should have correct egg translations', () => {
      expect(COOKING_UNITS.ova).toBe('ou')
      expect(COOKING_UNITS.ova_pl).toBe('ouă')
    })
  })

  describe('formatters export', () => {
    it('should export all formatters in a single object', () => {
      expect(formatters).toHaveProperty('formatDate')
      expect(formatters).toHaveProperty('formatTime')
      expect(formatters).toHaveProperty('formatDateTime')
      expect(formatters).toHaveProperty('formatNumber')
      expect(formatters).toHaveProperty('formatCurrency')
      expect(formatters).toHaveProperty('formatCookTime')
      expect(formatters).toHaveProperty('formatServings')
      expect(formatters).toHaveProperty('formatIngredientAmount')
      expect(formatters).toHaveProperty('formatRelativeTime')
      expect(formatters).toHaveProperty('formatPercentage')
      expect(formatters).toHaveProperty('formatTemperature')
      expect(formatters).toHaveProperty('formatFileSize')
    })

    it('should have functions that work correctly', () => {
      expect(formatters.formatDate(new Date(2024, 0, 15))).toBe('15.01.2024')
      const currency = formatters.formatCurrency(25.50)
      expect(currency).toMatch(/25,50.*RON/)
    })
  })

  describe('Locale consistency', () => {
    it('should use Romanian locale constant consistently', () => {
      expect(ROMANIAN_LOCALE).toBe('ro-RO')
    })

    it('should format all numeric values with Romanian conventions', () => {
      // Test that all numeric formatters use comma as decimal separator
      expect(formatNumber(1.5)).toContain(',')
      expect(formatCurrency(1.5)).toContain(',')
    })

    it('should use 24-hour time format consistently', () => {
      const afternoon = new Date(2024, 0, 1, 15, 30)
      expect(formatTime(afternoon)).toBe('15:30')
      expect(formatDateTime(afternoon)).toContain('15:30')
    })
  })

  describe('Edge cases and error handling', () => {
    it('should handle invalid dates gracefully', () => {
      const invalidDate = new Date('invalid')
      // Should not throw, but may return 'Invalid Date' string
      const result = formatDate(invalidDate)
      expect(typeof result).toBe('string')
    })

    it('should handle negative numbers in appropriate formatters', () => {
      expect(formatNumber(-1234.56)).toBe('-1.234,56')
      expect(formatCurrency(-25.50)).toContain('-')
    })

    it('should handle zero values appropriately', () => {
      expect(formatCookTime(0)).toBe('0min')
      expect(formatServings(0)).toBe('0 porții')
      expect(formatFileSize(0)).toBe('0 Bytes')
    })

    it('should handle very large numbers', () => {
      const largeNumber = 999999999.99
      const result = formatNumber(largeNumber)
      expect(result).toContain(',99')
      expect(result).toMatch(/999\.999\.999,99/)
    })
  })
})
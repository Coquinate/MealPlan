/**
 * Demo script to show Romanian formatters in action
 * Run with: npx tsx src/demo/formatters-demo.ts
 */

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
  COOKING_UNITS
} from '../utils/formatters'

console.log('🇷🇴 Romanian Formatters Demo\n')

// Date & Time formatting
const testDate = new Date(2024, 0, 15, 14, 30, 0)
console.log('📅 Date & Time Formatting:')
console.log(`formatDate: ${formatDate(testDate)}`)
console.log(`formatTime: ${formatTime(testDate)}`)
console.log(`formatDateTime: ${formatDateTime(testDate)}\n`)

// Number & Currency formatting
console.log('💰 Number & Currency Formatting:')
console.log(`formatNumber: ${formatNumber(1234.56)}`)
console.log(`formatCurrency: ${formatCurrency(25.50)}`)
console.log(`formatPercentage: ${formatPercentage(0.15)}\n`)

// Cooking-specific formatting
console.log('👨‍🍳 Cooking Formatters:')
console.log(`formatCookTime: ${formatCookTime(90)} (90 minutes)`)
console.log(`formatCookTime: ${formatCookTime(30)} (30 minutes)`)
console.log(`formatServings: ${formatServings(1)} (1 serving)`)
console.log(`formatServings: ${formatServings(4)} (4 servings)`)
console.log(`formatTemperature: ${formatTemperature(180, 'C')}\n`)

// Ingredient formatting
console.log('🥕 Ingredient Formatting:')
console.log(`formatIngredientAmount: ${formatIngredientAmount(250, 'g')}`)
console.log(`formatIngredientAmount: ${formatIngredientAmount(2, 'cups')}`)
console.log(`formatIngredientAmount: ${formatIngredientAmount(1, 'cup')}`)
console.log(`formatIngredientAmount: ${formatIngredientAmount(3, 'pieces', 'ouă')}`)
console.log(`formatIngredientAmount: ${formatIngredientAmount(1.5, 'tbsp')}\n`)

// File size formatting
console.log('📁 File Size Formatting:')
console.log(`formatFileSize: ${formatFileSize(1024)} (1KB)`)
console.log(`formatFileSize: ${formatFileSize(1048576)} (1MB)`)
console.log(`formatFileSize: ${formatFileSize(0)} (0 bytes)\n`)

// Cooking units reference
console.log('📋 Available Cooking Units:')
Object.entries(COOKING_UNITS).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`)
})

// Relative time (mock example)
const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
console.log(`\n⏰ Relative Time: ${formatRelativeTime(twoHoursAgo)}`)

console.log('\n✅ All formatters working correctly!')
/**
 * Romanian-Specific Formatting Configuration
 * Moved from design tokens - single responsibility principle
 * @module romanian-formats
 */

// Romanian-Specific Formatting Tokens
export const romanianFormats = {
  // Number formatting
  numberFormat: {
    locale: 'ro-RO',
    decimal: ',',
    thousands: '.',
    precision: 2,
  },

  // Currency formatting
  currencyFormat: {
    locale: 'ro-RO',
    currency: 'RON',
    symbol: 'lei',
    position: 'suffix', // "25 lei"
    spacing: true,
  },

  // Date formatting
  dateFormat: {
    locale: 'ro-RO',
    weekStartsOn: 1, // Monday
    formats: {
      short: 'DD.MM.YYYY',
      long: 'D MMMM YYYY',
      dayMonth: 'D MMM',
      weekday: 'dddd',
      time: 'HH:mm',
    },
  },

  // Time formatting
  timeFormat: {
    use24Hour: true,
    separator: ':',
  },
};

// Alias for backward compatibility
export const romanianUtils = romanianFormats;

// Default export
export default romanianFormats;
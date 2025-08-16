/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Admin Light Theme
        'admin-primary': 'oklch(55% 0.12 260)',
        'admin-surface': 'oklch(98% 0.01 260)',
        'admin-surface-raised': 'oklch(100% 0 0)',
        'admin-text': 'oklch(15% 0.02 260)',
        'admin-text-secondary': 'oklch(40% 0.02 260)',
        'admin-border': 'oklch(90% 0.02 260)',

        // Admin Dark Theme
        'admin-dark-surface': 'oklch(20% 0.02 260)',
        'admin-dark-surface-raised': 'oklch(25% 0.02 260)',
        'admin-dark-text': 'oklch(95% 0.01 260)',
        'admin-dark-text-secondary': 'oklch(70% 0.01 260)',
        'admin-dark-border': 'oklch(35% 0.02 260)',

        // Status Colors (both themes)
        'status-valid': 'oklch(65% 0.15 145)',
        'status-warning': 'oklch(75% 0.15 85)',
        'status-error': 'oklch(60% 0.2 25)',
        'status-unknown': 'oklch(60% 0 0)',

        // Existing app colors from shared config
        primary: 'oklch(62% 0.05 250)',
        surface: 'oklch(100% 0 0)',
        'surface-raised': 'oklch(99% 0.01 250)',
        text: 'oklch(20% 0.02 250)',
        'text-secondary': 'oklch(45% 0.02 250)',
        border: 'oklch(92% 0.02 250)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Satoshi', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '0.75rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};

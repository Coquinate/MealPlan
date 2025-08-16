import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/styles/globals.css';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { defaultHandlers } from '../src/mocks/handlers';
import { i18nDecorator } from './i18n-decorator';

// MSW cu silence pentru ne-mock-uite și error handling
try {
  initialize({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: './mockServiceWorker.js',
    },
  });
} catch (error) {
  console.warn('[MSW] Failed to initialize Mock Service Worker:', error);
  console.warn('[MSW] Stories will run without API mocking.');
}

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'eggshell',
      values: [
        { name: 'eggshell', value: 'oklch(98% 0.004 75)' },
        { name: 'dark', value: 'oklch(15% 0.01 200)' },
      ],
    },
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          // Critical for Phase 3 testing
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true },
          { id: 'focus-visible', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'label', enabled: true },
          { id: 'link-name', enabled: true },
          { id: 'aria-allowed-attr', enabled: true },
          { id: 'aria-valid-attr-value', enabled: true },
          { id: 'html-has-lang', enabled: true },
        ],
      },
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
        },
      },
      manual: false,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    // Default MSW handlers for all stories
    msw: {
      handlers: defaultHandlers,
    },
  },
  // MSW loader for handling API mocks
  loaders: [mswLoader],
  // Global decorators
  decorators: [
    // Theme switcher decorator with toolbar toggle
    withThemeByClassName({
      themes: {
        light: '', // 'light' is the default, no class needed
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    // i18n decorator with Romanian as default
    i18nDecorator,
    // Wrapper for global styles
    (Story) => (
      <div className="min-h-screen">
        <Story />
      </div>
    ),
  ],
  // Global configuration for locale switching
  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      defaultValue: 'ro',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'ro', title: 'Română' },
          { value: 'en', title: 'English' },
        ],
        showName: true,
      },
    },
  },
};

export default preview;

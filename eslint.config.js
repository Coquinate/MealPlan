// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import typescript from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...typescript.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescript.plugin,
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: typescript.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // TypeScript rules - Development friendly
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // i18n enforcement and Tailwind CSS - TEMPORARILY DISABLED
      // TODO: Re-enable these rules after fixing all hardcoded strings
      'no-restricted-syntax': 'off',
      /*
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXText[value=/[A-Za-z]{2,}/]',
          message: 'Use i18n for text content instead of hardcoded strings'
        },
        {
          selector: 'JSXAttribute[name.name!="className"][name.name!="id"][name.name!="key"][name.name!="type"][name.name!="name"][name.name!="data-testid"] > Literal[value=/[A-Za-z]{2,}/]',
          message: 'Use i18n for string literals instead of hardcoded strings'  
        },
        {
          // Only flag actual arbitrary values (px, rem, %, colors), not data attributes or CSS selectors
          selector: 'JSXAttribute[name.name="className"] Literal[value=/\\[(\\d+px|\\d+rem|\\d+%|#[0-9a-fA-F]+|rgb|hsl|url).*?\\]/]',
          message: 'Use design tokens instead of arbitrary Tailwind values'
        }
      ],
      */

      // General rules - Development friendly
      'no-console': 'off', // Allow all console statements in development
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'no-duplicate-imports': 'error',
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      // Exclude all test files from linting
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.test.js',
      '**/*.test.jsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.spec.js',
      '**/*.spec.jsx',
      '**/tests/**',
      '**/test/**',
      '**/__tests__/**',
      '**/e2e/**',
      'test-results/**',
      'playwright-report/**',
      '**/.playwright/**',
      '**/vitest.config.*',
      '**/playwright.config.*',
      '**/*test-utils*',
      '**/*test-setup*',
      '**/*test-db*',
      '**/*test-cleanup*',
      '**/*factories*',
      '**/page-objects/**',
      // Development and IDE test files
      '**/ide-test.ts',
      '**/demo/**',
      '**/*demo*',
      // Generated files that shouldn't be linted
      '**/*.d.ts.map',
      '**/*.js.map',
      // Specific test directories that were created
      'apps/web/tests/integration/auth/authentication.test.ts',
      'packages/i18n/src/config/__tests__/**',
      'packages/i18n/src/utils/__tests__/**',
      'packages/ui/src/tests/**',
      'apps/admin/src/test/**',
      'apps/admin/tests/**',
      'apps/admin/e2e/**',
      'apps/web/tests/admin/**',
      'apps/web/tests/helpers/**',
      'apps/web/tests/factories/**',
    ],
  },
  ...storybook.configs['flat/recommended'],
];

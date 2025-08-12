/**
 * ESLint Rules for Design Token Enforcement
 * Ensures only semantic tokens are used, no arbitrary values
 * 
 * ALLOWED PATTERNS:
 * - Radix UI data attributes: data-[state=open], data-[side=bottom], etc.
 * - Animation utilities: animate-in, fade-out-0, zoom-in-95, etc.
 * - Fractional opacity: bg-black/50 (using Tailwind's built-in opacity modifier)
 * - Standard Tailwind utilities that use our design tokens
 * 
 * BLOCKED PATTERNS:
 * - Arbitrary spacing: p-[17px], mt-[23px]
 * - Arbitrary colors: text-[#ff0000], bg-[rgb(255,0,0)]
 * - Arbitrary sizes: w-[280px], h-[150px] (use design tokens instead)
 * 
 * @module eslint-design-tokens
 */

export default {
  plugins: ['jsdoc'],
  rules: {
    // Prevent arbitrary Tailwind values and enforce i18n usage
    'no-restricted-syntax': [
      'error',
      {
        // Only flag arbitrary values that are actual arbitrary values (numbers, colors, sizes)
        // Allow: data attributes, CSS selectors, and animation utilities
        selector: 'Literal[value=/\\[(\\d+px|\\d+rem|\\d+%|#[0-9a-fA-F]+|rgb|hsl|url).*?\\]/]',
        message: 'Arbitrary Tailwind values are not allowed. Use semantic tokens from design-tokens.js instead.',
      },
      {
        // Same for template literals
        selector: 'TemplateElement[value.raw=/\\[(\\d+px|\\d+rem|\\d+%|#[0-9a-fA-F]+|rgb|hsl|url).*?\\]/]',
        message: 'Arbitrary Tailwind values in template literals are not allowed. Use semantic tokens instead.',
      },
      {
        // Prevent hardcoded text in JSX
        selector: 'JSXText[value=/[a-zA-ZăâîșțĂÂÎȘȚ]/]',
        message: 'Text content must use translation functions. Import useTranslation from @coquinate/i18n and use t() function.',
      },
      {
        // Prevent hardcoded Romanian text in string literals
        selector: 'Literal[value=/[a-zA-ZăâîșțĂÂÎȘȚ].*[a-zA-ZăâîșțĂÂÎȘȚ]/]:not([value=/^(className|data-|aria-|id|key|ref|type|role|tabindex|href|src|alt|placeholder|testId)$/])',
        message: 'String literals with text content must use translation keys. Use t() function from useTranslation hook.',
      },
    ],
    
    // Prevent hardcoded colors
    'no-restricted-properties': [
      'error',
      {
        object: 'style',
        property: 'color',
        message: 'Use Tailwind color classes with semantic tokens instead of inline styles.',
      },
      {
        object: 'style',
        property: 'backgroundColor',
        message: 'Use Tailwind background color classes with semantic tokens instead of inline styles.',
      },
      {
        object: 'style',
        property: 'borderColor',
        message: 'Use Tailwind border color classes with semantic tokens instead of inline styles.',
      },
    ],
    
    // Prevent hardcoded spacing
    'no-magic-numbers': [
      'warn',
      {
        ignore: [0, 1, -1],
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        enforceConst: true,
        detectObjects: false,
        message: 'Use spacing tokens from design-tokens.js instead of magic numbers.',
      },
    ],
    
    // Require JSDoc for vital functions
    'jsdoc/require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: false,
        },
        contexts: [
          'ExportNamedDeclaration > FunctionDeclaration',
          'ExportDefaultDeclaration > FunctionDeclaration',
          'TSInterfaceDeclaration',
          'TSTypeAliasDeclaration',
        ],
      },
    ],
    
    // JSDoc validation
    'jsdoc/require-param': 'error',
    'jsdoc/require-returns': 'error',
    'jsdoc/check-param-names': 'error',
    'jsdoc/check-types': 'error',
  },
  
  overrides: [
    {
      files: ['*.tsx', '*.jsx'],
      rules: {
        // React-specific rules for className validation
        'react/forbid-prop-types': [
          'error',
          {
            forbid: [
              {
                propName: 'style',
                message: 'Use className with Tailwind classes instead of inline styles.',
              },
            ],
          },
        ],
        
        // Prevent hardcoded text - must use i18n
        'react/jsx-no-literals': [
          'error',
          {
            noStrings: true,
            allowedStrings: [
              // Symbols and special characters
              '•', '←', '→', '×', '+', '-', '/', '*', '=', '&', '|', '<', '>', '(', ')', '[', ']', '{', '}',
              // Technical terms and units
              'px', '%', 'rem', 'em', 'vh', 'vw', 'fr', 'ch', 'ex',
              // CSS values and keywords
              'auto', 'none', 'inherit', 'initial', 'unset', 'transparent',
              // HTML attributes and data attributes
              'true', 'false', 'hidden', 'disabled', 'readonly', 'required',
              // Numbers as strings (for technical purposes)
              '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
              // Common single characters
              ' ', '\n', '\t', ':', ';', '.', ',', '?', '!', '"', "'",
              // Loading states (should eventually be translated but allowed for now)
              '...', '…'
            ],
            ignoreProps: false, // Changed to enforce translation in props too
            noAttributeStrings: true, // Enforce translations in HTML attributes
          },
        ],

        // Enforce valid translation key patterns
        'object-property-newline': [
          'error',
          {
            allowAllPropertiesOnSameLine: false,
          },
        ],
      },
    },
  ],
}
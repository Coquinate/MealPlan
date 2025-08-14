/**
 * Type definitions for i18n package
 * Provides TypeScript support and IDE integration for translations
 */
export * from './generated';
export type {
  TranslationKeys,
  TranslationFunction,
  TranslationOptions,
  InterpolationValues,
  NamespaceConfig,
  CreateTranslationMap,
} from './translations';
export { isValidNamespace } from './translations';
export * from './keys';
export type TranslationValues = Record<string, string | number | boolean>;
export interface I18nConfig {
  debug?: boolean;
  fallbackLng?: string;
  defaultNS?: string;
  ns?: string[];
  interpolation?: {
    escapeValue?: boolean;
  };
}
//# sourceMappingURL=index.d.ts.map

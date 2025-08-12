export { default as i18n, initializeI18n } from './i18n';
export { I18nProvider, withTranslations } from './react-provider';
export { useTranslation, useCommonTranslations, useRomanianFormatters, type TranslationNamespace, type TranslationKey } from './hooks';
export { Trans, createNamespacedTrans, CommonTrans, AuthTrans, MealsTrans, ShoppingTrans, AdminTrans, RecipesTrans, SettingsTrans, withTranslationHelpers, useNamespacedTrans } from './trans-component';
export { detectLanguageSSR, initializeI18nSSR, getI18nServerSideProps, getI18nStaticProps } from './ssr';
export { LanguageManager, languageManager, detectLanguage, changeLanguage, getCurrentLanguage, isLanguageSupported, addLanguageChangeListener, useLanguageManager, type LanguageDetectionOptions } from './language-detection';
//# sourceMappingURL=index.d.ts.map
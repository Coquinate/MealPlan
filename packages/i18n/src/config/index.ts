// i18next configuration exports
export { default as i18n, initializeI18n } from './i18n'
export { I18nProvider, withTranslations } from './react-provider'
export { 
  useTranslation, 
  useCommonTranslations, 
  useRomanianFormatters,
  type TranslationNamespace,
  type TranslationKey
} from './hooks'

// Trans component for complex translations
export { 
  Trans,
  createNamespacedTrans,
  CommonTrans,
  AuthTrans,
  MealsTrans,
  ShoppingTrans,
  AdminTrans,
  RecipesTrans,
  SettingsTrans,
  withTranslationHelpers,
  useNamespacedTrans
} from './trans-component'

// SSR support for Next.js
export {
  detectLanguageSSR,
  initializeI18nSSR,
  getI18nServerSideProps,
  getI18nStaticProps
} from './ssr'

// Language detection and persistence
export {
  LanguageManager,
  languageManager,
  detectLanguage,
  changeLanguage,
  getCurrentLanguage,
  isLanguageSupported,
  addLanguageChangeListener,
  useLanguageManager,
  type LanguageDetectionOptions
} from './language-detection'
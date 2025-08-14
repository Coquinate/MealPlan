import { initializeI18n } from './i18n';
/**
 * Detect language from various sources in SSR context
 * Priority: URL params -> Cookies -> Accept-Language header -> Default
 *
 * @param context - Next.js SSR context
 * @param options - Language detection options
 * @returns Detected language code
 */
export function detectLanguageSSR(context, options = {}) {
  const {
    defaultLanguage = 'ro',
    supportedLanguages = ['ro', 'en'],
    useCookies = true,
    cookieName = 'i18n-language',
  } = options;
  // Check URL parameters first (e.g., /ro/page or ?lang=ro)
  if (context.req) {
    const urlParams = new URLSearchParams(context.req.url?.split('?')[1]);
    const urlLang = urlParams.get('lang') || urlParams.get('locale');
    if (urlLang && supportedLanguages.includes(urlLang)) {
      return urlLang;
    }
  }
  // Check cookies if enabled
  if (useCookies && context.req?.headers.cookie) {
    const cookies = parseCookies(context.req.headers.cookie);
    const cookieLang = cookies[cookieName];
    if (cookieLang && supportedLanguages.includes(cookieLang)) {
      return cookieLang;
    }
  }
  // Check Accept-Language header
  if (context.req?.headers['accept-language']) {
    const acceptLanguage = context.req.headers['accept-language'];
    const browserLangs = parseAcceptLanguage(acceptLanguage);
    for (const browserLang of browserLangs) {
      const langCode = browserLang.split('-')[0]; // Extract language code (en from en-US)
      if (supportedLanguages.includes(langCode)) {
        return langCode;
      }
    }
  }
  return defaultLanguage;
}
/**
 * Initialize i18n for server-side rendering
 * Ensures proper language is loaded before page render
 *
 * @param language - Language to initialize
 * @param namespaces - Namespaces to preload
 * @returns Promise resolving to initialized i18n instance
 */
export async function initializeI18nSSR(language = 'ro', namespaces = ['common']) {
  const i18n = await initializeI18n();
  // Change language if different from default
  if (i18n.language !== language) {
    await i18n.changeLanguage(language);
  }
  // Preload specified namespaces
  await Promise.all(namespaces.map((ns) => i18n.loadNamespaces(ns)));
  return i18n;
}
/**
 * Get server-side props with i18n initialization
 * Helper for Next.js getServerSideProps with i18n support
 *
 * @param context - Next.js getServerSideProps context
 * @param namespaces - Translation namespaces to preload
 * @param options - Language detection options
 * @returns Props object with i18n configuration
 */
export async function getI18nServerSideProps(context, namespaces = ['common'], options = {}) {
  try {
    const language = detectLanguageSSR(context, options);
    const i18n = await initializeI18nSSR(language, namespaces);
    // Get initial translation state for hydration
    const initialI18nStore = {};
    for (const ns of namespaces) {
      // Initialize language object if it doesn't exist
      if (!initialI18nStore[language]) {
        initialI18nStore[language] = {};
      }
      initialI18nStore[language][ns] = i18n.getResourceBundle(language, ns);
    }
    return {
      props: {
        // Props for client-side hydration
        _i18n: {
          language,
          namespaces,
          initialI18nStore,
        },
      },
    };
  } catch (error) {
    console.error('Error in getI18nServerSideProps:', error);
    // Return minimal props to prevent SSR failure
    return {
      props: {
        _i18n: {
          language: options.defaultLanguage || 'ro',
          namespaces: ['common'],
          initialI18nStore: {},
        },
      },
    };
  }
}
/**
 * Get static props with i18n initialization
 * Helper for Next.js getStaticProps with i18n support
 *
 * @param context - Next.js getStaticProps context
 * @param namespaces - Translation namespaces to preload
 * @returns Props object with i18n configuration
 */
export async function getI18nStaticProps(context, namespaces = ['common']) {
  try {
    // For static generation, use Romanian as default
    const language = context.locale || 'ro';
    const i18n = await initializeI18nSSR(language, namespaces);
    const initialI18nStore = {};
    for (const ns of namespaces) {
      // Initialize language object if it doesn't exist
      if (!initialI18nStore[language]) {
        initialI18nStore[language] = {};
      }
      initialI18nStore[language][ns] = i18n.getResourceBundle(language, ns);
    }
    return {
      props: {
        _i18n: {
          language,
          namespaces,
          initialI18nStore,
        },
      },
      // Revalidate every 24 hours for translation updates
      revalidate: 86400,
    };
  } catch (error) {
    console.error('Error in getI18nStaticProps:', error);
    return {
      props: {
        _i18n: {
          language: 'ro',
          namespaces: ['common'],
          initialI18nStore: {},
        },
      },
      revalidate: 86400,
    };
  }
}
// Utility functions
/**
 * Parse cookie string into object
 * @param cookieString - Raw cookie string from request headers
 * @returns Object with cookie key-value pairs
 */
function parseCookies(cookieString) {
  const cookies = {};
  cookieString.split(';').forEach((cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      cookies[key] = decodeURIComponent(value);
    }
  });
  return cookies;
}
/**
 * Parse Accept-Language header into ordered array of languages
 * @param acceptLanguage - Accept-Language header value
 * @returns Array of language codes ordered by preference
 */
function parseAcceptLanguage(acceptLanguage) {
  return acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, q] = lang.trim().split(';q=');
      return {
        code: code.trim(),
        quality: q ? parseFloat(q) : 1.0,
      };
    })
    .sort((a, b) => b.quality - a.quality)
    .map((item) => item.code);
}

type NextApiRequest = {
    url?: string;
    headers: {
        cookie?: string;
        'accept-language'?: string;
    };
};
type GetServerSidePropsContext = {
    req?: NextApiRequest;
    query?: Record<string, any>;
    locale?: string;
};
type GetStaticPropsContext = {
    locale?: string;
    params?: Record<string, any>;
};
import type { TranslationNamespace } from './hooks';
/**
 * Server-side i18n configuration for Next.js applications
 * Provides utilities for SSR/SSG with proper language detection
 */
interface SSRLanguageDetectionOptions {
    /** Default language to use */
    defaultLanguage?: string;
    /** Supported languages */
    supportedLanguages?: string[];
    /** Whether to use cookie-based persistence */
    useCookies?: boolean;
    /** Cookie name for language preference */
    cookieName?: string;
}
/**
 * Detect language from various sources in SSR context
 * Priority: URL params -> Cookies -> Accept-Language header -> Default
 *
 * @param context - Next.js SSR context
 * @param options - Language detection options
 * @returns Detected language code
 */
export declare function detectLanguageSSR(context: GetServerSidePropsContext | {
    req?: NextApiRequest;
}, options?: SSRLanguageDetectionOptions): string;
/**
 * Initialize i18n for server-side rendering
 * Ensures proper language is loaded before page render
 *
 * @param language - Language to initialize
 * @param namespaces - Namespaces to preload
 * @returns Promise resolving to initialized i18n instance
 */
export declare function initializeI18nSSR(language?: string, namespaces?: TranslationNamespace[]): Promise<import("i18next").i18n>;
/**
 * Get server-side props with i18n initialization
 * Helper for Next.js getServerSideProps with i18n support
 *
 * @param context - Next.js getServerSideProps context
 * @param namespaces - Translation namespaces to preload
 * @param options - Language detection options
 * @returns Props object with i18n configuration
 */
export declare function getI18nServerSideProps(context: GetServerSidePropsContext, namespaces?: TranslationNamespace[], options?: SSRLanguageDetectionOptions): Promise<{
    props: {
        _i18n: {
            language: string;
            namespaces: TranslationNamespace[];
            initialI18nStore: Record<string, Record<string, any>>;
        };
    };
} | {
    props: {
        _i18n: {
            language: string;
            namespaces: string[];
            initialI18nStore: {};
        };
    };
}>;
/**
 * Get static props with i18n initialization
 * Helper for Next.js getStaticProps with i18n support
 *
 * @param context - Next.js getStaticProps context
 * @param namespaces - Translation namespaces to preload
 * @returns Props object with i18n configuration
 */
export declare function getI18nStaticProps(context: GetStaticPropsContext, namespaces?: TranslationNamespace[]): Promise<{
    props: {
        _i18n: {
            language: string;
            namespaces: TranslationNamespace[];
            initialI18nStore: Record<string, Record<string, any>>;
        };
    };
    revalidate: number;
} | {
    props: {
        _i18n: {
            language: string;
            namespaces: string[];
            initialI18nStore: {};
        };
    };
    revalidate: number;
}>;
export {};
//# sourceMappingURL=ssr.d.ts.map
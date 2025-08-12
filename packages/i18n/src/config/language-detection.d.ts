/**
 * Client-side language detection and persistence
 * Handles browser storage, URL parameters, and user preferences
 */
import type { TranslationNamespace } from './hooks';
export interface LanguageDetectionOptions {
    /** Supported language codes */
    supportedLanguages: string[];
    /** Default fallback language */
    defaultLanguage: string;
    /** Whether to persist language choice */
    persistLanguage: boolean;
    /** Storage method for persistence */
    storageMethod: 'localStorage' | 'sessionStorage' | 'cookie';
    /** Cookie/storage key name */
    storageKey: string;
    /** Cookie expiration days (only for cookie storage) */
    cookieExpirationDays: number;
    /** Whether to detect from URL parameters */
    detectFromUrl: boolean;
    /** URL parameter name to check */
    urlParameter: string;
    /** Whether to detect from browser language */
    detectFromBrowser: boolean;
}
/**
 * Language detection and persistence manager
 * Handles all aspects of language detection and user preference storage
 */
export declare class LanguageManager {
    private options;
    private currentLanguage;
    private listeners;
    constructor(options?: Partial<LanguageDetectionOptions>);
    /**
     * Initialize language detection
     * Runs through detection priority and sets initial language
     *
     * @returns Promise resolving to detected language
     */
    initialize(): Promise<string>;
    /**
     * Detect language from various sources
     * Priority: URL -> Stored preference -> Browser -> Default
     *
     * @returns Detected language code
     */
    detectLanguage(): string;
    /**
     * Change current language
     * Updates i18next, persists choice, and notifies listeners
     *
     * @param language - Language code to switch to
     * @returns Promise resolving when language change is complete
     */
    changeLanguage(language: string): Promise<void>;
    /**
     * Get current language
     * @returns Current language code
     */
    getCurrentLanguage(): string;
    /**
     * Check if language is supported
     * @param language - Language code to check
     * @returns True if language is supported
     */
    isLanguageSupported(language: string): boolean;
    /**
     * Get all supported languages
     * @returns Array of supported language codes
     */
    getSupportedLanguages(): string[];
    /**
     * Add language change listener
     * @param listener - Callback function for language changes
     * @returns Function to remove the listener
     */
    addLanguageChangeListener(listener: (language: string) => void): () => void;
    /**
     * Preload translation namespaces for better performance
     * @param namespaces - Namespaces to preload
     * @param language - Language to preload (defaults to current)
     * @returns Promise resolving when preloading is complete
     */
    preloadNamespaces(namespaces: TranslationNamespace[], language?: string): Promise<void>;
    private getLanguageFromUrl;
    private getBrowserLanguage;
    private getStoredLanguage;
    private storeLanguage;
    private getCookie;
    private setCookie;
    private notifyListeners;
}
export declare const languageManager: LanguageManager;
export declare const detectLanguage: () => string;
export declare const changeLanguage: (language: string) => Promise<void>;
export declare const getCurrentLanguage: () => string;
export declare const isLanguageSupported: (language: string) => boolean;
export declare const addLanguageChangeListener: (listener: (language: string) => void) => () => void;
/**
 * React hook for language management
 * Provides current language and change function with automatic re-renders
 *
 * @returns Object with current language and change function
 */
export declare function useLanguageManager(): {
    currentLanguage: string;
    changeLanguage: (language: string) => Promise<void>;
    supportedLanguages: string[];
    isLanguageSupported: (language: string) => boolean;
};
//# sourceMappingURL=language-detection.d.ts.map
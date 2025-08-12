import React, { type ReactNode } from 'react';
interface I18nProviderProps {
    children: ReactNode;
}
/**
 * React provider component for i18n functionality
 * Initializes i18next and provides context to child components
 *
 * @param children - React child components
 * @returns JSX.Element - Provider wrapper with loading state
 */
export declare const I18nProvider: React.FC<I18nProviderProps>;
/**
 * Higher-order component for page-level translations
 * Ensures translations are loaded before rendering component
 *
 * @param Component - React component to wrap
 * @param namespaces - Translation namespaces required by the component
 * @returns React component with translation loading
 */
export declare function withTranslations<T extends object>(Component: React.ComponentType<T>, namespaces?: string[]): (props: T) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=react-provider.d.ts.map
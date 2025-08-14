import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import React, { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { initializeI18n } from './i18n';
/**
 * React provider component for i18n functionality
 * Initializes i18next and provides context to child components
 *
 * @param children - React child components
 * @returns JSX.Element - Provider wrapper with loading state
 */
export const I18nProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = React.useState(false);
  React.useEffect(() => {
    const initialize = async () => {
      try {
        await initializeI18n();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        // Continue with default i18n instance for resilience
        setIsInitialized(true);
      }
    };
    initialize();
  }, []);
  if (!isInitialized) {
    return _jsx('div', {
      className: 'flex items-center justify-center min-h-screen',
      children: _jsxs('div', {
        className: 'text-center',
        children: [
          _jsx('div', {
            className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-primary',
          }),
          _jsx('p', { className: 'mt-4 text-sm text-muted-foreground' }),
        ],
      }),
    });
  }
  return _jsx(I18nextProvider, {
    i18n,
    children: _jsx(Suspense, {
      fallback: _jsx('div', {
        className: 'flex items-center justify-center min-h-screen',
        children: _jsx('div', { className: 'animate-pulse text-muted-foreground' }),
      }),
      children,
    }),
  });
};
/**
 * Higher-order component for page-level translations
 * Ensures translations are loaded before rendering component
 *
 * @param Component - React component to wrap
 * @param namespaces - Translation namespaces required by the component
 * @returns React component with translation loading
 */
export function withTranslations(Component, namespaces = ['common']) {
  return function WrappedComponent(props) {
    const [isLoading, setIsLoading] = React.useState(true);
    React.useEffect(() => {
      const loadNamespaces = async () => {
        try {
          await Promise.all(namespaces.map((ns) => i18n.loadNamespaces(ns)));
        } catch (error) {
          console.error('Failed to load translation namespaces:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadNamespaces();
    }, []);
    if (isLoading) {
      return _jsxs('div', {
        className: 'animate-pulse',
        children: [
          _jsx('div', { className: 'h-6 bg-muted rounded w-full mb-4' }),
          _jsx('div', { className: 'h-4 bg-muted rounded w-3/4 mb-2' }),
          _jsx('div', { className: 'h-4 bg-muted rounded w-1/2' }),
        ],
      });
    }
    return _jsx(Component, { ...props });
  };
}

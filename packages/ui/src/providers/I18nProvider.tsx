'use client';

import { I18nextProvider } from 'react-i18next';
import { i18n, initializeI18n } from '@coquinate/i18n';
import { useEffect, useState, type ReactNode } from 'react';

interface I18nProviderProps {
  children: ReactNode;
  locale: string;
}

export function I18nProvider({ children, locale }: I18nProviderProps) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    // Initialize i18n if not already initialized
    const initI18n = async () => {
      if (!i18n.isInitialized) {
        await initializeI18n();
      }
      
      // Change language if different from current
      if (i18n.language !== locale) {
        await i18n.changeLanguage(locale);
      }
      
      setIsI18nInitialized(true);
    };

    initI18n();
  }, [locale]);

  // Don't render children until i18n is initialized
  if (!isI18nInitialized) {
    return null;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

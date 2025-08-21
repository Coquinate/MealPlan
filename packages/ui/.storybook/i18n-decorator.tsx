import React from 'react';
import type { Decorator } from '@storybook/react';
import { I18nProvider } from '@coquinate/i18n';

// Re-export useTranslation from the actual i18n package
// export { useTranslation } from 'react-i18next';

// Mock i18n context
const I18nContext = React.createContext({
  locale: 'ro',
  t: (key: string) => {
    const keys = key.split('.');
    let value: any = mockTranslations.ro;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  },
  changeLocale: (locale: string) => {
    console.log('Changing locale to:', locale);
  },
});

// Mock useTranslation hook for components
export const useTranslation = (namespaces?: string | string[]) => {
  const context = React.useContext(I18nContext);

  return {
    t: (key: string, options?: any) => {
      // Handle namespace:key format
      if (key.includes(':')) {
        const [namespace, actualKey] = key.split(':');
        return context.t(`${namespace}.${actualKey}`);
      }

      // Handle array namespaces
      if (Array.isArray(namespaces)) {
        for (const ns of namespaces) {
          const value = context.t(`${ns}.${key}`);
          if (value !== `${ns}.${key}`) {
            return value;
          }
        }
      } else if (namespaces) {
        return context.t(`${namespaces}.${key}`);
      }

      return context.t(key);
    },
    i18n: {
      language: context.locale,
      changeLanguage: context.changeLocale,
    },
    ready: true,
  };
};

// Export for components to import directly
// Avoid global window pollution

// Decorator for Storybook
export const i18nDecorator: Decorator = (Story, context) => {
  const locale = context.globals?.locale || 'ro';

  const contextValue = {
    locale,
    t: (key: string) => {
      const keys = key.split('.');
      let value: any =
        mockTranslations[locale as keyof typeof mockTranslations] || mockTranslations.ro;
      for (const k of keys) {
        value = value?.[k];
      }
      return value || key;
    },
    changeLocale: (newLocale: string) => {
      console.log('Changing locale to:', newLocale);
    },
  };

  return (
    <I18nContext.Provider value={contextValue}>
      <Story />
    </I18nContext.Provider>
  );
};

export default i18nDecorator;

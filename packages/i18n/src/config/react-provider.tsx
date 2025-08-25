'use client';

import React, { type ReactNode, Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  return (
    <Suspense fallback={<div>Loading translations...</div>}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </Suspense>
  );
}

// HOC for wrapping components with translation provider
export function withTranslations<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithTranslations = (props: P) => (
    <I18nProvider>
      <WrappedComponent {...props} />
    </I18nProvider>
  );
  WithTranslations.displayName = `withTranslations(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithTranslations;
}

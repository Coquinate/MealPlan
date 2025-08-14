'use client';

import React from 'react';
import { Analytics } from '@vercel/analytics/next';
import { I18nProvider } from '@coquinate/i18n';

/**
 * Client-side providers wrapper
 * Contains all client-side providers that use React context
 */
interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <I18nProvider>
      {children}
      <Analytics />
    </I18nProvider>
  );
}

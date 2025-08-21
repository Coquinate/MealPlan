'use client';

import React from 'react';
import { Analytics } from '@vercel/analytics/next';
import { I18nProvider } from '@coquinate/ui';

/**
 * Client-side providers wrapper
 * Contains all client-side providers that use React context
 */
interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  // Hardcoding locale to 'ro' as it's the primary language of the app.
  // This could be dynamic in the future based on user preferences or URL.
  const locale = 'ro';

  return (
    <I18nProvider locale={locale}>
      {children}
      <Analytics />
    </I18nProvider>
  );
}

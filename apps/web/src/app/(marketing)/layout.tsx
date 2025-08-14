import React from 'react';

export const metadata = {
  title: {
    template: '%s | Coquinate',
  },
};

/**
 * Marketing Layout
 *
 * Simplified layout for marketing pages (landing, auth)
 * No navigation or complex UI - just a container for marketing content
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <div className="marketing-layout">{children}</div>;
}

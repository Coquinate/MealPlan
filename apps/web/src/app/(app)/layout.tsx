import React from 'react';

export const metadata = {
  title: {
    template: '%s | Coquinate Dashboard',
  },
};

/**
 * App Layout
 *
 * Simplified layout for authenticated user interface
 * Currently just a container - will be enhanced with navigation when needed
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="app-layout">{children}</div>;
}

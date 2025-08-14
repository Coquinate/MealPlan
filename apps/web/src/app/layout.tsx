import React from 'react';
import { Inter } from 'next/font/google';
import { RootErrorBoundary } from '../components/error-boundaries/RootErrorBoundary';
import { ClientProviders } from '../components/providers/ClientProviders';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Coquinate - Planificare mese inteligentă',
    template: '%s | Coquinate',
  },
  description: 'Planifică mesele tale cu ușurință și optimizează lista de cumpărături',
  keywords: ['planificare mese', 'lista cumpărături', 'rețete românești', 'organizare bucătărie'],
  authors: [{ name: 'Coquinate Team' }],
  creator: 'Coquinate',
  publisher: 'Coquinate',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://coquinate.com'),
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: '/',
    siteName: 'Coquinate',
    title: 'Coquinate - Planificare mese inteligentă',
    description: 'Planifică mesele tale cu ușurință și optimizează lista de cumpărături',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coquinate - Planificare mese inteligentă',
    description: 'Planifică mesele tale cu ușurință și optimizează lista de cumpărături',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={inter.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <RootErrorBoundary>
          <ClientProviders>{children}</ClientProviders>
        </RootErrorBoundary>
      </body>
    </html>
  );
}

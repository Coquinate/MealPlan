import React from 'react';
import { Inter, Lexend } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
// import { RootErrorBoundary } from '../components/error-boundaries/RootErrorBoundary';
import { ClientProviders } from '../components/providers/ClientProviders';
import { GlassMorphismInit } from '../components/features/GlassMorphismInit';
import '../styles/globals.css';

// Modern Hearth Font Setup with Romanian Support
// NOTE: Font loading is app-specific (Next.js vs Vite), but font families
// are defined in packages/config/tailwind/design-tokens.js (shared design system)
const inter = Inter({
  subsets: ['latin', 'latin-ext'], // CRITICAL pentru diacritice românești
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  fallback: ['Roboto', 'system-ui', 'sans-serif'], // Better Romanian support
});

const lexend = Lexend({
  subsets: ['latin', 'latin-ext'], // Romanian diacritics support
  variable: '--font-lexend',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  fallback: ['Inter', 'system-ui', 'sans-serif'],
  preload: false, // Lazy load - only loads when used by .font-display class
  adjustFontFallback: true, // Reduces layout shift when font loads
});

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://coquinate.ro'),
  alternates: {
    canonical: '/',
    languages: {
      'ro-RO': 'https://coquinate.ro',
      'en-US': 'https://coquinate.com',
    },
  },
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
    <html lang="ro" className={`${inter.variable} ${lexend.variable}`} data-motion="subtle" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Forțează light theme ca default pentru coming soon page
              if (window.location.pathname === '/' || window.location.pathname === '/coming-soon') {
                const savedTheme = localStorage.getItem('coming-soon-theme');
                if (savedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  // Default to light theme
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              }
            `,
          }}
        />
      </head>
      <body className="font-primary antialiased">
        <GlassMorphismInit />
        {/* <RootErrorBoundary> */}
        <ClientProviders>{children}</ClientProviders>
        {/* </RootErrorBoundary> */}
        <Analytics />
      </body>
    </html>
  );
}

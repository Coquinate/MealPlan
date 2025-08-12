import { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/next';

/**
 * Custom Next.js App component
 * Wraps all pages with common functionality and Vercel Analytics
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
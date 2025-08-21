/**
 * Full Launch Homepage - Multi-Domain Support
 * 
 * Supports both coquinate.ro (Romanian) and coquinate.com (International)
 * with domain-specific content, currency, and cultural adaptation.
 */

import { headers } from 'next/headers';
import { Metadata } from 'next';
import { getDomainFromHeaders, getDomainConfig, getCanonicalUrl, getAlternateUrls } from '@/lib/domain-utils';
import { HomepageClient } from '@/components/HomepageClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const domain = getDomainFromHeaders(headersList);
  const config = getDomainConfig(domain);
  const pathname = '/';
  const canonicalUrl = getCanonicalUrl(pathname, domain);
  const alternateUrls = getAlternateUrls(pathname);
  
  if (domain === 'com') {
    return {
      title: "No More 'What's for Dinner?' - Coquinate Meal Planning",
      description: "Save 3+ hours weekly and €80+ monthly with intelligent meal planning. We plan, you cook.",
      openGraph: {
        title: "No More 'What's for Dinner?' - Coquinate",
        description: "Intelligent meal planning platform for international families",
        locale: config.locale,
        url: canonicalUrl,
        siteName: "Coquinate",
        type: "website",
      },
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'en': alternateUrls.com,
          'ro': alternateUrls.ro,
        },
      },
    };
  }
  
  return {
    title: "Gata cu 'Ce gătim azi?' - Planificare Meniuri Coquinate",
    description: "Economisește 3+ ore săptămânal și 300+ RON lunar cu planificarea automată a meselor. Noi planificăm, tu gătești.",
    openGraph: {
      title: "Gata cu 'Ce gătim azi?' - Coquinate",
      description: "Platformă românească de planificare meniuri și urmărire nutrițională",
      locale: config.locale,
      url: canonicalUrl,
      siteName: "Coquinate",
      type: "website",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'ro': alternateUrls.ro,
        'en': alternateUrls.com,
      },
    },
  };
}

export default async function HomePage() {
  const headersList = await headers();
  const domain = getDomainFromHeaders(headersList);
  const config = getDomainConfig(domain);

  return (
    <main className="min-h-screen">
      <HomepageClient domain={domain} config={config} />
    </main>
  );
}
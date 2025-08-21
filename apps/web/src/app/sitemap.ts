import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coquinate.ro';
  
  // Paginile principale disponibile în ambele moduri de lansare
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // Adaugă rute suplimentare doar în modul full-launch
  if (process.env.NEXT_PUBLIC_LAUNCH_MODE === 'full-launch') {
    routes.push(
      {
        url: `${baseUrl}/pricing`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/auth/login`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.4,
      },
      {
        url: `${baseUrl}/auth/register`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.4,
      }
    );
  }

  return routes;
}
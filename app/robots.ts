import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/statement',
        '/reel',
        '/shootings',
        '/cv',
      ],
    },
    sitemap: 'https://tommysarchive.vercel.app/sitemap.xml',
  };
}


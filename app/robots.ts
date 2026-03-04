import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${process.env.APP_URL || 'https://Dwell-at-soundscapes.com'}/sitemap.xml`,
  };
}

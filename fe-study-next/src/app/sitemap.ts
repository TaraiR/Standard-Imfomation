import { MetadataRoute } from 'next';
import { curriculum } from '@/data/curriculum';

const SITE_URL = 'https://standard-information.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const chapterRoutes = curriculum.map(ch => ({
    url: `${SITE_URL}/chapter/${ch.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...chapterRoutes,
  ];
}

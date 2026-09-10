import type { MetadataRoute } from 'next';
import { getCatalog } from '@/lib/catalog';

const SITE = 'https://inkfold.vercel.app';

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog();
  const now = new Date();

  const fixed: MetadataRoute.Sitemap = (
    [
      { url: SITE, changeFrequency: 'weekly', priority: 1 },
      { url: `${SITE}/library`, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${SITE}/studio`, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${SITE}/licences`, changeFrequency: 'monthly', priority: 0.6 },
    ] satisfies MetadataRoute.Sitemap
  ).map((e) => ({ ...e, lastModified: now }));

  // Every series page, and every chapter a reader can open from it.
  const reading = catalog.flatMap((s) => [
    {
      url: `${SITE}/series/${s.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...s.chapters.map((c) => ({
      url: `${SITE}/read/${s.slug}/${c.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]);

  return [...fixed, ...reading];
}

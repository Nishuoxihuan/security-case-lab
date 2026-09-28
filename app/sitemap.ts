import type { MetadataRoute } from 'next';
import { getAllCases, getAllTopics, getAllPaths } from '@/lib/content';
import { siteConfig } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticRoutes = [
    '',
    '/cases',
    '/topics',
    '/paths',
    '/radar',
    '/search',
    '/sources',
    '/methodology',
    '/legal',
    '/about',
  ];

  const caseUrls = getAllCases()
    .filter((c) => ['published', 'updated'].includes(c.frontmatter.status))
    .map((c) => ({
      url: `${base}/cases/${c.frontmatter.slug}`,
      lastModified: new Date(c.frontmatter.lastReviewedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  const topicUrls = getAllTopics().map((t) => ({
    url: `${base}/topics/${t.frontmatter.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const pathUrls = getAllPaths().map((p) => ({
    url: `${base}/paths/${p.frontmatter.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes.map((r) => ({
      url: `${base}${r}`,
      changeFrequency: 'weekly' as const,
      priority: r === '' ? 1 : 0.7,
    })),
    ...caseUrls,
    ...topicUrls,
    ...pathUrls,
  ];
}

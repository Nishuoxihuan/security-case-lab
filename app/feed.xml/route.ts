import { getPublishedCases } from '@/lib/content';
import { siteConfig } from '@/lib/site';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RSS 2.0：最近发布/更新的案例（文档 13.3） */
export async function GET() {
  const cases = getPublishedCases().slice(0, 20);
  const items = cases
    .map((c) => {
      const fm = c.frontmatter;
      const link = `${siteConfig.url}/cases/${fm.slug}`;
      const categories = [...fm.surfaces, ...fm.tags]
        .map((t) => `      <category>${escapeXml(t)}</category>`)
        .join('\n');
      return `    <item>
      <title>${escapeXml(fm.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(fm.summary)}</description>
      <pubDate>${new Date(fm.firstDisclosedAt).toUTCString()}</pubDate>
${categories}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>zh-CN</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}

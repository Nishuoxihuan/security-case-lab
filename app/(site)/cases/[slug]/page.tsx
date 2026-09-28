import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { CaseMeta } from '@/components/case/CaseMeta';
import { CaseCard } from '@/components/case/CaseCard';
import { ReferenceList } from '@/components/case/ReferenceList';
import { mdxComponents } from '@/components/mdx-components';
import { getAllCases, getCaseBySlug, extractHeadings } from '@/lib/content';
import { formatDate } from '@/lib/date-window';
import { siteConfig } from '@/lib/site';
import type { CaseDoc } from '@/lib/schemas';

export async function generateStaticParams() {
  return getAllCases().map((c) => ({ slug: c.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return {};
  const fm = c.frontmatter;
  const keywords = [
    ...(fm.cves ?? []),
    ...(fm.aliases ?? []),
    fm.vendor ?? '',
    ...fm.tags,
    ...fm.surfaces,
    String(c.computed.year),
  ].filter(Boolean);
  return {
    title: fm.title,
    description: fm.summary,
    keywords,
    openGraph: {
      title: fm.title,
      description: fm.summary,
      type: 'article',
      publishedTime: fm.firstDisclosedAt,
      modifiedTime: fm.lastReviewedAt,
      tags: fm.tags,
    },
  };
}

function RelatedCases({ current }: { current: CaseDoc }) {
  const all = getAllCases().filter((c) => ['published', 'updated'].includes(c.frontmatter.status));
  const bySlug = new Map(all.map((c) => [c.frontmatter.slug, c]));
  let related: CaseDoc[] = [];
  const curated = current.frontmatter.relatedCases ?? [];
  related = curated.map((s) => bySlug.get(s)).filter((c): c is CaseDoc => Boolean(c));
  if (related.length < 6) {
    const sameSurface = all.filter(
      (c) =>
        c.frontmatter.slug !== current.frontmatter.slug &&
        !related.includes(c) &&
        c.frontmatter.surfaces.some((s) => current.frontmatter.surfaces.includes(s))
    );
    related = [...related, ...sameSurface].slice(0, 6);
  }
  if (related.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-extrabold">关联案例</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {related.map((c) => (
          <CaseCard key={c.frontmatter.slug} caseDoc={c} />
        ))}
      </div>
    </section>
  );
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseDoc = getCaseBySlug(slug);
  if (!caseDoc) notFound();
  const { frontmatter: fm, body } = caseDoc;
  const headings = extractHeadings(body);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: fm.title,
    description: fm.summary,
    datePublished: fm.firstDisclosedAt,
    dateModified: fm.lastReviewedAt,
    inLanguage: 'zh-CN',
    author: { '@type': 'Organization', name: siteConfig.name },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/cases" className="text-sm text-muted hover:text-text">
        ← 返回案例库
      </Link>
      <div className="mt-4">
        <CaseMeta caseDoc={caseDoc} />
      </div>

      <div className="mt-8 gap-8 lg:grid lg:grid-cols-[1fr_240px]">
        <article className="mdx-body min-w-0">
          {/* 内容为仓库内受审稿流程管控的可信 MDX：放行 JS 表达式 props（如 <AttackChain steps={[...]} />），保留 blockDangerousJS（默认 true）拦截 eval/Function/process 等危险用法 */}
          <MDXRemote source={body} components={mdxComponents} options={{ blockJS: false }} />
          <ReferenceList references={fm.references} />
          <div className="mt-8 rounded-xl border border-border bg-panel p-4 text-sm text-muted">
            <p>
              最后复核：{formatDate(fm.lastReviewedAt)}
              {fm.status === 'updated' ? '（发布后有更新）' : ''}
              {fm.contentVersion ? ` · 内容版本 ${fm.contentVersion}` : ''}
            </p>
            {fm.changeLog && fm.changeLog.length > 0 && (
              <ul className="mt-2 space-y-1">
                {fm.changeLog.map((c, i) => (
                  <li key={i} className="text-xs">
                    {formatDate(c.date)}：{c.summary}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2">
              发现事实错误？请通过{' '}
              <Link href="/about" className="underline">
                关于页
              </Link>{' '}
              的联系方式反馈。
            </p>
          </div>
        </article>

        <aside className="hidden lg:block">
          <nav className="sticky top-20 rounded-xl border border-border bg-panel p-4">
            <div className="mb-2 text-sm font-bold">目录</div>
            <ul className="space-y-1.5 text-sm">
              {headings.map((h) => (
                <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
                  <a href={`#${h.id}`} className="text-muted hover:text-text">
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      <RelatedCases current={caseDoc} />
    </div>
  );
}

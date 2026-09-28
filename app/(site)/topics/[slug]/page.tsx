import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { CaseCard } from '@/components/case/CaseCard';
import { mdxComponents } from '@/components/mdx-components';
import { getAllTopics, getTopicBySlug, getPublishedCases } from '@/lib/content';

export async function generateStaticParams() {
  return getAllTopics().map((t) => ({ slug: t.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getTopicBySlug(slug);
  if (!t) return {};
  return { title: t.frontmatter.title, description: t.frontmatter.summary };
}

export default async function TopicDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const surfaces = topic.frontmatter.surfaces ?? [];
  const cases = getPublishedCases().filter((c) =>
    c.frontmatter.surfaces.some((s) => surfaces.includes(s))
  );

  return (
    <div className="space-y-8">
      <div>
        <Link href="/topics" className="text-sm text-muted hover:text-text">
          ← 返回专题
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold">{topic.frontmatter.title}</h1>
        <p className="mt-3 text-lg text-muted">{topic.frontmatter.summary}</p>
      </div>
      <article className="mdx-body">
        <MDXRemote source={topic.body} components={mdxComponents} options={{ blockJS: false }} />
      </article>
      <section>
        <h2 className="mb-4 text-xl font-extrabold">本专题案例（{cases.length}）</h2>
        {cases.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
            该专题案例正在写作中。
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {cases.map((c) => (
              <CaseCard key={c.frontmatter.slug} caseDoc={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

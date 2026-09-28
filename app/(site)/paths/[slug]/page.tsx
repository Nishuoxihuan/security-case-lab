import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/mdx-components';
import { getAllPaths, getPathBySlug, getCaseBySlug, getTopicBySlug } from '@/lib/content';

export async function generateStaticParams() {
  return getAllPaths().map((p) => ({ slug: p.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPathBySlug(slug);
  if (!p) return {};
  return { title: p.frontmatter.title, description: p.frontmatter.summary };
}

export default async function PathDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pathDoc = getPathBySlug(slug);
  if (!pathDoc) notFound();
  const { frontmatter: fm, body } = pathDoc;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/paths" className="text-sm text-muted hover:text-text">
          ← 返回学习路径
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold">{fm.title}</h1>
        <p className="mt-3 text-lg text-muted">{fm.summary}</p>
      </div>
      <article className="mdx-body">
        <MDXRemote source={body} components={mdxComponents} options={{ blockJS: false }} />
      </article>
      <section>
        <h2 className="mb-4 text-xl font-extrabold">学习步骤</h2>
        <ol className="space-y-4">
          {fm.steps.map((step, i) => {
            const caseDoc = step.caseSlug ? getCaseBySlug(step.caseSlug) : undefined;
            const topic = step.topicSlug ? getTopicBySlug(step.topicSlug) : undefined;
            return (
              <li key={i} className="rounded-xl border border-border bg-panel p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7db4ff]/15 font-mono text-sm font-bold text-[#7db4ff]">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-bold">{step.title}</div>
                    <p className="mt-1 text-sm text-muted">{step.description}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm">
                      {caseDoc && (
                        <Link
                          href={`/cases/${caseDoc.frontmatter.slug}`}
                          className="text-[#7db4ff] underline underline-offset-4"
                        >
                          阅读案例：{caseDoc.frontmatter.title} →
                        </Link>
                      )}
                      {topic && (
                        <Link
                          href={`/topics/${topic.frontmatter.slug}`}
                          className="text-[#7db4ff] underline underline-offset-4"
                        >
                          专题：{topic.frontmatter.title} →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

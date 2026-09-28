import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTopics } from '@/lib/content';

export const metadata: Metadata = { title: '专题' };

export default function TopicsPage() {
  const topics = getAllTopics();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">专题</h1>
        <p className="mt-2 text-muted">
          按现代攻击面组织的案例集合，每个专题解释该攻击面为何在近五年变得重要。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {topics.map((t) => (
          <Link
            key={t.frontmatter.slug}
            href={`/topics/${t.frontmatter.slug}`}
            className="rounded-xl border border-border bg-panel p-6 hover:border-[#7db4ff]/60"
          >
            <h2 className="text-xl font-bold">{t.frontmatter.title}</h2>
            <p className="mt-2 text-sm text-muted">{t.frontmatter.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPaths } from '@/lib/content';

export const metadata: Metadata = { title: '学习路径' };

export default function PathsPage() {
  const paths = getAllPaths();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">学习路径</h1>
        <p className="mt-2 text-muted">
          按主题串起来的案例阅读顺序，适合系统性地理解一类现代攻击面。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {paths.map((p) => (
          <Link
            key={p.frontmatter.slug}
            href={`/paths/${p.frontmatter.slug}`}
            className="rounded-xl border border-border bg-panel p-6 hover:border-[#7db4ff]/60"
          >
            <h2 className="text-xl font-bold">{p.frontmatter.title}</h2>
            <p className="mt-2 text-sm text-muted">{p.frontmatter.summary}</p>
            <p className="mt-2 text-xs text-muted">{p.frontmatter.steps.length} 个步骤</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { surfaceLabel, EXPLOITATION_LABEL } from '@/lib/site';
import { createFuse, type SearchDocument } from '@/lib/search';
import rawIndex from '@/data/generated/search-index.json';

const docs = rawIndex as SearchDocument[];

export function SearchBox() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const fuse = useMemo(() => createFuse(docs), []);

  const [committed, setCommitted] = useState(searchParams.get('q') ?? '');
  useEffect(() => {
    const t = setTimeout(() => setCommitted(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const results = useMemo(() => {
    if (!committed) return [];
    return fuse.search(committed).slice(0, 30);
  }, [fuse, committed]);

  return (
    <div className="space-y-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="例如：XZ Utils、供应链、CVE-2024-3094、BOLA…"
        autoFocus
        className="w-full rounded-xl border border-border bg-panel px-4 py-3 text-lg text-text placeholder:text-muted/60 focus:border-[#7db4ff]/60 focus:outline-none"
      />
      {committed ? (
        results.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
            没有找到「{committed}」相关的内容，换个关键词试试。
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted">找到 {results.length} 条结果</p>
            {results.map(({ item }) => (
              <Link
                key={item.slug}
                href={`/cases/${item.slug}`}
                className="block rounded-xl border border-border bg-panel p-4 hover:border-[#7db4ff]/60"
              >
                <div className="flex flex-wrap gap-2">
                  <Badge tone="info">{item.year}</Badge>
                  {item.surfaces.map((s) => (
                    <Badge key={s}>{surfaceLabel(s)}</Badge>
                  ))}
                  <Badge
                    tone={item.exploitationStatus === 'known-exploited' ? 'danger' : 'default'}
                  >
                    {EXPLOITATION_LABEL[item.exploitationStatus] ?? item.exploitationStatus}
                  </Badge>
                </div>
                <div className="mt-2 font-bold">{item.title}</div>
                <div className="mt-1 line-clamp-2 text-sm text-muted">{item.summary}</div>
              </Link>
            ))}
          </div>
        )
      ) : (
        <p className="text-sm text-muted">
          输入关键词开始检索（标题、别名、标签、CVE、厂商均可）。
        </p>
      )}
    </div>
  );
}

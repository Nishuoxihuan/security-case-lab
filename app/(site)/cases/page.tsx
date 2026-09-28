import type { Metadata } from 'next';
import { CaseCard } from '@/components/case/CaseCard';
import { CaseFilters } from '@/components/case/CaseFilters';
import { getPublishedCases } from '@/lib/content';
import { applyCaseFilters, availableFilterValues, type CaseFilterParams } from '@/lib/filters';

export const metadata: Metadata = { title: '案例库' };

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params: CaseFilterParams = {
    surface: first(sp.surface),
    year: first(sp.year),
    exploitation: first(sp.exploitation),
    severity: first(sp.severity),
    tag: first(sp.tag),
    q: first(sp.q),
  };

  const published = getPublishedCases();
  const cases = applyCaseFilters(published, params);
  const values = availableFilterValues(published);
  const hasFilter = Object.values(params).some((v) => v);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">案例库</h1>
        <p className="mt-2 text-muted">
          共 {published.length} 篇深度案例。筛选条件全部体现在 URL 中，可直接分享链接。
        </p>
      </div>
      <CaseFilters values={values} />
      {cases.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
          没有符合筛选条件的案例，试试放宽条件。
        </p>
      ) : (
        <>
          <p className="text-sm text-muted">
            找到 {cases.length} 篇{hasFilter ? '（已筛选）' : ''}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {cases.map((c) => (
              <CaseCard key={c.frontmatter.slug} caseDoc={c} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

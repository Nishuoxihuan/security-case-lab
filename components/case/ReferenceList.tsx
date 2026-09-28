import type { Reference } from '@/lib/schemas';

const TYPE_LABEL: Record<string, string> = {
  'vendor-advisory': '厂商公告',
  nvd: 'NVD',
  kev: 'CISA KEV',
  research: '研究报告',
  news: '媒体报道',
  other: '其他',
};

/** 来源列表：每条主张对应来源（文档 4.1 第 11 模块） */
export function ReferenceList({ references }: { references: Reference[] }) {
  if (!references || references.length === 0) return null;
  return (
    <div className="my-6">
      <h3 className="text-sm font-bold text-muted">引用来源</h3>
      <ul className="mt-2 space-y-2">
        {references.map((ref, i) => (
          <li key={i} className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded border border-border bg-panel px-1.5 py-0.5 text-xs text-muted">
              {TYPE_LABEL[ref.type] ?? ref.type}
            </span>
            {ref.primary && (
              <span className="rounded border border-safe/40 bg-safe/10 px-1.5 py-0.5 text-xs text-safe">
                一级来源
              </span>
            )}
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7db4ff] underline underline-offset-4 hover:text-[#a8ccff]"
            >
              {ref.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

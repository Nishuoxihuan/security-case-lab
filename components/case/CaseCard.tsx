import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/date-window';
import { surfaceLabel, SEVERITY_LABEL, EXPLOITATION_LABEL } from '@/lib/site';
import type { CaseDoc } from '@/lib/schemas';

export function CaseCard({ caseDoc }: { caseDoc: CaseDoc }) {
  const { frontmatter: fm, computed } = caseDoc;
  return (
    <Link
      href={`/cases/${fm.slug}`}
      className="block rounded-xl border border-border bg-panel p-5 transition hover:border-[#7db4ff]/60 hover:bg-[#11182b]/80"
    >
      <div className="flex flex-wrap gap-2">
        <Badge tone="info">{computed.year}</Badge>
        {fm.surfaces.map((s) => (
          <Badge key={s}>{surfaceLabel(s)}</Badge>
        ))}
        {fm.severity && (
          <Badge
            tone={
              fm.severity === 'critical' ? 'danger' : fm.severity === 'high' ? 'warning' : 'default'
            }
          >
            严重性：{SEVERITY_LABEL[fm.severity]}
          </Badge>
        )}
        <Badge tone={computed.exploitationStatus === 'known-exploited' ? 'danger' : 'default'}>
          {EXPLOITATION_LABEL[computed.exploitationStatus]}
        </Badge>
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug">{fm.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{fm.summary}</p>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted">
        <span>阅读约 {computed.readingTimeMinutes} 分钟</span>
        <span>最后复核 {formatDate(fm.lastReviewedAt)}</span>
        {fm.cves && fm.cves.length > 0 && <span>{fm.cves.join('、')}</span>}
      </div>
    </Link>
  );
}

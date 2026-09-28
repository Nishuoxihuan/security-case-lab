import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/date-window';
import { surfaceLabel, SEVERITY_LABEL, EXPLOITATION_LABEL } from '@/lib/site';
import type { CaseDoc } from '@/lib/schemas';

/** 案例详情首屏元信息（文档 7.2） */
export function CaseMeta({ caseDoc }: { caseDoc: CaseDoc }) {
  const { frontmatter: fm, computed } = caseDoc;
  return (
    <div>
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
            {SEVERITY_LABEL[fm.severity]}
            {typeof fm.cvss === 'number' ? ` · CVSS ${fm.cvss}` : ''}
          </Badge>
        )}
        <Badge tone={computed.exploitationStatus === 'known-exploited' ? 'danger' : 'default'}>
          {EXPLOITATION_LABEL[computed.exploitationStatus]}
        </Badge>
        {fm.kevAddedAt && <Badge tone="danger">KEV 收录</Badge>}
      </div>
      <h1 className="mt-4 text-3xl font-extrabold leading-tight">{fm.title}</h1>
      <p className="mt-3 text-lg text-muted">{fm.summary}</p>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        {[
          ['首次披露', fm.firstDisclosedAt],
          ['补丁/缓解', fm.patchedAt],
          ['确认在野利用', fm.kevAddedAt],
          ['本站最后复核', fm.lastReviewedAt],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-panel px-3 py-2">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="mt-1 font-mono text-sm">{formatDate(value)}</dd>
          </div>
        ))}
      </dl>
      {fm.cves && fm.cves.length > 0 && (
        <p className="mt-4 text-sm text-muted">
          相关编号：<span className="font-mono text-text">{fm.cves.join('、')}</span>
          {fm.cwes && fm.cwes.length > 0 && (
            <>
              {' ｜ '}
              <span className="font-mono text-text">{fm.cwes.join('、')}</span>
            </>
          )}
        </p>
      )}
    </div>
  );
}

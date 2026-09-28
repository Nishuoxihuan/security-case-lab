import type { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/date-window';
import { surfaceLabel } from '@/lib/site';
import { RadarCandidateSchema, type RadarCandidate } from '@/lib/schemas';

export const metadata: Metadata = { title: '攻防雷达' };

function loadCandidates(): RadarCandidate[] {
  const file = path.join(process.cwd(), 'data', 'radar-candidates.json');
  const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as unknown[];
  return raw.map((item) => RadarCandidateSchema.parse(item));
}

const CLAIM_LABEL: Record<string, string> = {
  none: '未声称在野利用',
  'kev-listed': 'CISA KEV 已收录',
  'vendor-confirmed': '厂商已确认',
};

export default function RadarPage() {
  const candidates = loadCandidates();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">攻防雷达</h1>
        <p className="mt-2 max-w-3xl text-muted">
          编辑筛选后的候选清单：只展示已核实的基础事实与来源，不公开未经审核的攻击细节；
          「研究中」的条目不会把推测写成事实。候选经充分研究后可能成为深度案例。
        </p>
      </div>
      {candidates.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
          暂无候选条目。
        </p>
      ) : (
        <div className="space-y-4">
          {candidates.map((c) => (
            <article key={c.id} className="rounded-xl border border-border bg-panel p-5">
              <div className="flex flex-wrap gap-2">
                <Badge tone={c.status === 'published' ? 'safe' : 'warning'}>
                  {c.status === 'published' ? '已发布分析' : '研究中'}
                </Badge>
                {c.surfaces.map((s) => (
                  <Badge key={s}>{surfaceLabel(s)}</Badge>
                ))}
                <Badge tone={c.exploitationClaim === 'none' ? 'default' : 'danger'}>
                  {CLAIM_LABEL[c.exploitationClaim]}
                </Badge>
              </div>
              <h2 className="mt-3 text-lg font-bold">{c.title}</h2>
              <p className="mt-1 font-mono text-sm text-muted">{c.cves.join('、')}</p>
              <p className="mt-2 text-sm text-muted">{c.candidateReason}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                <span>最后核查 {formatDate(c.lastCheckedAt)}</span>
                {c.sourceUrls.map((u, i) => (
                  <a
                    key={u}
                    href={u}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7db4ff] underline underline-offset-4"
                  >
                    来源 {i + 1}
                  </a>
                ))}
                {c.exploitationEvidenceUrl && (
                  <a
                    href={c.exploitationEvidenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-danger underline underline-offset-4"
                  >
                    在野利用证据
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

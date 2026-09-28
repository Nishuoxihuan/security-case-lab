/**
 * 雷达候选校验（文档 8.5）：
 *  - schema 合法
 *  - 声称在野利用必须附带可验证的证据链接
 *  - 文案中出现「在野利用/已被利用」等断言时，必须有对应的 exploitationClaim
 */
import fs from 'node:fs';
import path from 'node:path';
import { RadarCandidateSchema } from '../lib/schemas';
import { isValidDateString } from '../lib/date-window';

const errors: string[] = [];
const file = path.join(process.cwd(), 'data', 'radar-candidates.json');

if (!fs.existsSync(file)) {
  console.error('ERROR: data/radar-candidates.json 不存在');
  process.exit(1);
}

let raw: unknown;
try {
  raw = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch {
  console.error('ERROR: data/radar-candidates.json 不是合法 JSON');
  process.exit(1);
}

if (!Array.isArray(raw)) {
  console.error('ERROR: data/radar-candidates.json 顶层必须是数组');
  process.exit(1);
}

const EXPLOIT_ASSERT_RE = /在野利用|已被利用|正在被利用|确认被利用/;
const ids = new Set<string>();

raw.forEach((item, idx) => {
  const r = RadarCandidateSchema.safeParse(item);
  const label = `radar[${idx}]`;
  if (!r.success) {
    errors.push(
      `${label} schema 校验失败：${r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`
    );
    return;
  }
  const c = r.data;
  if (ids.has(c.id)) errors.push(`${label} id 重复：${c.id}`);
  ids.add(c.id);

  if (!isValidDateString(c.lastCheckedAt))
    errors.push(`${label} lastCheckedAt 非法：${c.lastCheckedAt}`);

  // 声称在野利用必须有证据链接
  if (c.exploitationClaim !== 'none' && !c.exploitationEvidenceUrl) {
    errors.push(`${label} 声称 ${c.exploitationClaim} 但缺少 exploitationEvidenceUrl`);
  }

  // 文案断言与 claim 一致性
  const text = `${c.title} ${c.candidateReason}`;
  if (EXPLOIT_ASSERT_RE.test(text) && c.exploitationClaim === 'none') {
    errors.push(`${label} 文案断言了在野利用，但 exploitationClaim 为 none（须附证据或改写文案）`);
  }
  if (c.exploitationClaim === 'none' && c.exploitationEvidenceUrl) {
    console.warn(`WARN: ${label} exploitationClaim 为 none 却附带了证据链接，请确认`);
  }
});

for (const e of errors) console.error(`ERROR: ${e}`);
if (errors.length > 0) {
  console.error(`\n雷达校验失败：${errors.length} 个错误`);
  process.exit(1);
}
console.log(`雷达校验通过：${raw.length} 条候选`);

/**
 * 内容校验（文档 8.5 CI 检查项）：
 *  - slug 唯一
 *  - 日期合法
 *  - published 案例：至少两条来源、至少一条一级来源
 *  - 正文包含五个关键章节：影响条件 / 根因 / 检测 / 修复 / 验证
 *  - 正文不得使用未允许的 MDX 组件
 *  - published 案例的关键日期须落在滚动 5 年窗口内
 *  - 专题 / 学习路径 frontmatter 合法
 * 错误 → 进程退出码 1；推荐字段缺失 → 仅 warning。
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
  CaseCoreSchema,
  CaseEnhancedSchema,
  TopicFrontmatterSchema,
  PathFrontmatterSchema,
} from '../lib/schemas';
import { isInWindow, isValidDateString } from '../lib/date-window';
import { extractHeadings } from '../lib/content';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const errors: string[] = [];
const warnings: string[] = [];

const fail = (msg: string) => errors.push(msg);
const warn = (msg: string) => warnings.push(msg);

/** 允许在 MDX 正文内使用的自定义组件 */
const ALLOWED_MDX_COMPONENTS = new Set([
  'AttackChain',
  'DetectionPanel',
  'DefenseChecklist',
  'ReferenceList',
  'CaseMeta',
]);

/** 正文必须包含的五个关键章节（按标题关键词匹配） */
const REQUIRED_SECTIONS = ['影响条件', '根因', '检测', '修复', '验证'];

function stripFencedCode(body: string): string {
  return body.replace(/```[\s\S]*?```/g, '');
}

function checkMdxComponents(slug: string, body: string) {
  const clean = stripFencedCode(body);
  const used = new Set<string>();
  for (const m of clean.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)) used.add(m[1]);
  for (const name of used) {
    if (!ALLOWED_MDX_COMPONENTS.has(name)) {
      fail(`[${slug}] 正文使用了未允许的 MDX 组件 <${name}>`);
    }
  }
  if (/<script[\s>]/i.test(clean)) fail(`[${slug}] 正文包含 <script> 标签，不允许`);
}

function checkRequiredSections(slug: string, body: string) {
  const headings = extractHeadings(body).map((h) => h.text);
  for (const keyword of REQUIRED_SECTIONS) {
    if (!headings.some((t) => t.includes(keyword))) {
      fail(`[${slug}] 正文缺少关键章节（标题需包含「${keyword}」）`);
    }
  }
}

function walkMdx(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.mdx')) out.push(p);
    }
  };
  walk(dir);
  return out.sort();
}

function validateCases() {
  const files = walkMdx(path.join(CONTENT_DIR, 'cases'));
  if (files.length === 0) warn('content/cases 下没有找到任何 .mdx 文件');

  const slugs = new Set<string>();
  for (const file of files) {
    const rel = path.relative(CONTENT_DIR, file);
    const raw = fs.readFileSync(file, 'utf8');
    const { data, content: body } = matter(raw);

    const core = CaseCoreSchema.safeParse(data);
    if (!core.success) {
      fail(
        `[${rel}] frontmatter 必填字段校验失败：${core.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`
      );
      continue;
    }
    const fm = core.data;
    const label = fm.slug;

    if (slugs.has(fm.slug)) fail(`[${rel}] slug 重复：${fm.slug}`);
    slugs.add(fm.slug);

    // 推荐增强字段：缺失仅 warning
    const enhanced = CaseEnhancedSchema.safeParse(data);
    if (enhanced.success) {
      const missing = Object.keys(CaseEnhancedSchema.shape).filter(
        (k) => (data as Record<string, unknown>)[k] === undefined
      );
      if (missing.length > 0) warn(`[${label}] 缺少推荐增强字段（不阻断）：${missing.join(', ')}`);
    }

    // 日期合法性
    for (const key of ['firstDisclosedAt', 'lastReviewedAt', 'patchedAt', 'kevAddedAt'] as const) {
      const v = (data as Record<string, unknown>)[key];
      if (v !== undefined && !isValidDateString(v)) fail(`[${label}] 日期字段 ${key} 非法：${v}`);
    }

    const isPublished = ['published', 'updated'].includes(fm.status);
    if (isPublished) {
      if (fm.references.length < 2) fail(`[${label}] 已发布案例至少需要 2 条来源`);
      if (!fm.references.some((r) => r.primary)) fail(`[${label}] 已发布案例至少需要 1 条一级来源`);
      const kev = (data as Record<string, unknown>).kevAddedAt as string | undefined;
      if (!isInWindow(fm.firstDisclosedAt) && !isInWindow(kev)) {
        fail(`[${label}] 已发布案例的首次披露/KEV 日期不在滚动 5 年窗口内`);
      }
      checkRequiredSections(label, body);
    }

    checkMdxComponents(label, body);

    if (!body || body.trim().length < 200)
      warn(`[${label}] 正文过短（<200 字符），请确认不是占位文件`);
  }
}

function validateTypedDir(
  dirName: 'topics' | 'paths',
  schema: typeof TopicFrontmatterSchema | typeof PathFrontmatterSchema
) {
  for (const file of walkMdx(path.join(CONTENT_DIR, dirName))) {
    const rel = path.relative(CONTENT_DIR, file);
    const { data } = matter(fs.readFileSync(file, 'utf8'));
    const r = schema.safeParse(data);
    if (!r.success) {
      fail(
        `[${rel}] frontmatter 校验失败：${r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`
      );
    }
  }
}

validateCases();
validateTypedDir('topics', TopicFrontmatterSchema);
validateTypedDir('paths', PathFrontmatterSchema);

for (const w of warnings) console.warn(`WARN: ${w}`);
for (const e of errors) console.error(`ERROR: ${e}`);

if (errors.length > 0) {
  console.error(`\n内容校验失败：${errors.length} 个错误，${warnings.length} 个警告`);
  process.exit(1);
}
console.log(`内容校验通过（${warnings.length} 个警告）`);

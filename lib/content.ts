import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
  CaseFrontmatterSchema,
  TopicFrontmatterSchema,
  PathFrontmatterSchema,
  type CaseDoc,
  type CaseComputed,
  type TopicDoc,
  type PathDoc,
} from './schemas';
import { isInWindow, getYear } from './date-window';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function readMdxFiles(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  const walk = (d: string) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith('.mdx')) out.push(p);
    }
  };
  walk(dir);
  return out.sort();
}

/** 中文按字数估算：约 400 字/分钟 */
function readingTimeMinutes(body: string): number {
  const chars = body.replace(/\s/g, '').length;
  return Math.max(1, Math.ceil(chars / 400));
}

function stripFencedCode(body: string): string {
  return body.replace(/```[\s\S]*?```/g, '');
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}\-]/gu, '');
}

/** 提取二级/三级标题用于浮动目录（跳过代码块内的 #） */
export function extractHeadings(body: string): Heading[] {
  const clean = stripFencedCode(body);
  const headings: Heading[] = [];
  for (const line of clean.split('\n')) {
    const m = line.match(/^(#{2,3})\s+(.+)$/);
    if (!m) continue;
    const text = m[2].trim();
    if (!text) continue;
    headings.push({ level: m[1].length, text, id: slugifyHeading(text) });
  }
  return headings;
}

/* ---------------- 案例 ---------------- */

export function getAllCases(): CaseDoc[] {
  const files = readMdxFiles(path.join(CONTENT_DIR, 'cases'));
  const cases: CaseDoc[] = files.map((file) => {
    const raw = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(raw);
    const frontmatter = CaseFrontmatterSchema.parse(data);
    const kevAddedAt = frontmatter.kevAddedAt ?? null;
    const computed: CaseComputed = {
      year: getYear(frontmatter.firstDisclosedAt),
      readingTimeMinutes: readingTimeMinutes(content),
      windowEligible: isInWindow(frontmatter.firstDisclosedAt) || isInWindow(kevAddedAt),
      exploitationStatus: kevAddedAt
        ? 'known-exploited'
        : (frontmatter.exploitationStatus ?? 'unconfirmed'),
      searchKeywords: [
        ...(frontmatter.aliases ?? []),
        ...(frontmatter.cves ?? []),
        frontmatter.vendor ?? '',
        ...(frontmatter.products ?? []),
      ].filter(Boolean),
    };
    return { frontmatter, body: content, computed };
  });

  // 默认排序：已在野利用优先 → 最近复核 → 最近披露
  const exploitRank = (s: string) => (s === 'known-exploited' ? 0 : 1);
  return cases.sort((a, b) => {
    const r =
      exploitRank(a.computed.exploitationStatus) - exploitRank(b.computed.exploitationStatus);
    if (r !== 0) return r;
    const t = b.frontmatter.lastReviewedAt.localeCompare(a.frontmatter.lastReviewedAt);
    if (t !== 0) return t;
    return b.frontmatter.firstDisclosedAt.localeCompare(a.frontmatter.firstDisclosedAt);
  });
}

export function getPublishedCases(): CaseDoc[] {
  return getAllCases().filter((c) => ['published', 'updated'].includes(c.frontmatter.status));
}

export function getCaseBySlug(slug: string): CaseDoc | undefined {
  return getAllCases().find((c) => c.frontmatter.slug === slug);
}

/* ---------------- 专题 ---------------- */

export function getAllTopics(): TopicDoc[] {
  return readMdxFiles(path.join(CONTENT_DIR, 'topics')).map((file) => {
    const raw = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(raw);
    return { frontmatter: TopicFrontmatterSchema.parse(data), body: content };
  });
}

export function getTopicBySlug(slug: string): TopicDoc | undefined {
  return getAllTopics().find((t) => t.frontmatter.slug === slug);
}

/* ---------------- 学习路径 ---------------- */

export function getAllPaths(): PathDoc[] {
  return readMdxFiles(path.join(CONTENT_DIR, 'paths')).map((file) => {
    const raw = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(raw);
    return { frontmatter: PathFrontmatterSchema.parse(data), body: content };
  });
}

export function getPathBySlug(slug: string): PathDoc | undefined {
  return getAllPaths().find((p) => p.frontmatter.slug === slug);
}

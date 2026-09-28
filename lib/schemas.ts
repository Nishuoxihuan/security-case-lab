import { z } from 'zod';

/* ---------- 通用 ---------- */

const SLUG_RE = /^[a-z0-9-]+$/;

export const ReferenceSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  type: z.string().min(1),
  primary: z.boolean().default(false),
});
export type Reference = z.infer<typeof ReferenceSchema>;

export const AttackChainStepSchema = z.object({
  phase: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  defensiveControl: z.string().optional(),
});
export type AttackChainStep = z.infer<typeof AttackChainStepSchema>;

/* ---------- 案例 frontmatter：三层模型（文档第 6 章） ---------- */

export const CaseStatusSchema = z.enum(['draft', 'review', 'published', 'updated', 'archived']);
export type CaseStatus = z.infer<typeof CaseStatusSchema>;

export const ExploitationStatusSchema = z.enum([
  'known-exploited',
  'credible-reports',
  'unconfirmed',
  'not-applicable',
]);
export type ExploitationStatus = z.infer<typeof ExploitationStatusSchema>;

/** 发布必填：缺失则 CI 构建失败 */
export const CaseCoreSchema = z.object({
  id: z.string().min(3),
  slug: z.string().regex(SLUG_RE, 'slug 只能包含小写字母、数字和连字符'),
  title: z.string().min(8),
  summary: z.string().min(30),
  status: CaseStatusSchema,
  firstDisclosedAt: z.string().min(1),
  lastReviewedAt: z.string().min(1),
  surfaces: z.array(z.string().min(1)).min(1),
  tags: z.array(z.string().min(1)).min(1),
  references: z.array(ReferenceSchema).min(1),
});

/** 推荐增强：缺失仅 warning，不阻断构建 */
export const CaseEnhancedSchema = z.object({
  patchedAt: z.string().optional(),
  kevAddedAt: z.string().optional(),
  vendor: z.string().optional(),
  products: z.array(z.string()).optional(),
  affectedVersions: z.array(z.string()).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  cvss: z.number().min(0).max(10).optional(),
  cves: z.array(z.string()).optional(),
  cwes: z.array(z.string()).optional(),
  owasp: z.array(z.string()).optional(),
  attack: z.array(z.string()).optional(),
  aliases: z.array(z.string()).optional(),
  relatedCases: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  attackChain: z.array(AttackChainStepSchema).optional(),
  exploitationStatus: ExploitationStatusSchema.optional(),
  contentVersion: z.string().optional(),
  changeLog: z.array(z.object({ date: z.string(), summary: z.string().min(1) })).optional(),
});

export const CaseFrontmatterSchema = CaseCoreSchema.merge(CaseEnhancedSchema);
export type CaseFrontmatter = z.infer<typeof CaseFrontmatterSchema>;

/** 自动生成：只在构建/读取时计算，不从 MDX 手填 */
export interface CaseComputed {
  year: number;
  readingTimeMinutes: number;
  windowEligible: boolean;
  exploitationStatus: ExploitationStatus;
  searchKeywords: string[];
}

export interface CaseDoc {
  frontmatter: CaseFrontmatter;
  body: string;
  computed: CaseComputed;
}

/* ---------- 专题 / 学习路径 ---------- */

export const TopicFrontmatterSchema = z.object({
  id: z.string().min(2),
  slug: z.string().regex(SLUG_RE),
  title: z.string().min(4),
  summary: z.string().min(20),
  surfaces: z.array(z.string()).optional(),
});
export type TopicFrontmatter = z.infer<typeof TopicFrontmatterSchema>;

export interface TopicDoc {
  frontmatter: TopicFrontmatter;
  body: string;
}

export const PathStepSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  caseSlug: z.string().optional(),
  topicSlug: z.string().optional(),
});

export const PathFrontmatterSchema = z.object({
  id: z.string().min(2),
  slug: z.string().regex(SLUG_RE),
  title: z.string().min(4),
  summary: z.string().min(20),
  steps: z.array(PathStepSchema).min(1),
});
export type PathFrontmatter = z.infer<typeof PathFrontmatterSchema>;

export interface PathDoc {
  frontmatter: PathFrontmatter;
  body: string;
}

/* ---------- 雷达候选 ---------- */

export const RadarCandidateSchema = z.object({
  id: z.string().min(3),
  title: z.string().min(8),
  cves: z.array(z.string()).min(1),
  status: z.enum(['researching', 'published']),
  surfaces: z.array(z.string().min(1)).min(1),
  candidateReason: z.string().min(10),
  exploitationClaim: z.enum(['none', 'kev-listed', 'vendor-confirmed']),
  exploitationEvidenceUrl: z.string().url().optional(),
  sourceUrls: z.array(z.string().url()).min(1),
  lastCheckedAt: z.string().min(1),
});
export type RadarCandidate = z.infer<typeof RadarCandidateSchema>;

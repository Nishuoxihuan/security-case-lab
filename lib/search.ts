import Fuse from 'fuse.js';
import type { CaseDoc } from './schemas';

/** 搜索文档结构（文档 9.2） */
export interface SearchDocument {
  id: string;
  slug: string;
  title: string;
  summary: string;
  aliases: string[];
  tags: string[];
  surfaces: string[];
  cves: string[];
  vendor?: string;
  products: string[];
  year: number;
  exploitationStatus: string;
}

/**
 * 字段权重（文档 9.2）。文档中 vendor/products 合计 0.10，
 * Fuse 按字段分别配置，此处各取 0.05 以严格贴合文档。
 */
export const SEARCH_WEIGHTS = {
  title: 0.3,
  aliases: 0.2,
  cves: 0.2,
  tags: 0.12,
  vendor: 0.05,
  products: 0.05,
  surfaces: 0.05,
  summary: 0.03,
} as const;

export function buildSearchDocuments(cases: CaseDoc[]): SearchDocument[] {
  return cases
    .filter((c) => ['published', 'updated'].includes(c.frontmatter.status))
    .map((c) => ({
      id: c.frontmatter.id,
      slug: c.frontmatter.slug,
      title: c.frontmatter.title,
      summary: c.frontmatter.summary,
      aliases: c.frontmatter.aliases ?? [],
      tags: c.frontmatter.tags,
      surfaces: c.frontmatter.surfaces,
      cves: c.frontmatter.cves ?? [],
      vendor: c.frontmatter.vendor,
      products: c.frontmatter.products ?? [],
      year: c.computed.year,
      exploitationStatus: c.computed.exploitationStatus,
    }));
}

export function createFuse(docs: SearchDocument[]): Fuse<SearchDocument> {
  return new Fuse(docs, {
    keys: [
      { name: 'title', weight: SEARCH_WEIGHTS.title },
      { name: 'aliases', weight: SEARCH_WEIGHTS.aliases },
      { name: 'cves', weight: SEARCH_WEIGHTS.cves },
      { name: 'tags', weight: SEARCH_WEIGHTS.tags },
      { name: 'vendor', weight: SEARCH_WEIGHTS.vendor },
      { name: 'products', weight: SEARCH_WEIGHTS.products },
      { name: 'surfaces', weight: SEARCH_WEIGHTS.surfaces },
      { name: 'summary', weight: SEARCH_WEIGHTS.summary },
    ],
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true,
  });
}

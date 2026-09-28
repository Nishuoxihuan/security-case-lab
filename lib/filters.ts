import type { CaseDoc } from './schemas';

export interface CaseFilterParams {
  surface?: string;
  year?: string;
  exploitation?: string;
  severity?: string;
  tag?: string;
  q?: string;
}

export function applyCaseFilters(cases: CaseDoc[], params: CaseFilterParams): CaseDoc[] {
  return cases.filter((c) => {
    const fm = c.frontmatter;
    if (params.surface && !fm.surfaces.includes(params.surface)) return false;
    if (params.year && String(c.computed.year) !== params.year) return false;
    if (params.exploitation && c.computed.exploitationStatus !== params.exploitation) return false;
    if (params.severity && fm.severity !== params.severity) return false;
    if (params.tag && !fm.tags.includes(params.tag)) return false;
    if (params.q) {
      const q = params.q.toLowerCase();
      const haystack = [
        fm.title,
        fm.summary,
        ...(fm.aliases ?? []),
        ...(fm.cves ?? []),
        fm.vendor ?? '',
        ...(fm.products ?? []),
        ...fm.tags,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function availableFilterValues(cases: CaseDoc[]) {
  return {
    years: [...new Set(cases.map((c) => c.computed.year))].sort((a, b) => b - a),
    surfaces: [...new Set(cases.flatMap((c) => c.frontmatter.surfaces))].sort(),
    tags: [...new Set(cases.flatMap((c) => c.frontmatter.tags))].sort(),
    severities: [
      ...new Set(cases.map((c) => c.frontmatter.severity).filter((s) => s !== undefined)),
    ].sort(),
  };
}

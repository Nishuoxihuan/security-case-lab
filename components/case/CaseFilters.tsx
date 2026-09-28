'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { surfaceLabel } from '@/lib/site';

export interface FilterValues {
  years: number[];
  surfaces: string[];
  tags: string[];
  severities: string[];
}

function Select({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (name: string, value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-xs text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="rounded-lg border border-border bg-panel px-3 py-2 text-sm text-text"
      >
        <option value="">全部</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** 案例列表筛选器：筛选状态全部落在 URL query，便于分享与 SEO（文档 4.2） */
export function CaseFilters({ values }: { values: FilterValues }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    router.push(`/cases?${params.toString()}`, { scroll: false });
  };

  const get = (name: string) => searchParams.get(name) ?? '';

  const SEVERITY_OPTIONS = [
    { value: 'critical', label: '严重' },
    { value: 'high', label: '高' },
    { value: 'medium', label: '中' },
    { value: 'low', label: '低' },
  ].filter((o) => values.severities.includes(o.value));

  return (
    <div className="rounded-xl border border-border bg-panel p-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs text-muted">关键词</span>
          <input
            defaultValue={get('q')}
            placeholder="标题 / CVE / 厂商"
            onKeyDown={(e) => {
              if (e.key === 'Enter') update('q', (e.target as HTMLInputElement).value.trim());
            }}
            onBlur={(e) => update('q', e.target.value.trim())}
            className="rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-text placeholder:text-muted/60"
          />
        </label>
        <Select
          label="年份"
          name="year"
          value={get('year')}
          options={values.years.map((y) => ({ value: String(y), label: String(y) }))}
          onChange={update}
        />
        <Select
          label="攻击面"
          name="surface"
          value={get('surface')}
          options={values.surfaces.map((s) => ({ value: s, label: surfaceLabel(s) }))}
          onChange={update}
        />
        <Select
          label="在野利用"
          name="exploitation"
          value={get('exploitation')}
          options={[
            { value: 'known-exploited', label: '已确认在野利用' },
            { value: 'credible-reports', label: '有可信利用报告' },
            { value: 'unconfirmed', label: '未确认' },
          ]}
          onChange={update}
        />
        <Select
          label="严重性"
          name="severity"
          value={get('severity')}
          options={SEVERITY_OPTIONS}
          onChange={update}
        />
        <Select
          label="标签"
          name="tag"
          value={get('tag')}
          options={values.tags.map((t) => ({ value: t, label: t }))}
          onChange={update}
        />
      </div>
      {searchParams.toString() && (
        <button
          onClick={() => router.push('/cases', { scroll: false })}
          className="mt-3 text-xs text-muted underline underline-offset-4 hover:text-text"
        >
          清除全部筛选
        </button>
      )}
    </div>
  );
}

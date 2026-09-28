import type { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';

export const metadata: Metadata = { title: '数据源与编辑方法' };

interface SourceRegistry {
  levels: { level: number; name: string; sources: string[]; usage: string }[];
  updatedAt: string;
}

function loadRegistry(): SourceRegistry {
  const file = path.join(process.cwd(), 'data', 'source-registry.json');
  return JSON.parse(fs.readFileSync(file, 'utf8')) as SourceRegistry;
}

export default function SourcesPage() {
  const registry = loadRegistry();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">数据源与编辑方法</h1>
        <p className="mt-2 max-w-3xl text-muted">
          本站每条关键事实都要求可溯源。来源按可信度分为三级，编辑规范要求：已发布案例至少两条引用、
          其中至少一条一级来源；披露、修复、在野利用三个日期必须区分标注，不得混淆。
        </p>
      </div>
      <section className="space-y-4">
        {registry.levels.map((l) => (
          <div key={l.level} className="rounded-xl border border-border bg-panel p-5">
            <h2 className="text-lg font-bold">
              {l.level}级来源：{l.name}
            </h2>
            <p className="mt-2 text-sm">
              <span className="text-muted">包括：</span>
              {l.sources.join('、')}
            </p>
            <p className="mt-2 text-sm">
              <span className="text-muted">使用方式：</span>
              {l.usage}
            </p>
          </div>
        ))}
      </section>
      <section className="rounded-xl border border-border bg-panel p-5 text-sm text-muted">
        <h2 className="text-lg font-bold text-text">编辑流程</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>从 CISA KEV、厂商安全公告、可信研究中发现候选，进入雷达。</li>
          <li>人工核实影响版本、时间线，至少两类可信来源交叉确认。</li>
          <li>按统一模板写作：影响条件、根因、检测、修复、验证缺一不可。</li>
          <li>发布前检查安全边界：不含可直接武器化的操作细节，不涉及未修复 0day。</li>
          <li>发布后持续复核：关键事实变化时更新正文与「最后复核」日期。</li>
        </ol>
      </section>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { CaseCard } from '@/components/case/CaseCard';
import { Badge } from '@/components/ui/Badge';
import { getPublishedCases, getAllTopics, getAllPaths } from '@/lib/content';
import { siteConfig } from '@/lib/site';
import { BASELINE_START } from '@/lib/date-window';

export const metadata: Metadata = {
  title: `${siteConfig.name}｜${siteConfig.tagline}`,
};

function SectionTitle({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-extrabold">{children}</h2>
      <Link href={href} className="text-sm text-muted hover:text-text">
        查看全部 →
      </Link>
    </div>
  );
}

export default function HomePage() {
  const cases = getPublishedCases();
  const exploited = cases.filter((c) => c.computed.exploitationStatus === 'known-exploited');
  const topics = getAllTopics();
  const paths = getAllPaths();

  return (
    <div className="space-y-12">
      {/* Hero：定位 + 安全边界（文档 4.1） */}
      <section className="rounded-2xl border border-border bg-panel px-6 py-10 md:px-10">
        <div className="flex flex-wrap gap-2">
          <Badge tone="info">滚动 5 年窗口</Badge>
          <Badge>防守导向</Badge>
          <Badge tone="safe">来源可核查</Badge>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
          {siteConfig.name}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">{siteConfig.description}</p>
        <p className="mt-4 max-w-2xl text-sm text-muted">
          主案例库覆盖 {BASELINE_START} 至今披露或被实际利用的真实事件；每篇回答六个问题：
          是什么事件、影响条件是什么、根因在哪一层、留下什么证据、如何修复、如何验证修复有效。
          本站不提供针对未授权目标的攻击操作，只讲防守方需要知道的事。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/cases"
            className="rounded-lg bg-[#7db4ff] px-5 py-2.5 font-bold text-[#0b1020] hover:bg-[#a8ccff]"
          >
            浏览案例库
          </Link>
          <Link
            href="/paths"
            className="rounded-lg border border-border px-5 py-2.5 text-text hover:border-[#7db4ff]/60"
          >
            从学习路径开始
          </Link>
        </div>
      </section>

      {/* 已确认在野利用精选 */}
      {exploited.length > 0 && (
        <section>
          <SectionTitle href="/cases?exploitation=known-exploited">已确认在野利用</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2">
            {exploited.slice(0, 4).map((c) => (
              <CaseCard key={c.frontmatter.slug} caseDoc={c} />
            ))}
          </div>
        </section>
      )}

      {/* 最新更新 */}
      <section>
        <SectionTitle href="/cases">最新更新</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          {cases.slice(0, 4).map((c) => (
            <CaseCard key={c.frontmatter.slug} caseDoc={c} />
          ))}
        </div>
        {cases.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
            首批案例正在写作中，敬请期待。
          </p>
        )}
      </section>

      {/* 攻击面专题入口 */}
      {topics.length > 0 && (
        <section>
          <SectionTitle href="/topics">攻击面专题</SectionTitle>
          <div className="grid gap-4 md:grid-cols-3">
            {topics.map((t) => (
              <Link
                key={t.frontmatter.slug}
                href={`/topics/${t.frontmatter.slug}`}
                className="rounded-xl border border-border bg-panel p-5 hover:border-[#7db4ff]/60"
              >
                <h3 className="font-bold">{t.frontmatter.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{t.frontmatter.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 学习路径 */}
      {paths.length > 0 && (
        <section>
          <SectionTitle href="/paths">学习路径</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2">
            {paths.map((p) => (
              <Link
                key={p.frontmatter.slug}
                href={`/paths/${p.frontmatter.slug}`}
                className="rounded-xl border border-border bg-panel p-5 hover:border-[#7db4ff]/60"
              >
                <h3 className="font-bold">{p.frontmatter.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{p.frontmatter.summary}</p>
                <p className="mt-2 text-xs text-muted">{p.frontmatter.steps.length} 个步骤</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 数据透明区 */}
      <section className="rounded-2xl border border-border bg-panel px-6 py-8">
        <h2 className="text-xl font-extrabold">数据透明度</h2>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <div className="text-2xl font-extrabold">{cases.length}</div>
            <div className="text-muted">已发布深度案例</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold">100%</div>
            <div className="text-muted">人工审核比例（首期无 AI 自动写作）</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold">5 年</div>
            <div className="text-muted">滚动时间窗口，过期案例进入归档</div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
          <Link href="/feed.xml" className="text-[#7db4ff] underline underline-offset-4">
            RSS 订阅
          </Link>
          <Link href="/legal" className="text-muted underline underline-offset-4 hover:text-text">
            免责声明：内容仅用于教育、防御、研究与授权测试参考
          </Link>
        </div>
      </section>
    </div>
  );
}

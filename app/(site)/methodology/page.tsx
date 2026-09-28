import type { Metadata } from 'next';

export const metadata: Metadata = { title: '方法论' };

export default function MethodologyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">方法论</h1>
        <p className="mt-2 max-w-3xl text-muted">
          本站的内容准入、事实核验与更新方式。所有规则只有一个目的：让每一篇案例都经得起复核。
        </p>
      </div>

      <section className="rounded-xl border border-border bg-panel p-6">
        <h2 className="text-xl font-bold">内容准入</h2>
        <p className="mt-2 text-sm text-muted">正式案例须满足以下 6 项中的至少 4 项：</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
          <li>有 CVE、厂商公告、补丁记录、可信公开漏洞报告或完整事件复盘支撑。</li>
          <li>披露、补丁或确认在野利用发生在近五年滚动窗口内。</li>
          <li>
            涉及云、身份、CI/CD、供应链、容器、API、多租户 SaaS、客户端、边界设备或 AI/Agent
            等现代攻击面。
          </li>
          <li>可解释完整的影响条件、根因、检测、修复与验证。</li>
          <li>至少有一个一级来源。</li>
          <li>可沉淀为通用安全设计或检测经验，而非仅为特定旧版本的短期信息。</li>
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-panel p-6">
        <h2 className="text-xl font-bold">事实核验</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
          <li>影响版本、部署条件、厂商建议必须经官方资料核实，不转述二手结论。</li>
          <li>「首次披露」「厂商修复」「确认在野利用」是三个不同的日期，页面必须分别标注。</li>
          <li>无法确认的技术结论写作「尚待确认」，不用推测填补可读性。</li>
          <li>每篇文章底部维护变更记录，关键事实变化时更新正文与最后复核日期。</li>
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-panel p-6">
        <h2 className="text-xl font-bold">更新与归档</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
          <li>主案例库采用「当前日期向前滚动 5 年」的窗口，基线为 2021-01-01。</li>
          <li>每年 1 月检查一次：超出窗口的案例进入归档，不再出现在首页与默认筛选中。</li>
          <li>距最后复核超过 90 天的文章会提示「建议复核」，编辑优先处理在野利用中的案例。</li>
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-panel p-6">
        <h2 className="text-xl font-bold">优先级</h2>
        <p className="mt-2 text-sm text-muted">
          编辑优先级不等于 CVSS，而是：在野利用状态 × 30 + 影响范围 × 20 + 现代攻击面 × 20 +
          来源可信度 × 15 + 防守学习价值 × 15。S 级为有可靠在野利用证据且影响广泛的事件，优先产出。
        </p>
      </section>
    </div>
  );
}

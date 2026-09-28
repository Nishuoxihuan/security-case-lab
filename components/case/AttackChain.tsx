import type { AttackChainStep } from '@/lib/schemas';

/**
 * 防守导向线性攻击链（文档 5.2）：
 * 前置条件 → 信任边界失效 → 可能影响 → 可观测证据 → 防御控制点
 * 只描述攻击模型与信任边界，不包含可直接执行的利用步骤。
 */
export function AttackChain({ steps }: { steps: AttackChainStep[] }) {
  if (!steps || steps.length === 0) return null;
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-panel">
      <div className="border-b border-border px-5 py-3 text-sm font-bold">攻击链（防守视角）</div>
      <ol className="divide-y divide-border">
        {steps.map((step, i) => (
          <li key={i} className="px-5 py-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7db4ff]/15 font-mono text-sm font-bold text-[#7db4ff]">
                {i + 1}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted">{step.phase}</span>
                  <span className="font-bold">{step.title}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{step.description}</p>
                {step.defensiveControl && (
                  <p className="mt-2 rounded-lg bg-safe/10 px-3 py-2 text-sm text-safe">
                    防御控制点：{step.defensiveControl}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

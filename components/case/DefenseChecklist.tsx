/** 分层防御清单：立即行动 / 短期修复 / 长期治理 */
export function DefenseChecklist({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="my-6 rounded-xl border border-safe/40 bg-safe/5 px-5 py-4">
      <div className="text-sm font-bold text-safe">{title}</div>
      <ul className="mt-2 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-safe/50 text-xs text-safe">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

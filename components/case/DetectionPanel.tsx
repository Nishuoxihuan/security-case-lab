import type { ReactNode } from 'react';

/** 检测与排查提示面板：防守方视角的可观测证据与误报边界 */
export function DetectionPanel({
  title = '检测提示',
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="my-6 rounded-xl border border-info/40 bg-[#7db4ff]/5 px-5 py-4">
      <div className="text-sm font-bold text-[#7db4ff]">{title}</div>
      <div className="mt-2 text-sm text-text [&>p]:my-2 [&>ul]:my-2 [&>ul]:list-disc [&>ul]:pl-5">
        {children}
      </div>
    </div>
  );
}

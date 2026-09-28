import type { ReactNode } from 'react';

type Tone = 'danger' | 'warning' | 'safe' | 'info' | 'default';

const TONES: Record<Tone, string> = {
  danger: 'bg-danger/15 text-danger border-danger/40',
  warning: 'bg-warning/15 text-warning border-warning/40',
  safe: 'bg-safe/15 text-safe border-safe/40',
  info: 'bg-[#7db4ff]/15 text-[#7db4ff] border-[#7db4ff]/40',
  default: 'bg-panel text-muted border-border',
};

export function Badge({ tone = 'default', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

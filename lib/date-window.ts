/** 滚动时间窗口：当前日期向前 5 年（文档 1.3） */
export const WINDOW_YEARS = 5;

/** 首期内容基线起点 */
export const BASELINE_START = '2021-01-01';

export function getWindowStart(now: Date = new Date()): Date {
  return new Date(now.getFullYear() - WINDOW_YEARS, now.getMonth(), now.getDate());
}

export function isValidDateString(v: unknown): v is string {
  if (typeof v !== 'string') return false;
  return !Number.isNaN(new Date(v).getTime());
}

/** 日期是否落在滚动 5 年窗口内（含边界） */
export function isInWindow(dateStr: string | null | undefined, now: Date = new Date()): boolean {
  if (!isValidDateString(dateStr)) return false;
  const d = new Date(dateStr);
  return d >= getWindowStart(now) && d <= now;
}

/** 统一输出 yyyy-MM-dd；非法输入返回 '—' */
export function formatDate(dateStr: string | null | undefined): string {
  if (!isValidDateString(dateStr)) return '—';
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getYear(dateStr: string): number {
  return new Date(dateStr).getFullYear();
}

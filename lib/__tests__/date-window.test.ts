import { describe, it, expect } from 'vitest';
import { getWindowStart, isInWindow, formatDate } from '../date-window';

describe('滚动 5 年窗口', () => {
  const now = new Date('2026-09-28T00:00:00');

  it('窗口起点为当前日期向前 5 年', () => {
    const start = getWindowStart(now);
    expect(start.getFullYear()).toBe(2021);
    expect(start.getMonth()).toBe(8); // 9 月
    expect(start.getDate()).toBe(28);
  });

  it('窗口内日期判定正确', () => {
    expect(isInWindow('2024-03-29', now)).toBe(true);
    expect(isInWindow('2021-09-28', now)).toBe(true); // 边界
    expect(isInWindow('2021-01-01', now)).toBe(false); // 超出窗口
    expect(isInWindow('2030-01-01', now)).toBe(false); // 未来
  });

  it('非法输入返回 false', () => {
    expect(isInWindow(null, now)).toBe(false);
    expect(isInWindow(undefined, now)).toBe(false);
    expect(isInWindow('not-a-date', now)).toBe(false);
  });

  it('formatDate 输出 yyyy-MM-dd', () => {
    expect(formatDate('2024-03-29T12:00:00Z')).toBe('2024-03-29');
    expect(formatDate('xxx')).toBe('—');
  });
});

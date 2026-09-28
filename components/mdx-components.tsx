import React from 'react';
import { AttackChain } from './case/AttackChain';
import { DetectionPanel } from './case/DetectionPanel';
import { DefenseChecklist } from './case/DefenseChecklist';
import { slugifyHeading } from '@/lib/content';

function toText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(toText).join('');
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return toText(props.children);
  }
  return '';
}

/**
 * 标题统一加 id，与 lib/content.ts 的 extractHeadings 使用同一套 slug 规则，
 * 保证案例详情页右侧浮动目录的锚点跳转有效。
 */
function H2({ children }: { children?: React.ReactNode }) {
  const id = slugifyHeading(toText(children));
  return <h2 id={id}>{children}</h2>;
}

function H3({ children }: { children?: React.ReactNode }) {
  const id = slugifyHeading(toText(children));
  return <h3 id={id}>{children}</h3>;
}

/**
 * MDX 正文内可用的自定义组件（白名单）。
 * scripts/validate-content.ts 中的 ALLOWED_MDX_COMPONENTS 须与此处保持一致。
 */
export const mdxComponents = {
  h2: H2,
  h3: H3,
  AttackChain,
  DetectionPanel,
  DefenseChecklist,
};

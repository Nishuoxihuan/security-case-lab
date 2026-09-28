export const siteConfig = {
  name: '近五年攻防案例实验室',
  shortName: '案例实验室',
  tagline: '近五年真实安全事件与漏洞案例的中文攻防知识站',
  description:
    '解释风险为什么发生、如何发现、怎样修复，以及如何验证修复真的有效。只收录近五年披露或被实际利用的真实案例。',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://security-case-lab.vercel.app',
  locale: 'zh-CN',
} as const;

export const NAV_ITEMS = [
  { href: '/cases', label: '案例库' },
  { href: '/radar', label: '攻防雷达' },
  { href: '/topics', label: '专题' },
  { href: '/paths', label: '学习路径' },
  { href: '/methodology', label: '方法论' },
  { href: '/about', label: '关于' },
] as const;

export const SURFACES = [
  { id: 'supply-chain', label: '供应链' },
  { id: 'ci-cd', label: 'CI/CD' },
  { id: 'cloud', label: '云' },
  { id: 'identity', label: '身份' },
  { id: 'api', label: 'API' },
  { id: 'container', label: '容器' },
  { id: 'edge-device', label: '边界设备' },
  { id: 'client', label: '客户端' },
  { id: 'ai-agent', label: 'AI/Agent' },
] as const;

export function surfaceLabel(id: string): string {
  return SURFACES.find((s) => s.id === id)?.label ?? id;
}

export const SEVERITY_LABEL: Record<string, string> = {
  low: '低',
  medium: '中',
  high: '高',
  critical: '严重',
};

export const EXPLOITATION_LABEL: Record<string, string> = {
  'known-exploited': '已确认在野利用',
  'credible-reports': '有可信利用报告',
  unconfirmed: '未确认',
  'not-applicable': '不适用',
};

export const STATUS_LABEL: Record<string, string> = {
  draft: '草稿',
  review: '审核中',
  published: '已发布',
  updated: '已更新',
  archived: '已归档',
};

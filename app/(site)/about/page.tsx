import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: '关于' };

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">关于</h1>
        <p className="mt-3 max-w-3xl text-muted">
          「近五年攻防案例实验室」是一个中文安全案例研究站：把近五年真实披露或被实际利用的安全事件，
          整理为可验证的知识——为什么发生、如何发现、怎样修复、如何证明修复真的有效。
        </p>
      </div>

      <section className="rounded-xl border border-border bg-panel p-6">
        <h2 className="text-xl font-bold">项目定位</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
          <li>不是 CVE/NVD 数据镜像站，不做漏洞新闻聚合。</li>
          <li>不是 PoC、EXP、载荷下载站，不托管可直接武器化的利用代码。</li>
          <li>不是针对未授权目标的攻击操作教程站。</li>
          <li>
            是结构化的安全研究与学习站：每个案例聚焦攻击面、影响条件、证据、检测、防御与修复验证。
          </li>
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-panel p-6">
        <h2 className="text-xl font-bold">公开站与私有实验分层</h2>
        <p className="mt-3 text-sm text-muted">
          公开网站只讲「攻击为何可能成立、如何被防守方观察到、怎样切断路径」；
          需要动手验证的内容（靶场搭建、抓包、实验数据）保留在作者本地的私有实验笔记中，
          仅在自建或明确授权的环境里进行。两者的边界见《
          <Link href="/methodology" className="underline">
            方法论
          </Link>
          》与仓库 docs/local-lab-boundary.md。
        </p>
      </section>

      <section className="rounded-xl border border-border bg-panel p-6">
        <h2 className="text-xl font-bold">联系与纠错</h2>
        <p className="mt-3 text-sm text-muted">
          安全内容最怕事实错误。如果你发现某篇案例的事实、日期或引用有误， 欢迎通过 GitHub 仓库提交
          Issue 或 PR（仓库地址见 README），所有更正都会记录在文章的变更记录中。
        </p>
      </section>
    </div>
  );
}

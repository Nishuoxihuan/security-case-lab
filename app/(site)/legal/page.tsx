import type { Metadata } from 'next';

export const metadata: Metadata = { title: '许可与免责声明' };

export default function LegalPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">许可与免责声明</h1>
        <p className="mt-2 text-muted">使用本站前请阅读以下内容。</p>
      </div>

      <section className="rounded-xl border border-border bg-panel p-6">
        <h2 className="text-xl font-bold">内容许可</h2>
        <div className="mt-3 space-y-2 text-sm">
          <p>
            本站原创文字、原创图示与结构化整理默认采用
            <strong> CC BY-NC-SA 4.0（署名-非商业性使用-相同方式共享）</strong>许可。
          </p>
          <p className="text-muted">
            第三方商标、产品名称、截图、公告原文、代码片段、引用与外部链接归其各自权利人所有，
            本站仅为研究、评论、引用和教育说明目的使用；不能因为本站选择 CC
            协议，就认为第三方材料也受本站协议覆盖。
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-danger/40 bg-danger/5 p-6">
        <h2 className="text-xl font-bold">免责声明与使用条款</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
          <li>本站内容仅用于教育、防御、研究与授权测试参考。</li>
          <li>使用者必须遵守所在地法律法规、所在组织政策与相关服务条款。</li>
          <li>本站不授权、不鼓励任何未经许可的测试或攻击行为。</li>
          <li>安全信息随时间变化，读者应以厂商官方公告和自身环境验证为准，再采取行动。</li>
          <li>本站不对基于本站内容采取的行动及其后果承担保证责任。</li>
          <li>如发现事实错误或侵权材料，请通过「关于」页的联系方式反馈，我们会核实更正。</li>
        </ul>
      </section>
    </div>
  );
}

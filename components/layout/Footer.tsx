import Link from 'next/link';
import { siteConfig } from '@/lib/site';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-muted md:grid-cols-3">
        <div>
          <div className="font-bold text-text">{siteConfig.name}</div>
          <p className="mt-2">{siteConfig.description}</p>
        </div>
        <div>
          <div className="font-bold text-text">站点</div>
          <ul className="mt-2 space-y-1">
            <li>
              <Link href="/sources" className="hover:text-text">
                数据源与编辑方法
              </Link>
            </li>
            <li>
              <Link href="/methodology" className="hover:text-text">
                方法论
              </Link>
            </li>
            <li>
              <Link href="/legal" className="hover:text-text">
                许可与免责声明
              </Link>
            </li>
            <li>
              <Link href="/feed.xml" className="hover:text-text">
                RSS 订阅
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-bold text-text">安全边界</div>
          <p className="mt-2">
            本站内容仅用于教育、防御、研究与授权测试参考，不提供针对未授权目标的攻击操作。
            实验仅限自建或明确授权的环境。
          </p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        内容采用 CC BY-NC-SA 4.0 许可；第三方材料归其权利人所有。
      </div>
    </footer>
  );
}

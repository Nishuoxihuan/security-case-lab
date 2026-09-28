import Link from 'next/link';
import { NAV_ITEMS, siteConfig } from '@/lib/site';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          {siteConfig.shortName}
          <span className="ml-2 hidden text-xs font-normal text-muted sm:inline">
            近五年攻防案例
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted hover:text-text">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/search"
          className="ml-auto rounded-lg border border-border bg-panel px-3 py-1.5 text-sm text-muted hover:text-text"
        >
          搜索
        </Link>
      </div>
    </header>
  );
}

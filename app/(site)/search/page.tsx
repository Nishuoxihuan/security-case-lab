import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchBox } from './SearchBox';

export const metadata: Metadata = { title: '搜索' };

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">搜索</h1>
        <p className="mt-2 text-muted">
          支持中文全称、英文缩写、CVE 编号、厂商与产品名、同义词别名检索。
        </p>
      </div>
      <Suspense fallback={<p className="text-muted">加载搜索中…</p>}>
        <SearchBox />
      </Suspense>
    </div>
  );
}

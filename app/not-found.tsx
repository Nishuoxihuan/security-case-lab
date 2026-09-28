import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <div className="text-6xl font-extrabold text-muted">404</div>
      <p className="mt-4 text-muted">这个页面不存在，可能已被移动或归档。</p>
      <Link href="/" className="mt-6 inline-block text-[#7db4ff] underline underline-offset-4">
        返回首页
      </Link>
    </div>
  );
}

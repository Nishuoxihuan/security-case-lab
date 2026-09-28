import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const baseHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

// 取舍说明：开发模式下 Next.js 热更新依赖 eval，严格 CSP 会破坏 dev；
// 因此完整 CSP 只在生产环境启用，dev 仅保留基础响应头。
const csp =
  "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; " +
  "script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: isProd
          ? [...baseHeaders, { key: 'Content-Security-Policy', value: csp }]
          : baseHeaders,
      },
    ];
  },
};

export default nextConfig;

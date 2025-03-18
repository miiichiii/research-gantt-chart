/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/research-gantt-chart',
  images: {
    unoptimized: true,
  },
  // 重要: GitHub Pagesで必要な設定
  trailingSlash: true,
  assetPrefix: '/research-gantt-chart/',
};

export default nextConfig;

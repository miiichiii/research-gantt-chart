/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 静的ファイルとして出力
  basePath: '/research-gantt-chart', // GitHubリポジトリ名に合わせる
  images: {
    unoptimized: true, // GitHub Pagesで必要
  },
};

export default nextConfig;
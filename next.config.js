/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/research-gantt-chart',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;

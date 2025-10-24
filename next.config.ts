/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/financial-horizon',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

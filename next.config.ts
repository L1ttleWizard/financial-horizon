/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/financial-horizon',
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    typedRoutes: false, // 🚫 disables strict route type validation
  },
};

module.exports = nextConfig;

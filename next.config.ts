/** @type {import('next').NextConfig} */


const nextConfig = {
  output: 'export',
  assetPrefix: '/financial-horizon',
  basePath: '/financial-horizon',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;



/** @type {import('next').NextConfig} */


const nextConfig = {
  output: 'export',
  assetPrefix: '/financial-horizon',
  basePath: '/financial-horizon',
  images: {
    unoptimized: true,
  },
  publicRuntimeConfig: {
    basePath: '/financial-horizon',
  },
};

module.exports = nextConfig;



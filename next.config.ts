import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // basePath: isProd ? '/financial-horizon' : '',
  // assetPrefix: isProd ? '/financial-horizon/' : '',
  basePath: process.env.PAGES_BASE_PATH, 
};


export default nextConfig;

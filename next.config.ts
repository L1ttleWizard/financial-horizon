import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // basePath: isProd ? '/financial-horizon' : '',
  // assetPrefix: isProd ? '/financial-horizon/' : '',
  images:{unoptimized: true},
  basePath: process.env.PAGES_BASE_PATH, 
  output:'export'
};


export default nextConfig;

import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  // basePath: isProd ? '/financial-horizon' : '',
  assetPrefix: '/financial-horizon/',
  basePath: process.env.PAGES_BASE_PATH, 
};


export default nextConfig;

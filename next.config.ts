/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/financial-horizon",
  assetPrefix: "/financial-horizon",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */

// Check if the build is running on GitHub Actions
const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = '';
let basePath = '';

// If it is, then set the basePath and assetPrefix to the repository name
if (isGithubActions) {
  const repo = 'financial-horizon';
  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

const nextConfig = {
  output: 'export',
  assetPrefix: assetPrefix,
  basePath: basePath,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
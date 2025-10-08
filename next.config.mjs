/** @type {import('next').NextConfig} */
export const PHASE_PRODUCTION_BUILD = 'phase-production-build'
// Check if the build is running on GitHub Actions
const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = '';
let basePath = '';

// If it is, then set the basePath and assetPrefix to the repository name
if (isGithubActions) {
  const repo = 'https://l1ttlewizard.github.io/financial-horizon';
  assetPrefix = `${repo}/`;
  basePath = `${repo}`;
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
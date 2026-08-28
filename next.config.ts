import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const [owner = '', repository = ''] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isUserSite = repository === `${owner}.github.io`;
const basePath = isGitHubPages && repository && !isUserSite ? `/${repository}` : '';

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: 'export',
      basePath,
      assetPrefix: basePath,
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;

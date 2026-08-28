import type { Metadata } from 'next';
import './globals.css';

const [githubOwner = '', githubRepository = ''] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const githubPagesUrl = githubRepository === `${githubOwner}.github.io`
  ? `https://${githubOwner}.github.io`
  : `https://${githubOwner}.github.io/${githubRepository}`;
const siteUrl = process.env.GITHUB_PAGES === 'true' && githubOwner && githubRepository
  ? githubPagesUrl
  : 'https://snap-to-fix.oai-x-carahs-7465.chatgpt.site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Snap-to-Fix — See the problem. Know the fix.',
  description: 'Identify appliance errors, warning lights, and broken parts from a photo. Get clear, safety-first troubleshooting in seconds.',
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [{ url: `${siteUrl}/favicon.png`, type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Snap-to-Fix',
    title: 'Snap-to-Fix — See the problem. Know the fix.',
    description: 'Photo-powered diagnostics for everyday repairs, with clear steps and safety warnings.',
    images: [{
      url: `${siteUrl}/og.png`,
      width: 1200,
      height: 630,
      alt: 'Snap-to-Fix — See the problem. Know the fix.',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snap-to-Fix — See the problem. Know the fix.',
    description: 'Photo-powered diagnostics for everyday repairs, with clear steps and safety warnings.',
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

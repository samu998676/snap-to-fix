import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://snap-to-fix.oai-x-carahs-7465.chatgpt.site'),
  title: 'Snap-to-Fix — See the problem. Know the fix.',
  description: 'Identify appliance errors, warning lights, and broken parts from a photo. Get clear, safety-first troubleshooting in seconds.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    url: 'https://snap-to-fix.oai-x-carahs-7465.chatgpt.site',
    siteName: 'Snap-to-Fix',
    title: 'Snap-to-Fix — See the problem. Know the fix.',
    description: 'Photo-powered diagnostics for everyday repairs, with clear steps and safety warnings.',
    images: [{
      url: 'https://snap-to-fix.oai-x-carahs-7465.chatgpt.site/og.png',
      width: 1200,
      height: 630,
      alt: 'Snap-to-Fix — See the problem. Know the fix.',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snap-to-Fix — See the problem. Know the fix.',
    description: 'Photo-powered diagnostics for everyday repairs, with clear steps and safety warnings.',
    images: ['https://snap-to-fix.oai-x-carahs-7465.chatgpt.site/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}

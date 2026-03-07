import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const inter = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AeroSphere — Next-Gen Cloud Infrastructure Platform',
  description:
    'AeroSphere delivers cutting-edge cloud infrastructure with real-time analytics, AI-powered insights, and enterprise-grade security for modern teams.',
  keywords: ['cloud', 'infrastructure', 'analytics', 'AI', 'platform', 'enterprise', 'AeroSphere'],
  authors: [{ name: 'Himanshu Kaushik' }],
  openGraph: {
    title: 'AeroSphere — Next-Gen Cloud Infrastructure Platform',
    description: 'Cutting-edge cloud infrastructure with real-time analytics and AI-powered insights.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased bg-bg-primary">
        {children}
      </body>
    </html>
  );
}

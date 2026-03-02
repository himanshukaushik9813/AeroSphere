import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'AeroSphere - Global Weather Visualization',
  description:
    'Futuristic real-time global weather visualization dashboard powered by an interactive 3D globe and live weather APIs.',
  keywords: ['weather', 'globe', '3D', 'visualization', 'forecast', 'AQI', 'monsoon'],
  authors: [{ name: 'Himanshu Kaushik' }],
  openGraph: {
    title: 'AeroSphere - Global Weather Visualization',
    description: 'Real-time weather on an interactive 3D globe',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

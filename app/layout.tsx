import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zentable - AI-Powered Presentation Builder',
  description: 'Create stunning presentations with AI in seconds. Transform your ideas into captivating visual stories.',
  keywords: ['AI presentations', 'presentation builder', 'AI-powered slides', 'automated presentations', 'slide generator', 'presentation templates'],
  authors: [{ name: 'Zentable' }],
  creator: 'Zentable',
  publisher: 'Zentable',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://zentableai.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zentableai.com',
    title: 'Zentable - AI-Powered Presentation Builder',
    description: 'Create stunning presentations with AI in seconds. Transform your ideas into captivating visual stories.',
    siteName: 'Zentable',
    images: [
      {
        url: '/assets/Zentable_Hero.png',
        width: 1200,
        height: 630,
        alt: 'Zentable - AI-Powered Presentation Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zentable - AI-Powered Presentation Builder',
    description: 'Create stunning presentations with AI in seconds. Transform your ideas into captivating visual stories.',
    images: ['/assets/Zentable_Hero.png'],
    creator: '@zentable',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/assets/Zentable_icon.png',
    shortcut: '/assets/Zentable_icon.png',
    apple: '/assets/Zentable_icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/assets/Zentable_icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/assets/Zentable_icon.png',
      },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/Zentable.png" />
      </head>
      <body className={inter.className}>
        {process.env.NEXT_PUBLIC_GA_TRACKING_ID && (
          <GoogleAnalytics trackingId={process.env.NEXT_PUBLIC_GA_TRACKING_ID} />
        )}
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

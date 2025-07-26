import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Zent - AI-Powered Presentation Builder',
    template: '%s | Zent - AI Presentations'
  },
  description: 'Create stunning presentations with AI in seconds. Transform your ideas into captivating visual stories with intelligent slide generation, templates, and editing tools.',
  keywords: ['AI presentations', 'slide generator', 'presentation maker', 'artificial intelligence', 'slides', 'PowerPoint alternative'],
  authors: [{ name: 'Zent Team' }],
  creator: 'Zent',
  publisher: 'Zent',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://zent.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zent.ai',
    title: 'Zent - AI-Powered Presentation Builder',
    description: 'Create stunning presentations with AI in seconds. Transform your ideas into captivating visual stories.',
    siteName: 'Zent',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Zent AI Presentation Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zent - AI-Powered Presentation Builder',
    description: 'Create stunning presentations with AI in seconds.',
    images: ['/assets/twitter-image.png'],
    creator: '@zent_ai',
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
    icon: '/assets/Zent_icon.png',
    shortcut: '/assets/Zent_icon.png',
    apple: '/assets/Zent_icon.png',
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
        <link rel="icon" href="/assets/Zent.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

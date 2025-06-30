import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zent - AI-Powered Presentation Builder',
  description: 'Create stunning presentations with AI in seconds. Transform your ideas into captivating visual stories.',
  icons: {
    icon: '/assets/Zent_icon.png',
    shortcut: '/assets/Zent_icon.png',
    apple: '/assets/Zent_icon.png',
  },
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

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Quran — Read, Listen & Reflect',
  description:
    'A beautiful Quran reading experience with Arabic text, translations, and audio recitation for all 114 surahs.',
  keywords: ['Quran', 'Islam', 'Arabic', 'Recitation', 'Translation'],
  openGraph: {
    title: 'Quran — Read, Listen & Reflect',
    description:
      'Beautiful Quran reading with Arabic text, translations, and audio.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* theme-dark is the default — ThemeApplier will update it client-side */
    <html
      lang="en"
      className={`${inter.variable} theme-dark`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Quranic Arabic fonts + UI fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Scheherazade+New:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

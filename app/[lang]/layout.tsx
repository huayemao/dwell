import type {Metadata, Viewport} from 'next';
import { Inter } from 'next/font/google';
import '../globals.css'; // Global styles
import { GlobalAudio } from '@/components/GlobalAudio';
import { Visuals } from '@/components/Visuals';
import { Navigation } from '@/components/Navigation';
import { supportedLocales } from '@/lib/i18n';
import { SerwistProvider } from '../serwist';
import { Analytics } from "@vercel/analytics/next"
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const viewport: Viewport = {
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'Dwell - Seamless Audio-Visual Soundscapes',
  description: 'Experience high-end, minimalist audio-visual scenes. Relax with looping white noise, fireplace, rain, ocean, and forest soundscapes for focus and meditation.',
  keywords: ['white noise', 'relax', 'soundscape', 'fireplace', 'rain', 'ocean', 'forest', 'focus', 'meditation', 'sleep', 'ambient sounds'],
  authors: [{ name: 'Dwell' }],
  openGraph: {
    title: 'Dwell - Audio-Visual Soundscapes',
    description: 'Immerse yourself in seamless audio-visual soundscapes for focus and relaxation.',
    type: 'website',
    siteName: 'Dwell',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dwell - Audio-Visual Soundscapes',
    description: 'Immerse yourself in seamless audio-visual soundscapes for focus and relaxation.',
  },
  alternates: {
    canonical: '/',
  }
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html lang={lang} className={inter.variable}>
      <body suppressHydrationWarning className="font-sans bg-black text-white overflow-hidden">
        <SerwistProvider swUrl="/serwist/sw.js">
          <GlobalAudio />
          <Visuals />
          <Navigation lang={lang as any} />
          {children}
        </SerwistProvider>
        <Analytics />
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return supportedLocales.map((locale) => ({
    lang: locale,
  }));
}

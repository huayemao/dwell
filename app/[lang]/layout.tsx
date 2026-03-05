import type {Metadata, Viewport} from 'next';
import { Inter } from 'next/font/google';
import '../globals.css'; // Global styles
import { GlobalAudio } from '@/components/GlobalAudio';
import { Visuals } from '@/components/Visuals';
import { Navigation } from '@/components/Navigation';
import { supportedLocales } from '@/lib/i18n';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const viewport: Viewport = {
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'Dwell-at - Seamless Audio-Visual Soundscapes',
  description: 'Experience high-end, minimalist audio-visual scenes. Relax with looping white noise, fireplace, rain, ocean, and forest soundscapes for focus and meditation.',
  keywords: ['white noise', 'relax', 'soundscape', 'fireplace', 'rain', 'ocean', 'forest', 'focus', 'meditation', 'sleep', 'ambient sounds'],
  authors: [{ name: 'Dwell-at' }],
  openGraph: {
    title: 'Dwell-at - Audio-Visual Soundscapes',
    description: 'Immerse yourself in seamless audio-visual soundscapes for focus and relaxation.',
    type: 'website',
    siteName: 'Dwell-at',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dwell-at - Audio-Visual Soundscapes',
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
        <GlobalAudio />
        <Visuals />
        <Navigation lang={lang as any} />
        {children}
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return supportedLocales.map((locale) => ({
    lang: locale,
  }));
}

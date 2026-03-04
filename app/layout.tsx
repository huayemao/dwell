import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles
import { GlobalAudio } from '@/components/GlobalAudio';
import { Visuals } from '@/components/Visuals';
import { Navigation } from '@/components/Navigation';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

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

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning className="font-sans bg-black text-white overflow-hidden">
        <GlobalAudio />
        <Visuals />
        <Navigation />
        {children}
      </body>
    </html>
  );
}

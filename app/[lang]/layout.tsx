import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css"; // Global styles
import { GlobalAudio } from "@/components/GlobalAudio";
import { Visuals } from "@/components/Visuals";
import { Navigation } from "@/components/Navigation";
import { Language, supportedLocales, t } from "@/lib/i18n";
import { SerwistProvider } from "../serwist";
import { Analytics } from "@vercel/analytics/next";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  initialScale: 1,
  viewportFit: "contain",
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;
  const title = t("title", lang as Language);
  const description = t("description", lang as Language);
  return {
    title,
    description,
    keywords: [
      "white noise",
      "ambient sounds",
      "ambient visuals",
      "ambient scenes",
      "soundscape",
      "mix ambient sounds",
      "Free Ambient Sound Mixer",
      "fireplace live wallpaper",
      "rain",
      "ocean",
      "forest",
      "focus",
      "meditation",
      "sleep",
    ],
    authors: [{ name: "huayemao", url: "https://huayemao.run" }],
    openGraph: {
      title: t("title", lang as Language),
      description,
      type: "website",
      siteName: "Dwell",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title", lang as Language),
      description,
    },
    alternates: {
      canonical: "/",
    },
  };
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
      <body
        suppressHydrationWarning
        className="font-sans bg-black text-white overflow-hidden"
      >
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

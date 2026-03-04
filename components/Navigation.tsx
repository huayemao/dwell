'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Home, ListMusic, Layers, PlayCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Language, translations } from '@/lib/i18n';

export function Navigation({ lang }: { lang: Language }) {
  const pathname = usePathname();
  const isPlaying = useAppStore(state => state.isPlaying);
  const t = translations[lang] || translations.en;
  
  // Hide navigation in immersive play mode
  if (pathname === `/${lang}/play`) return null;

  const links = [
    { href: `/${lang}`, label: t.title || 'Home', icon: Home },
    { href: `/${lang}/scenes`, label: t.scenes, icon: Layers },
    { href: `/${lang}/sounds`, label: t.soundElements, icon: ListMusic },
  ];

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none"
    >
      <div className="flex gap-8 pointer-events-auto bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
        {links.map(link => {
          const isActive = pathname === link.href || (link.href === `/${lang}` && pathname === `/${lang}`);
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-2 text-sm uppercase tracking-widest transition-colors ${
                isActive ? 'text-white font-medium' : 'text-white/50 hover:text-white'
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span className="hidden md:inline">{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4 pointer-events-auto">
        <select 
          className="bg-black/40 backdrop-blur-md text-white border border-white/10 rounded-full px-4 py-2 text-sm uppercase tracking-widest outline-none appearance-none cursor-pointer"
          value={lang}
          onChange={(e) => {
            const newLang = e.target.value;
            const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
            window.location.href = newPath;
          }}
        >
          <option value="en">EN</option>
          <option value="es">ES</option>
          <option value="ja">JA</option>
          <option value="zh">ZH</option>
        </select>

        {isPlaying && (
          <Link 
            href={`/${lang}/play`}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm uppercase tracking-widest font-medium hover:scale-105 transition-transform"
          >
            <PlayCircle className="w-4 h-4" />
            <span className="hidden md:inline">{t.play}</span>
          </Link>
        )}
      </div>
    </motion.nav>
  );
}

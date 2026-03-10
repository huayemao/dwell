'use client';

import { useState, useMemo, use } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { SOUND_ELEMENTS } from '@/lib/config';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Play, SlidersHorizontal, Search, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { audio } from '@/lib/audioEngine';
import { translations, TranslationKey, Language, tSound, t } from '@/lib/i18n';

export default function SoundsPage({ params }: { params: Promise<{ lang: Language }> }) {
  const { lang } = use(params);
  const router = useRouter();
  const { activeMix, setMixVolume, setIsPlaying, setIsEntered, setCurrentScene,getShareUrl } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handlePlayMix = () => {
    audio.init();
    setIsEntered(true);
    setIsPlaying(true);
    setCurrentScene('custom');
    const shareUrl = getShareUrl();
    router.push(shareUrl);
  };

  const categories = ['all', ...Array.from(new Set(SOUND_ELEMENTS.map(e => e.category)))];

  const filteredElements = useMemo(() => {
    return SOUND_ELEMENTS.filter(element => {
      const matchesSearch = element.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || element.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md text-white overflow-y-auto pt-32 pb-24 px-8 z-40">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-4">{t('soundEffects', lang)}</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-light">
            {t('soundEffectsSubtitle', lang)}
          </p>
        </motion.div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <h2 className="text-2xl font-light tracking-widest uppercase flex items-center gap-3">
              <SlidersHorizontal className="w-6 h-6 opacity-50" />
              {t('customMix', lang)}
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder={t('searchSounds', lang)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="relative w-full sm:w-auto">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-auto bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-8 text-sm outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer"
                >
                  {categories.map(cat => {
                    const catKey = `category${cat.charAt(0).toUpperCase() + cat.slice(1)}` as TranslationKey;
                    return (
                      <option key={cat} value={cat} className="bg-black text-white">
                        {t(catKey, lang) || cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                onClick={handlePlayMix}
                className="flex items-center justify-center gap-2 bg-white text-black px-6 py-2 rounded-full text-sm uppercase tracking-widest font-medium hover:scale-105 transition-transform w-full sm:w-auto whitespace-nowrap"
              >
                <Play className="w-4 h-4" />
                {t('playMix', lang)}
              </button>
            </div>
          </div>

          {filteredElements.length === 0 ? (
            <div className="text-center py-12 text-white/50">
              {t('noSoundsFound', lang)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {filteredElements.map(element => {
                const volume = activeMix[element.id] || 0;
                const isActive = volume > 0;
                const catKey = `category${element.category.charAt(0).toUpperCase() + element.category.slice(1)}` as TranslationKey;

                return (
                  <div key={element.id} className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-medium tracking-wide">{tSound(element.id, lang as Language)}</span>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                          {t(catKey, lang) || element.category}
                        </span>
                      </div>
                      <span className="text-xs opacity-50 font-mono">{Math.round(volume * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setMixVolume(element.id, isActive ? 0 : 0.5)}
                        className="opacity-50 hover:opacity-100 transition-opacity"
                      >
                        {isActive ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0" max="1" step="0.01"
                        value={volume}
                        onChange={(e) => setMixVolume(element.id, parseFloat(e.target.value))}
                        className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

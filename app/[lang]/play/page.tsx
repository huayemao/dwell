'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { translations, TranslationKey, Language } from '@/lib/i18n';
import { Mixer } from '@/components/Mixer';
import { SCENES } from '@/lib/config';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Maximize, Minimize, Play, Pause, Globe, Flame, CloudRain, Waves, TreePine, SlidersHorizontal, Share2, CloudLightning, Snowflake, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const icons: Record<string, any> = {
  rain: CloudRain,
  ocean: Waves,
  fireplace: Flame,
  forest: TreePine,
  thunderstorm: CloudLightning,
  winter_cabin: Snowflake,
  night_crickets: Moon,
  custom: SlidersHorizontal
};

export default function PlayPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const { 
    currentScene, setCurrentScene, 
    isPlaying, setIsPlaying, 
    volume, setVolume,
    getShareUrl
  } = useAppStore();
  const router = useRouter();

  const t = (key: TranslationKey) => translations[lang as Language]?.[key] || translations.en[key] || key;

  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMixer, setShowMixer] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !showMixer) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleShare = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-auto"
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
    >
      <AnimatePresence>
        {showMixer && <Mixer onClose={() => setShowMixer(false)} lang={lang as Language} />}
      </AnimatePresence>

      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-start pointer-events-auto">
              <button 
                onClick={() => router.push(`/${lang}`)}
                className="text-2xl font-light tracking-widest opacity-50 hover:opacity-100 transition-opacity"
              >
                {t('title')}
              </button>
              
              <div className="flex items-center gap-6">
                <button 
                  onClick={handleShare} 
                  className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden md:inline">{shareCopied ? 'Copied!' : 'Share Mix'}</span>
                </button>
                <div className="flex items-center gap-2 group">
                  <Globe className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <select 
                    value={lang}
                    onChange={(e) => {
                      const newLang = e.target.value;
                      window.location.href = `/${newLang}/play`;
                    }}
                    className="bg-transparent text-sm opacity-50 hover:opacity-100 outline-none cursor-pointer appearance-none"
                  >
                    <option value="en" className="bg-black">EN</option>
                    <option value="es" className="bg-black">ES</option>
                    <option value="ja" className="bg-black">JA</option>
                    <option value="zh" className="bg-black">ZH</option>
                  </select>
                </div>
                <button onClick={toggleFullscreen} className="opacity-50 hover:opacity-100 transition-opacity">
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 pointer-events-auto">
              
              {/* Play/Pause & Volume */}
              <div className="flex items-center gap-6 bg-black/20 backdrop-blur-md p-4 rounded-full border border-white/10">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                </button>
                
                <div className="flex items-center gap-3 w-32">
                  {volume === 0 ? <VolumeX className="w-4 h-4 opacity-50" /> : <Volume2 className="w-4 h-4 opacity-50" />}
                  <input 
                    type="range" 
                    min="0" max="1" step="0.01" 
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>
              </div>

              {/* Scene Switcher & Mixer Toggle */}
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/10 overflow-x-auto custom-scrollbar max-w-full">
                {SCENES.filter(s => s.id !== 'custom').map((scene) => {
                  const Icon = icons[scene.id] || CloudRain;
                  return (
                    <button
                      key={scene.id}
                      onClick={() => setCurrentScene(scene.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 whitespace-nowrap ${
                        currentScene === scene.id 
                          ? 'bg-white/10 text-white' 
                          : 'text-white/40 hover:text-white hover:bg-white/5'
                      }`}
                      title={scene.name}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm hidden md:block">{t(scene.id as any) || scene.name}</span>
                    </button>
                  );
                })}
                <div className="w-px h-8 bg-white/10 mx-2 shrink-0" />
                <button
                  onClick={() => setShowMixer(!showMixer)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 shrink-0 ${
                    showMixer || currentScene === 'custom'
                      ? 'bg-white/10 text-white' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                  title={t('audioMixer')}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="text-sm hidden md:block">{t('audioMixer')}</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

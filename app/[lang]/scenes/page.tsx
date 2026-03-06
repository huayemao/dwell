'use client';

import { use } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { SCENES } from '@/lib/config';
import { motion } from 'motion/react';
import { CloudRain, Waves, Flame, TreePine, CloudLightning, Snowflake, Moon, SlidersHorizontal, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { audio } from '@/lib/audioEngine';
import { translations, TranslationKey, Language, tScene, t } from '@/lib/i18n';

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

export default function ScenesPage({ params }: { params: Promise<{ lang: Language }> }) {
  const { lang } = use(params);
  const router = useRouter();
  const { setCurrentScene, setIsPlaying, setIsEntered } = useAppStore();

  const handlePlayScene = (sceneId: string) => {
    // audio.init();
    // setIsEntered(true);
    // setIsPlaying(true);
    // setCurrentScene(sceneId);
    router.push(`/${lang}/scenes/${sceneId}`);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md text-white overflow-y-auto pt-32 pb-24 px-8 z-40">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-4">{t('scenes', lang)}</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-light">
            Carefully crafted environments combining high-quality visuals and perfectly balanced audio mixes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SCENES.map((scene, index) => {
            const Icon = icons[scene.id] || SlidersHorizontal;
            return (
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 text-white/80 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  {(() => {
                    const sceneData = tScene(scene.id as any, lang as Language);
                    return (
                      <>
                        <h3 className="text-2xl font-light mb-2">{sceneData.name}</h3>
                        <p className="text-white/50 text-sm mb-8 min-h-[40px]">{sceneData.description}</p>
                      </>
                    );
                  })()}

                  <button
                    onClick={() => handlePlayScene(scene.id)}
                    className="flex items-center gap-2 text-sm uppercase tracking-widest font-medium opacity-50 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-4 h-4" />
                    {t('play', lang)}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, use } from "react";
import { useAppStore } from "@/store/useAppStore";
import { translations, TranslationKey, Language, tScene, t } from "@/lib/i18n";
import { audio } from "@/lib/audioEngine";
import { SCENES } from "@/lib/config";
import { motion, AnimatePresence } from "motion/react";
import {
  Flame,
  CloudRain,
  Waves,
  TreePine,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  CloudLightning,
  Snowflake,
  Moon,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const icons: Record<string, any> = {
  rain: CloudRain,
  ocean: Waves,
  fireplace: Flame,
  forest: TreePine,
  thunderstorm: CloudLightning,
  winter_cabin: Snowflake,
  night_crickets: Moon,
  custom: SlidersHorizontal,
};

export default function Home({
  params,
}: {
  params: Promise<{ lang: Language }>;
}) {
  const { lang } = use(params);
  const {
    setCurrentScene,
    setIsPlaying,
    setIsEntered,
    isPlaying,
    currentScene,
    volume,
  } = useAppStore();
  const router = useRouter();



  const initialIndex = SCENES.findIndex((s) => s.id === currentScene);
  const [carouselIndex, setCarouselIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );

  const handleEnter = (sceneId: string) => {
    audio.init();
    setIsEntered(true);
    setIsPlaying(true);
    setCurrentScene(sceneId);
    router.push(`/${lang}/play`);
  };

  const handlePrev = () => {
    const newIndex = (carouselIndex - 1 + SCENES.length) % SCENES.length;
    setCarouselIndex(newIndex);
    setCurrentScene(SCENES[newIndex].id);
  };

  const handleNext = () => {
    const newIndex = (carouselIndex + 1) % SCENES.length;
    setCarouselIndex(newIndex);
    setCurrentScene(SCENES[newIndex].id);
  };

  const handleToggleMute = () => {
    setIsPlaying(!isPlaying);
  };

  const previewScene = SCENES[carouselIndex];
  const Icon = icons[previewScene.id] || SlidersHorizontal;

  return (
    <div className="fixed inset-0 bg-transparent text-white flex flex-col items-center justify-center font-sans overflow-y-auto z-40">
      <article className="sr-only">
        <h2>{t("aboutTitle", lang)}</h2>
        <p>{t("aboutText", lang)}</p>
        <h3>{t("designPrinciples", lang)}</h3>
        <p>{t("designPrinciplesText", lang)}</p>
      </article>

      <div className="w-full max-w-4xl px-8 flex flex-col justify-center items-center min-h-dvh gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6 "
        >
          <h1 className="text-6xl md:text-8xl font-light tracking-tighter">
            {t("short_name", lang)}
          </h1>
          <p className="text-xl md:text-2xl text-white/50 font-light max-w-md mx-auto">
            {t("subtitle", lang)}
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="w-full max-w-2xl relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handlePrev}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={previewScene.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                {(() => {
                  const sceneData = tScene(previewScene.id as any, lang as Language);
                  return (
                    <>
                      <h3 className="text-2xl font-light mb-2">
                        {sceneData.name}
                      </h3>
                      <p className="text-white/50 text-sm max-w-xs">
                        {sceneData.description}
                      </p>
                    </>
                  );
                })()}
              </motion.div>
            </AnimatePresence>

            <button
              onClick={handleNext}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleEnter(previewScene.id)}
              className="px-8 py-4 bg-white text-black rounded-full hover:scale-105 transition-transform text-sm uppercase tracking-widest font-medium"
            >
              {t("enter", lang)}
            </button>
            <button
              onClick={handleToggleMute}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              title={isPlaying ? t("unmute", lang) : t("mute", lang)}
            >
              {!isPlaying ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5 shrink-0" />
              )}
            </button>
          </div>

        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-center max-w-2xl"
        >
          <h3 className="text-lg font-light tracking-widest uppercase mb-4 opacity-50">
            {t("designPrinciples", lang)}
          </h3>
          <p className="text-sm text-white/40 leading-relaxed">
            {t("designPrinciplesText", lang)}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

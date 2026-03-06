"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { useAppStore } from "@/store/useAppStore";
import { translations, TranslationKey, Language, tScene, t } from "@/lib/i18n";
import { Mixer } from "@/components/Mixer";
import { SCENES } from "@/lib/config";
import { audio } from "@/lib/audioEngine";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Play,
  Pause,
  Globe,
  Flame,
  CloudRain,
  Waves,
  TreePine,
  SlidersHorizontal,
  Share2,
  CloudLightning,
  Snowflake,
  Moon,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

interface PlayerProps {
  lang: Language;
  initialScene?: string;
  showBackButton?: boolean;
  backUrl?: string;
}

// 订阅音频上下文状态的 store
function createAudioContextStore() {
  let state = { needsInteraction: false, state: "suspended" as AudioContextState };
  const listeners = new Set<() => void>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getState() {
      return state;
    },
    check() {
      if (typeof window === "undefined") return state;

      audio.init();
      const currentState = audio.ctx?.state || "suspended";
      const needsInteraction = currentState === "suspended";

      if (state.needsInteraction !== needsInteraction || state.state !== currentState) {
        state = { needsInteraction, state: currentState };
        notify();
      }
      return state;
    },
    async resume() {
      if (audio.ctx?.state === "suspended") {
        await audio.ctx.resume();
      }
      state = { needsInteraction: false, state: audio.ctx?.state || "running" };
      notify();
    },
  };
}

const audioContextStore = createAudioContextStore();

// 使用 useSyncExternalStore 订阅音频上下文状态
function useAudioContextState() {
  return useSyncExternalStore(
    audioContextStore.subscribe,
    () => audioContextStore.getState().needsInteraction,
    () => false
  );
}

export function Player({
  lang,
  initialScene,
  showBackButton = true,
  backUrl,
}: PlayerProps) {
  const {
    currentScene,
    setCurrentScene,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    getShareUrl,
    loadMixFromUrl,
  } = useAppStore();
  const router = useRouter();



  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMixer, setShowMixer] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 使用 useSyncExternalStore 获取音频上下文状态
  const needsUserInteraction = useAudioContextState();

  // 处理用户交互 - 恢复音频上下文并开始播放
  const handleUserInteraction = async () => {
    await audioContextStore.resume();
    setIsPlaying(true);
  };

  // 如果提供了初始场景，设置它
  useEffect(() => {
    if (initialScene && SCENES.some((s) => s.id === initialScene)) {
      setCurrentScene(initialScene);
    }
  }, [initialScene, setCurrentScene]);

  // 从 URL 加载 mix 参数
  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    if (!searchParams) return;
    const mix = searchParams.get("mix");
    if (mix) {
      loadMixFromUrl(mix);
    }
    setIsPlaying(true);
  }, [loadMixFromUrl, setIsPlaying]);

  // 组件挂载时检查音频上下文状态 - 使用 requestAnimationFrame 避免同步 setState
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      audioContextStore.check();
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  // 当 isPlaying 变为 true 时，检查音频上下文状态
  useEffect(() => {
    if (!isPlaying) return;

    const frameId = requestAnimationFrame(() => {
      const { needsInteraction } = audioContextStore.check();
      // 如果需要用户交互，暂停播放
      if (needsInteraction) {
        setIsPlaying(false);
      }
    });
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, setIsPlaying]);

  // 全屏状态监听
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !showMixer) setShowControls(false);
    }, 3000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { });
    } else {
      document.exitFullscreen().catch(() => { });
    }
  };

  const handleShare = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.push(`/${lang}`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-auto"
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
    >
      {/* 用户交互遮罩层 */}
      <AnimatePresence>
        {needsUserInteraction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={handleUserInteraction}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                <Play className="w-10 h-10 text-white ml-1" />
              </div>
              <h2 className="text-2xl font-light text-white mb-2">
                {t("enter", lang) || "Enter Experience"}
              </h2>
              <p className="text-white/50 text-sm">
                {lang === "zh"
                  ? "点击任意处开始播放"
                  : lang === "ja"
                    ? "タップして再生を開始"
                    : lang === "es"
                      ? "Toca para comenzar"
                      : "Tap anywhere to start"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMixer && <Mixer onClose={() => setShowMixer(false)} lang={lang} />}
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
              {showBackButton ? (
                <button
                  onClick={handleBack}
                  className="text-2xl font-light tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                >
                  {t("short_name", lang)}
                </button>
              ) : (
                <div className="text-2xl font-light tracking-widest opacity-50">
                  {t("short_name", lang)}
                </div>
              )}

              <div className="flex items-center gap-6">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden md:inline">
                    {shareCopied ? "Copied!" : "Share Mix"}
                  </span>
                </button>
                <div className="flex items-center gap-2 group">
                  <Globe className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <select
                    value={lang}
                    onChange={(e) => {
                      const newLang = e.target.value;
                      const currentPath = window.location.pathname;
                      const newPath = currentPath.replace(
                        `/${lang}/`,
                        `/${newLang}/`
                      );
                      window.location.href = newPath;
                    }}
                    className="bg-transparent text-sm opacity-50 hover:opacity-100 outline-none cursor-pointer appearance-none"
                  >
                    <option value="en" className="bg-black">
                      EN
                    </option>
                    <option value="es" className="bg-black">
                      ES
                    </option>
                    <option value="ja" className="bg-black">
                      JA
                    </option>
                    <option value="zh" className="bg-black">
                      ZH
                    </option>
                  </select>
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="opacity-50 hover:opacity-100 transition-opacity"
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5" />
                  ) : (
                    <Maximize className="w-5 h-5" />
                  )}
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
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-1" />
                  )}
                </button>

                <div className="flex items-center gap-3 w-32">
                  {volume === 0 ? (
                    <VolumeX className="w-4 h-4 opacity-50" />
                  ) : (
                    <Volume2 className="w-4 h-4 opacity-50" />
                  )}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>
              </div>

              {/* Scene Switcher & Mixer Toggle */}
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/10 overflow-x-auto custom-scrollbar max-w-full">
                {SCENES.filter((s) => s.id !== "custom").map((scene) => {
                  const Icon = icons[scene.id] || CloudRain;
                  return (
                    <button
                      key={scene.id}
                      onClick={() => setCurrentScene(scene.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 whitespace-nowrap ${currentScene === scene.id
                        ? "bg-white/10 text-white"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                        }`}
                      title={tScene(scene.id as any, lang).name}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm hidden md:block">
                        {tScene(scene.id as any, lang).name}
                      </span>
                    </button>
                  );
                })}
                <div className="w-px h-8 bg-white/10 mx-2 shrink-0" />
                <button
                  onClick={() => setShowMixer(!showMixer)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 shrink-0 ${showMixer || currentScene === "custom"
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  title={t("audioMixer", lang)}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="text-sm hidden md:block">
                    {t("audioMixer", lang)}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

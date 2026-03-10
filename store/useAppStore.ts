import { create } from 'zustand';
import { Language } from '@/lib/i18n';
import { SCENES } from '@/lib/config';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentScene: string;
  setCurrentScene: (sceneId: string) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
  isEntered: boolean;
  setIsEntered: (entered: boolean) => void;
  activeMix: Record<string, number>;
  setMixVolume: (soundId: string, volume: number) => void;
  loadMixFromUrl: (encoded: string) => void;
  getShareUrl: () => string;
}

export const useAppStore = create<AppState>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  currentScene: 'rain',
  setCurrentScene: (sceneId) => {
    const scene = SCENES.find(s => s.id === sceneId);
    if (scene) {
      set({ currentScene: sceneId, activeMix: scene.id === 'custom' ? { ...get().activeMix } : { ...scene.defaultMix } });
    }
  },
  isPlaying: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  volume: 0.5,
  setVolume: (vol) => set({ volume: vol }),
  isEntered: false,
  setIsEntered: (entered) => set({ isEntered: entered }),
  activeMix: { ...SCENES[0].defaultMix },
  setMixVolume: (soundId, volume) => set((state) => {
    const newMix = { ...state.activeMix };
    if (volume <= 0) {
      delete newMix[soundId];
    } else {
      newMix[soundId] = volume;
    }
    // If we modify the mix manually, we might want to switch to 'custom' scene visually,
    // but for now let's just keep the current visual and update the mix.
    return { activeMix: newMix };
  }),
  loadMixFromUrl: (encoded) => {
    try {
      const decoded = JSON.parse(atob(encoded));
      if (typeof decoded === 'object') {
        set({ activeMix: decoded, currentScene: 'custom', isEntered: true, isPlaying: true });
      }
    } catch (e) {
      console.error("Failed to load mix from URL", e);
    }
  },
  getShareUrl: () => {
    const state = get();
    const encoded = btoa(JSON.stringify(state.activeMix));
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/play?mix=${encoded}`;
    }
    return '';
  }
}));

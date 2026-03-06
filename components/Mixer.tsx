'use client';

import { useAppStore } from '@/store/useAppStore';
import { SOUND_ELEMENTS } from '@/lib/config';
import { Volume2, VolumeX, X } from 'lucide-react';
import { Language, translations, tSound } from '@/lib/i18n';

export function Mixer({ onClose, lang }: { onClose: () => void, lang: Language }) {
  const { activeMix, setMixVolume } = useAppStore();
  const t = translations[lang] || translations.en;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-[90%] max-w-md z-50 text-white shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-light tracking-widest uppercase">{t.audioMixer}</h2>
        <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
        {SOUND_ELEMENTS.map(element => {
          const volume = activeMix[element.id] || 0;
          const isActive = volume > 0;

          return (
            <div key={element.id} className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium tracking-wide">{tSound(element.id, lang)}</span>
                <span className="text-xs opacity-50">{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMixVolume(element.id, isActive ? 0 : 0.5)}
                  className="opacity-50 hover:opacity-100 transition-opacity"
                >
                  {isActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0" max="1" step="0.01"
                  value={volume}
                  onChange={(e) => setMixVolume(element.id, parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { audio } from '@/lib/audioEngine';

export function GlobalAudio() {
  const { isPlaying, activeMix, volume } = useAppStore();

  useEffect(() => {
    if (isPlaying) {
      audio.init();
      audio.syncMix(activeMix);
    } else {
      audio.stopAll();
    }
  }, [isPlaying, activeMix]);

  useEffect(() => {
    audio.setVolume(volume);
  }, [volume]);

  return null;
}

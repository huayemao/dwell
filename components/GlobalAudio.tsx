"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { audio } from "@/lib/audioEngine";

export function GlobalAudio() {
  const { isPlaying, activeMix, volume, setIsPlaying } = useAppStore();

  useEffect(() => {
    if (isPlaying) {
      try {
        audio.init();
        console.log("activeMix", activeMix);

        audio.syncMix(activeMix);
      } catch (error) {
        console.error("Error initializing audio engine:", error);
        setIsPlaying(false);
        audio.stopAll();
      }
    } else {
      audio.stopAll();
    }
  }, [isPlaying, activeMix, setIsPlaying]);

  useEffect(() => {
    audio.setVolume(volume);
  }, [volume]);

  return null;
}

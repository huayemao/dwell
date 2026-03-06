import { SoundId } from "./i18n";

export type SynthType = 'pink' | 'brown' | 'white' | 'crackle' | 'birds' | 'ocean' | 'wind' | 'thunder' | 'river' | 'crickets' | 'chimes';

export interface SoundElementDef {
  id: SoundId;
  name: string;
  category: 'nature' | 'noise' | 'ambience';
  synthType: SynthType;
}

export const SOUND_ELEMENTS: SoundElementDef[] = [
  { id: 'rain_heavy', name: 'Heavy Rain', category: 'nature', synthType: 'pink' },
  { id: 'ocean_waves', name: 'Ocean Waves', category: 'nature', synthType: 'ocean' },
  { id: 'fire_rumble', name: 'Fire Rumble', category: 'nature', synthType: 'brown' },
  { id: 'fire_crackle', name: 'Fire Crackle', category: 'nature', synthType: 'crackle' },
  { id: 'wind_forest', name: 'Forest Wind', category: 'nature', synthType: 'wind' },
  { id: 'birds', name: 'Birds Chirping', category: 'nature', synthType: 'birds' },
  { id: 'thunder', name: 'Thunder Strikes', category: 'nature', synthType: 'thunder' },
  { id: 'river', name: 'Mountain River', category: 'nature', synthType: 'river' },
  { id: 'crickets', name: 'Night Crickets', category: 'nature', synthType: 'crickets' },
  { id: 'chimes', name: 'Wind Chimes', category: 'ambience', synthType: 'chimes' },
  { id: 'white_noise', name: 'White Noise', category: 'noise', synthType: 'white' },
  { id: 'pink_noise', name: 'Pink Noise', category: 'noise', synthType: 'pink' },
  { id: 'brown_noise', name: 'Brown Noise', category: 'noise', synthType: 'brown' },
];

export interface SceneDef {
  id: string;
  name: string;
  description: string;
  visual: {
    type: 'particles' | 'video';
    variant: string;
    videoUrl?: string;
  };
  defaultMix: Record<string, number>;
}

export const SCENES: SceneDef[] = [
  {
    id: 'rain',
    name: 'Rainstorm',
    description: 'A calming downpour to wash away distractions.',
    visual: { type: 'particles', variant: 'rain', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-glass-of-a-window-822-large.mp4' },
    defaultMix: { 'rain_heavy': 0.8, 'wind_forest': 0.1 }
  },
  {
    id: 'ocean',
    name: 'Midnight Ocean',
    description: 'Deep, rolling waves under a moonlit sky.',
    visual: { type: 'particles', variant: 'ocean', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4' },
    defaultMix: { 'ocean_waves': 0.9, 'wind_forest': 0.2 }
  },
  {
    id: 'fireplace',
    name: 'Cozy Fireplace',
    description: 'Warm crackling embers for deep focus.',
    visual: { type: 'particles', variant: 'fireplace', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fire-flames-burning-in-a-fireplace-4235-large.mp4' },
    defaultMix: { 'fire_rumble': 0.8, 'fire_crackle': 0.7 }
  },
  {
    id: 'forest',
    name: 'Deep Forest',
    description: 'Serene woodland environment with birdsong.',
    visual: { type: 'particles', variant: 'forest', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4' },
    defaultMix: { 'wind_forest': 0.6, 'birds': 0.5, 'river': 0.2 }
  },
  {
    id: 'thunderstorm',
    name: 'Thunderstorm',
    description: 'Intense rain with rolling thunder.',
    visual: { type: 'particles', variant: 'thunderstorm', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-lightning-strikes-in-the-night-sky-4158-large.mp4' },
    defaultMix: { 'rain_heavy': 0.9, 'thunder': 0.8, 'wind_forest': 0.4 }
  },
  {
    id: 'winter_cabin',
    name: 'Winter Cabin',
    description: 'Snow falling outside a warm cabin.',
    visual: { type: 'particles', variant: 'winter_cabin', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-snow-falling-in-a-pine-forest-4261-large.mp4' },
    defaultMix: { 'fire_rumble': 0.6, 'fire_crackle': 0.5, 'wind_forest': 0.3 }
  },
  {
    id: 'night_crickets',
    name: 'Summer Night',
    description: 'Peaceful night with crickets and chimes.',
    visual: { type: 'particles', variant: 'night_crickets' },
    defaultMix: { 'crickets': 0.6, 'wind_forest': 0.2, 'chimes': 0.3 }
  },
  {
    id: 'custom',
    name: 'Custom Mix',
    description: 'Your personalized soundscape.',
    visual: { type: 'particles', variant: 'custom' },
    defaultMix: {}
  }
];

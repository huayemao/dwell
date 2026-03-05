import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dwell - Ambient Sounds & Scenes',
    short_name: 'Dwell',
    description: 'Discover & Build Audio-Visual Soundscapes. Immerse in nature’s symphony—rain, ocean waves, forest whispers. Free premium ambient sounds to spark creativity and nourish your soul.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/api/icon?size=192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/api/icon?size=512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

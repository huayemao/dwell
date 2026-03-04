import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Zenith - Seamless Audio-Visual Soundscapes',
    short_name: 'Zenith',
    description: 'Experience high-end, minimalist audio-visual scenes. Relax with looping white noise, fireplace, rain, ocean, and forest soundscapes for focus and meditation.',
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

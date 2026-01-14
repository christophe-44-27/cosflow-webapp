import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cosflow - Plateforme de gestion de projets cosplay',
    short_name: 'Cosflow',
    description: 'La plateforme tout-en-un pour gérer vos projets cosplay, collaborer avec des photographes et partager votre passion.',
    start_url: '/',
    display: 'standalone',
    background_color: '#110F29',
    theme_color: '#6259CA',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

import { AppLayout } from './components/app-layout';
import { LandingView } from './components/landing-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cosflow - Plateforme de gestion de projets cosplay',
  description: 'La plateforme tout-en-un pour gérer vos projets cosplay, collaborer avec des photographes et partager votre passion. Organisez vos photoshoots, stockez vos photos et planifiez vos événements.',
  keywords: ['cosplay', 'photographie', 'gestion de projets', 'galerie photo', 'événements', 'collaboration'],
  authors: [{ name: 'Cosflow' }],
  openGraph: {
    title: 'Cosflow - Plateforme de gestion de projets cosplay',
    description: 'La plateforme tout-en-un pour gérer vos projets cosplay, collaborer avec des photographes et partager votre passion.',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cosflow - Plateforme de gestion de projets cosplay',
    description: 'La plateforme tout-en-un pour gérer vos projets cosplay, collaborer avec des photographes et partager votre passion.',
  },
};

export default function Home() {
  return (
    <AppLayout>
      <LandingView />
    </AppLayout>
  );
}

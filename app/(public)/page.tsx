import { AppLayout } from '@/app/features/shared/components/app-layout';
import { LandingView } from '@/app/components/landing-view';
import type { Metadata } from 'next';
import { getServerTranslations, getServerLocale } from '@/app/lib/server-locale';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslations();
  const locale = await getServerLocale();

  return {
    title: t.metadata.title,
    description: t.metadata.homeLong,
    keywords: ['cosplay', 'photographie', 'gestion de projets', 'galerie photo', 'événements', 'collaboration'],
    authors: [{ name: 'Cosflow' }],
    openGraph: {
      title: t.metadata.title,
      description: t.metadata.description,
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.metadata.title,
      description: t.metadata.description,
    },
  };
}

export default function Home() {
  return (
    <AppLayout>
      <LandingView />
    </AppLayout>
  );
}

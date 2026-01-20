import { Suspense } from 'react';
import { AppLayout } from '@/app/features/shared/components/app-layout';
import { WebProjectsView } from '@/app/components/web-projects-view';
import type { Metadata } from 'next';
import { getServerTranslations } from '@/app/lib/server-locale';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslations();

  return {
    title: t.metadata.projectsTitle,
    description: t.metadata.projectsDescription,
    openGraph: {
      title: t.metadata.projectsTitle,
      description: t.metadata.projectsDescription,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.metadata.projectsTitle,
      description: t.metadata.projectsDescription,
    },
  };
}

export default function ProjectsPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="text-white">Chargement...</div></div>}>
        <WebProjectsView />
      </Suspense>
    </AppLayout>
  );
}

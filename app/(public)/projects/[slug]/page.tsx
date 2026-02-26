export const revalidate = 60;

import { cache } from 'react';
import { AppLayout } from '@/app/features/shared/components/app-layout';
import { ProjectDetailView } from '@/app/components/project-detail-view';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, defaultLocale } from '@/app/lib/locales';
import { projectService } from '@/app/lib/services';
import type { ProjectDetail } from '@/app/types/models';

// React cache déduplique la requête réseau entre generateMetadata et la page
const getProject = cache(async (slug: string): Promise<ProjectDetail | null> => {
  try {
    const response = await projectService.getProject(slug);
    return response.data;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('403') || error.message.includes('404'))) {
      notFound();
    }
    return null;
  }
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  // Pas de cookies() ici pour ne pas bloquer l'ISR — locale fixe pour le metadata
  const t = getTranslations(defaultLocale);
  const project = await getProject(slug);

  if (!project) {
    return {
      title: t.metadata.projectsTitle,
      description: t.metadata.projectDetailDescription,
      openGraph: {
        title: t.metadata.projectsTitle,
        description: t.metadata.projectDetailDescription,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: t.metadata.projectsTitle,
        description: t.metadata.projectDetailDescription,
      },
    };
  }

  return {
    title: project.title,
    description: project.description || t.metadata.projectDetailDescription,
    openGraph: {
      title: project.title,
      description: project.description || t.metadata.projectDetailDescription,
      type: 'website',
      images: project.image_url ? [{ url: project.image_url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description || t.metadata.projectDetailDescription,
      images: project.image_url ? [project.image_url] : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const initialData = await getProject(slug);

  return (
    <AppLayout>
      <ProjectDetailView slug={slug} initialData={initialData} />
    </AppLayout>
  );
}

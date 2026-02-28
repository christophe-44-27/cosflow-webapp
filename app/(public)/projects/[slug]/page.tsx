export const revalidate = 60;

import { cache } from 'react';
import { AppLayout } from '@/app/features/shared/components/app-layout';
import { ProjectPublicView } from '@/app/features/projects/public-view/components/ProjectPublicView';
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
    console.error('[getProject] SSR fetch failed for slug:', slug, error);
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
      images: project.image_url
        ? [{ url: project.image_url, width: 1200, height: 630, alt: project.title }]
        : undefined,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/projects/${slug}`,
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
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === '1';

  // En mode preview (owner sur son projet privé), on skip le SSR public
  // et on laisse le client utiliser l'endpoint authentifié
  const initialData = isPreview ? null : await getProject(slug);

  return (
    <AppLayout noContainer>
      <ProjectPublicView slug={slug} initialData={initialData} isPreview={isPreview} />
    </AppLayout>
  );
}

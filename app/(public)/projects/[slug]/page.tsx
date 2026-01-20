import { AppLayout } from '@/app/features/shared/components/app-layout';
import { ProjectDetailView } from '@/app/components/project-detail-view';
import { ProjectOwnerView } from '@/app/components/project-owner-view';
import type { Metadata } from 'next';
import { getServerTranslations, getServerLocale } from '@/app/lib/server-locale';
import { publicApiService } from '@/app/lib/services';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getServerTranslations();
  const locale = await getServerLocale();

  try {
    const response = await publicApiService.getProject(slug);
    const project = response.data;

    return {
      title: project.title,
      description: project.description || t.metadata.projectDetailDescription,
      openGraph: {
        title: project.title,
        description: project.description || t.metadata.projectDetailDescription,
        type: 'website',
        images: project.image_url ? [{ url: project.image_url }] : undefined,
        locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: project.description || t.metadata.projectDetailDescription,
        images: project.image_url ? [project.image_url] : undefined,
      },
    };
  } catch {
    return {
      title: t.metadata.projectsTitle,
      description: t.metadata.projectDetailDescription,
      openGraph: {
        title: t.metadata.projectsTitle,
        description: t.metadata.projectDetailDescription,
        type: 'website',
        locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: t.metadata.projectsTitle,
        description: t.metadata.projectDetailDescription,
      },
    };
  }
}

export default async function ProjectDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ owner?: string }>;
}) {
  const { slug } = await params;
  const { owner } = await searchParams;
  const isOwnerView = owner === 'true';

  return (
    <AppLayout>
      {isOwnerView ? (
        <ProjectOwnerView slug={slug} />
      ) : (
        <ProjectDetailView slug={slug} />
      )}
    </AppLayout>
  );
}

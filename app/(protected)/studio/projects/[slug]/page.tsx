import { AppLayout } from '@/app/features/shared/components/app-layout';
import { ProjectOwnerView } from '@/app/components/project-owner-view-refactored';

export default async function StudioProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <AppLayout noContainer>
      <ProjectOwnerView slug={slug} />
    </AppLayout>
  );
}

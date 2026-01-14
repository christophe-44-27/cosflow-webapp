import { AppLayout } from '../../components/app-layout';
import { ProjectDetailView } from '../../components/project-detail-view';

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  return (
    <AppLayout>
      <ProjectDetailView slug={slug} />
    </AppLayout>
  );
}

import { AppLayout } from '@/app/features/shared/components/app-layout';
import { ProjectPageSkeleton } from '@/app/features/projects/public-view/components/ProjectPageSkeleton';

export default function ProjectDetailLoading() {
  return (
    <AppLayout noContainer>
      <ProjectPageSkeleton />
    </AppLayout>
  );
}

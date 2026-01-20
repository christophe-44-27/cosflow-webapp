import { AppLayout } from '@/app/features/shared/components/app-layout';
import { ProfileView } from '@/app/components/profile-view';

export default async function ProfilePage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  return (
    <AppLayout>
      <ProfileView slug={slug} />
    </AppLayout>
  );
}

import { AppLayout } from '../../components/app-layout';
import { ProfileView } from '../../components/profile-view';

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


export const revalidate = 60;

import { notFound } from 'next/navigation';
import { AppLayout } from '@/app/features/shared/components/app-layout';
import { ProfileView } from '@/app/components/profile-view';
import { userService } from '@/app/lib/services';

async function checkProfileExists(slug: string): Promise<void> {
  try {
    await userService.getUserProfile(slug);
  } catch (error) {
    if (error instanceof Error && (error.message.includes('403') || error.message.includes('404'))) {
      notFound();
    }
    // Autres erreurs (404, 500...) : laisse ProfileView gérer côté client
  }
}

export default async function ProfilePage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  await checkProfileExists(slug);

  return (
    <AppLayout>
      <ProfileView slug={slug} />
    </AppLayout>
  );
}

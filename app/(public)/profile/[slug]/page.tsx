export const revalidate = 60;

import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AppLayout } from '@/app/features/shared/components/app-layout';
import { ProfilePublicView } from '@/app/features/profile/public-view/components/ProfilePublicView';
import { userService } from '@/app/lib/services';
import type { UserProfile } from '@/app/types/models';

const getProfile = cache(async (slug: string): Promise<UserProfile | null> => {
  try {
    const response = await userService.getUserProfile(slug);
    return response.data;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('403') || error.message.includes('404'))) {
      notFound();
    }
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug);

  if (!profile) {
    return { title: 'Profil introuvable' };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cosflow.co';
  const description = profile.description
    ? profile.description.slice(0, 155)
    : `Découvrez le profil cosplay de ${profile.name} sur Cosflow.`;

  return {
    title: `${profile.name} — Cosflow`,
    description,
    openGraph: {
      title: profile.name,
      description,
      url: `${appUrl}/profile/${slug}`,
      images:
        profile.has_avatar && profile.avatar
          ? [{ url: profile.avatar, alt: profile.name }]
          : [],
    },
    twitter: {
      card: 'summary',
      title: profile.name,
      description,
      images: profile.has_avatar && profile.avatar ? [profile.avatar] : [],
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getProfile(slug);

  return (
    <AppLayout>
      <ProfilePublicView slug={slug} initialData={profile} />
    </AppLayout>
  );
}

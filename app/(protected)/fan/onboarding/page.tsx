import type { Metadata } from 'next';
import { AppLayout } from '@/app/features/shared/components/app-layout';
import { userService } from '@/app/lib/services';
import { getServerTranslations } from '@/app/lib/server-locale';
import { FanOnboardingView } from '@/app/features/fan/onboarding/FanOnboardingView';
import type { User } from '@/app/types/models';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslations();
  return {
    title: t.fanOnboarding.metaTitle,
    description: t.fanOnboarding.metaDescription,
  };
}

export default async function FanOnboardingPage() {
  let makers: User[] = [];
  try {
    const response = await userService.getUsers({ per_page: 10 });
    makers = response.data ?? [];
  } catch {
    // API indisponible — page reste accessible sans makers
  }

  return (
    <AppLayout>
      <FanOnboardingView makers={makers} />
    </AppLayout>
  );
}

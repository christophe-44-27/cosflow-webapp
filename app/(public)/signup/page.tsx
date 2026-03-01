import type { Metadata } from 'next';
import { getServerTranslations } from '@/app/lib/server-locale';
import { SignupPageView } from './SignupPageView';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslations();
  return {
    title: t.signup.metaTitle,
    description: t.signup.metaDescription,
  };
}

export default function SignupPage() {
  return <SignupPageView />;
}

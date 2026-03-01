import type { Metadata } from 'next';
import { getServerTranslations } from '@/app/lib/server-locale';
import { VerifyEmailView } from './VerifyEmailView';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslations();
  return { title: t.verifyEmail.metaTitle };
}

export default function VerifyEmailPage() {
  return <VerifyEmailView />;
}

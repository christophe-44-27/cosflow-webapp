'use client';

import Link from 'next/link';
import { useTranslations } from '@/app/lib/locale-context';

export default function ProjectNotFound() {
  const t = useTranslations();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-black text-primary mb-4">{t.notFound.code}</p>

      <h1 className="text-xl font-bold text-white mb-3">
        {t.projectDetail.projectNotFound}
      </h1>

      <p className="text-white/50 max-w-sm mb-8 text-sm leading-relaxed">
        {t.notFound.description}
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
      >
        {t.notFound.cta}
      </Link>
    </div>
  );
}

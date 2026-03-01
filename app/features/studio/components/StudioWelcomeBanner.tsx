'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useTranslations } from '@/app/lib/locale-context';
import { useAuth } from '@/app/features/auth';

export function StudioWelcomeBanner() {
  const t = useTranslations();
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('cosflow_new_maker') === '1') {
      setVisible(true);
      localStorage.removeItem('cosflow_new_maker');
    }
  }, []);

  if (!visible) return null;

  const name = user?.profile?.name ?? '';

  return (
    <div className="relative bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-2xl p-5 mb-6">
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute top-3 right-3 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Fermer"
      >
        <X className="w-4 h-4 text-white/60" />
      </button>

      <div className="flex items-start gap-4">
        <span className="text-3xl flex-shrink-0">🎉</span>
        <div className="flex-1">
          <h2 className="text-white font-bold text-lg leading-snug">
            {name
              ? t.studio.welcomeTitle.replace('{name}', name)
              : t.studio.welcomeTitle.replace(', {name}', '').replace('{name}', '')}
          </h2>
          <p className="text-white/70 text-sm mt-1">{t.studio.welcomeSubtitle}</p>
          <div className="flex items-center gap-3 mt-4">
            <Link
              href="/studio/projects?new=1"
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium transition-colors"
            >
              {t.studio.createFirstProject}
            </Link>
            <Link
              href="/discovery"
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm font-medium transition-colors"
            >
              {t.studio.explore}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

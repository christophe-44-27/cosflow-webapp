'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLocale } from '@/app/lib/locale-context';

interface PublicVisibilityToggleProps {
  slug: string;
  initialIsPrivate: boolean;
}

export function PublicVisibilityToggle({ slug, initialIsPrivate }: PublicVisibilityToggleProps) {
  const { t } = useLocale();
  const [isPrivate, setIsPrivate] = useState(initialIsPrivate);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    const newIsPrivate = !isPrivate;
    setIsPrivate(newIsPrivate);
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('is_private', newIsPrivate ? '1' : '0');
      const res = await fetch(`/api/projects/${slug}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        setIsPrivate(!newIsPrivate);
        setError(t.projectInfo.visibility_error);
        setTimeout(() => setError(null), 3000);
      }
    } catch {
      setIsPrivate(!newIsPrivate);
      setError(t.projectInfo.visibility_error);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className="flex items-center gap-2 min-h-[44px] min-w-[44px] px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
        aria-label={isPrivate ? t.projectInfo.visibility_private : t.projectInfo.visibility_public}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-white/60" />
        ) : isPrivate ? (
          <EyeOff className="w-4 h-4 text-white/60" />
        ) : (
          <Eye className="w-4 h-4 text-green-400" />
        )}
        <span className={`text-sm ${isPrivate ? 'text-white/60' : 'text-green-400'}`}>
          {isPrivate ? t.projectInfo.visibility_private : t.projectInfo.visibility_public}
        </span>
      </button>
      {error && (
        <p className="text-red-400 text-xs px-1">{error}</p>
      )}
    </div>
  );
}

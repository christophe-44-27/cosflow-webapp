'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from '@/app/lib/locale-context';
import { useAuth } from '@/app/features/auth';
import { useLikeToast } from '@/app/features/shared/context/like-toast-context';

interface LikeButtonProps {
  slug: string;
  initialCount: number;
  initialLiked: boolean | null;
  /** 'sidebar' = carte complète desktop | 'mobile' = barre fixe mobile */
  variant?: 'sidebar' | 'mobile';
}

export function LikeButton({
  slug,
  initialCount,
  initialLiked,
  variant = 'sidebar',
}: LikeButtonProps) {
  const { t } = useLocale();
  const { isLoggedIn } = useAuth();
  const { showLikeToast } = useLikeToast();
  const [liked, setLiked] = useState(initialLiked ?? false);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  // Empêche le GET initial d'écraser un optimistic update déjà appliqué
  const hasInteracted = useRef(false);

  // Synchronise uniquement le statut liked côté client une fois l'auth connue
  // (l'endpoint public SSR retourne is_liked_by_user: null)
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch(`/api/projects/${slug}/like`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data != null && !hasInteracted.current) setLiked(data.liked);
      })
      .catch(() => {});
  }, [isLoggedIn, slug]);

  const toggle = async () => {
    if (!isLoggedIn) {
      showLikeToast();
      return;
    }
    if (isLoading) return;

    hasInteracted.current = true;
    const newLiked = !liked;
    // Optimistic update + pulse animation
    setLiked(newLiked);
    setCount((prev) => (newLiked ? prev + 1 : prev - 1));
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 100);

    try {
      setIsLoading(true);
      const res = await fetch(`/api/projects/${slug}/like`, {
        method: 'POST',
      });
      if (!res.ok) {
        setLiked(!newLiked);
        setCount((prev) => (newLiked ? prev - 1 : prev + 1));
      }
    } catch {
      // Silent rollback
      setLiked(!newLiked);
      setCount((prev) => (newLiked ? prev - 1 : prev + 1));
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'mobile') {
    return (
      <button
        onClick={toggle}
        disabled={isLoading}
        className={`flex-1 flex items-center justify-center gap-2 min-h-[44px] rounded-[10px] border-[1.5px] text-sm font-medium transition-all ${
          liked
            ? 'bg-[#2BD1C7]/15 text-[#2BD1C7] border-[#2BD1C7]/60 font-semibold'
            : 'bg-transparent text-[#2BD1C7] border-[#2BD1C7] hover:bg-[#2BD1C7]/10'
        }`}
      >
        <span className={`transition-transform duration-75 ${isPulsing ? 'scale-125' : 'scale-100'}`}>
          {liked ? '♥' : '♡'}
        </span>
        {liked
          ? t.project.sidebar.likedAction.replace('♥ ', '')
          : t.project.sidebar.likeAction.replace('♡ ', '')
        }
      </button>
    );
  }

  return (
    <div className="p-[1.5rem_1.25rem] flex flex-col items-center gap-4">
      {/* Compteur */}
      <div className="flex items-baseline gap-2">
        <span
          className="font-mono font-bold text-white"
          style={{ fontSize: '2.25rem', letterSpacing: '-0.04em' }}
        >
          {count}
        </span>
      </div>
      <span className="text-[0.75rem] text-[#9690C4] text-center -mt-2">
        {t.project.sidebar.likesLabel}
      </span>

      {/* Bouton */}
      <button
        onClick={toggle}
        disabled={isLoading}
        className={`w-full min-h-[44px] rounded-[10px] border text-sm font-medium transition-all ${isPulsing ? 'scale-[1.03]' : 'scale-100'} ${
          liked
            ? 'bg-[#2BD1C7]/15 text-[#2BD1C7] border-[#2BD1C7]/60 font-semibold'
            : 'bg-transparent text-[#2BD1C7] border-[#2BD1C7] hover:bg-[#2BD1C7]/10'
        }`}
      >
        {liked ? t.project.sidebar.likedAction : t.project.sidebar.likeAction}
      </button>
    </div>
  );
}

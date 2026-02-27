'use client';

import { useState } from 'react';
import { useLocale } from '@/app/lib/locale-context';
import { useAuth } from '@/app/features/auth';
import { useLikeToast } from '@/app/features/shared/context/like-toast-context';

interface ProfileLikeButtonProps {
  slug: string;
  initialCount: number;
  initialLiked: boolean | null;
}

export function ProfileLikeButton({ slug, initialCount, initialLiked }: ProfileLikeButtonProps) {
  const { t } = useLocale();
  const { isLoggedIn } = useAuth();
  const { showLikeToast } = useLikeToast();
  const [liked, setLiked] = useState(initialLiked ?? false);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const toggle = async () => {
    if (!isLoggedIn) {
      showLikeToast();
      return;
    }
    if (isLoading) return;

    const newLiked = !liked;
    setLiked(newLiked);
    setCount((prev) => (newLiked ? prev + 1 : prev - 1));
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 100);

    try {
      setIsLoading(true);
      const res = await fetch(`/api/profiles/${slug}/like`, {
        method: newLiked ? 'POST' : 'DELETE',
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

  return (
    <button
      onClick={toggle}
      disabled={isLoading}
      className={`flex items-center gap-1.5 px-4 min-h-[44px] rounded-xl border font-medium transition-all ${
        liked
          ? 'bg-[#2BD1C7]/15 text-[#2BD1C7] border-[#2BD1C7]/50 font-semibold'
          : 'bg-white/5 text-white/60 border-white/10 hover:bg-[#2BD1C7]/10 hover:text-[#2BD1C7] hover:border-[#2BD1C7]/30'
      }`}
      style={{ fontSize: '0.85rem' }}
    >
      <span className={`transition-transform duration-75 ${isPulsing ? 'scale-125' : 'scale-100'}`}>
        {liked ? '♥' : '♡'}
      </span>
      <span className="font-mono" style={{ fontSize: '0.8rem' }}>{count}</span>
      <span className="hidden sm:inline">
        {liked ? t.engagement.profileLikedAction.replace('♥ ', '') : t.engagement.profileLikeAction.replace('♡ ', '')}
      </span>
    </button>
  );
}

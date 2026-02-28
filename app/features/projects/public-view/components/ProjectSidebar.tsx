'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { useLocale } from '@/app/lib/locale-context';
import { LikeButton } from './LikeButton';
import { MakerProfileCard } from './MakerProfileCard';
import { useAuth } from '@/app/features/auth';
import type { ProjectDetail } from '@/app/types/models';

interface ProjectSidebarProps {
  project: ProjectDetail;
}

const cardClass =
  'bg-white/[0.04] border border-white/[0.07] rounded-[14px] overflow-hidden';

export function ProjectSidebar({ project }: ProjectSidebarProps) {
  const { t } = useLocale();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const isOwner = user != null && user.id === project.user_id;

  const makerProfile = project.user.profile;
  const kofiUrl = makerProfile.ko_fi_url;
  const patreonUrl = makerProfile.patreon_url;
  const supportUrl = kofiUrl || patreonUrl;

  const handleShare = async () => {
    const url = window.location.origin + window.location.pathname;
    if (navigator.share) {
      try {
        await navigator.share({ title: project.title, url });
      } catch {
        // Utilisateur a annulé — pas d'erreur
      }
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* ── Sidebar desktop (sticky) ── */}
      <div className="flex flex-col gap-[0.875rem]">
        {/* Like card */}
        <div className={cardClass}>
          {isOwner ? (
            <div className="p-[1.5rem_1.25rem] flex flex-col items-center gap-1">
              <span className="font-mono font-bold text-white" style={{ fontSize: '2.25rem', letterSpacing: '-0.04em' }}>
                {project.likes_count}
              </span>
              <span className="text-[0.75rem] text-[#9690C4] text-center">{t.project.sidebar.likesLabel}</span>
            </div>
          ) : (
            <LikeButton
              slug={project.slug}
              initialCount={project.likes_count}
              initialLiked={project.is_liked_by_user}
            />
          )}
        </div>

        {/* Actions card : Ko-fi + Share */}
        <div className={cardClass}>
          <div className="p-[0.875rem] flex flex-col gap-2">
            {supportUrl && (
              <a
                href={supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#FF5e5b] hover:bg-[#e84e4b] text-white rounded-[10px] font-medium transition-all hover:-translate-y-px"
                style={{ fontSize: '0.85rem', letterSpacing: '0.01em' }}
              >
                ☕ {t.project.sidebar.supportKofi}
              </a>
            )}
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 w-full py-[0.65rem] bg-transparent border border-white/[0.07] rounded-[10px] text-[#9690C4] hover:bg-white/[0.07] hover:text-white hover:border-white/[0.14] transition-all"
              style={{ fontSize: '0.82rem', fontWeight: 500 }}
            >
              <Share2 size={14} />
              {copied ? t.project.sidebar.shareCopied : t.project.sidebar.share}
            </button>
          </div>
        </div>

        {/* Maker card */}
        <div className={cardClass}>
          <MakerProfileCard profile={makerProfile} />
        </div>
      </div>

      {/* ── Barre fixe mobile (< 1024px) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1E1A40]/90 backdrop-blur-sm border-t border-white/[0.07] px-6 py-[0.875rem] pb-[calc(0.875rem+env(safe-area-inset-bottom,0px))] flex items-center gap-3">
        <span className="font-mono font-semibold text-white" style={{ fontSize: '0.875rem' }}>
          {project.likes_count}
        </span>
        {!isOwner && (
          <LikeButton
            slug={project.slug}
            initialCount={project.likes_count}
            initialLiked={project.is_liked_by_user}
            variant="mobile"
          />
        )}
      </div>
    </>
  );
}

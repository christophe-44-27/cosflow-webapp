'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { useLocale } from '@/app/lib/locale-context';
import type { ProjectUserProfile } from '@/app/types/models';

interface MakerProfileCardProps {
  profile: ProjectUserProfile;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function MakerProfileCard({ profile }: MakerProfileCardProps) {
  const { t } = useLocale();

  return (
    <div className="p-[1.125rem]">
      {/* Header avatar + nom */}
      <div className="flex items-center gap-3 mb-[0.875rem]">
        <Avatar className="h-[46px] w-[46px] border-2 border-[#6259CA]/35 ring-[3px] ring-[#6259CA]/10">
          {profile.has_avatar && <AvatarImage src={profile.avatar} alt={profile.name} />}
          <AvatarFallback className="bg-gradient-to-br from-[#6259CA] to-[#2BD1C7] text-white font-bold text-sm">
            {getInitials(profile.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <Link
            href={`/profile/${profile.slug}`}
            className="block font-bold text-white truncate hover:text-[#2BD1C7] transition-colors"
            style={{ fontSize: '0.9rem', letterSpacing: '-0.02em' }}
          >
            {profile.name}
          </Link>
        </div>
      </div>

      {/* Bio */}
      {profile.description && (
        <p
          className="text-[#9690C4] mb-[0.875rem] line-clamp-3"
          style={{ fontSize: '0.78rem', lineHeight: '1.6' }}
        >
          {profile.description}
        </p>
      )}

      {/* Bouton suivre */}
      <Link
        href={`/profile/${profile.slug}`}
        className="w-full flex items-center justify-center gap-1.5 py-[0.6rem] bg-transparent border border-[#6259CA] rounded-[10px] text-[#6259CA] hover:bg-[#6259CA]/10 transition-colors"
        style={{ fontSize: '0.82rem', fontWeight: 500 }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        {t.project.sidebar.follow} {profile.name.split(' ')[0]}
      </Link>
    </div>
  );
}

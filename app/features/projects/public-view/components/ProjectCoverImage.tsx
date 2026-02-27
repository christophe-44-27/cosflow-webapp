'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { useLocale } from '@/app/lib/locale-context';

interface ProjectCoverImageProps {
  coverUrl: string | null;
  thumbnailUrl: string | null;
  projectTitle: string;
  fandomName?: string | null;
  originName?: string | null;
  makerName: string;
  makerAvatar?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function ProjectCoverImage({
  coverUrl,
  thumbnailUrl,
  projectTitle,
  fandomName,
  originName,
  makerName,
  makerAvatar,
}: ProjectCoverImageProps) {
  const { t } = useLocale();

  return (
    <div className="relative h-[40vh] md:h-[45vh] lg:h-[50vh] w-full overflow-hidden">
      {/* Cover background */}
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={projectTitle}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#6259CA] to-[#2BD1C7]"
          aria-label={t.project.cover.noImage}
        />
      )}

      {/* Gradient overlay bottom-to-top */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A40] via-[#1E1A40]/40 to-transparent" />

      {/* Hero content */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 pb-6 flex justify-between items-end gap-4">

          {/* Left: thumbnail + title + fandom */}
          <div className="min-w-0 flex-1 flex items-end gap-3">
            {/* Project thumbnail (portrait 3:4) */}
            {thumbnailUrl && (
              <div className="relative w-12 h-16 md:w-14 md:h-[4.67rem] rounded-lg overflow-hidden ring-2 ring-white/20 shadow-lg shrink-0">
                <Image
                  src={thumbnailUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
            )}

            {/* Title + fandom */}
            <div className="min-w-0">
              <h1
                className="font-extrabold text-white leading-[1.05] drop-shadow-lg"
                style={{ fontSize: 'clamp(1.875rem, 4.5vw, 3.25rem)', letterSpacing: '-0.035em' }}
              >
                {projectTitle}
              </h1>
              {(fandomName || originName) && (
                <p
                  className="mt-1 font-semibold text-white/55 truncate"
                  style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', letterSpacing: '-0.01em' }}
                >
                  {[fandomName, originName].filter(Boolean).join(' — ')}
                </p>
              )}
            </div>
          </div>

          {/* Right: maker chip */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 shrink-0">
            <Avatar className="h-6 w-6">
              {makerAvatar && <AvatarImage src={makerAvatar} alt={makerName} />}
              <AvatarFallback className="text-xs bg-[#6259CA] text-white">
                {getInitials(makerName)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white font-medium">{makerName}</span>
          </div>

        </div>
      </div>
    </div>
  );
}

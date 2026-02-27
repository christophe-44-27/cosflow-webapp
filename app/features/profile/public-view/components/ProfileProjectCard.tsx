'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/app/lib/locale-context';
import type { UserProfileProject } from '@/app/types/models';
import { parseWorkingTime } from '../../utils/parseProfileStats';

interface ProfileProjectCardProps {
  project: UserProfileProject;
}

export function ProfileProjectCard({ project }: ProfileProjectCardProps) {
  const { t } = useLocale();

  const hasHours = !!project.total_project_working_time;
  const hasBudget = project.project_estimated_price !== null && project.project_estimated_price !== undefined;
  const hasElements = project.elements_count !== undefined;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group bg-white/[0.04] border border-white/[0.07] rounded-[14px] overflow-hidden hover:border-[#6259CA]/50 hover:-translate-y-px transition-all"
    >
      {/* Cover image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-[#6259CA]/20 to-[#2BD1C7]/20">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A40]/80 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-[6px] text-xs border ${
              project.status === 'completed'
                ? 'bg-[#2BD1C7]/15 text-[#2BD1C7] border-[#2BD1C7]/30'
                : 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
            }`}
            style={{ fontSize: '0.7rem', fontWeight: 500 }}
          >
            {project.status === 'completed' ? t.profile.completed : t.profile.inProgress}
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <h3
            className="font-bold text-white truncate leading-tight"
            style={{ fontSize: '0.95rem', letterSpacing: '-0.02em' }}
          >
            {project.title}
          </h3>
        </div>
      </div>

      {/* Stats row */}
      {(hasHours || hasBudget || hasElements) && (
        <div className="px-4 py-3 flex items-center gap-3 border-t border-white/[0.05]">
          {hasHours && (
            <span className="font-mono text-white/70" style={{ fontSize: '0.78rem' }}>
              {parseWorkingTime(project.total_project_working_time)}
            </span>
          )}
          {hasHours && (hasElements || hasBudget) && (
            <span className="text-white/20">·</span>
          )}
          {hasElements && (
            <span className="font-mono text-white/70" style={{ fontSize: '0.78rem' }}>
              {project.elements_count} éléments
            </span>
          )}
          {hasElements && hasBudget && (
            <span className="text-white/20">·</span>
          )}
          {hasBudget && (
            <span className="font-mono text-[#9690C4]" style={{ fontSize: '0.78rem' }}>
              {project.project_estimated_price} €
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

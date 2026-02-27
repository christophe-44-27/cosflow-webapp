'use client';

import Link from 'next/link';
import { useLocale } from '@/app/lib/locale-context';
import type { PersonalRecords } from '@/app/types/models';
import { parseHours, formatPrice } from '../../utils/parseProfileStats';

interface PersonalRecordsSectionProps {
  records: PersonalRecords | null | undefined;
}

export function PersonalRecordsSection({ records }: PersonalRecordsSectionProps) {
  const { t } = useLocale();

  return (
    <div className="mb-6">
      <h2
        className="font-bold text-white mb-3"
        style={{ fontSize: '1.05rem', letterSpacing: '-0.025em' }}
      >
        {t.profile.records.title}
      </h2>

      {!records || (records.total_hours === 0 && records.total_budget === 0 && !records.most_complex_project) ? (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-[12px] px-5 py-4 text-center text-[#9690C4]" style={{ fontSize: '0.82rem' }}>
          {t.profile.records.noProjects}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Total hours */}
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-[12px] px-4 py-[1.125rem] flex flex-col gap-1">
            <span
              className="font-mono font-bold text-white leading-none"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.04em' }}
            >
              {parseHours(records.total_hours)}
            </span>
            <span
              className="uppercase text-[#9690C4] font-medium"
              style={{ fontSize: '0.665rem', letterSpacing: '0.14em' }}
            >
              {t.profile.records.totalHours}
            </span>
          </div>

          {/* Total budget */}
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-[12px] px-4 py-[1.125rem] flex flex-col gap-1">
            <span
              className="font-mono font-bold text-white leading-none"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.04em' }}
            >
              {formatPrice(records.total_budget)}
            </span>
            <span
              className="uppercase text-[#9690C4] font-medium"
              style={{ fontSize: '0.665rem', letterSpacing: '0.14em' }}
            >
              {t.profile.records.totalBudget}
            </span>
          </div>

          {/* Most complex project */}
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-[12px] px-4 py-[1.125rem] flex flex-col gap-1">
            {records.most_complex_project ? (
              <>
                <Link
                  href={`/projects/${records.most_complex_project.slug}`}
                  className="font-bold text-white truncate hover:text-[#2BD1C7] transition-colors leading-tight"
                  style={{ fontSize: '0.9rem', letterSpacing: '-0.02em' }}
                >
                  {records.most_complex_project.title}
                </Link>
                <span
                  className="font-mono text-[#9690C4]"
                  style={{ fontSize: '0.72rem' }}
                >
                  {records.most_complex_project.elements_count} {t.profile.records.elements}
                </span>
                <span
                  className="uppercase text-[#9690C4] font-medium"
                  style={{ fontSize: '0.665rem', letterSpacing: '0.14em' }}
                >
                  {t.profile.records.mostComplex}
                </span>
              </>
            ) : (
              <span className="text-[#9690C4]" style={{ fontSize: '0.82rem' }}>—</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

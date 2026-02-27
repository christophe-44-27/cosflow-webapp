'use client';

import { useLocale } from '@/app/lib/locale-context';
import { parseHours, formatPrice } from '../utils/parseProjectStats';

interface ProjectStatsBarProps {
  totalWorkingTime: string;
  elementsCount: number;
  estimatedPrice: string | null;
}

export function ProjectStatsBar({
  totalWorkingTime,
  elementsCount,
  estimatedPrice,
}: ProjectStatsBarProps) {
  const { t } = useLocale();
  const hours = parseHours(totalWorkingTime);
  const price = formatPrice(estimatedPrice);

  return (
    <div className="w-full bg-[#6259CA]">
      <div className="grid grid-cols-3 max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center py-5 px-4 border-r border-white/20">
          <span
            className="font-bold font-mono text-white leading-none"
            style={{ fontSize: 'clamp(1.875rem, 3.5vw, 2.875rem)', letterSpacing: '-0.04em' }}
          >
            {hours}
          </span>
          <span
            className="uppercase text-white/60 mt-1 font-medium"
            style={{ fontSize: '0.665rem', letterSpacing: '0.14em' }}
          >
            {t.project.stats.hours}
          </span>
        </div>
        <div className="flex flex-col items-center py-5 px-4 border-r border-white/20">
          <span
            className="font-bold font-mono text-white leading-none"
            style={{ fontSize: 'clamp(1.875rem, 3.5vw, 2.875rem)', letterSpacing: '-0.04em' }}
          >
            {elementsCount}
          </span>
          <span
            className="uppercase text-white/60 mt-1 font-medium"
            style={{ fontSize: '0.665rem', letterSpacing: '0.14em' }}
          >
            {t.project.stats.elements}
          </span>
        </div>
        <div className="flex flex-col items-center py-5 px-4">
          <span
            className="font-bold font-mono text-white leading-none"
            style={{ fontSize: 'clamp(1.875rem, 3.5vw, 2.875rem)', letterSpacing: '-0.04em' }}
          >
            {price}
          </span>
          <span
            className="uppercase text-white/60 mt-1 font-medium"
            style={{ fontSize: '0.665rem', letterSpacing: '0.14em' }}
          >
            {t.project.stats.budget}
          </span>
        </div>
      </div>
    </div>
  );
}

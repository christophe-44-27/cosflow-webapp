'use client';

import { useLocale } from '@/app/lib/locale-context';
import { parseHours, formatElementPrice } from '../utils/parseProjectStats';
import type { ProjectElement } from '@/app/types/models';

interface ProjectElementCardProps {
  element: ProjectElement;
}

function getInitial(title: string): string {
  return title.trim().charAt(0).toUpperCase();
}

export function ProjectElementCard({ element }: ProjectElementCardProps) {
  const { t } = useLocale();

  const hours = parseHours(element.total_working_time);
  const price = formatElementPrice(element.price);

  const typeLabel =
    element.type === 'buy'
      ? t.projectDetail.elements.buy
      : element.type === 'make'
        ? t.projectDetail.elements.make
        : t.projectDetail.elements.task;

  const categoryDisplay = [element.category?.name, typeLabel]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.07] border-l-[2.5px] border-l-[#6259CA] rounded-[10px] p-[0.875rem] pl-[0.8rem] transition-all duration-150 hover:bg-white/[0.07] hover:border-l-[#2BD1C7] hover:-translate-y-px cursor-default">
      {/* Icône — initiale du titre */}
      <div className="w-[34px] h-[34px] rounded-[6px] bg-[#6259CA]/14 border border-[#6259CA]/20 flex items-center justify-center shrink-0 text-[#6259CA] font-bold text-sm">
        {getInitial(element.title)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div
          className="font-semibold text-white truncate"
          style={{ fontSize: '0.82rem' }}
        >
          {element.title}
        </div>
        {categoryDisplay && (
          <div
            className="flex items-center gap-1 font-medium text-[#5f5a8a] mt-0.5"
            style={{ fontSize: '0.62rem', letterSpacing: '0.05em' }}
          >
            <span className="w-[5px] h-[5px] rounded-full bg-[#2BD1C7] shrink-0" />
            {categoryDisplay}
          </div>
        )}
      </div>

      {/* Meta — heures + coût */}
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span className="font-mono font-bold text-white" style={{ fontSize: '0.78rem' }}>
          {hours}
        </span>
        <span className="font-mono text-[#9690C4]" style={{ fontSize: '0.68rem' }}>
          {price}
        </span>
      </div>
    </div>
  );
}

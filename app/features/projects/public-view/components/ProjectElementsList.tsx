'use client';

import { useLocale } from '@/app/lib/locale-context';
import { ProjectElementCard } from './ProjectElementCard';
import { SectionEmptyState } from './SectionEmptyState';
import type { Currency, ProjectElement } from '@/app/types/models';

function ElementsIllustration() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      {/* Scissors handle 1 */}
      <circle cx="11" cy="18" r="5.5" stroke="#9690C4" strokeWidth="1.5" />
      {/* Scissors handle 2 */}
      <circle cx="11" cy="34" r="5.5" stroke="#9690C4" strokeWidth="1.5" />
      {/* Top blade */}
      <path d="M15.5 14.2 L43 5" stroke="#9690C4" strokeWidth="1.5" strokeLinecap="round" />
      {/* Bottom blade */}
      <path d="M15.5 37.8 L43 47" stroke="#9690C4" strokeWidth="1.5" strokeLinecap="round" />
      {/* Center rivet */}
      <circle cx="23" cy="26" r="1.8" fill="#6259CA" opacity="0.9" />
      {/* Thread spool body */}
      <rect x="32" y="22" width="14" height="8" rx="2.5" fill="rgba(98,89,202,0.12)" stroke="#6259CA" strokeWidth="1.4" />
      {/* Spool flanges */}
      <rect x="31" y="21" width="1.8" height="10" rx="0.9" fill="#6259CA" opacity="0.8" />
      <rect x="46.2" y="21" width="1.8" height="10" rx="0.9" fill="#6259CA" opacity="0.8" />
      {/* Thread tail */}
      <path d="M39 22 C36.5 18 41 15 39 11" stroke="#9690C4" strokeWidth="1.1" strokeLinecap="round" />
      {/* Star sparkle top-left */}
      <path d="M5 5 L5.6 7.2 L7.8 7.2 L6.1 8.6 L6.7 10.8 L5 9.4 L3.3 10.8 L3.9 8.6 L2.2 7.2 L4.4 7.2 Z" fill="#6259CA" opacity="0.45" />
      {/* Dot accent bottom-right */}
      <circle cx="48" cy="45" r="1.4" fill="#9690C4" opacity="0.3" />
    </svg>
  );
}

interface ProjectElementsListProps {
  elements: ProjectElement[];
  currency: Currency | null;
}

export function ProjectElementsList({ elements, currency }: ProjectElementsListProps) {
  const { t } = useLocale();

  return (
    <section className="mb-12">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <h2
          className="font-bold text-white"
          style={{ fontSize: '1.1rem', letterSpacing: '-0.025em' }}
        >
          {t.project.elements.sectionTitle}
        </h2>
        <span
          className="font-mono text-[#9690C4]"
          style={{ fontSize: '0.68rem' }}
        >
          {elements.length}
        </span>
      </div>

      {/* Elements grid */}
      {elements.length === 0 ? (
        <SectionEmptyState
          illustration={<ElementsIllustration />}
          message={t.project.elements.empty}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[0.625rem]">
          {elements.map((element) => (
            <ProjectElementCard key={element.id} element={element} currency={currency} />
          ))}
        </div>
      )}
    </section>
  );
}

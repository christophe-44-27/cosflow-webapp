'use client';

import { useLocale } from '@/app/lib/locale-context';
import { ProjectElementCard } from './ProjectElementCard';
import type { ProjectElement } from '@/app/types/models';

interface ProjectElementsListProps {
  elements: ProjectElement[];
}

export function ProjectElementsList({ elements }: ProjectElementsListProps) {
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
        <p className="text-sm text-white/40 py-6 text-center">
          {t.project.elements.empty}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[0.625rem]">
          {elements.map((element) => (
            <ProjectElementCard key={element.id} element={element} />
          ))}
        </div>
      )}
    </section>
  );
}

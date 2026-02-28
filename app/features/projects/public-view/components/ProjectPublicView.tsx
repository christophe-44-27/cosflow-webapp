'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/app/lib/locale-context';
import { projectService } from '@/app/lib/services';
import type { ProjectDetail } from '@/app/types/models';
import { ProjectCoverImage } from './ProjectCoverImage';
import { ProjectStatsBar } from './ProjectStatsBar';
import { ProjectElementsList } from './ProjectElementsList';
import { ProjectGallery } from './ProjectGallery';
import { ProjectSidebar } from './ProjectSidebar';

interface ProjectPublicViewProps {
  slug: string;
  initialData?: ProjectDetail | null;
  isPreview?: boolean;
}

/**
 * Vue publique d'un projet — Direction D1 "Split Editorial"
 *
 * Structure (de haut en bas) :
 *  1. ProjectCoverImage  — hero h-[50vh] full-width + gradient overlay + titre + maker chip
 *  2. ProjectStatsBar    — full-width bg-[#6259CA] · heures · éléments · budget
 *  3. Split grid 65/35   — colonne principale (gauche) + sidebar sticky (droite)
 *     • Colonne principale (65%) : éléments (Story 2.3) + galerie (Story 2.4)
 *     • Sidebar (35%)           : like + Ko-fi + share + MakerCard (Story 2.5)
 */
export function ProjectPublicView({ slug, initialData, isPreview = false }: ProjectPublicViewProps) {
  const { t } = useLocale();
  const [project, setProject] = useState<ProjectDetail | null>(initialData ?? null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) return;
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError(null);
        let data: ProjectDetail;
        if (isPreview) {
          // Mode preview : l'owner consulte son projet privé → endpoint authentifié
          const res = await fetch(`/api/projects/${slug}`);
          if (!res.ok) throw new Error(`${res.status}`);
          const json = await res.json();
          data = json.data ?? json;
        } else {
          const response = await projectService.getProject(slug);
          data = response.data;
        }
        setProject(data);
      } catch (err) {
        setError(t.projectDetail.errorLoadingProject);
        console.error('Error fetching project:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [slug, t, initialData, isPreview]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-[50vh] bg-white/5" />
        <div className="h-20 bg-[#6259CA]/30" />
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-8">
          <div className="space-y-4">
            <div className="h-8 bg-white/5 rounded w-1/3" />
            <div className="h-14 bg-white/5 rounded" />
            <div className="h-14 bg-white/5 rounded" />
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 text-red-500 text-center">
          {error || t.projectDetail.projectNotFound}
        </div>
      </div>
    );
  }

  const makerProfile = project.user.profile;
  const currency = makerProfile.currency;

  return (
    <article>
      <ProjectCoverImage
        coverUrl={project.cover_url ?? null}
        thumbnailUrl={project.image_url || null}
        projectTitle={project.title}
        fandomName={project.fandom?.name}
        originName={project.origin?.name}
        makerName={makerProfile.name}
        makerAvatar={makerProfile.has_avatar ? makerProfile.avatar : undefined}
      />
      <ProjectStatsBar
        totalWorkingTime={project.total_project_working_time}
        elementsCount={project.elements.length}
        estimatedPrice={project.project_estimated_price}
        currency={currency}
      />
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 mt-8 pb-16 grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-8 items-start">
        <main>
          <ProjectElementsList elements={project.elements} currency={currency} />
          <ProjectGallery photoReferences={project.photoReferences} />
        </main>
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <ProjectSidebar project={project} />
        </aside>
      </div>
    </article>
  );
}

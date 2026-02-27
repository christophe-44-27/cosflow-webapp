'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/app/lib/locale-context';
import { ProjectOwnerView } from '@/app/components/project-owner-view';
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
export function ProjectPublicView({ slug, initialData }: ProjectPublicViewProps) {
  const { t } = useLocale();
  const [isOwnerView, setIsOwnerView] = useState(false);
  const [project, setProject] = useState<ProjectDetail | null>(initialData ?? null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  // Routing owner côté client uniquement pour préserver l'ISR
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsOwnerView(params.get('owner') === 'true');
  }, []);

  // Fallback fetch côté client si le SSR n'a pas pu charger les données
  useEffect(() => {
    if (initialData) return;
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await projectService.getProject(slug);
        setProject(response.data);
      } catch (err) {
        setError(t.projectDetail.errorLoadingProject);
        console.error('Error fetching project:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [slug, t, initialData]);

  if (isOwnerView) {
    return <ProjectOwnerView slug={slug} />;
  }

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

  return (
    <article>
      <ProjectCoverImage
        imageUrl={project.image_url || null}
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
      />
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 mt-8 pb-16 grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-8 items-start">
        <main>
          <ProjectElementsList elements={project.elements} />
          <ProjectGallery photoReferences={project.photoReferences} />
        </main>
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <ProjectSidebar project={project} />
        </aside>
      </div>
    </article>
  );
}

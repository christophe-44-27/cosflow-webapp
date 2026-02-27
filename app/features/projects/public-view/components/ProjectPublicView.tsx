'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/app/lib/locale-context';
import { ProjectOwnerView } from '@/app/components/project-owner-view';
import { ProjectDetailView } from '@/app/components/project-detail-view';
import { projectService } from '@/app/lib/services';
import type { ProjectDetail } from '@/app/types/models';

interface ProjectPublicViewProps {
  slug: string;
  initialData?: ProjectDetail | null;
}

/**
 * Vue publique d'un projet — Direction B "Maker Pride"
 *
 * Structure cible (de haut en bas) :
 *  1. ProjectCoverImage  — cover 16:9 + gradient overlay + maker chip + titre  (Story 2.2)
 *  2. ProjectStatsBar    — 3 colonnes fond primary : heures · éléments · budget  (Story 2.2)
 *  3. ProjectActionsRow  — like + share                                           (Story 2.5)
 *  4. ProjectElementsList / ProjectElementCard                                    (Story 2.3)
 *  5. ProjectGallery     — galerie références 2 col mobile / 3 col desktop        (Story 2.4)
 *  6. MakerCard          — profil maker + lien Ko-fi/Patreon                      (Story 2.5)
 *
 * Scaffold Story 2.1 : délègue à ProjectDetailView pour préserver le rendu
 * existant. Les sections ci-dessus remplaceront progressivement ce contenu
 * dans les Stories 2.2 à 2.5.
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
    if (initialData) {
      return;
    }
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
      <div className="flex-1">
        <div className="py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-white/5 rounded-2xl" />
            <div className="h-8 bg-white/5 rounded w-1/2" />
            <div className="h-4 bg-white/5 rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex-1">
        <div className="py-8">
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 text-red-500 text-center">
            {error || t.projectDetail.projectNotFound}
          </div>
        </div>
      </div>
    );
  }

  // TODO Story 2.2 : remplacer par <ProjectCoverImage /> + <ProjectStatsBar />
  // TODO Story 2.3 : remplacer par <ProjectElementsList />
  // TODO Story 2.4 : remplacer par <ProjectGallery />
  // TODO Story 2.5 : remplacer par <ProjectActionsRow /> + <MakerCard />
  return <ProjectDetailView slug={slug} initialData={project} />;
}

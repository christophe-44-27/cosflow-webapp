'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/app/lib/locale-context';
import { Header } from '@/app/components/header';
import { ChevronDown, ChevronUp, Settings, Camera, Clock, ListChecks, AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import {
  useProjectData,
  useProjectBudget,
  useProjectElements,
  useTimeEntries,
  useProjectInfo
} from '@/app/features/projects/owner-view';
import { SectionsState } from '@/app/features/projects/owner-view';
import {
  ProjectStatsBar,
  ProjectInfoSection,
  ProjectElementsSection,
  TimeTrackingSection,
  ProjectGallerySection
} from '@/app/features/projects/owner-view';

interface ProjectOwnerViewProps {
  slug: string;
}

export function ProjectOwnerView({ slug }: ProjectOwnerViewProps) {
  const { t, locale } = useLocale();

  // Sections collapse state
  const [sectionsOpen, setSectionsOpen] = useState<SectionsState>({
    info: true,
    elements: true,
    time: true,
    gallery: false,
  });

  // Data hooks
  const {
    project,
    elements,
    categories,
    timeEntries,
    isLoading,
    error,
    refetch,
    setElements,
    setTimeEntries,
  } = useProjectData(slug, locale);

  // Budget calculations
  const budgetData = useProjectBudget(project, elements);

  // Project info management
  const projectInfo = useProjectInfo({ project, slug, onRefetch: refetch });

  // Elements management
  const elementsManager = useProjectElements({
    slug,
    onRefetch: refetch,
    setElements,
  });

  // Time entries management
  const timeManager = useTimeEntries({
    projectId: project?.id,
    onRefetch: refetch,
    setTimeEntries,
  });

  // Initialize edited project when project loads
  useEffect(() => {
    if (project) {
      projectInfo.initEditedProject(project);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  const toggleSection = (section: keyof SectionsState) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-400">{error || 'Projet introuvable'}</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Header title={project.title} />

      <div className="p-8 space-y-6">
        {/* === Section: Informations du projet === */}
        <div className="bg-secondary border border-white/10 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('info')}
            className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="text-white text-lg font-bold">{t.projectInfo.title}</h2>
            </div>
            {sectionsOpen.info ? <ChevronUp className="w-5 h-5 text-white/60" /> : <ChevronDown className="w-5 h-5 text-white/60" />}
          </button>

          {sectionsOpen.info && (
            <div className="p-6 pt-0 space-y-4">
              <ProjectInfoSection
                project={project}
                projectInfo={projectInfo}
                t={t}
                locale={locale}
              />
              <ProjectStatsBar
                project={project}
                locale={locale}
                {...budgetData}
                t={t}
              />
            </div>
          )}
        </div>

        {/* === Section: Éléments === */}
        <div className="bg-secondary border border-white/10 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('elements')}
            className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ListChecks className="w-5 h-5 text-blue-400" />
              <h2 className="text-white text-lg font-bold">{t.projectElements.title}</h2>
              <span className="bg-white/10 text-white/60 text-sm px-2 py-0.5 rounded-full">
                {elements.length}
              </span>
            </div>
            {sectionsOpen.elements ? <ChevronUp className="w-5 h-5 text-white/60" /> : <ChevronDown className="w-5 h-5 text-white/60" />}
          </button>

          {sectionsOpen.elements && (
            <div className="p-6 pt-0">
              <ProjectElementsSection
                elements={elements}
                categories={categories}
                elementsManager={elementsManager}
                t={t}
              />
            </div>
          )}
        </div>

        {/* === Section: Time Tracking === */}
        <div className="bg-secondary border border-white/10 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('time')}
            className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-400" />
              <h2 className="text-white text-lg font-bold">{t.timeManagement.title}</h2>
              <span className="bg-white/10 text-white/60 text-sm px-2 py-0.5 rounded-full">
                {timeEntries.length}
              </span>
            </div>
            {sectionsOpen.time ? <ChevronUp className="w-5 h-5 text-white/60" /> : <ChevronDown className="w-5 h-5 text-white/60" />}
          </button>

          {sectionsOpen.time && (
            <div className="p-6 pt-0">
              <TimeTrackingSection
                timeEntries={timeEntries}
                elements={elements}
                timeManager={timeManager}
                t={t}
              />
            </div>
          )}
        </div>

        {/* === Section: Galerie === */}
        <div className="bg-secondary border border-white/10 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('gallery')}
            className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-green-400" />
              <h2 className="text-white text-lg font-bold">Galerie</h2>
              <span className="bg-white/10 text-white/60 text-sm px-2 py-0.5 rounded-full">
                {project.photos.length + project.photoReferences.length + project.photoshoots.length}
              </span>
            </div>
            {sectionsOpen.gallery ? <ChevronUp className="w-5 h-5 text-white/60" /> : <ChevronDown className="w-5 h-5 text-white/60" />}
          </button>

          {sectionsOpen.gallery && (
            <div className="p-6 pt-0">
              <ProjectGallerySection project={project} />
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {projectInfo.showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => projectInfo.setShowDeleteConfirm(false)} />
          <div className="relative bg-secondary border border-white/10 rounded-2xl p-6 max-w-md">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <h3 className="text-white font-bold mb-2">{t.projectEdit.deleteConfirmTitle}</h3>
                <p className="text-white/60 text-sm mb-4">{t.projectEdit.deleteConfirmDesc}</p>
                <div className="flex gap-3">
                  <button
                    onClick={projectInfo.handleDeleteProject}
                    disabled={projectInfo.isDeleting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    {projectInfo.isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    {t.projectEdit.confirmDelete}
                  </button>
                  <button onClick={() => projectInfo.setShowDeleteConfirm(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg">
                    {t.projectEdit.cancelDelete}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


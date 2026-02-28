'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Loader2, Pencil, Trash2, CheckCircle2, Clock, Layers, Wallet, CalendarDays } from 'lucide-react';
import { useLocale } from '@/app/lib/locale-context';
import { PublicVisibilityToggle } from './PublicVisibilityToggle';
import type { ProjectDetail } from '@/app/types/models/project';
import type { ProjectElement } from '@/app/types/models/project-element';
import type { Translations } from '@/app/lib/locales/fr';

interface SidebarStatRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function SidebarStatRow({ icon: Icon, label, value }: SidebarStatRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-0">
      <span className="flex items-center gap-2 text-xs text-white/40">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      <span className="text-xs font-semibold text-white/80">{value}</span>
    </div>
  );
}

interface ProjectOwnerSidebarProps {
  project: ProjectDetail;
  slug: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  budgetData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projectInfo: any;
  elements: ProjectElement[];
  t: Translations;
  onRefetch: () => Promise<void>;
  onEditClick: () => void;
}

export function ProjectOwnerSidebar({
  project,
  slug,
  budgetData,
  projectInfo,
  elements,
  t,
  onRefetch,
  onEditClick,
}: ProjectOwnerSidebarProps) {
  const { locale } = useLocale();
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  const canMarkComplete = budgetData.progression === 100 && project.status !== 'completed';

  const handleMarkComplete = async () => {
    setIsMarkingComplete(true);
    try {
      const formData = new FormData();
      formData.append('status', 'completed');
      formData.append('_method', 'PUT');
      await fetch(`/api/projects/${slug}`, { method: 'POST', body: formData });
      await onRefetch();
    } catch (err) {
      console.error(err);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const statusMap: Record<string, { label: string; cls: string }> = {
    draft:       { label: t.projectEdit.status.draft,      cls: 'bg-white/10 text-white/50' },
    in_progress: { label: t.projectEdit.status.inProgress, cls: 'bg-blue-500/20 text-blue-300' },
    completed:   { label: t.projectEdit.status.completed,  cls: 'bg-green-500/20 text-green-300' },
    on_hold:     { label: t.projectEdit.status.onHold,     cls: 'bg-orange-500/20 text-orange-300' },
  };
  const { label: statusLabel, cls: statusCls } = statusMap[project.status] ?? { label: project.status, cls: 'bg-white/10 text-white/50' };

  const endDateDisplay = project.estimated_end_date
    ? new Date(project.estimated_end_date).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })
    : t.studioProject.sidebar.noEndDate;

  return (
    <div className="flex flex-col gap-3">

      {/* ── Informations ── */}
      <div className="bg-secondary border border-white/10 rounded-2xl p-4">
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3">
          {t.studioProject.sidebar.infoCard}
        </p>
        <div className="flex gap-3 items-start mb-3">
          <div className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden border border-white/10 bg-primary/20 relative">
            {project.image_url && (
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                className="object-cover"
                sizes="56px"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white leading-tight mb-1.5 line-clamp-2">
              {project.title}
            </p>
            {project.description && (
              <p className="text-xs text-white/40 line-clamp-2 mb-2">{project.description}</p>
            )}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${statusCls}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
              {statusLabel}
            </span>
          </div>
        </div>
        <hr className="border-white/[0.08] mb-3" />
        <button
          onClick={onEditClick}
          className="w-full flex items-center justify-center gap-2 py-2 bg-white/[0.06] hover:bg-white/[0.12] text-white rounded-xl text-sm transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          {t.studioProject.sidebar.editButton}
        </button>
      </div>

      {/* ── Statistiques ── */}
      <div className="bg-secondary border border-white/10 rounded-2xl p-4">
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">
          {t.studioProject.sidebar.statsCard}
        </p>
        <SidebarStatRow
          icon={Clock}
          label={t.studioProject.sidebar.totalTime}
          value={project.total_project_working_time || '—'}
        />
        <SidebarStatRow
          icon={Layers}
          label={t.studioProject.sidebar.elementsCount}
          value={String(elements.length)}
        />
        <SidebarStatRow
          icon={Wallet}
          label={t.studioProject.sidebar.actualBudget}
          value={budgetData.actualBudget > 0 ? `${budgetData.actualBudget.toFixed(0)}€` : '—'}
        />
        <SidebarStatRow
          icon={CalendarDays}
          label={t.studioProject.sidebar.endDate}
          value={endDateDisplay}
        />
      </div>

      {/* ── Visibilité ── */}
      <div className="bg-secondary border border-white/10 rounded-2xl p-4">
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3">
          {t.studioProject.sidebar.visibilityCard}
        </p>
        <PublicVisibilityToggle slug={slug} initialIsPrivate={project.is_private} />
        {!project.is_private && project.likes_count > 0 && (
          <p className="text-xs text-white/30 mt-2">
            ♥ {project.likes_count} {t.project.sidebar.likesLabel}
          </p>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="bg-secondary border border-white/10 rounded-2xl p-4">
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3">
          {t.studioProject.sidebar.actionsCard}
        </p>
        <div className="flex flex-col gap-2">
          {canMarkComplete && (
            <button
              onClick={handleMarkComplete}
              disabled={isMarkingComplete}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/25 text-green-400 rounded-xl text-sm transition-colors disabled:opacity-60"
            >
              {isMarkingComplete
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <CheckCircle2 className="w-4 h-4" />
              }
              {t.studioProject.sidebar.markComplete}
            </button>
          )}
          <button
            onClick={() => projectInfo.setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/[0.08] hover:bg-red-500/15 border border-red-500/20 text-red-400 rounded-xl text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {t.projectEdit.deleteProject}
          </button>
        </div>
      </div>

    </div>
  );
}

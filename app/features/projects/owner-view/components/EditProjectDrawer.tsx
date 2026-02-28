'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useLocale } from '@/app/lib/locale-context';
import { ThumbnailCropModal } from './ThumbnailCropModal';
import type { ProjectDetail } from '@/app/types/models/project';

interface EditProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectDetail;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projectInfo: any;
}

export function EditProjectDrawer({ isOpen, onClose, project, projectInfo }: EditProjectDrawerProps) {
  const { t } = useLocale();
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [rawThumbnailSrc, setRawThumbnailSrc] = useState<string | null>(null);
  const [titleError, setTitleError] = useState(false);

  const { editedProject, setEditedProject, isSaving, handleSaveProjectInfo, handleThumbnailUpload } = projectInfo;

  // Fermer sur Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!editedProject.title?.trim()) {
      setTitleError(true);
      return;
    }
    setTitleError(false);
    await handleSaveProjectInfo();
    onClose();
  };

  const field = (key: string, value: string) =>
    setEditedProject((p: Partial<ProjectDetail>) => ({ ...p, [key]: value }));

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel slide-in depuis la droite */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-[#1a1634] border-l border-white/[0.08] z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] flex-shrink-0">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white">{t.projectEdit.title}</h2>
            <p className="text-xs text-white/40 mt-0.5 truncate">{project.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/[0.08] transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

          {/* ── Miniature ── */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">
              🖼 {t.studioProject.drawer.thumbnailSection}
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="w-[72px] h-[72px] rounded-xl bg-white/[0.05] border-2 border-dashed border-white/15 hover:border-primary/50 flex-shrink-0 overflow-hidden cursor-pointer transition-colors relative"
              >
                {project.image_url ? (
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                ) : (
                  <span className="text-2xl">🖼</span>
                )}
              </button>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setRawThumbnailSrc(reader.result as string);
                  reader.readAsDataURL(file);
                  e.target.value = '';
                }}
              />
              <p className="text-xs text-white/40 leading-relaxed">
                {t.studioProject.drawer.thumbnailHint}
              </p>
            </div>
          </div>

          <hr className="border-white/[0.08]" />

          {/* ── Informations ── */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">
              📋 {t.studioProject.drawer.infoSection}
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-white/50 mb-1.5 block font-semibold">
                  {t.projectEdit.titleLabel} *
                </label>
                <input
                  type="text"
                  value={editedProject.title || ''}
                  onChange={e => { field('title', e.target.value); setTitleError(false); }}
                  className={`w-full px-4 py-2.5 bg-white/[0.05] rounded-xl text-white text-sm outline-none border transition-colors ${
                    titleError
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/10 focus:border-primary/50'
                  }`}
                />
                {titleError && (
                  <p className="text-red-400 text-xs mt-1">{t.studioProject.drawer.titleRequired}</p>
                )}
              </div>
              <div>
                <label className="text-[11px] text-white/50 mb-1.5 block font-semibold">
                  {t.projectEdit.descriptionLabel}
                </label>
                <textarea
                  value={editedProject.description || ''}
                  onChange={e => field('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/10 focus:border-primary/50 rounded-xl text-white text-sm outline-none resize-none transition-colors"
                />
              </div>
            </div>
          </div>

          <hr className="border-white/[0.08]" />

          {/* ── Planning ── */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">
              📅 {t.studioProject.drawer.planningSection}
            </p>
            <div className="mb-3">
              <label className="text-[11px] text-white/50 mb-1.5 block font-semibold">
                {t.projectEdit.statusLabel}
              </label>
              <select
                value={editedProject.status || ''}
                onChange={e => field('status', e.target.value)}
                className="w-full px-3 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="draft" className="bg-[#1E1A40]">📝 {t.projectEdit.status.draft}</option>
                <option value="in_progress" className="bg-[#1E1A40]">🔵 {t.projectEdit.status.inProgress}</option>
                <option value="completed" className="bg-[#1E1A40]">✅ {t.projectEdit.status.completed}</option>
                <option value="on_hold" className="bg-[#1E1A40]">⏸ {t.projectEdit.status.onHold}</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-white/50 mb-1.5 block font-semibold">
                {t.projectEdit.estimatedEndDateLabel}
              </label>
              <input
                type="date"
                value={editedProject.estimated_end_date || ''}
                onChange={e => field('estimated_end_date', e.target.value)}
                className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/10 focus:border-primary/50 rounded-xl text-white text-sm outline-none transition-colors"
              />
            </div>
          </div>

          <hr className="border-white/[0.08]" />

          {/* ── Budget ── */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">
              💰 {t.studioProject.drawer.budgetSection}
            </p>
            <div>
              <label className="text-[11px] text-white/50 mb-1.5 block font-semibold">
                {t.studioProject.drawer.budgetLabel}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editedProject.project_estimated_price || ''}
                onChange={e => field('project_estimated_price', e.target.value)}
                placeholder="0,00"
                className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/10 focus:border-primary/50 rounded-xl text-white text-sm outline-none transition-colors"
              />
              <p className="text-xs text-white/30 mt-2">{t.studioProject.drawer.budgetHint}</p>
            </div>
          </div>

        </div>

        {/* Footer sticky */}
        <div className="flex gap-3 px-5 py-4 border-t border-white/[0.08] flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-white/[0.08] hover:bg-white/15 text-white rounded-xl text-sm transition-colors"
          >
            {t.common.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-[2] flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm transition-colors disabled:opacity-60"
          >
            {isSaving
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Save className="w-4 h-4" />
            }
            {isSaving ? t.studioProject.drawer.saving : t.common.save}
          </button>
        </div>
      </div>

      {/* Crop modal miniature */}
      {rawThumbnailSrc && (
        <ThumbnailCropModal
          imageSrc={rawThumbnailSrc}
          onConfirm={async (blob) => {
            await handleThumbnailUpload(blob);
            setRawThumbnailSrc(null);
          }}
          onCancel={() => setRawThumbnailSrc(null)}
        />
      )}
    </>
  );
}

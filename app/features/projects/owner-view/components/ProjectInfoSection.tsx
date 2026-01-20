'use client';

import { Upload, Eye, EyeOff, Settings, Loader2, Save, Trash2 } from 'lucide-react';
import { ProjectDetail } from '@/app/lib/types';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface ProjectInfoSectionProps {
  project: ProjectDetail;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projectInfo: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  locale: string;
}

export function ProjectInfoSection({
  project,
  projectInfo,
  t,
  locale
}: ProjectInfoSectionProps) {
  const {
    isEditingInfo,
    setIsEditingInfo,
    editedProject,
    setEditedProject,
    isSaving,
    setShowDeleteConfirm,
    fileInputRef,
    handleSaveProjectInfo,
    handleImageUpload,
  } = projectInfo;

  return (
    <div className="flex gap-6">
      {/* Image */}
      <div className="w-32 h-32 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 relative group">
        <ImageWithFallback src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <Upload className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 space-y-4">
        {isEditingInfo ? (
          <>
            <input
              type="text"
              value={editedProject.title || ''}
              onChange={e => setEditedProject((prev: ProjectDetail) => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              placeholder={t.projectInfo.placeholder_title}
            />
            <textarea
              value={editedProject.description || ''}
              onChange={e => setEditedProject((prev: ProjectDetail) => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
              rows={2}
              placeholder={t.projectInfo.placeholder_description}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/50 text-xs mb-1 block">{t.projectInfo.estimated_budget}</label>
                <input
                  type="number"
                  step="0.01"
                  value={editedProject.project_estimated_price || ''}
                  onChange={e => setEditedProject((prev: ProjectDetail) => ({ ...prev, project_estimated_price: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">{t.projectInfo.estimated_end_date}</label>
                <input
                  type="date"
                  value={editedProject.estimated_end_date || ''}
                  onChange={e => setEditedProject((prev: ProjectDetail) => ({ ...prev, estimated_end_date: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <select
                value={editedProject.status || ''}
                onChange={e => setEditedProject((prev: ProjectDetail) => ({ ...prev, status: e.target.value }))}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="draft" className="bg-secondary">{t.projectEdit.status.draft}</option>
                <option value="in_progress" className="bg-secondary">{t.projectEdit.status.inProgress}</option>
                <option value="completed" className="bg-secondary">{t.projectEdit.status.completed}</option>
                <option value="on_hold" className="bg-secondary">{t.projectEdit.status.onHold}</option>
              </select>
              <select
                value={editedProject.priority || ''}
                onChange={e => setEditedProject((prev: ProjectDetail) => ({ ...prev, priority: e.target.value }))}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="low" className="bg-secondary">{t.projectEdit.priority.low}</option>
                <option value="medium" className="bg-secondary">{t.projectEdit.priority.medium}</option>
                <option value="high" className="bg-secondary">{t.projectEdit.priority.high}</option>
              </select>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editedProject.is_private || false}
                    onChange={e => setEditedProject((prev: ProjectDetail) => ({ ...prev, is_private: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-white/20 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4 relative"></div>
                  {editedProject.is_private ? <EyeOff className="w-4 h-4 text-white/60" /> : <Eye className="w-4 h-4 text-green-400" />}
                </label>
              </div>
            </div>
            {/* Actions */}
            <div className="flex justify-between pt-4 border-t border-white/10">
              <div className="flex gap-2">
                <button onClick={handleSaveProjectInfo} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Enregistrer
                </button>
                <button onClick={() => {
                  setIsEditingInfo(false);
                  if (project) {
                    projectInfo.initEditedProject(project);
                  }
                }} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg">
                  Annuler
                </button>
              </div>
              <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                <Trash2 className="w-4 h-4" />
                {t.common.delete}
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-white text-xl font-bold">{project.title}</h3>
            <p className="text-white/60 text-sm">{project.description || t.projectInfo.no_description}</p>
            <div className="flex gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-lg text-sm ${project.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {project.status}
              </span>
              <span className="px-3 py-1 rounded-lg text-sm bg-white/10 text-white/70">{project.priority}</span>
              {project.is_private ? (
                <span className="px-3 py-1 rounded-lg text-sm bg-white/10 text-white/70 flex items-center gap-1">
                  <EyeOff className="w-3 h-3" /> {t.projectInfo.visibility_private}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg text-sm bg-green-500/20 text-green-400 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {t.projectInfo.visibility_public}
                </span>
              )}
            </div>
            {/* Actions */}
            <div className="flex justify-between pt-4 border-t border-white/10">
              <button onClick={() => setIsEditingInfo(true)} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg">
                <Settings className="w-4 h-4" />
                {t.common.edit}
              </button>
              <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                <Trash2 className="w-4 h-4" />
                {t.common.delete}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


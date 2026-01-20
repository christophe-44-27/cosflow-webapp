'use client';

import { useState, useRef } from 'react';
import { ProjectDetail } from '@/app/lib/types';
import { useRouter } from 'next/navigation';

interface UseProjectInfoProps {
  project: ProjectDetail | null;
  slug: string;
  onRefetch: () => Promise<void>;
}

export function useProjectInfo({ project, slug, onRefetch }: UseProjectInfoProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editedProject, setEditedProject] = useState<Partial<ProjectDetail>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initEditedProject = (projectData: ProjectDetail) => {
    setEditedProject({
      title: projectData.title,
      description: projectData.description,
      priority: projectData.priority,
      is_private: projectData.is_private,
      category_id: projectData.category_id,
      fandom_id: projectData.fandom_id,
      project_estimated_price: projectData.project_estimated_price,
      estimated_end_date: projectData.estimated_end_date,
      status: projectData.status,
    });
  };

  const handleSaveProjectInfo = async () => {
    if (!project) return;
    setIsSaving(true);
    try {
      const formData = new FormData();
      const excludedFields = ['created_at', 'updated_at', 'id', 'user_id', 'slug'];

      Object.entries(editedProject).forEach(([key, value]) => {
        if (value !== undefined && value !== null && !excludedFields.includes(key)) {
          formData.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
        }
      });

      formData.append('_method', 'PUT');

      const res = await fetch(`/api/projects/${slug}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to save');

      await onRefetch();
      setIsEditingInfo(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`/api/projects/${slug}/images`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        await onRefetch();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/projects');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isEditingInfo,
    setIsEditingInfo,
    editedProject,
    setEditedProject,
    isSaving,
    showDeleteConfirm,
    setShowDeleteConfirm,
    isDeleting,
    fileInputRef,
    handleSaveProjectInfo,
    handleImageUpload,
    handleDeleteProject,
    initEditedProject,
  };
}


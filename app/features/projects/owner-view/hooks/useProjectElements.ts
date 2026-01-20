'use client';

import { useState } from 'react';
import { ProjectElement } from '../types';

interface UseProjectElementsProps {
  slug: string;
  onRefetch: () => Promise<void>;
  setElements: React.Dispatch<React.SetStateAction<ProjectElement[]>>;
}

export function useProjectElements({ slug, onRefetch, setElements }: UseProjectElementsProps) {
  const [newElementTitle, setNewElementTitle] = useState('');
  const [newElementType, setNewElementType] = useState<'buy' | 'make' | 'task'>('buy');
  const [newElementPrice, setNewElementPrice] = useState('');
  const [newElementCategoryId, setNewElementCategoryId] = useState('');
  const [newElementParentId, setNewElementParentId] = useState('');
  const [isAddingElement, setIsAddingElement] = useState(false);
  const [showAdvancedElementForm, setShowAdvancedElementForm] = useState(false);
  const [editingElementId, setEditingElementId] = useState<number | null>(null);

  const handleAddElement = async () => {
    if (!newElementTitle.trim()) return;
    setIsAddingElement(true);
    try {
      const payload: {
        title: string;
        type: string;
        price?: number;
        category_id?: number;
        parent_id?: number;
      } = {
        title: newElementTitle,
        type: newElementType,
      };

      if (newElementPrice) {
        payload.price = parseFloat(newElementPrice);
      }
      if (newElementCategoryId) {
        payload.category_id = parseInt(newElementCategoryId);
      }
      if (newElementParentId) {
        payload.parent_id = parseInt(newElementParentId);
      }

      const res = await fetch(`/api/projects/${slug}/elements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        resetForm();
        await onRefetch();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingElement(false);
    }
  };

  const handleToggleElementDone = async (element: ProjectElement) => {
    try {
      const res = await fetch(`/api/projects/${slug}/elements/${element.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_done: !element.is_done }),
      });
      if (res.ok) {
        setElements(prev => prev.map(el =>
          el.id === element.id ? { ...el, is_done: !el.is_done } : el
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteElement = async (elementId: number) => {
    try {
      const res = await fetch(`/api/projects/${slug}/elements/${elementId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setElements(prev => prev.filter(el => el.id !== elementId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setNewElementTitle('');
    setNewElementPrice('');
    setNewElementCategoryId('');
    setNewElementParentId('');
    setShowAdvancedElementForm(false);
  };

  return {
    newElementTitle,
    setNewElementTitle,
    newElementType,
    setNewElementType,
    newElementPrice,
    setNewElementPrice,
    newElementCategoryId,
    setNewElementCategoryId,
    newElementParentId,
    setNewElementParentId,
    isAddingElement,
    showAdvancedElementForm,
    setShowAdvancedElementForm,
    editingElementId,
    setEditingElementId,
    handleAddElement,
    handleToggleElementDone,
    handleDeleteElement,
    resetForm,
  };
}


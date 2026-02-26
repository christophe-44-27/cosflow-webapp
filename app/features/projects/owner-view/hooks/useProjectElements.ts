'use client';

import { useState } from 'react';
import { ProjectElement, ElementCategory } from '../types';

interface UseProjectElementsProps {
  slug: string;
  onRefetch: () => Promise<void>;
  setElements: React.Dispatch<React.SetStateAction<ProjectElement[]>>;
  setCategories: React.Dispatch<React.SetStateAction<ElementCategory[]>>;
}

export function useProjectElements({ slug, onRefetch, setElements, setCategories }: UseProjectElementsProps) {
  // Form state
  const [newElementTitle, setNewElementTitle] = useState('');
  const [newElementType, setNewElementType] = useState<'buy' | 'make' | 'task'>('buy');
  const [newElementPrice, setNewElementPrice] = useState('');
  const [newElementCategoryId, setNewElementCategoryId] = useState('');
  const [newElementParentId, setNewElementParentId] = useState('');
  const [isAddingElement, setIsAddingElement] = useState(false);

  // Modal state
  const [showElementModal, setShowElementModal] = useState(false);
  const [editingElement, setEditingElement] = useState<ProjectElement | null>(null);

  // Category management state
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const resetForm = () => {
    setNewElementTitle('');
    setNewElementPrice('');
    setNewElementCategoryId('');
    setNewElementParentId('');
    setNewElementType('buy');
  };

  const openAddModal = (parentId?: number | null) => {
    setEditingElement(null);
    resetForm();
    if (parentId) setNewElementParentId(String(parentId));
    setShowElementModal(true);
  };

  const openEditModal = (element: ProjectElement) => {
    setEditingElement(element);
    setNewElementTitle(element.title);
    setNewElementType(element.type as 'buy' | 'make' | 'task');
    setNewElementPrice(element.price !== null && element.price !== undefined ? String(element.price) : '');
    setNewElementCategoryId(element.category_id ? String(element.category_id) : '');
    setNewElementParentId(element.parent_id ? String(element.parent_id) : '');
    setShowAddCategory(false);
    setNewCategoryName('');
    setShowElementModal(true);
  };

  const closeModal = () => {
    setShowElementModal(false);
    setEditingElement(null);
    setShowAddCategory(false);
    setNewCategoryName('');
    resetForm();
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsAddingCategory(true);
    try {
      const res = await fetch('/api/project_element_categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (res.ok) {
        const data = await res.json();
        const created: ElementCategory = data.data || data;
        setCategories(prev => [...prev, created]);
        setNewElementCategoryId(String(created.id));
        setNewCategoryName('');
        setShowAddCategory(false);
      }
    } catch (err) {
      console.error('Error adding category:', err);
    } finally {
      setIsAddingCategory(false);
    }
  };

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

      if (newElementPrice) payload.price = parseFloat(newElementPrice);
      if (newElementCategoryId) payload.category_id = parseInt(newElementCategoryId);
      if (newElementParentId) payload.parent_id = parseInt(newElementParentId);

      const res = await fetch(`/api/projects/${slug}/elements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowElementModal(false);
        setShowAddCategory(false);
        setNewCategoryName('');
        resetForm();
        await onRefetch();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingElement(false);
    }
  };

  const handleUpdateElement = async () => {
    if (!editingElement || !newElementTitle.trim()) return;
    setIsAddingElement(true);
    try {
      const payload: Record<string, string | number | null> = {
        title: newElementTitle,
        type: newElementType,
        price: newElementPrice ? parseFloat(newElementPrice) : null,
        category_id: newElementCategoryId ? parseInt(newElementCategoryId) : null,
      };

      const res = await fetch(`/api/projects/${slug}/elements/${editingElement.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowElementModal(false);
        setEditingElement(null);
        setShowAddCategory(false);
        setNewCategoryName('');
        resetForm();
        await onRefetch();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingElement(false);
    }
  };

  const reorderElements = (currentElements: ProjectElement[], parentId: number | null, activeId: number, overId: number) => {
    const scoped = [...currentElements.filter(el => parentId === null ? !el.parent_id : el.parent_id === parentId)]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    const oldIndex = scoped.findIndex(el => el.id === activeId);
    const newIndex = scoped.findIndex(el => el.id === overId);
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    const reordered = [...scoped];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    const withOrders = reordered.map((el, i) => ({ ...el, position: i }));

    setElements([
      ...currentElements.filter(el => parentId === null ? !!el.parent_id : el.parent_id !== parentId),
      ...withOrders,
    ]);

    withOrders.forEach(el => {
      fetch(`/api/projects/${slug}/elements/${el.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: el.position }),
      }).then(async res => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          console.error(`Error reordering element ${el.id} (${res.status}):`, body);
        }
      }).catch(err => console.error('Error reordering:', err));
    });
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
    editingElement,
    showElementModal,
    openAddModal,
    openEditModal,
    closeModal,
    showAddCategory,
    setShowAddCategory,
    newCategoryName,
    setNewCategoryName,
    isAddingCategory,
    handleAddCategory,
    reorderElements,
    handleAddElement,
    handleUpdateElement,
    handleToggleElementDone,
    handleDeleteElement,
    resetForm,
  };
}

'use client';

import { useState, useEffect } from 'react';
import { PackingList, PackingListItem } from '../types';

interface UsePackingListsProps {
  slug: string;
}

interface NewListForm {
  name: string;
  description: string;
  due_date: string;
}

interface NewItemForm {
  name: string;
  quantity: string;
  category: string;
  notes: string;
}

export function usePackingLists({ slug }: UsePackingListsProps) {
  const [packingLists, setPackingLists] = useState<PackingList[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New list form state
  const [showAddList, setShowAddList] = useState(false);
  const [newListForm, setNewListForm] = useState<NewListForm>({ name: '', description: '', due_date: '' });
  const [isAddingList, setIsAddingList] = useState(false);

  // New item form state (per list)
  const [addingItemToList, setAddingItemToList] = useState<number | null>(null);
  const [newItemForm, setNewItemForm] = useState<NewItemForm>({ name: '', quantity: '1', category: '', notes: '' });
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Expanded lists
  const [expandedLists, setExpandedLists] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchPackingLists();
  }, [slug]);

  const fetchPackingLists = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${slug}/packing-lists`);
      if (res.ok) {
        const data = await res.json();
        setPackingLists(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching packing lists:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddList = async () => {
    if (!newListForm.name.trim()) return;
    setIsAddingList(true);
    try {
      const payload: Record<string, string> = { name: newListForm.name };
      if (newListForm.description) payload.description = newListForm.description;
      if (newListForm.due_date) payload.due_date = newListForm.due_date;

      const res = await fetch(`/api/projects/${slug}/packing-lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setPackingLists(prev => [...prev, { ...(data.data || data), items: [] }]);
        setNewListForm({ name: '', description: '', due_date: '' });
        setShowAddList(false);
      }
    } catch (err) {
      console.error('Error adding packing list:', err);
    } finally {
      setIsAddingList(false);
    }
  };

  const handleDeleteList = async (listId: number) => {
    try {
      const res = await fetch(`/api/projects/${slug}/packing-lists/${listId}`, { method: 'DELETE' });
      if (res.ok) {
        setPackingLists(prev => prev.filter(l => l.id !== listId));
      }
    } catch (err) {
      console.error('Error deleting packing list:', err);
    }
  };

  const handleAddItem = async (listId: number) => {
    if (!newItemForm.name.trim()) return;
    setIsAddingItem(true);
    try {
      const payload: Record<string, string | number> = {
        name: newItemForm.name,
        quantity: parseInt(newItemForm.quantity) || 1,
      };
      if (newItemForm.category) payload.category = newItemForm.category;
      if (newItemForm.notes) payload.notes = newItemForm.notes;

      const res = await fetch(`/api/projects/${slug}/packing-lists/${listId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        const newItem: PackingListItem = data.data || data;
        setPackingLists(prev => prev.map(list =>
          list.id === listId
            ? { ...list, items: [...list.items, newItem] }
            : list
        ));
        setNewItemForm({ name: '', quantity: '1', category: '', notes: '' });
        setAddingItemToList(null);
      }
    } catch (err) {
      console.error('Error adding item:', err);
    } finally {
      setIsAddingItem(false);
    }
  };

  const handleToggleItem = async (listId: number, item: PackingListItem) => {
    try {
      const res = await fetch(`/api/projects/${slug}/packing-lists/${listId}/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_packed: !item.is_packed }),
      });
      if (res.ok) {
        setPackingLists(prev => prev.map(list =>
          list.id === listId
            ? {
                ...list,
                items: list.items.map(i =>
                  i.id === item.id ? { ...i, is_packed: !i.is_packed } : i
                ),
              }
            : list
        ));
      }
    } catch (err) {
      console.error('Error toggling item:', err);
    }
  };

  const handleDeleteItem = async (listId: number, itemId: number) => {
    try {
      const res = await fetch(`/api/projects/${slug}/packing-lists/${listId}/items/${itemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPackingLists(prev => prev.map(list =>
          list.id === listId
            ? { ...list, items: list.items.filter(i => i.id !== itemId) }
            : list
        ));
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const toggleListExpanded = (listId: number) => {
    setExpandedLists(prev => {
      const next = new Set(prev);
      if (next.has(listId)) {
        next.delete(listId);
      } else {
        next.add(listId);
      }
      return next;
    });
  };

  return {
    packingLists,
    isLoading,
    showAddList,
    setShowAddList,
    newListForm,
    setNewListForm,
    isAddingList,
    handleAddList,
    handleDeleteList,
    addingItemToList,
    setAddingItemToList,
    newItemForm,
    setNewItemForm,
    isAddingItem,
    handleAddItem,
    handleToggleItem,
    handleDeleteItem,
    expandedLists,
    toggleListExpanded,
  };
}

'use client';

import { useState } from 'react';
import { NewTimeEntryForm, TimeEntry } from '../types';

interface UseTimeEntriesProps {
  projectId: number | undefined;
  onRefetch: () => Promise<void>;
  setTimeEntries: React.Dispatch<React.SetStateAction<TimeEntry[]>>;
}

export function useTimeEntries({ projectId, onRefetch, setTimeEntries }: UseTimeEntriesProps) {
  const [showAddTime, setShowAddTime] = useState(false);
  const [newTimeEntry, setNewTimeEntry] = useState<NewTimeEntryForm>({
    hours: 0,
    minutes: 30,
    description: '',
    element_id: '',
  });

  const handleAddTimeEntry = async () => {
    try {
      const today = new Date();
      const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      const payload: {
        project_id: number | undefined;
        hours: number;
        minutes: number;
        date: string;
        project_element_id?: number;
      } = {
        project_id: projectId,
        hours: newTimeEntry.hours,
        minutes: newTimeEntry.minutes,
        date: localDate,
      };

      if (newTimeEntry.element_id) {
        payload.project_element_id = parseInt(newTimeEntry.element_id);
      }

      const res = await fetch('/api/timesheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setNewTimeEntry({ hours: 0, minutes: 30, description: '', element_id: '' });
        setShowAddTime(false);
        await onRefetch();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTimeEntry = async (entryId: number) => {
    try {
      const res = await fetch(`/api/timesheets/${entryId}`, { method: 'DELETE' });
      if (res.ok) {
        setTimeEntries(prev => prev.filter(e => e.id !== entryId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    showAddTime,
    setShowAddTime,
    newTimeEntry,
    setNewTimeEntry,
    handleAddTimeEntry,
    handleDeleteTimeEntry,
  };
}


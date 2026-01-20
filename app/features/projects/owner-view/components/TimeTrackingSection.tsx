'use client';

import { Plus, Clock, X } from 'lucide-react';
import { TimeEntry, ProjectElement } from '../types';

interface TimeTrackingSectionProps {
  timeEntries: TimeEntry[];
  elements: ProjectElement[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timeManager: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}

export function TimeTrackingSection({
  timeEntries,
  elements,
  timeManager,
  t,
}: TimeTrackingSectionProps) {
  const {
    showAddTime,
    setShowAddTime,
    newTimeEntry,
    setNewTimeEntry,
    handleAddTimeEntry,
    handleDeleteTimeEntry,
  } = timeManager;

  return (
    <div className="space-y-4">
      {/* Add time button */}
      {!showAddTime ? (
        <button
          onClick={() => setShowAddTime(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Ajouter une entrée
        </button>
      ) : (
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-white/50 text-xs mb-1 block">Heures</label>
              <input
                type="number"
                min="0"
                value={newTimeEntry.hours}
                onChange={e => setNewTimeEntry({ ...newTimeEntry, hours: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                step="15"
                value={newTimeEntry.minutes}
                onChange={e => setNewTimeEntry({ ...newTimeEntry, minutes: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">Élément (optionnel)</label>
              <select
                value={newTimeEntry.element_id}
                onChange={e => setNewTimeEntry({ ...newTimeEntry, element_id: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="" className="bg-secondary">Aucun</option>
                {elements.map(el => (
                  <option key={el.id} value={el.id} className="bg-secondary">{el.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddTimeEntry}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
            <button
              onClick={() => setShowAddTime(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Time entries list */}
      <div className="space-y-2">
        {timeEntries.length === 0 ? (
          <p className="text-white/40 text-center py-8">Aucune entrée de temps</p>
        ) : (
          timeEntries.map(entry => (
            <div key={entry.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-white font-medium">{entry.formatted_time || `${entry.hours}h ${entry.minutes}min`}</span>
              {entry.description && <span className="text-white/60 text-sm">- {entry.description}</span>}
              {entry.project_element && (
                <span className="text-white/50 text-xs bg-white/5 px-2 py-1 rounded">({entry.project_element.title})</span>
              )}
              <span className="text-white/40 text-xs ml-auto">{entry.date}</span>
              <button
                onClick={() => handleDeleteTimeEntry(entry.id)}
                className="p-1 text-white/40 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


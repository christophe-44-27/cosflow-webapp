'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLocale } from '../lib/locale-context';
import {
  AlertTriangle, Loader2, Trash2, CheckCircle2,
  LayoutDashboard, Layers, Activity,
  Camera, Plus, X, Clock, CalendarDays, FileText, Loader
} from 'lucide-react';
import {
  useProjectData,
  useProjectBudget,
  useProjectElements,
  useTimeEntries,
  useProjectInfo,
  usePackingLists,
} from '@/app/features/projects/owner-view';
import {
  ProjectStatsBar,
  ProjectInfoSection,
  ProjectElementsSection,
  TimeTrackingSection,
  ProjectGallerySection,
  PackingListSection,
} from '@/app/features/projects/owner-view';

type Tab = 'summary' | 'content' | 'activity';

interface ProjectOwnerViewProps {
  slug: string;
}

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'summary', label: 'Résumé', icon: LayoutDashboard },
  { id: 'content', label: 'Contenu', icon: Layers },
  { id: 'activity', label: 'Activité', icon: Activity },
];

export function ProjectOwnerView({ slug }: ProjectOwnerViewProps) {
  const { t, locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const tabParam = searchParams.get('tab');
    return (tabParam === 'summary' || tabParam === 'content' || tabParam === 'activity') ? tabParam : 'summary';
  });

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // ── Data hooks ─────────────────────────────────────────────────────────────
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
    setCategories,
  } = useProjectData(slug, locale);

  const budgetData = useProjectBudget(project, elements);
  const projectInfo = useProjectInfo({ project, slug, onRefetch: refetch });
  const elementsManager = useProjectElements({ slug, onRefetch: refetch, setElements, setCategories });
  const timeManager = useTimeEntries({ projectId: project?.id, onRefetch: refetch, setTimeEntries });
  const packingListManager = usePackingLists({ slug });

  // ── Activity: Notes ─────────────────────────────────────────────────────────
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  // ── Activity: Events ────────────────────────────────────────────────────────
  interface CosplayEvent {
    id: number;
    title: string;
    date: string;
    location: string | null;
  }
  const [events, setEvents] = useState<CosplayEvent[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '' });
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  useEffect(() => {
    if (project) {
      projectInfo.initEditedProject(project);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  // ── Mark as complete ────────────────────────────────────────────────────────
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  const handleMarkComplete = async () => {
    if (!project) return;
    setIsMarkingComplete(true);
    try {
      const formData = new FormData();
      formData.append('status', 'completed');
      formData.append('_method', 'PUT');
      const res = await fetch(`/api/projects/${slug}`, { method: 'POST', body: formData });
      if (res.ok) await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  // ── Notes save ──────────────────────────────────────────────────────────────
  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const formData = new FormData();
      formData.append('notes', notes);
      formData.append('_method', 'PUT');
      await fetch(`/api/projects/${slug}`, { method: 'POST', body: formData });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // ── Events ──────────────────────────────────────────────────────────────────
  const handleAddEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.date) return;
    setIsAddingEvent(true);
    try {
      const res = await fetch(`/api/projects/${slug}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(prev => [...prev, data.data || data]);
        setNewEvent({ title: '', date: '', location: '' });
        setShowAddEvent(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingEvent(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const res = await fetch(`/api/projects/${slug}/events/${eventId}`, { method: 'DELETE' });
      if (res.ok) setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (err) {
      console.error(err);
    }
  };

  // ── States ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <p className="text-red-400">{error || 'Projet introuvable'}</p>
      </div>
    );
  }

  const canMarkComplete = budgetData.progression === 100 && project.status !== 'completed';

  return (
    <div className="flex-1">
      {/* ── Tab bar ── */}
      <div className="flex w-full p-1 mt-6 mb-6 bg-white/5 border border-white/10 rounded-xl">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/30 text-white border border-primary/40'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════
          TAB: RÉSUMÉ
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'summary' && (
        <div className="space-y-5">
          {/* Project card */}
          <div className="bg-secondary border border-white/10 rounded-2xl p-6 space-y-4">
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

          {/* Budget detail card */}
          <div className="bg-secondary border border-white/10 rounded-2xl p-6">
            <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">Budget</h3>
            <div className="space-y-3">
              {/* Progress bar */}
              {budgetData.estimatedBudget !== null && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Utilisation</span>
                    <span className={budgetData.withinBudget ? 'text-green-400' : 'text-red-400'}>
                      {budgetData.budgetPercentage?.toFixed(0) ?? 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${budgetData.withinBudget ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(budgetData.budgetPercentage ?? 0, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-white/50 text-xs mb-1">Budget estimé</p>
                  <p className="text-white font-bold text-lg">
                    {budgetData.estimatedBudget !== null ? `$${budgetData.estimatedBudget.toFixed(2)}` : '—'}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-white/50 text-xs mb-1">Budget réel</p>
                  <p className={`font-bold text-lg ${budgetData.withinBudget ? 'text-green-400' : 'text-red-400'}`}>
                    ${budgetData.actualBudget.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progression card */}
          <div className="bg-secondary border border-white/10 rounded-2xl p-6">
            <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Progression</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${budgetData.progression === 100 ? 'bg-green-500' : 'bg-primary'}`}
                    style={{ width: `${budgetData.progression}%` }}
                  />
                </div>
              </div>
              <span className={`text-2xl font-bold flex-shrink-0 ${budgetData.progression === 100 ? 'text-green-400' : 'text-white'}`}>
                {budgetData.progression}%
              </span>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-secondary border border-white/10 rounded-2xl p-6 space-y-3">
            <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">Actions</h3>

            {canMarkComplete && (
              <button
                onClick={handleMarkComplete}
                disabled={isMarkingComplete}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-xl transition-colors"
              >
                {isMarkingComplete
                  ? <Loader className="w-4 h-4 animate-spin" />
                  : <CheckCircle2 className="w-4 h-4" />
                }
                Marquer comme terminé
              </button>
            )}

            <button
              onClick={() => projectInfo.setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer le projet
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: CONTENU
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'content' && (
        <div className="space-y-5">
          {/* Elements section */}
          <div className="bg-secondary border border-white/10 rounded-2xl p-6">
            <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              Éléments du projet
              <span className="bg-white/10 text-white/50 text-xs px-2 py-0.5 rounded-full font-normal normal-case">
                {elements.length}
              </span>
            </h3>
            <ProjectElementsSection
              elements={elements}
              categories={categories}
              elementsManager={elementsManager}
              t={t}
            />
          </div>

          {/* Gallery section */}
          <div className="bg-secondary border border-white/10 rounded-2xl p-6">
            <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Camera className="w-3.5 h-3.5" />
              Galerie
              <span className="bg-white/10 text-white/50 text-xs px-2 py-0.5 rounded-full font-normal normal-case">
                {project.photos.length + project.photoReferences.length + project.photoshoots.length}
              </span>
            </h3>
            <ProjectGallerySection project={project} />
          </div>

          {/* Packing lists section */}
          <div className="bg-secondary border border-white/10 rounded-2xl p-6">
            <PackingListSection packingListManager={packingListManager} />
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: ACTIVITÉ
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'activity' && (
        <div className="space-y-5">
          {/* Time tracking */}
          <div className="bg-secondary border border-white/10 rounded-2xl p-6">
            <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              Temps de travail
              <span className="bg-white/10 text-white/50 text-xs px-2 py-0.5 rounded-full font-normal normal-case">
                {project.total_project_working_time || '0min'}
              </span>
            </h3>
            <TimeTrackingSection
              timeEntries={timeEntries}
              elements={elements}
              timeManager={timeManager}
              t={t}
            />
          </div>

          {/* Cosplay events */}
          <div className="bg-secondary border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5" />
                Événements cosplay
                <span className="bg-white/10 text-white/50 text-xs px-2 py-0.5 rounded-full font-normal normal-case">
                  {events.length}
                </span>
              </h3>
              <button
                onClick={() => setShowAddEvent(!showAddEvent)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>

            {showAddEvent && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nom de l'événement"
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm"
                    autoFocus
                  />
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={e => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Lieu (optionnel)"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddEvent}
                    disabled={isAddingEvent || !newEvent.title.trim() || !newEvent.date}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    {isAddingEvent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    Ajouter
                  </button>
                  <button
                    onClick={() => { setShowAddEvent(false); setNewEvent({ title: '', date: '', location: '' }); }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {events.length === 0 ? (
              <p className="text-white/40 text-center py-6 text-sm">Aucun événement ajouté</p>
            ) : (
              <div className="space-y-2">
                {events.map(event => (
                  <div key={event.id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                    <CalendarDays className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-white text-sm font-medium">{event.title}</span>
                      {event.location && (
                        <span className="text-white/50 text-xs ml-2">— {event.location}</span>
                      )}
                    </div>
                    <span className="text-white/40 text-xs flex-shrink-0">
                      {new Date(event.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-1 text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-secondary border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                Notes
              </h3>
              <button
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {isSavingNotes
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : notesSaved
                  ? <CheckCircle2 className="w-3.5 h-3.5" />
                  : null
                }
                {notesSaved ? 'Sauvegardé' : 'Sauvegarder'}
              </button>
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ajoutez vos notes, idées, références... (Markdown supporté)"
              rows={8}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm resize-none focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {projectInfo.showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => projectInfo.setShowDeleteConfirm(false)} />
          <div className="relative bg-secondary border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
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
                  <button
                    onClick={() => projectInfo.setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
                  >
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

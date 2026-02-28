'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { forbidden, notFound } from 'next/navigation';
import {
  LayoutDashboard, Layers, Activity,
  AlertTriangle, Loader2, Trash2, Eye, Camera,
  Clock, CalendarDays, FileText, Plus, CheckCircle2, X,
} from 'lucide-react';
import { useLocale } from '@/app/lib/locale-context';
import {
  useProjectData,
  useProjectBudget,
  useProjectElements,
  useTimeEntries,
  useProjectInfo,
  usePackingLists,
} from '@/app/features/projects/owner-view';
import {
  CoverEditorSection,
  ProjectElementsSection,
  TimeTrackingSection,
  ProjectGallerySection,
  PackingListSection,
  EditProjectDrawer,
  ProjectOwnerSidebar,
} from '@/app/features/projects/owner-view';
import type { CoverEditorSectionRef } from '@/app/features/projects/owner-view/components/CoverEditorSection';
import type { Translations } from '@/app/lib/locales/fr';

// ── Types ────────────────────────────────────────────────────────────────────

type Tab = 'resume' | 'content' | 'activity';

const TABS: { id: Tab; icon: React.ElementType }[] = [
  { id: 'resume',   icon: LayoutDashboard },
  { id: 'content',  icon: Layers },
  { id: 'activity', icon: Activity },
];

interface CosplayEvent {
  id: number;
  title: string;
  date: string;
  location: string | null;
}

interface ProjectOwnerViewProps {
  slug: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m.toString().padStart(2, '0')}m` : `${m}m`;
}

// ── Badge helpers ─────────────────────────────────────────────────────────────

function StatusBadge({ status, t }: { status: string; t: Translations }) {
  const map: Record<string, { label: string; cls: string }> = {
    draft:       { label: t.projectEdit.status.draft,      cls: 'bg-white/15 text-white/60' },
    in_progress: { label: t.projectEdit.status.inProgress, cls: 'bg-blue-500/20 text-blue-300' },
    completed:   { label: t.projectEdit.status.completed,  cls: 'bg-green-500/20 text-green-300' },
    on_hold:     { label: t.projectEdit.status.onHold,     cls: 'bg-orange-500/20 text-orange-300' },
  };
  const { label, cls } = map[status] ?? { label: status, cls: 'bg-white/15 text-white/60' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
}

function calcDeadlinePriority(endDate: string | null, t: Translations): { label: string; cls: string } | null {
  if (!endDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(endDate);
  deadline.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / 86_400_000);
  if (daysLeft < 0)  return { label: `🔴 ${t.projectEdit.priority.urgent}`,  cls: 'bg-red-500/20 text-red-300' };
  if (daysLeft <= 7) return { label: `↑ ${t.projectEdit.priority.high}`,    cls: 'bg-orange-500/20 text-orange-300' };
  if (daysLeft <= 30) return { label: `→ ${t.projectEdit.priority.medium}`, cls: 'bg-yellow-500/20 text-yellow-300' };
  return { label: `↓ ${t.projectEdit.priority.low}`, cls: 'bg-white/10 text-white/40' };
}

// ── DonutRing ─────────────────────────────────────────────────────────────────

function DonutRing({ pct, doneLabel }: { pct: number; doneLabel: string }) {
  const r = 36;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.min(pct, 100) / 100);
  return (
    <div className="relative w-[90px] h-[90px] flex-shrink-0">
      <svg width="90" height="90" viewBox="0 0 90 90" className="-rotate-90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx="45" cy="45" r={r} fill="none" stroke="#6259CA" strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-[#a5b4fc]">{pct}%</span>
        <span className="text-[9px] text-white/40 mt-0.5">{doneLabel}</span>
      </div>
    </div>
  );
}

// ── Section header helper ─────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, label, count }: {
  icon?: React.ElementType;
  label: string;
  count?: number;
}) {
  return (
    <h3 className="text-[10px] text-white/40 uppercase tracking-widest font-bold flex items-center gap-2 mb-4">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
      {count !== undefined && (
        <span className="bg-white/[0.08] text-white/50 text-xs px-2 py-0.5 rounded-full normal-case font-normal">
          {count}
        </span>
      )}
    </h3>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProjectOwnerView({ slug }: ProjectOwnerViewProps) {
  const { t, locale } = useLocale();
  const coverEditorRef = useRef<CoverEditorSectionRef>(null);

  // ── Tab state — synced avec l'URL sans useSearchParams (ne bloque pas l'ISR) ──
  const [activeTab, setActiveTab] = useState<Tab>('resume');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'resume' || tab === 'content' || tab === 'activity') {
      setActiveTab(tab);
    }
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  // ── Data hooks ────────────────────────────────────────────────────────────
  const {
    project,
    elements,
    categories,
    timeEntries,
    isLoading,
    error,
    statusCode,
    refetch,
    setElements,
    setTimeEntries,
    setCategories,
  } = useProjectData(slug, locale);

  const budgetData        = useProjectBudget(project, elements);
  const projectInfo       = useProjectInfo({ project, slug, onRefetch: refetch });
  const elementsManager   = useProjectElements({ slug, onRefetch: refetch, setElements, setCategories });
  const timeManager       = useTimeEntries({ projectId: project?.id, onRefetch: refetch, setTimeEntries });
  const packingListManager = usePackingLists({ slug });

  useEffect(() => {
    if (project) projectInfo.initEditedProject(project);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  // ── Edit drawer state ─────────────────────────────────────────────────────
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  // ── Events state ──────────────────────────────────────────────────────────
  const [events, setEvents] = useState<CosplayEvent[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '' });
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // ── Notes state ───────────────────────────────────────────────────────────
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────
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

  // ── Derived values ────────────────────────────────────────────────────────
  const totalMinutes  = timeEntries.reduce((s, e) => s + e.total_minutes, 0);
  const sessionCount  = timeEntries.length;
  const avgMinutes    = sessionCount > 0 ? Math.round(totalMinutes / sessionCount) : 0;
  const lastEntry     = sessionCount > 0
    ? [...timeEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  const doneCount = elements.filter(e => e.is_done).length;

  // ── Loading / error ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !project) {
    if (statusCode === 403) forbidden();
    if (statusCode === 404) notFound();
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <p className="text-red-400">{error || t.studioProject.notFound}</p>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>

      {/* ══════════════════════════════════════════════════════════════
          COVER HERO — full-width
      ══════════════════════════════════════════════════════════════ */}
      <CoverEditorSection
        ref={coverEditorRef}
        coverUrl={project.cover_url ?? null}
        projectTitle={project.title}
        onCoverUpload={projectInfo.handleCoverUpload}
      >
        <div className="w-full px-6 md:px-8 pb-6">
          <div className="flex items-end justify-between gap-4">

            <div>
              <div className="mb-3">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  {t.studioProject.backToProjects}
                </Link>
              </div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <StatusBadge status={project.status} t={t} />
                {(() => {
                  const p = calcDeadlinePriority(project.estimated_end_date ?? null, t);
                  return p ? (
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${p.cls}`}>{p.label}</span>
                  ) : null;
                })()}
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight text-white mb-1"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
                {project.title}
              </h1>
              {(project.fandom || project.origin) && (
                <p className="text-sm text-white/50">
                  {[project.fandom?.name, project.origin?.name].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => coverEditorRef.current?.openFilePicker()}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-sm text-white/80 hover:text-white transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {project.cover_url ? t.projectEdit.changeCover : t.projectEdit.addCover}
                </span>
              </button>
              <Link
                href={`/projects/${slug}?preview=1`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-sm text-white/80 hover:text-white transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">{t.studioProject.viewPublicPage}</span>
              </Link>
            </div>

          </div>
        </div>
      </CoverEditorSection>

      {/* ══════════════════════════════════════════════════════════════
          ZONE PRINCIPALE
      ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start mt-6">

          {/* ════════════════════════════
              COLONNE GAUCHE — Tabs + Content
          ════════════════════════════ */}
          <div>

            {/* Tab bar */}
            <div className="flex gap-0.5 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-1 mb-5">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary/30 border border-primary/40 text-white'
                        : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.studioProject.tabs[tab.id]}
                  </button>
                );
              })}
            </div>

            {/* ════════════ TAB: RÉSUMÉ ════════════ */}
            {activeTab === 'resume' && (
              <div className="space-y-3">

                {/* Progression + Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* Progression */}
                  <div className="bg-secondary border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                    <DonutRing pct={budgetData.progression} doneLabel={t.studioProject.resume.done} />
                    <div className="min-w-0">
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1.5">
                        {t.projectInfo.progression}
                      </p>
                      <p className="text-sm text-white/70">
                        {doneCount} / {elements.length} {t.studioProject.resume.elements}
                      </p>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="bg-secondary border border-white/10 rounded-2xl p-4">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">
                      {t.studioProject.resume.budget}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-[10px] text-white/40 mb-1">{t.studioProject.resume.spent}</p>
                        <p className={`text-xl font-black ${budgetData.withinBudget ? 'text-green-400' : 'text-red-400'}`}>
                          {budgetData.actualBudget.toFixed(0)}€
                        </p>
                      </div>
                      {budgetData.estimatedBudget !== null && (
                        <div>
                          <p className="text-[10px] text-white/40 mb-1">{t.studioProject.resume.estimated}</p>
                          <p className="text-xl font-black text-white">
                            {budgetData.estimatedBudget.toFixed(0)}€
                          </p>
                        </div>
                      )}
                    </div>
                    {budgetData.estimatedBudget !== null && (
                      <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${budgetData.withinBudget ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(budgetData.budgetPercentage ?? 0, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Temps de travail */}
                <div className="bg-secondary border border-white/10 rounded-2xl p-4">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {t.studioProject.resume.timeTitle}
                  </p>
                  <div className="flex gap-3 mb-3">
                    <div className="flex-1 bg-white/[0.04] rounded-xl px-3 py-2.5 text-center">
                      <p className="text-base font-black text-white">{formatMinutes(totalMinutes)}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">{t.projectInfo.total_time}</p>
                    </div>
                    <div className="flex-1 bg-white/[0.04] rounded-xl px-3 py-2.5 text-center">
                      <p className="text-base font-black text-white">{formatMinutes(avgMinutes)}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">{t.studioProject.resume.avgPerSession}</p>
                    </div>
                    <div className="flex-1 bg-white/[0.04] rounded-xl px-3 py-2.5 text-center">
                      <p className="text-base font-black text-white">{sessionCount}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">{t.studioProject.resume.sessions}</p>
                    </div>
                  </div>
                  {lastEntry ? (
                    <p className="text-xs text-white/40">
                      {t.studioProject.resume.lastSession}{' '}
                      <span className="text-white/60">
                        {new Date(lastEntry.date).toLocaleDateString(locale, { day: '2-digit', month: 'short' })}
                      </span>
                      {lastEntry.project_element && (
                        <span className="text-white/50"> · {lastEntry.project_element.title}</span>
                      )}
                    </p>
                  ) : (
                    <p className="text-xs text-white/30">{t.studioProject.resume.noSessionYet}</p>
                  )}
                </div>

                {/* Événements à venir */}
                <div className="bg-secondary border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                      <CalendarDays className="w-3 h-3" />
                      {t.studioProject.resume.eventsPreview}
                    </p>
                    <button
                      onClick={() => { handleTabChange('activity'); setShowAddEvent(true); }}
                      className="flex items-center gap-1 px-2.5 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-xs transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      {t.studioProject.resume.addEvent}
                    </button>
                  </div>
                  {upcomingEvents.length === 0 ? (
                    <p className="text-xs text-white/30 py-2">{t.studioProject.resume.noUpcomingEvents}</p>
                  ) : (
                    <div className="space-y-2">
                      {upcomingEvents.map(ev => (
                        <div key={ev.id} className="flex items-center gap-2 text-sm">
                          <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-lg font-medium flex-shrink-0">
                            {new Date(ev.date).toLocaleDateString(locale, { day: '2-digit', month: 'short' })}
                          </span>
                          <span className="text-white/80 font-medium truncate">{ev.title}</span>
                          {ev.location && (
                            <span className="text-white/40 text-xs truncate hidden sm:block">
                              {ev.location}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile : sidebar inlinée */}
                <div className="lg:hidden">
                  <ProjectOwnerSidebar
                    project={project}
                    slug={slug}
                    budgetData={budgetData}
                    projectInfo={projectInfo}
                    elements={elements}
                    t={t}
                    onRefetch={refetch}
                    onEditClick={() => setIsEditDrawerOpen(true)}
                  />
                </div>

              </div>
            )}

            {/* ════════════ TAB: CONTENU ════════════ */}
            {activeTab === 'content' && (
              <div className="space-y-4">

                {/* Éléments */}
                <div className="bg-secondary border border-white/10 rounded-2xl p-5">
                  <SectionHeader
                    label={t.studioProject.content.elementsTitle}
                    count={elements.length}
                  />
                  <ProjectElementsSection
                    elements={elements}
                    categories={categories}
                    elementsManager={elementsManager}
                    t={t}
                  />
                </div>

                {/* Galerie */}
                <div className="bg-secondary border border-white/10 rounded-2xl p-5">
                  <SectionHeader
                    label={t.studioProject.content.galleryTitle}
                    count={project.photos.length + project.photoReferences.length + project.photoshoots.length}
                  />
                  <ProjectGallerySection project={project} />
                </div>

                {/* Packing lists */}
                <div className="bg-secondary border border-white/10 rounded-2xl p-5">
                  <SectionHeader label={t.studioProject.content.packingTitle} />
                  <PackingListSection packingListManager={packingListManager} />
                </div>

              </div>
            )}

            {/* ════════════ TAB: ACTIVITÉ ════════════ */}
            {activeTab === 'activity' && (
              <div className="space-y-4">

                {/* Temps de travail */}
                <div className="bg-secondary border border-white/10 rounded-2xl p-5">
                  <TimeTrackingSection
                    timeEntries={timeEntries}
                    elements={elements}
                    timeManager={timeManager}
                    t={t}
                  />
                </div>

                {/* Événements cosplay */}
                <div className="bg-secondary border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <SectionHeader
                      icon={CalendarDays}
                      label={t.studioProject.activity.eventsTitle}
                      count={events.length}
                    />
                    <button
                      onClick={() => setShowAddEvent(v => !v)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {t.studioProject.resume.addEvent}
                    </button>
                  </div>

                  {showAddEvent && (
                    <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 mb-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={newEvent.title}
                          onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                          placeholder={t.studioProject.activity.eventNamePlaceholder}
                          className="px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-primary/50"
                          autoFocus
                        />
                        <input
                          type="date"
                          value={newEvent.date}
                          onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                          className="px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                        />
                      </div>
                      <input
                        type="text"
                        value={newEvent.location}
                        onChange={e => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                        placeholder={t.studioProject.activity.eventLocationPlaceholder}
                        className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-primary/50"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddEvent}
                          disabled={isAddingEvent || !newEvent.title.trim() || !newEvent.date}
                          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm disabled:opacity-50 transition-colors"
                        >
                          {isAddingEvent
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Plus className="w-3.5 h-3.5" />
                          }
                          {t.studioProject.resume.addEvent}
                        </button>
                        <button
                          onClick={() => { setShowAddEvent(false); setNewEvent({ title: '', date: '', location: '' }); }}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
                        >
                          {t.common.cancel}
                        </button>
                      </div>
                    </div>
                  )}

                  {events.length === 0 ? (
                    <p className="text-white/40 text-center py-6 text-sm">
                      {t.studioProject.activity.noEventsAdded}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {[...events]
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map(ev => (
                          <div key={ev.id} className="flex items-center gap-3 p-3 bg-white/[0.04] border border-white/10 rounded-xl">
                            <CalendarDays className="w-4 h-4 text-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="text-white text-sm font-medium">{ev.title}</span>
                              {ev.location && (
                                <span className="text-white/50 text-xs ml-2">— {ev.location}</span>
                              )}
                            </div>
                            <span className="text-white/40 text-xs flex-shrink-0">
                              {new Date(ev.date).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <button
                              onClick={() => handleDeleteEvent(ev.id)}
                              className="p-1 text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="bg-secondary border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <SectionHeader icon={FileText} label={t.studioProject.activity.notesTitle} />
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
                      {notesSaved ? t.studioProject.activity.notesSaved : t.common.save}
                    </button>
                  </div>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder={t.studioProject.activity.notesPlaceholder}
                    rows={8}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm resize-none focus:outline-none focus:border-primary/50"
                  />
                </div>

              </div>
            )}

          </div>

          {/* ════════════════════════════
              COLONNE DROITE — Sidebar persistante
          ════════════════════════════ */}
          <div className="hidden lg:block lg:sticky lg:top-20 lg:h-fit">
            <ProjectOwnerSidebar
              project={project}
              slug={slug}
              budgetData={budgetData}
              projectInfo={projectInfo}
              elements={elements}
              t={t}
              onRefetch={refetch}
              onEditClick={() => setIsEditDrawerOpen(true)}
            />
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          DRAWER — Édition du projet
      ══════════════════════════════════════════════════════════════ */}
      <EditProjectDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        project={project}
        projectInfo={projectInfo}
      />

      {/* ══════════════════════════════════════════════════════════════
          MODALE DE SUPPRESSION
      ══════════════════════════════════════════════════════════════ */}
      {projectInfo.showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => projectInfo.setShowDeleteConfirm(false)}
          />
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
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                  >
                    {projectInfo.isDeleting
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />
                    }
                    {t.projectEdit.confirmDelete}
                  </button>
                  <button
                    onClick={() => projectInfo.setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
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

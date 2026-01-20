'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from './header';
import {
    Save, Trash2, Plus, Check, X, Clock, DollarSign,
    Camera, Image as ImageIcon, Upload, Loader2,
    ChevronDown, ChevronUp, Settings, Eye, EyeOff,
    ListChecks, ShoppingCart, Wrench, AlertTriangle, TrendingUp, TrendingDown
} from 'lucide-react';
import { ProjectDetail } from '../lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLocale } from '../lib/locale-context';
import {
    calculateProjectActualBudget,
    formatBudget,
    calculateBudgetDifference,
    isWithinBudget,
    calculateBudgetPercentage
} from '../lib/budget-utils';

interface ProjectElement {
    id: number;
    title: string;
    type: string;
    price: string | number | null;
    is_done: boolean;
    to_make: boolean;
    project_id: number;
    category_id: number | null;
    parent_id: number | null;
    total_working_time: string;
    category?: { id: number; name: string } | null;
    children?: ProjectElement[];
}

interface TimeEntry {
    id: number;
    project_id: number;
    hours: string;
    minutes: string;
    description: string | null;
    date: string;
    total_minutes: number;
    formatted_time: string;
    project_element?: {
        id: number;
        title: string;
    } | null;
    timesheetable_id: string;
    timesheetable_type: string;
    created_at: string;
    updated_at: string;
}

interface ProjectOwnerViewProps {
    slug: string;
}

export function ProjectOwnerView({ slug }: ProjectOwnerViewProps) {
    const { t, locale } = useLocale();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [elements, setElements] = useState<ProjectElement[]>([]);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Calcul du budget réel basé sur les éléments
    const actualBudget = useMemo(() => {
        return calculateProjectActualBudget(elements);
    }, [elements]);

    // Budget estimé par l'utilisateur
    const estimatedBudget = useMemo(() => {
        if (!project?.project_estimated_price) return null;
        return parseFloat(project.project_estimated_price);
    }, [project?.project_estimated_price]);

    // Différence entre budget estimé et réel
    const budgetDifference = useMemo(() => {
        return calculateBudgetDifference(estimatedBudget, actualBudget);
    }, [estimatedBudget, actualBudget]);

    // Vérifier si dans le budget
    const withinBudget = useMemo(() => {
        return isWithinBudget(estimatedBudget, actualBudget);
    }, [estimatedBudget, actualBudget]);

    // Pourcentage du budget utilisé
    const budgetPercentage = useMemo(() => {
        return calculateBudgetPercentage(estimatedBudget, actualBudget);
    }, [estimatedBudget, actualBudget]);

    // Edit states
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [editedProject, setEditedProject] = useState<Partial<ProjectDetail>>({});
    const [isSaving, setIsSaving] = useState(false);

    // Element states
    const [newElementTitle, setNewElementTitle] = useState('');
    const [newElementType, setNewElementType] = useState<'buy' | 'make' | 'task'>('buy');
    const [newElementPrice, setNewElementPrice] = useState('');
    const [newElementCategoryId, setNewElementCategoryId] = useState('');
    const [newElementParentId, setNewElementParentId] = useState('');
    const [isAddingElement, setIsAddingElement] = useState(false);
    const [showAdvancedElementForm, setShowAdvancedElementForm] = useState(false);

    // Time entry states
    const [showAddTime, setShowAddTime] = useState(false);
    const [newTimeEntry, setNewTimeEntry] = useState({ hours: 0, minutes: 30, description: '', element_id: '' });

    // Sections collapse
    const [sectionsOpen, setSectionsOpen] = useState({
        info: true,
        elements: true,
        time: true,
        gallery: false,
    });

    // Delete confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchProject();
        fetchCategories();
    }, [slug, locale]);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`/api/project_element_categories?locale=${locale}`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchProject = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/projects/${slug}`);
            if (!res.ok) throw new Error('Failed to fetch project');
            const response = await res.json();
            setProject(response.data);
            setElements(response.data.elements || []);

            console.log("DATA: " + response.data.title);

            // Ne copier que les champs modifiables
            setEditedProject({
                title: response.data.title,
                description: response.data.description,
                priority: response.data.priority,
                is_private: response.data.is_private,
                category_id: response.data.category_id,
                fandom_id: response.data.fandom_id,
                project_estimated_price: response.data.project_estimated_price,
                estimated_end_date: response.data.estimated_end_date,
            });

            // Fetch time entries
            const timeRes = await fetch(`/api/timesheets/projects/${slug}`);
            if (timeRes.ok) {
                const timeData = await timeRes.json();
                setTimeEntries(timeData.data || []);
            }
        } catch (err) {
            setError('Erreur lors du chargement du projet');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSection = (section: keyof typeof sectionsOpen) => {
        setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // === Project Info ===
    const handleSaveProjectInfo = async () => {
        if (!project) return;
        setIsSaving(true);
        try {
            const formData = new FormData();

            // Filtrer les champs auto-gérés par Laravel
            const excludedFields = ['created_at', 'updated_at', 'id', 'user_id', 'slug'];

            Object.entries(editedProject).forEach(([key, value]) => {
                if (value !== undefined && value !== null && !excludedFields.includes(key)) {
                    formData.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
                }
            });

            // Laravel: POST avec _method=PUT pour FormData
            formData.append('_method', 'PUT');

            const res = await fetch(`/api/projects/${slug}`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to save');

            await fetchProject();
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
                await fetchProject();
            }
        } catch (err) {
            console.error(err);
        }
    };

    // === Elements ===
    const handleAddElement = async () => {
        if (!newElementTitle.trim()) return;
        setIsAddingElement(true);
        try {
            const payload: any = {
                title: newElementTitle,
                type: newElementType,
            };

            // Ajouter les champs optionnels seulement s'ils sont renseignés
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
                setNewElementTitle('');
                setNewElementPrice('');
                setNewElementCategoryId('');
                setNewElementParentId('');
                setShowAdvancedElementForm(false);
                await fetchProject();
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

    // === Time Entries ===
    const handleAddTimeEntry = async () => {
        try {
            // Utiliser l'heure locale au lieu de UTC pour éviter les décalages de date
            const today = new Date();
            const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

            const payload: any = {
                project_id: project?.id,
                hours: newTimeEntry.hours,
                minutes: newTimeEntry.minutes,
                date: localDate,
            };

            // Ajouter project_element_id seulement si un élément est sélectionné
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
                await fetchProject();
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

    // === Delete Project ===
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

    if (isLoading) {
        return (
            <div className="flex-1">
                <Header title="Chargement..." />
                <div className="p-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-48 bg-white/5 rounded-2xl"></div>
                        <div className="h-32 bg-white/5 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex-1">
                <Header title="Erreur" />
                <div className="p-8">
                    <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 text-red-500 text-center">
                        {error || 'Projet introuvable'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1">
            <Header title={project.title} />

            <div className="p-8 space-y-6">
                {/* === Section: Informations du projet === */}
                <div className="bg-secondary border border-white/10 rounded-2xl overflow-hidden">
                    <button
                        onClick={() => toggleSection('info')}
                        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Settings className="w-5 h-5 text-primary" />
                            <h2 className="text-white text-lg font-bold">{t.projectInfo.title}</h2>
                        </div>
                        {sectionsOpen.info ? <ChevronUp className="w-5 h-5 text-white/60" /> : <ChevronDown className="w-5 h-5 text-white/60" />}
                    </button>

                    {sectionsOpen.info && (
                        <div className="p-6 pt-0 space-y-4">
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
                                                onChange={e => setEditedProject(prev => ({ ...prev, title: e.target.value }))}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                                placeholder={t.projectInfo.placeholder_title}
                                            />
                                            <textarea
                                                value={editedProject.description || ''}
                                                onChange={e => setEditedProject(prev => ({ ...prev, description: e.target.value }))}
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
                                                        onChange={e => setEditedProject(prev => ({ ...prev, project_estimated_price: e.target.value }))}
                                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-white/50 text-xs mb-1 block">{t.projectInfo.estimated_end_date}</label>
                                                    <input
                                                        type="date"
                                                        value={editedProject.estimated_end_date || ''}
                                                        onChange={e => setEditedProject(prev => ({ ...prev, estimated_end_date: e.target.value }))}
                                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <select
                                                    value={editedProject.status || ''}
                                                    onChange={e => setEditedProject(prev => ({ ...prev, status: e.target.value }))}
                                                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                                >
                                                    <option value="draft" className="bg-secondary">{t.projectEdit.status.draft}</option>
                                                    <option value="in_progress" className="bg-secondary">{t.projectEdit.status.inProgress}</option>
                                                    <option value="completed" className="bg-secondary">{t.projectEdit.status.completed}</option>
                                                    <option value="on_hold" className="bg-secondary">{t.projectEdit.status.onHold}</option>
                                                </select>
                                                <select
                                                    value={editedProject.priority || ''}
                                                    onChange={e => setEditedProject(prev => ({ ...prev, priority: e.target.value }))}
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
                                                            onChange={e => setEditedProject(prev => ({ ...prev, is_private: e.target.checked }))}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-10 h-6 bg-white/20 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4 relative"></div>
                                                        {editedProject.is_private ? <EyeOff className="w-4 h-4 text-white/60" /> : <Eye className="w-4 h-4 text-green-400" />}
                                                    </label>
                                                </div>
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
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-5 gap-4 pt-4 border-t border-white/10">
                                <div className="text-center">
                                    <p className="text-white/50 text-xs">{t.projectInfo.progression}</p>
                                    <p className="text-white text-lg font-bold">{project.progression}%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-white/50 text-xs">{t.projectInfo.total_time}</p>
                                    <p className="text-white text-lg font-bold">{project.total_project_working_time || '0min'}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-white/50 text-xs">{t.projectInfo.estimated_end_date}</p>
                                    <p className="text-white text-lg font-bold">
                                        {project.estimated_end_date
                                            ? new Date(project.estimated_end_date).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })
                                            : t.projectInfo.no_end_date
                                        }
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-white/50 text-xs">{t.projectInfo.actual_budget}</p>
                                    <p className={`text-lg font-bold ${withinBudget ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        ${formatBudget(actualBudget)}
                                    </p>
                                    {estimatedBudget !== null && (
                                        <div className="flex items-center justify-center gap-1 mt-1">
                                            {withinBudget ? (
                                                <TrendingDown className="w-3 h-3 text-green-400" />
                                            ) : (
                                                <TrendingUp className="w-3 h-3 text-red-400" />
                                            )}
                                            <span className={`text-xs ${withinBudget ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                {budgetDifference !== null && budgetDifference >= 0
                                                    ? `-$${formatBudget(Math.abs(budgetDifference))}`
                                                    : `+$${formatBudget(Math.abs(budgetDifference || 0))}`
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="text-white/50 text-xs">{t.projectInfo.estimated_budget}</p>
                                    <p className="text-white text-lg font-bold">
                                        {estimatedBudget !== null ? `$${formatBudget(estimatedBudget)}` : t.common.loading}
                                    </p>
                                    {budgetPercentage !== null && (
                                        <p className={`text-xs mt-1 ${budgetPercentage <= 100 ? 'text-white/60' : 'text-red-400'
                                            }`}>
                                            {budgetPercentage.toFixed(0)}% utilisé
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between pt-4 border-t border-white/10">
                                {isEditingInfo ? (
                                    <div className="flex gap-2">
                                        <button onClick={handleSaveProjectInfo} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg">
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Enregistrer
                                        </button>
                                        <button onClick={() => {
                                            setIsEditingInfo(false);
                                            if (project) {
                                                setEditedProject({
                                                    title: project.title,
                                                    description: project.description,
                                                    priority: project.priority,
                                                    is_private: project.is_private,
                                                    category_id: project.category_id,
                                                    fandom_id: project.fandom_id,
                                                    project_estimated_price: project.project_estimated_price,
                                                    estimated_end_date: project.estimated_end_date,
                                                });
                                            }
                                        }} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg">
                                            Annuler
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => setIsEditingInfo(true)} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg">
                                        <Settings className="w-4 h-4" />
                                        {t.common.edit}
                                    </button>
                                )}
                                <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                    {t.common.delete}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* === Section: Éléments === */}
                <div className="bg-secondary border border-white/10 rounded-2xl overflow-hidden">
                    <button
                        onClick={() => toggleSection('elements')}
                        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <ListChecks className="w-5 h-5 text-blue-400" />
                            <h2 className="text-white text-lg font-bold">{t.projectElements.title}</h2>
                            <span className="bg-white/10 text-white/60 text-sm px-2 py-0.5 rounded-full">{elements.length}</span>
                        </div>
                        {sectionsOpen.elements ? <ChevronUp className="w-5 h-5 text-white/60" /> : <ChevronDown className="w-5 h-5 text-white/60" />}
                    </button>

                    {sectionsOpen.elements && (
                        <div className="p-6 pt-0 space-y-4">
                            {/* Add element form */}
                            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newElementTitle}
                                        onChange={e => setNewElementTitle(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && !showAdvancedElementForm && handleAddElement()}
                                        placeholder={t.projectElements.element_title_placeholder}
                                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40"
                                    />
                                    <select
                                        value={newElementType}
                                        onChange={e => setNewElementType(e.target.value as 'buy' | 'make' | 'task')}
                                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                    >
                                        <option value="buy" className="bg-secondary">{t.projectDetail.elements.buy}</option>
                                        <option value="make" className="bg-secondary">{t.projectDetail.elements.make}</option>
                                        <option value="task" className="bg-secondary">{t.projectDetail.elements.task}</option>
                                    </select>
                                    <button
                                        onClick={() => setShowAdvancedElementForm(!showAdvancedElementForm)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${showAdvancedElementForm
                                            ? 'bg-primary/20 text-primary border border-primary/30'
                                            : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Advanced fields */}
                                {showAdvancedElementForm && (
                                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                                        <div>
                                            <label className="text-white/50 text-xs mb-1 block">{t.projectElements.label_price}</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={newElementPrice}
                                                onChange={e => setNewElementPrice(e.target.value)}
                                                placeholder="25.99"
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-white/50 text-xs mb-1 block">{t.projectElements.label_category}</label>
                                            <select
                                                value={newElementCategoryId}
                                                onChange={e => setNewElementCategoryId(e.target.value)}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                            >
                                                <option value="" className="bg-secondary">{t.projectElements.no_category}</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id} className="bg-secondary">
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-white/50 text-xs mb-1 block">{t.projectElements.label_parent_element}</label>
                                            <select
                                                value={newElementParentId}
                                                onChange={e => setNewElementParentId(e.target.value)}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                            >
                                                <option value="" className="bg-secondary">{t.projectElements.no_parent}</option>
                                                {elements.filter(el => !el.parent_id).map(el => (
                                                    <option key={el.id} value={el.id} className="bg-secondary">{el.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={handleAddElement}
                                        disabled={isAddingElement || !newElementTitle.trim()}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isAddingElement ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                        {newElementParentId ? t.projectElements.add_sub_element : t.projectElements.add_element}
                                    </button>
                                    {(newElementTitle || newElementPrice || newElementCategoryId || newElementParentId) && (
                                        <button
                                            onClick={() => {
                                                setNewElementTitle('');
                                                setNewElementPrice('');
                                                setNewElementCategoryId('');
                                                setNewElementParentId('');
                                                setShowAdvancedElementForm(false);
                                            }}
                                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
                                        >
                                            {t.projectElements.reset}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Elements list */}
                            <div className="space-y-2">
                                {elements.length === 0 ? (
                                    <p className="text-white/40 text-center py-8">{t.projectElements.no_elements}</p>
                                ) : (
                                    <>
                                        {/* Parent elements */}
                                        {elements.filter(el => !el.parent_id).map(element => (
                                            <div key={element.id}>
                                                <div
                                                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${element.is_done ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/10'
                                                        }`}
                                                >
                                                    <button
                                                        onClick={() => handleToggleElementDone(element)}
                                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${element.is_done ? 'bg-green-500 border-green-500' : 'border-white/30 hover:border-white/50'
                                                            }`}
                                                    >
                                                        {element.is_done && <Check className="w-4 h-4 text-white" />}
                                                    </button>
                                                    <div className={`p-1.5 rounded flex-shrink-0 ${element.type === 'task' ? 'bg-blue-500/20 text-blue-400' :
                                                        element.type === 'make' ? 'bg-purple-500/20 text-purple-400' :
                                                            'bg-orange-500/20 text-orange-400'
                                                        }`}>
                                                        {element.type === 'task' ? <ListChecks className="w-4 h-4" /> :
                                                            element.type === 'make' ? <Wrench className="w-4 h-4" /> :
                                                                <ShoppingCart className="w-4 h-4" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className={`block ${element.is_done ? 'text-white/50 line-through' : 'text-white'}`}>
                                                            {element.title}
                                                        </span>
                                                        {element.parent_id && (
                                                            <span className="text-white/30 text-xs">Sous-élément</span>
                                                        )}
                                                    </div>
                                                    {element.price && elements.filter(child => child.parent_id === element.id).length === 0 && (
                                                        <span className="text-green-400 text-sm flex items-center gap-1 flex-shrink-0">
                                                            <DollarSign className="w-3 h-3" />
                                                            {element.price}
                                                        </span>
                                                    )}
                                                    {element.category && (
                                                        <span className="text-white/40 text-xs bg-white/5 px-2 py-1 rounded flex-shrink-0">
                                                            {element.category.name}
                                                        </span>
                                                    )}
                                                    {element.total_working_time && element.total_working_time !== '0m' && (
                                                        <span className="text-white/40 text-sm flex items-center gap-1 flex-shrink-0">
                                                            <Clock className="w-3 h-3" />
                                                            {element.total_working_time}
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteElement(element.id)}
                                                        className="p-1 text-white/40 hover:text-red-400 transition-colors flex-shrink-0"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Child elements */}
                                                {elements.filter(child => child.parent_id === element.id).length > 0 && (
                                                    <div className="ml-12 mt-2 space-y-2 border-l-2 border-white/10 pl-4">
                                                        {elements.filter(child => child.parent_id === element.id).map(childElement => (
                                                            <div
                                                                key={childElement.id}
                                                                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${childElement.is_done ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/10'
                                                                    }`}
                                                            >
                                                                <button
                                                                    onClick={() => handleToggleElementDone(childElement)}
                                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${childElement.is_done ? 'bg-green-500 border-green-500' : 'border-white/30 hover:border-white/50'
                                                                        }`}
                                                                >
                                                                    {childElement.is_done && <Check className="w-3 h-3 text-white" />}
                                                                </button>
                                                                <div className={`p-1 rounded flex-shrink-0 ${childElement.type === 'task' ? 'bg-blue-500/20 text-blue-400' :
                                                                    childElement.type === 'make' ? 'bg-purple-500/20 text-purple-400' :
                                                                        'bg-orange-500/20 text-orange-400'
                                                                    }`}>
                                                                    {childElement.type === 'task' ? <ListChecks className="w-3 h-3" /> :
                                                                        childElement.type === 'make' ? <Wrench className="w-3 h-3" /> :
                                                                            <ShoppingCart className="w-3 h-3" />}
                                                                </div>
                                                                <span className={`flex-1 text-sm ${childElement.is_done ? 'text-white/50 line-through' : 'text-white'}`}>
                                                                    {childElement.title}
                                                                </span>
                                                                {childElement.price && (
                                                                    <span className="text-green-400 text-xs flex items-center gap-1 flex-shrink-0">
                                                                        <DollarSign className="w-3 h-3" />
                                                                        {childElement.price}
                                                                    </span>
                                                                )}
                                                                {childElement.category && (
                                                                    <span className="text-white/40 text-xs bg-white/5 px-2 py-0.5 rounded flex-shrink-0">
                                                                        {childElement.category.name}
                                                                    </span>
                                                                )}
                                                                {childElement.total_working_time && childElement.total_working_time !== '0m' && (
                                                                    <span className="text-white/40 text-xs flex items-center gap-1 flex-shrink-0">
                                                                        <Clock className="w-3 h-3" />
                                                                        {childElement.total_working_time}
                                                                    </span>
                                                                )}
                                                                <button
                                                                    onClick={() => handleDeleteElement(childElement.id)}
                                                                    className="p-1 text-white/40 hover:text-red-400 transition-colors flex-shrink-0"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* === Section: Temps de travail === */}
                <div className="bg-secondary border border-white/10 rounded-2xl overflow-hidden">
                    <button
                        onClick={() => toggleSection('time')}
                        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-orange-400" />
                            <h2 className="text-white text-lg font-bold">{t.timeManagement.title}</h2>
                            <span className="bg-white/10 text-white/60 text-sm px-2 py-0.5 rounded-full">{project.total_project_working_time || '0min'}</span>
                        </div>
                        {sectionsOpen.time ? <ChevronUp className="w-5 h-5 text-white/60" /> : <ChevronDown className="w-5 h-5 text-white/60" />}
                    </button>

                    {sectionsOpen.time && (
                        <div className="p-6 pt-0 space-y-4">
                            {/* Add time button/form */}
                            {showAddTime ? (
                                <div className="space-y-3">
                                    <div className="flex gap-2 items-end">
                                        <div className="w-32">
                                            <label className="text-white/50 text-xs mb-1 block">{t.timeManagement.label_hours}</label>
                                            <input
                                                type="number"
                                                value={newTimeEntry.hours}
                                                onChange={e => setNewTimeEntry(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                                min="0"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="w-32">
                                            <label className="text-white/50 text-xs mb-1 block">{t.timeManagement.label_minutes}</label>
                                            <input
                                                type="number"
                                                value={newTimeEntry.minutes}
                                                onChange={e => setNewTimeEntry(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                                min="0"
                                                max="59"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-white/50 text-xs mb-1 block">{t.timeManagement.label_project_elements}</label>
                                            <select
                                                value={newTimeEntry.element_id}
                                                onChange={e => setNewTimeEntry(prev => ({ ...prev, element_id: e.target.value }))}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                            >
                                                <option value="" className="bg-secondary">{t.timeManagement.label_global_time_project}</option>
                                                {elements.map(el => (
                                                    <option key={el.id} value={el.id} className="bg-secondary">{el.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button onClick={handleAddTimeEntry} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setShowAddTime(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAddTime(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                    {t.timeManagement.add_action}
                                </button>
                            )}

                            {/* Time entries list */}
                            <div className="space-y-2">
                                {timeEntries.length === 0 ? (
                                    <p className="text-white/40 text-center py-8">{t.timeManagement.no_entries}</p>
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
                    )}
                </div>

                {/* === Section: Galerie === */}
                <div className="bg-secondary border border-white/10 rounded-2xl overflow-hidden">
                    <button
                        onClick={() => toggleSection('gallery')}
                        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Camera className="w-5 h-5 text-green-400" />
                            <h2 className="text-white text-lg font-bold">Galerie</h2>
                            <span className="bg-white/10 text-white/60 text-sm px-2 py-0.5 rounded-full">
                                {project.photos.length + project.photoReferences.length + project.photoshoots.length}
                            </span>
                        </div>
                        {sectionsOpen.gallery ? <ChevronUp className="w-5 h-5 text-white/60" /> : <ChevronDown className="w-5 h-5 text-white/60" />}
                    </button>

                    {sectionsOpen.gallery && (
                        <div className="p-6 pt-0">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-white/60 text-sm mb-2 flex items-center gap-2">
                                        <Camera className="w-4 h-4" /> Photos ({project.photos.length})
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {project.photos.slice(0, 4).map(photo => (
                                            <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-white/5">
                                                <ImageWithFallback src={photo.photo[0]?.preview_url || photo.photo[0]?.original_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm mb-2 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" /> Références ({project.photoReferences.length})
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {project.photoReferences.slice(0, 4).map(ref => (
                                            <div key={ref.id} className="aspect-square rounded-lg overflow-hidden bg-white/5">
                                                <ImageWithFallback src={ref.photo[0]?.preview_url || ref.photo[0]?.original_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm mb-2 flex items-center gap-2">
                                        <Camera className="w-4 h-4" /> Photoshoots ({project.photoshoots.length})
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {project.photoshoots.slice(0, 4).map(shoot => (
                                            <div key={shoot.id} className="aspect-square rounded-lg overflow-hidden bg-white/5">
                                                <ImageWithFallback src={shoot.cover_image || shoot.images[0]?.image_thumb_url} alt={shoot.title} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete confirmation modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80" onClick={() => setShowDeleteConfirm(false)} />
                    <div className="relative bg-secondary border border-white/10 rounded-2xl p-6 max-w-md">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                            <div>
                                <h3 className="text-white font-bold mb-2">{t.projectEdit.deleteConfirmTitle}</h3>
                                <p className="text-white/60 text-sm mb-4">{t.projectEdit.deleteConfirmDesc}</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleDeleteProject}
                                        disabled={isDeleting}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                    >
                                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        {t.projectEdit.confirmDelete}
                                    </button>
                                    <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg">
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

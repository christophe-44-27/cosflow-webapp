'use client';

import { Header } from './header';
import { Image, SlidersHorizontal, MoreVertical, Calendar, Users, ChevronLeft, ChevronRight, Lock, Globe, Search, X, ArrowUpDown, Clock, CheckCircle, Circle, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MyProject, ApiResponse } from '../lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTranslations, useLocale } from '../lib/locale-context';

interface Filters {
    search: string;
    status: 'all' | 'in_progress' | 'completed';
    visibility: 'all' | 'public' | 'private';
    recent: boolean;
    sort: string;
}

const defaultFilters: Filters = {
    search: '',
    status: 'all',
    visibility: 'all',
    recent: false,
    sort: '-id',
};

export function WebProjectsView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations();
    const { locale } = useLocale();
    const [projects, setProjects] = useState<MyProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(() => {
        const pageFromUrl = searchParams.get('page');
        return pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
    });
    const [totalPages, setTotalPages] = useState(1);
    const [totalProjects, setTotalProjects] = useState(0);
    const perPage = 20;

    // Filters state
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== filters.search) {
                setFilters(prev => ({ ...prev, search: searchInput }));
                setCurrentPage(1);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput, filters.search]);

    const updatePage = (newPage: number) => {
        setCurrentPage(newPage);
        router.push(`?page=${newPage}`, { scroll: false });
    };

    const updateFilter = useCallback((key: keyof Filters, value: Filters[keyof Filters]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(defaultFilters);
        setSearchInput('');
        setCurrentPage(1);
    }, []);

    const hasActiveFilters = filters.search !== '' ||
        filters.status !== 'all' ||
        filters.visibility !== 'all' ||
        filters.recent ||
        filters.sort !== '-id';

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const queryParams = new URLSearchParams({
                    page: currentPage.toString(),
                    per_page: perPage.toString(),
                    sort: filters.sort,
                    locale: locale,
                });

                // Add search filter
                if (filters.search) {
                    queryParams.append('filter[search]', filters.search);
                }

                // Add status filter
                if (filters.status === 'completed') {
                    queryParams.append('filter[completed]', 'true');
                } else if (filters.status === 'in_progress') {
                    queryParams.append('filter[in_progress]', 'true');
                }

                // Add visibility filter
                if (filters.visibility === 'public') {
                    queryParams.append('filter[public_projects]', 'true');
                } else if (filters.visibility === 'private') {
                    queryParams.append('filter[is_private]', 'true');
                }

                // Add recent filter
                if (filters.recent) {
                    queryParams.append('filter[recent]', 'true');
                }

                const response = await fetch(`/api/projects?${queryParams.toString()}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data: ApiResponse<MyProject[]> = await response.json();
                setProjects(data.data);
                if (data.meta) {
                    setTotalPages(data.meta.last_page);
                    setTotalProjects(data.meta.total);
                }
            } catch (err) {
                setError(t.projects.errorLoading);
                console.error('Error fetching projects:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage, locale, filters, t.projects.errorLoading]);

    const sortOptions = [
        { value: '-id', label: 'Plus récent' },
        { value: 'id', label: 'Plus ancien' },
        { value: 'name', label: 'Nom (A-Z)' },
        { value: '-name', label: 'Nom (Z-A)' },
        { value: '-created_at', label: 'Date de création' },
        { value: 'estimated_end_date', label: 'Date de fin estimée' },
    ];

    return (
        <div className="flex-1">
            <Header title={t.projects.title} />

            <div className="p-8 space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-primary to-primary/70 rounded-2xl p-6">
                        <h3 className="text-white/80 mb-2">Total Projets</h3>
                        <p className="text-white text-2xl font-semibold">{isLoading ? '...' : totalProjects}</p>
                    </div>
                    <div className="bg-gradient-to-br from-tertiary to-tertiary/70 rounded-2xl p-6">
                        <h3 className="text-white/80 mb-2">Pages</h3>
                        <p className="text-white text-2xl font-semibold">{isLoading ? '...' : totalPages}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-500/70 rounded-2xl p-6">
                        <h3 className="text-white/80 mb-2">Page Actuelle</h3>
                        <p className="text-white text-2xl font-semibold">{currentPage}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-500/70 rounded-2xl p-6">
                        <h3 className="text-white/80 mb-2">Projets/Page</h3>
                        <p className="text-white text-2xl font-semibold">{perPage}</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Rechercher un projet..."
                        className="w-full pl-12 pr-12 py-3 bg-secondary border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    {searchInput && (
                        <button
                            onClick={() => {
                                setSearchInput('');
                                setFilters(prev => ({ ...prev, search: '' }));
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Status Filters */}
                    <div className="flex items-center gap-2 bg-secondary rounded-xl p-1 border border-white/10">
                        <button
                            onClick={() => updateFilter('status', 'all')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                filters.status === 'all'
                                    ? 'bg-primary text-white'
                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Circle className="w-4 h-4" />
                            <span>Tous</span>
                        </button>
                        <button
                            onClick={() => updateFilter('status', 'in_progress')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                filters.status === 'in_progress'
                                    ? 'bg-blue-500/30 text-blue-400'
                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Clock className="w-4 h-4" />
                            <span>En cours</span>
                        </button>
                        <button
                            onClick={() => updateFilter('status', 'completed')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                filters.status === 'completed'
                                    ? 'bg-green-500/30 text-green-400'
                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <CheckCircle className="w-4 h-4" />
                            <span>Terminé</span>
                        </button>
                    </div>

                    {/* Visibility Filters */}
                    <div className="flex items-center gap-2 bg-secondary rounded-xl p-1 border border-white/10">
                        <button
                            onClick={() => updateFilter('visibility', 'all')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                filters.visibility === 'all'
                                    ? 'bg-primary text-white'
                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <span>Tous</span>
                        </button>
                        <button
                            onClick={() => updateFilter('visibility', 'public')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                filters.visibility === 'public'
                                    ? 'bg-green-500/30 text-green-400'
                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Eye className="w-4 h-4" />
                            <span>Publics</span>
                        </button>
                        <button
                            onClick={() => updateFilter('visibility', 'private')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                filters.visibility === 'private'
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <EyeOff className="w-4 h-4" />
                            <span>Privés</span>
                        </button>
                    </div>

                    {/* Recent Filter */}
                    <button
                        onClick={() => updateFilter('recent', !filters.recent)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                            filters.recent
                                ? 'bg-orange-500/30 text-orange-400 border-orange-500/30'
                                : 'bg-secondary text-white/70 border-white/10 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Clock className="w-4 h-4" />
                        <span>Récents (30j)</span>
                    </button>

                    <div className="flex-1"></div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            <span>{sortOptions.find(o => o.value === filters.sort)?.label || 'Trier'}</span>
                        </button>
                        {showAdvancedFilters && (
                            <div className="absolute right-0 top-full mt-2 bg-secondary border border-white/10 rounded-xl shadow-xl z-10 min-w-[200px] overflow-hidden">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            updateFilter('sort', option.value);
                                            setShowAdvancedFilters(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors ${
                                            filters.sort === option.value
                                                ? 'text-primary bg-primary/10'
                                                : 'text-white/80'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Advanced Filters Button */}
                    <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                            hasActiveFilters
                                ? 'bg-primary/20 text-primary border-primary/30'
                                : 'bg-secondary text-white border-white/10 hover:bg-white/5'
                        }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Filtres</span>
                        {hasActiveFilters && (
                            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                                {[
                                    filters.search && 1,
                                    filters.status !== 'all' && 1,
                                    filters.visibility !== 'all' && 1,
                                    filters.recent && 1,
                                    filters.sort !== '-id' && 1,
                                ].filter(Boolean).length}
                            </span>
                        )}
                    </button>

                    {/* Reset Filters */}
                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            <span>Réinitialiser</span>
                        </button>
                    )}
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-white/60">Filtres actifs:</span>
                        {filters.search && (
                            <span className="bg-white/10 text-white px-3 py-1 rounded-lg flex items-center gap-2">
                                Recherche: "{filters.search}"
                                <button onClick={() => { setSearchInput(''); updateFilter('search', ''); }}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.status !== 'all' && (
                            <span className="bg-white/10 text-white px-3 py-1 rounded-lg flex items-center gap-2">
                                Statut: {filters.status === 'in_progress' ? 'En cours' : 'Terminé'}
                                <button onClick={() => updateFilter('status', 'all')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.visibility !== 'all' && (
                            <span className="bg-white/10 text-white px-3 py-1 rounded-lg flex items-center gap-2">
                                Visibilité: {filters.visibility === 'public' ? 'Publics' : 'Privés'}
                                <button onClick={() => updateFilter('visibility', 'all')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.recent && (
                            <span className="bg-white/10 text-white px-3 py-1 rounded-lg flex items-center gap-2">
                                Récents (30j)
                                <button onClick={() => updateFilter('recent', false)}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.sort !== '-id' && (
                            <span className="bg-white/10 text-white px-3 py-1 rounded-lg flex items-center gap-2">
                                Tri: {sortOptions.find(o => o.value === filters.sort)?.label}
                                <button onClick={() => updateFilter('sort', '-id')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 text-red-500 text-center">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-secondary border border-white/10 rounded-2xl p-6 animate-pulse">
                                <div className="flex items-start gap-6">
                                    <div className="w-24 h-24 bg-white/5 rounded-xl"></div>
                                    <div className="flex-1 space-y-3">
                                        <div className="h-6 bg-white/5 rounded w-1/3"></div>
                                        <div className="h-4 bg-white/5 rounded w-1/4"></div>
                                        <div className="h-4 bg-white/5 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Projects List */}
                {!isLoading && !error && (
                    <div className="space-y-4">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/projects/${project.slug}?owner=true`}
                                className="block bg-secondary border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all group cursor-pointer"
                            >
                                <div className="flex items-start gap-6">
                                    {/* Project Image */}
                                    <div className="w-24 h-24 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-primary/30 transition-colors">
                                        <ImageWithFallback
                                            src={project.image_url}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Project Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-white text-lg font-medium">{project.title}</h3>
                                                    {project.is_private ? (
                                                        <Lock className="w-4 h-4 text-white/40" />
                                                    ) : (
                                                        <Globe className="w-4 h-4 text-green-400/70" />
                                                    )}
                                                </div>
                                                <div className="flex gap-2 flex-wrap">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white/10 text-white text-sm">
                                                        {project.category.name}
                                                    </span>
                                                    {project.fandom && (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/20 text-primary text-sm border border-primary/30">
                                                            {project.fandom.name}
                                                        </span>
                                                    )}
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm ${
                                                        project.status === 'completed'
                                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                            : project.status === 'in_progress'
                                                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                            : 'bg-white/10 text-white/70'
                                                    }`}>
                                                        {project.status === 'completed' ? 'Terminé' : project.status === 'in_progress' ? 'En cours' : 'Brouillon'}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => e.preventDefault()}
                                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                <MoreVertical className="w-5 h-5 text-white/60" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="flex items-center gap-2 text-white/80">
                                                <Image className="w-4 h-4 text-white/60" />
                                                <span className="text-sm">{project.photos.length} photos</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-white/80">
                                                <Calendar className="w-4 h-4 text-white/60" />
                                                <span className="text-sm">{project.created_at}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-white/80">
                                                <Users className="w-4 h-4 text-white/60" />
                                                <span className="text-sm">{project.user.profile.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && projects.length === 0 && (
                    <div className="bg-secondary border border-white/10 rounded-2xl p-12 text-center">
                        <Image className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <h3 className="text-white text-lg mb-2">{t.projects.noProjects}</h3>
                        <p className="text-white/60 mb-4">{t.projects.noProjectsDesc}</p>
                        {hasActiveFilters && (
                            <button
                                onClick={resetFilters}
                                className="text-primary hover:text-primary/80 transition-colors"
                            >
                                Réinitialiser les filtres
                            </button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && !error && projects.length > 0 && (
                    <div className="bg-secondary border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            {/* Previous Button */}
                            <button
                                onClick={() => updatePage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span className="font-medium">{t.projects.pagination.previous}</span>
                            </button>

                            {/* Page Info */}
                            <div className="text-center">
                                <div className="text-white text-lg font-medium mb-1">
                                    {t.projects.pagination.page} {currentPage} {t.projects.pagination.of} {totalPages}
                                </div>
                                <div className="text-white/60 text-sm">
                                    {totalProjects} {t.projects.pagination.projectsTotal}
                                </div>
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={() => updatePage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <span className="font-medium">{t.projects.pagination.next}</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

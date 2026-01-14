'use client';

import { Header } from './header';
import { Image, SlidersHorizontal, MoreVertical, Calendar, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiService } from '../lib/api';
import { Project } from '../lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function WebProjectsView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(() => {
        const pageFromUrl = searchParams.get('page');
        return pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
    });
    const [totalPages, setTotalPages] = useState(1);
    const [totalProjects, setTotalProjects] = useState(0);
    const perPage = 20;

    const updatePage = (newPage: number) => {
        setCurrentPage(newPage);
        router.push(`?page=${newPage}`, { scroll: false });
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await apiService.getProjects({
                    page: currentPage,
                    per_page: perPage,
                    sort: '-id'
                });
                setProjects(response.data);
                if (response.meta) {
                    setTotalPages(response.meta.last_page);
                    setTotalProjects(response.meta.total);
                }
            } catch (err) {
                setError('Erreur lors du chargement des projets');
                console.error('Error fetching projects:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    return (
        <div className="flex-1">
            <Header title="Projets Publics" showSearch={true} showAddButton={true} />

            <div className="p-8 space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-primary to-primary/70 rounded-2xl p-6">
                        <h3 className="text-white/80 mb-2">Total Projets</h3>
                        <p className="text-white">{isLoading ? '...' : totalProjects}</p>
                    </div>
                    <div className="bg-gradient-to-br from-tertiary to-tertiary/70 rounded-2xl p-6">
                        <h3 className="text-white/80 mb-2">Pages</h3>
                        <p className="text-white">{isLoading ? '...' : totalPages}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-500/70 rounded-2xl p-6">
                        <h3 className="text-white/80 mb-2">Page Actuelle</h3>
                        <p className="text-white">{currentPage}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-500/70 rounded-2xl p-6">
                        <h3 className="text-white/80 mb-2">Projets/Page</h3>
                        <p className="text-white">{perPage}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 rounded-lg bg-primary text-white">
                        Tous les projets
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 transition-colors">
                        Anime/Manga
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 transition-colors">
                        Gaming
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 transition-colors">
                        Original
                    </button>
                    <div className="flex-1"></div>
                    <button className="flex items-center gap-2 bg-white/5 text-white px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Filtres</span>
                    </button>
                </div>

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
                                href={`/projects/${project.slug}`}
                                className="block bg-secondary border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all group cursor-pointer"
                            >
                                <div className="flex items-start gap-6">
                                    {/* Project Image */}
                                    <div className="w-24 h-24 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-primary/30 transition-colors">
                                        <ImageWithFallback
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Project Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-white mb-2 text-lg font-medium">{project.title}</h3>
                                                <div className="flex gap-2">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/20 text-primary text-sm border border-primary/30">
                                                        {project.fandom}
                                                    </span>
                                                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white/10 text-white text-sm">
                                                        @{project.username}
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                                <MoreVertical className="w-5 h-5 text-white/60" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="flex items-center gap-2 text-white/80">
                                                <Image className="w-4 h-4 text-white/60" />
                                                <span className="text-sm">{project.photos_count} photos</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-white/80">
                                                <Calendar className="w-4 h-4 text-white/60" />
                                                <span className="text-sm">
                                                    {new Date(project.created_at).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-white/80">
                                                <Users className="w-4 h-4 text-white/60" />
                                                <span className="text-sm">{project.username}</span>
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
                        <h3 className="text-white text-lg mb-2">Aucun projet trouvé</h3>
                        <p className="text-white/60">Les projets publics apparaîtront ici.</p>
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
                                <span className="font-medium">Précédent</span>
                            </button>

                            {/* Page Info */}
                            <div className="text-center">
                                <div className="text-white text-lg font-medium mb-1">
                                    Page {currentPage} sur {totalPages}
                                </div>
                                <div className="text-white/60 text-sm">
                                    {totalProjects} projets au total
                                </div>
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={() => updatePage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <span className="font-medium">Suivant</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
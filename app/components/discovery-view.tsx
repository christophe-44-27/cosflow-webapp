'use client';

import { Header } from './header';
import {Heart, Camera, Eye, MapPin, ChevronLeft, ChevronRight} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiService } from '../lib/api';
import { User, Project } from '../lib/types';

export function DiscoveryView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [creators, setCreators] = useState<User[]>([]);
    const [publicProjects, setPublicProjects] = useState<Project[]>([]);
    const [isLoadingCreators, setIsLoadingCreators] = useState(true);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [creatorsError, setCreatorsError] = useState<string | null>(null);
    const [projectsError, setProjectsError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(() => {
        const pageFromUrl = searchParams.get('page');
        return pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
    });
    const [totalPages, setTotalPages] = useState(1);
    const [totalProjects, setTotalProjects] = useState(0);
    const perPage = 6;

    const updatePage = (newPage: number) => {
        setCurrentPage(newPage);
        router.push(`?page=${newPage}`, { scroll: false });
    };

    useEffect(() => {
        const fetchCreators = async () => {
            try {
                setIsLoadingCreators(true);
                setCreatorsError(null);
                const response = await apiService.getUsers({
                    per_page: 4,
                    sort: '-id'
                });
                setCreators(response.data.slice(0, 4));
            } catch (err) {
                setCreatorsError('Erreur lors du chargement des créateurs');
                console.error('Error fetching creators:', err);
            } finally {
                setIsLoadingCreators(false);
            }
        };

        fetchCreators();
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoadingProjects(true);
                setProjectsError(null);
                const response = await apiService.getProjects({
                    page: currentPage,
                    per_page: perPage,
                    sort: '-id'
                });
                setPublicProjects(response.data);
                if (response.meta) {
                    setTotalPages(response.meta.last_page);
                    setTotalProjects(response.meta.total);
                }
            } catch (err) {
                setProjectsError('Erreur lors du chargement des projets');
                console.error('Error fetching projects:', err);
            } finally {
                setIsLoadingProjects(false);
            }
        };

        fetchProjects();
    }, [currentPage]);

    return (
        <div className="flex-1">
            <Header title="Découverte" showSearch={true} />

            <div className="p-8 space-y-8">
                {/* Featured Creators */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white">Cosflow creators</h2>
                        <button className="text-tertiary hover:text-tertiary/80 transition-colors">
                            Voir tout
                        </button>
                    </div>

                    {isLoadingCreators ? (
                        <div className="grid grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="bg-secondary border border-white/10 rounded-2xl overflow-hidden animate-pulse"
                                >
                                    <div className="h-24 bg-white/5" />
                                    <div className="px-5 pb-5 -mt-8 relative space-y-3">
                                        <div className="w-16 h-16 bg-white/5 rounded-xl" />
                                        <div className="space-y-2">
                                            <div className="h-4 bg-white/5 rounded w-3/4" />
                                            <div className="h-3 bg-white/5 rounded w-full" />
                                        </div>
                                        <div className="h-10 bg-white/5 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : creatorsError ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                            <p className="text-red-400">{creatorsError}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-6">
                            {creators.map((creator) => {
                                const avatarInitial = creator.name.charAt(0).toUpperCase();

                                return (
                                    <Link
                                        key={creator.id}
                                        href={`/profile/${creator.slug}`}
                                        className="group bg-secondary border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
                                    >
                                        {/* Cover Image */}
                                        {/* Cover Image */}
                                        <div className="h-24 relative overflow-hidden">
                                            <ImageWithFallback
                                                src={creator.cover}
                                                alt={creator.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary" />
                                        </div>

                                        {/* Profile */}
                                        <div className="px-5 pb-5 -mt-8 relative">
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-tertiary rounded-xl flex items-center justify-center mb-3 border-4 border-secondary overflow-hidden">
                                                {creator.has_avatar && creator.avatar ? (
                                                    <img
                                                        src={creator.avatar}
                                                        alt={creator.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-white text-xl">{avatarInitial}</span>
                                                )}
                                            </div>

                                            <div className="mb-3">
                                                <h3 className="text-white mb-2">{creator.name}</h3>
                                                {creator.description && (
                                                    <p className="text-white/80 text-sm line-clamp-2 mb-3">{creator.description}</p>
                                                )}
                                                <div className="flex items-center gap-1 text-white/60 text-sm">
                                                    <MapPin className="w-3 h-3" />
                                                    {creator.country}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-4 text-sm">
                                                <div>
                                                    <p className="text-white">{creator.stats.followers_count}</p>
                                                    <p className="text-white/60">Abonnés</p>
                                                </div>
                                                <div>
                                                    <p className="text-white">{creator.stats.public_projects_count}</p>
                                                    <p className="text-white/60">Projets</p>
                                                </div>
                                            </div>

                                            <span className="block w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg transition-colors text-center">
                                                Voir le profil
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Public Projects */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white">Projets publics</h2>
                        <button className="text-tertiary hover:text-tertiary/80 transition-colors">
                            Voir tout
                        </button>
                    </div>

                    {isLoadingProjects ? (
                        <div className="grid grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="bg-secondary border border-white/10 rounded-2xl overflow-hidden animate-pulse"
                                >
                                    <div className="aspect-[4/3] bg-white/5" />
                                    <div className="p-6 space-y-3">
                                        <div className="h-4 bg-white/5 rounded w-3/4" />
                                        <div className="h-3 bg-white/5 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : projectsError ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                            <p className="text-red-400">{projectsError}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-6">
                            {publicProjects.map((project) => {
                                const authorInitial = project.username.charAt(0).toUpperCase();

                                return (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.slug}`}
                                        className="group relative bg-secondary border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
                                    >
                                        <div className="aspect-[4/3] relative overflow-hidden">
                                            <ImageWithFallback
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                            <span className="absolute top-4 left-4 px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-lg text-white text-sm">
                                                {project.fandom}
                                            </span>

                                            <button className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100">
                                                <Heart className="w-5 h-5 text-white" />
                                            </button>
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h3 className="text-white mb-2">{project.title}</h3>

                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                                    <ImageWithFallback
                                                        src={project.avatar}
                                                        alt={project.username}
                                                        className="w-full h-full object-cover"
                                                        fallback={
                                                            <div className="w-full h-full bg-gradient-to-br from-primary to-tertiary flex items-center justify-center">
                                                                <span className="text-white text-sm">{authorInitial}</span>
                                                            </div>
                                                        }
                                                    />
                                                </div>
                                                <p className="text-white/80 text-sm">@{project.username}</p>
                                            </div>

                                            <div className="flex items-center gap-4 text-white/60 text-sm">
                                                <span className="flex items-center gap-1">
                                                    <Camera className="w-4 h-4" />
                                                    {project.photos_count}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {!isLoadingProjects && !projectsError && publicProjects.length > 0 && (
                        <div className="bg-secondary border border-white/10 rounded-2xl p-6 mt-6">
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
        </div>
    );
}

'use client';

import { Header } from './header';
import {Heart, Camera, MapPin, ChevronLeft, ChevronRight} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiService } from '../lib/api';
import { User, Project } from '../lib/types';
import { useTranslations } from '../lib/locale-context';

export function DiscoveryView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations();
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
            <Header title={t.discovery.title} showSearch={false} />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                {/* Featured Creators */}
                <div>
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-white text-lg sm:text-xl">{t.discovery.featuredCreators}</h2>
                        <Link href="/creators" className="text-tertiary hover:text-tertiary/80 transition-colors text-sm sm:text-base">
                            {t.discovery.viewAll}
                        </Link>
                    </div>

                    {isLoadingCreators ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="bg-secondary border border-white/10 rounded-2xl overflow-hidden animate-pulse"
                                >
                                    <div className="h-20 sm:h-24 bg-white/5" />
                                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 -mt-7 sm:-mt-8 relative space-y-3">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/5 rounded-xl" />
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
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 sm:p-6 text-center">
                            <p className="text-red-400 text-sm sm:text-base">{creatorsError}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            {creators.map((creator) => {
                                const avatarInitial = creator.name.charAt(0).toUpperCase();

                                return (
                                    <Link
                                        key={creator.id}
                                        href={`/profile/${creator.slug}`}
                                        className="group bg-secondary border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
                                    >
                                        {/* Cover Image */}
                                        <div className="h-20 sm:h-24 relative overflow-hidden">
                                            <ImageWithFallback
                                                src={creator.cover}
                                                alt={creator.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/50 to-secondary" />
                                        </div>

                                        {/* Profile */}
                                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 -mt-7 sm:-mt-8 relative">
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-tertiary rounded-xl flex items-center justify-center mb-3 border-[3px] sm:border-4 border-secondary overflow-hidden shadow-lg">
                                                {creator.has_avatar && creator.avatar ? (
                                                    <img
                                                        src={creator.avatar}
                                                        alt={creator.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-white text-lg sm:text-xl font-semibold">{avatarInitial}</span>
                                                )}
                                            </div>

                                            <div className="mb-4">
                                                <h3 className="text-white font-semibold mb-1.5 text-sm sm:text-lg line-clamp-1">{creator.name}</h3>
                                                {creator.description && (
                                                    <p className="text-white/70 text-xs sm:text-sm line-clamp-2 mb-2">{creator.description}</p>
                                                )}
                                                <div className="flex items-center gap-1 text-white/60 text-xs">
                                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                                    <span className="line-clamp-1">{creator.country}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-around mb-4 py-3 bg-white/5 rounded-lg">
                                                <div className="text-center">
                                                    <p className="text-white font-semibold text-sm sm:text-base">{creator.stats.followers_count}</p>
                                                    <p className="text-white/60 text-[10px] sm:text-xs">{t.discovery.followers}</p>
                                                </div>
                                                <div className="w-px h-8 bg-white/10"></div>
                                                <div className="text-center">
                                                    <p className="text-white font-semibold text-sm sm:text-base">{creator.stats.public_projects_count}</p>
                                                    <p className="text-white/60 text-[10px] sm:text-xs">{t.discovery.projects}</p>
                                                </div>
                                            </div>

                                            <span className="block w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 sm:py-2.5 rounded-lg transition-colors text-center text-xs sm:text-base">
                                                {t.discovery.viewProfile}
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
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-white text-lg sm:text-xl">{t.discovery.publicProjects}</h2>
                    </div>

                    {isLoadingProjects ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="bg-secondary border border-white/10 rounded-2xl overflow-hidden animate-pulse"
                                >
                                    <div className="aspect-[4/3] bg-white/5" />
                                    <div className="p-4 sm:p-6 space-y-3">
                                        <div className="h-4 bg-white/5 rounded w-3/4" />
                                        <div className="h-3 bg-white/5 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : projectsError ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 sm:p-6 text-center">
                            <p className="text-red-400 text-sm sm:text-base">{projectsError}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
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
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                                            <span className="hidden sm:block absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 sm:px-3 bg-primary/90 backdrop-blur-sm rounded-lg text-white text-xs sm:text-sm">
                                                {project.fandom}
                                            </span>

                                            <button className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100">
                                                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                            </button>
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                                            <h3 className="text-white font-semibold mb-2.5 text-sm sm:text-lg line-clamp-2 drop-shadow-lg">{project.title}</h3>

                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/20">
                                                    <ImageWithFallback
                                                        src={project.avatar}
                                                        alt={project.username}
                                                        className="w-full h-full object-cover"
                                                        fallback={
                                                            <div className="w-full h-full bg-gradient-to-br from-primary to-tertiary flex items-center justify-center">
                                                                <span className="text-white text-xs sm:text-sm">{authorInitial}</span>
                                                            </div>
                                                        }
                                                    />
                                                </div>
                                                <p className="text-white font-medium text-xs sm:text-sm drop-shadow-md">@{project.username}</p>
                                            </div>

                                            <div className="hidden sm:flex items-center gap-4 text-white/80 text-xs sm:text-sm mt-3">
                                                <span className="flex items-center gap-1">
                                                    <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    {project.photos_count} {t.discovery.photos}
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
                        <div className="bg-secondary border border-white/10 rounded-2xl p-3 sm:p-6 mt-4 sm:mt-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                                {/* Page Info */}
                                <div className="text-center order-first sm:order-none w-full sm:w-auto">
                                    <div className="text-white text-sm sm:text-lg font-medium mb-0.5 sm:mb-1">
                                        {t.pagination.page} {currentPage} {t.pagination.of} {totalPages}
                                    </div>
                                    <div className="text-white/60 text-[10px] sm:text-sm">
                                        {totalProjects} {t.discovery.projectsTotal}
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => updatePage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-1.5 px-3 sm:px-6 py-2 sm:py-3 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 sm:flex-none justify-center"
                                    >
                                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="font-medium text-xs sm:text-base">{t.pagination.previous}</span>
                                    </button>

                                    {/* Next Button */}
                                    <button
                                        onClick={() => updatePage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center gap-1.5 px-3 sm:px-6 py-2 sm:py-3 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 sm:flex-none justify-center"
                                    >
                                        <span className="font-medium text-xs sm:text-base">{t.pagination.next}</span>
                                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

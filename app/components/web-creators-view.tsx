'use client';

import { Header } from './header';
import { MapPin, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { publicApiService } from '../lib/services';
import { User } from '../lib/types';
import { useTranslations } from '../lib/locale-context';

export function WebCreatorsView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations();
    const [creators, setCreators] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(() => {
        const pageFromUrl = searchParams.get('page');
        return pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
    });
    const [totalPages, setTotalPages] = useState(1);
    const [totalCreators, setTotalCreators] = useState(0);
    const perPage = 12;

    const updatePage = (newPage: number) => {
        setCurrentPage(newPage);
        router.push(`?page=${newPage}`, { scroll: false });
    };

    useEffect(() => {
        const fetchCreators = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await publicApiService.getUsers({
                    page: currentPage,
                    per_page: perPage,
                    sort: '-id'
                });
                setCreators(response.data);
                if (response.meta) {
                    setTotalPages(response.meta.last_page);
                    setTotalCreators(response.meta.total);
                }
            } catch (err) {
                setError(t.creators.errorLoading);
                console.error('Error fetching creators:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCreators();
    }, [currentPage, t.creators.errorLoading]);

    // Filter creators based on search query
    const filteredCreators = creators.filter((creator) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            creator.name.toLowerCase().includes(searchLower) ||
            (creator.description && creator.description.toLowerCase().includes(searchLower)) ||
            (creator.country && creator.country.toLowerCase().includes(searchLower))
        );
    });

    return (
        <div className="flex-1">
            <Header title={t.creators.title} />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                {/* Search Bar */}
                <div className="bg-secondary border border-white/10 rounded-2xl p-4 sm:p-6">
                    <div className="relative">
                        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                        <input
                            type="text"
                            placeholder={t.creators.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/10 text-white placeholder:text-white/60 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
                        />
                    </div>
                </div>

                {/* Creators Grid */}
                <div>
                    {isLoading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            {[...Array(perPage)].map((_, i) => (
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
                    ) : error ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 sm:p-6 text-center">
                            <p className="text-red-400 text-sm sm:text-base">{error}</p>
                        </div>
                    ) : filteredCreators.length === 0 ? (
                        <div className="bg-secondary border border-white/10 rounded-2xl p-8 sm:p-12 text-center">
                            <h3 className="text-white mb-2 text-base sm:text-lg">{t.creators.noCreators}</h3>
                            <p className="text-white/60 text-sm sm:text-base">{t.creators.noCreatorsDesc}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            {filteredCreators.map((creator) => {
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
                                                {creator.country && (
                                                    <div className="flex items-center gap-1 text-white/60 text-xs">
                                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                                        <span className="line-clamp-1">{creator.country}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-around mb-4 py-3 bg-white/5 rounded-lg">
                                                <div className="text-center">
                                                    <p className="text-white font-semibold text-sm sm:text-base">{creator.stats.followers_count}</p>
                                                    <p className="text-white/60 text-[10px] sm:text-xs">{t.creators.followers}</p>
                                                </div>
                                                <div className="w-px h-8 bg-white/10"></div>
                                                <div className="text-center">
                                                    <p className="text-white font-semibold text-sm sm:text-base">{creator.stats.public_projects_count}</p>
                                                    <p className="text-white/60 text-[10px] sm:text-xs">{t.creators.projects}</p>
                                                </div>
                                            </div>

                                            <span className="block w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 sm:py-2.5 rounded-lg transition-colors text-center text-xs sm:text-base">
                                                {t.creators.viewProfile}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && !error && filteredCreators.length > 0 && !searchQuery && (
                    <div className="bg-secondary border border-white/10 rounded-2xl p-3 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                            {/* Page Info */}
                            <div className="text-center order-first sm:order-none w-full sm:w-auto">
                                <div className="text-white text-sm sm:text-lg font-medium mb-0.5 sm:mb-1">
                                    {t.creators.pagination.page} {currentPage} {t.creators.pagination.of} {totalPages}
                                </div>
                                <div className="text-white/60 text-[10px] sm:text-sm">
                                    {totalCreators} {t.creators.pagination.creatorsTotal}
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
                                    <span className="font-medium text-xs sm:text-base">{t.creators.pagination.previous}</span>
                                </button>

                                {/* Next Button */}
                                <button
                                    onClick={() => updatePage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1.5 px-3 sm:px-6 py-2 sm:py-3 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 sm:flex-none justify-center"
                                >
                                    <span className="font-medium text-xs sm:text-base">{t.creators.pagination.next}</span>
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

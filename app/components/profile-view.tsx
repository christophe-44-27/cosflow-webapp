'use client';

import { Header } from './header';
import {
    Camera,
    Share2,
    Calendar,
    X,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Users,
    Folder,
    Link as LinkIcon,
    ExternalLink,
    Twitch
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/features/auth';
import { publicApiService } from '../lib/services';
import { UserProfile, SocialLink, UserProfileProject, Event, Photoshoot } from '../lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { useLocale } from '../lib/locale-context';

interface ProfileViewProps {
    slug: string;
}

type TabType = 'projects' | 'photoshoots' | 'events';

interface PaginationMeta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

// Helper function to get social link by platform
function getSocialLink(socialLinks: SocialLink[], platform: string): string | null {
    const link = socialLinks.find(l => l.platform === platform);
    return link?.url || null;
}

// Social icon components
function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
    );
}

function TwitterIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
    );
}

function YoutubeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
    );
}

function TiktokIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
    );
}

// Loading Skeleton for tabs
function TabSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-secondary border border-white/10 rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-4/3 bg-white/5" />
                    <div className="p-4 space-y-2">
                        <div className="h-4 bg-white/5 rounded w-3/4" />
                        <div className="h-3 bg-white/5 rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ProfileView({ slug }: ProfileViewProps) {
    const { t } = useLocale();
    const { isLoggedIn, handleLoginRequired } = useAuth();

    // Profile state
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [profileError, setProfileError] = useState<string | null>(null);

    // UI state
    const [isFollowing, setIsFollowing] = useState(false);
    const [showCopied, setShowCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('projects');

    // Projects state
    const [projects, setProjects] = useState<UserProfileProject[]>([]);
    const [projectsMeta, setProjectsMeta] = useState<PaginationMeta | null>(null);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);
    const [projectsPage, setProjectsPage] = useState(1);

    // Events state
    const [events, setEvents] = useState<Event[]>([]);
    const [eventsMeta, setEventsMeta] = useState<PaginationMeta | null>(null);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [eventsPage, setEventsPage] = useState(1);

    // Photoshoots state
    const [photoshoots, setPhotoshoots] = useState<Photoshoot[]>([]);
    const [photoshootsMeta, setPhotoshootsMeta] = useState<PaginationMeta | null>(null);
    const [isLoadingPhotoshoots, setIsLoadingPhotoshoots] = useState(false);
    const [photoshootsPage, setPhotoshootsPage] = useState(1);

    // Gallery state
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
    const [selectedPhotoshootId, setSelectedPhotoshootId] = useState<number | null>(null);

    const perPage = 9;

    // Pagination component local to ProfileView with access to t
    function Pagination({
        meta,
        onPageChange,
        isLoading
    }: {
        meta: PaginationMeta;
        onPageChange: (page: number) => void;
        isLoading: boolean;
    }) {
        if (meta.last_page <= 1) return null;

        return (
            <div className="flex items-center justify-center gap-2 mt-6">
                <button
                    onClick={() => onPageChange(meta.current_page - 1)}
                    disabled={meta.current_page === 1 || isLoading}
                    className="px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    {t.common.previous}
                </button>
                <div className="px-4 py-2 text-white/60">
                    {t.common.page} {meta.current_page} {t.common.of} {meta.last_page}
                </div>
                <button
                    onClick={() => onPageChange(meta.current_page + 1)}
                    disabled={meta.current_page === meta.last_page || isLoading}
                    className="px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    {t.common.next}
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        );
    }

    // Fetch profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoadingProfile(true);
                setProfileError(null);
                const response = await publicApiService.getUserProfile(slug);
                setProfile(response.data);
                setIsFollowing(response.data.is_following || false);
            } catch (err) {
                setProfileError(t.profile.profileLoadError);
                console.error('Error fetching profile:', err);
            } finally {
                setIsLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [slug, t]);

    // Fetch projects
    useEffect(() => {
        if (!profile) return;

        const fetchProjects = async () => {
            try {
                setIsLoadingProjects(true);
                const response = await publicApiService.getUserProjects(slug, {
                    page: projectsPage,
                    per_page: perPage
                });
                setProjects(response.data);
                if (response.meta) {
                    setProjectsMeta({
                        current_page: response.meta.current_page,
                        last_page: response.meta.last_page,
                        total: response.meta.total,
                        per_page: response.meta.per_page
                    });
                }
            } catch (err) {
                console.error('Error fetching projects:', err);
            } finally {
                setIsLoadingProjects(false);
            }
        };

        fetchProjects();
    }, [slug, profile, projectsPage]);

    // Fetch events when tab is active
    useEffect(() => {
        if (!profile || activeTab !== 'events') return;

        const fetchEvents = async () => {
            try {
                setIsLoadingEvents(true);
                const response = await publicApiService.getUserEvents(slug, {
                    page: eventsPage,
                    per_page: perPage
                });
                setEvents(response.data);
                if (response.meta) {
                    setEventsMeta({
                        current_page: response.meta.current_page,
                        last_page: response.meta.last_page,
                        total: response.meta.total,
                        per_page: response.meta.per_page
                    });
                }
            } catch (err) {
                console.error('Error fetching events:', err);
            } finally {
                setIsLoadingEvents(false);
            }
        };

        fetchEvents();
    }, [slug, profile, activeTab, eventsPage]);

    // Fetch photoshoots when tab is active
    useEffect(() => {
        if (!profile || activeTab !== 'photoshoots') return;

        const fetchPhotoshoots = async () => {
            try {
                setIsLoadingPhotoshoots(true);
                const response = await publicApiService.getUserPhotoshoots(slug, {
                    page: photoshootsPage,
                    per_page: perPage
                });
                setPhotoshoots(response.data);
                if (response.meta) {
                    setPhotoshootsMeta({
                        current_page: response.meta.current_page,
                        last_page: response.meta.last_page,
                        total: response.meta.total,
                        per_page: response.meta.per_page
                    });
                }
            } catch (err) {
                console.error('Error fetching photoshoots:', err);
            } finally {
                setIsLoadingPhotoshoots(false);
            }
        };

        fetchPhotoshoots();
    }, [slug, profile, activeTab, photoshootsPage]);

    const handleFollow = () => {
        if (!isLoggedIn) {
            handleLoginRequired();
            return;
        }
        setIsFollowing(!isFollowing);
    };

    const handleShare = async () => {
        try {
            const url = window.location.href;
            await navigator.clipboard.writeText(url);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    const openPhotoshootGallery = (photoshootId: number, index: number = 0) => {
        setSelectedPhotoshootId(photoshootId);
        setSelectedPhotoIndex(index);
        document.body.style.overflow = 'hidden';
    };

    const closeGallery = useCallback(() => {
        setSelectedPhotoIndex(null);
        setSelectedPhotoshootId(null);
        document.body.style.overflow = 'auto';
    }, []);

    const goToPrevious = useCallback(() => {
        if (selectedPhotoIndex === null || selectedPhotoshootId === null) return;
        const shoot = photoshoots.find(s => s.id === selectedPhotoshootId);
        if (!shoot) return;
        setSelectedPhotoIndex(
            selectedPhotoIndex === 0 ? shoot.images.length - 1 : selectedPhotoIndex - 1
        );
    }, [selectedPhotoIndex, photoshoots, selectedPhotoshootId]);

    const goToNext = useCallback(() => {
        if (selectedPhotoIndex === null || selectedPhotoshootId === null) return;
        const shoot = photoshoots.find(s => s.id === selectedPhotoshootId);
        if (!shoot) return;
        setSelectedPhotoIndex(
            selectedPhotoIndex === shoot.images.length - 1 ? 0 : selectedPhotoIndex + 1
        );
    }, [selectedPhotoIndex, photoshoots, selectedPhotoshootId]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedPhotoIndex === null) return;
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPhotoIndex, closeGallery, goToPrevious, goToNext]);

    const getEventStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'ongoing':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'past':
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            default:
                return 'bg-white/10 text-white/60 border-white/20';
        }
    };

    const getEventStatusLabel = (status: string) => {
        switch (status) {
            case 'upcoming':
                return t.profile.upcoming;
            case 'ongoing':
                return t.profile.ongoing;
            case 'past':
                return t.profile.past;
            default:
                return status;
        }
    };

    // Handle tab change and reset page
    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        if (tab === 'projects') setProjectsPage(1);
        if (tab === 'events') setEventsPage(1);
        if (tab === 'photoshoots') setPhotoshootsPage(1);
    };

    if (isLoadingProfile) {
        return (
            <div className="flex-1">
                <Header title={t.profile.loading} />
                <div className="p-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-48 bg-white/5 rounded-2xl"></div>
                        <div className="h-8 bg-white/5 rounded w-1/3"></div>
                        <div className="h-4 bg-white/5 rounded w-1/4"></div>
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="aspect-square bg-white/5 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (profileError || !profile) {
        return (
            <div className="flex-1">
                <Header title={t.profile.error} />
                <div className="p-8">
                    <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 text-red-500 text-center">
                        {profileError || t.profile.profileNotFound}
                    </div>
                </div>
            </div>
        );
    }

    // Get social links
    const websiteUrl = getSocialLink(profile.social_links, 'website');
    const instagramUrl = getSocialLink(profile.social_links, 'instagram');
    const twitterUrl = getSocialLink(profile.social_links, 'twitter');
    const youtubeUrl = getSocialLink(profile.social_links, 'youtube');
    const tiktokUrl = getSocialLink(profile.social_links, 'tiktok');
    const twitchUrl = getSocialLink(profile.social_links, 'twitch');

    // Build tabs dynamically based on stats
    const tabs: { key: TabType; label: string; count: number; icon: React.ReactNode }[] = [
        {
            key: 'projects',
            label: t.profile.projects,
            count: profile.stats.public_projects_count,
            icon: <Folder className="w-4 h-4" />
        },
    ];

    // Only add photoshoots tab if count > 0
    if ((profile.stats.photoshoots_count ?? 0) > 0) {
        tabs.push({
            key: 'photoshoots',
            label: t.profile.photoshoots,
            count: profile.stats.photoshoots_count ?? 0,
            icon: <Camera className="w-4 h-4" />
        });
    }

    // Only add events tab if count > 0
    if (profile.stats.events_count > 0) {
        tabs.push({
            key: 'events',
            label: t.profile.events,
            count: profile.stats.events_count,
            icon: <Calendar className="w-4 h-4" />
        });
    }

    const hasSocialLinks = websiteUrl || instagramUrl || twitterUrl || youtubeUrl || tiktokUrl || twitchUrl;

    return (
        <div className="flex-1">
            <Header title={profile.name} />

            <div className="space-y-6">
                {/* Profile Header with Cover */}
                <div className="relative">
                    {/* Cover Image */}
                    <div className="h-48 md:h-64 relative overflow-hidden">
                        {profile.has_cover && profile.cover ? (
                            <ImageWithFallback
                                src={profile.cover}
                                alt={`Couverture de ${profile.name}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-linear-to-br from-primary/30 to-tertiary/30" />
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
                    </div>

                    {/* Profile Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="flex items-end gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-background shadow-2xl bg-secondary">
                                    {profile.has_avatar && profile.avatar ? (
                                        <ImageWithFallback
                                            src={profile.avatar}
                                            alt={profile.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-primary to-tertiary flex items-center justify-center">
                                            <span className="text-white text-4xl font-bold">
                                                {profile.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Name and Location */}
                            <div className="flex-1 pb-2">
                                <h1 className="text-white text-2xl md:text-3xl font-bold flex items-center gap-2">
                                    {profile.name}
                                </h1>
                                {profile.country && (
                                    <div className="flex items-center gap-1 text-white/60 mt-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{profile.country.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 pb-2">
                                <button
                                    onClick={handleFollow}
                                    className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                                        isFollowing
                                            ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                                            : 'bg-primary text-white hover:bg-primary/90'
                                    }`}
                                >
                                    {isFollowing ? t.profile.following : t.profile.follow}
                                </button>
                                <button
                                    onClick={handleShare}
                                    className={`p-2.5 rounded-xl border transition-colors ${
                                        showCopied
                                            ? 'bg-green-500 text-white border-green-500'
                                            : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                                    }`}
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats and Bio Section */}
                <div className="px-8">
                    <div className="bg-secondary border border-white/10 rounded-2xl p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Stats */}
                            <div className="flex items-center gap-6 justify-center lg:justify-start">
                                <div className="text-center">
                                    <p className="text-white text-2xl font-bold">{profile.stats.public_projects_count}</p>
                                    <p className="text-white/50 text-sm">{t.profile.projects}</p>
                                </div>
                                <div className="w-px h-12 bg-white/10" />
                                <div className="text-center">
                                    <p className="text-white text-2xl font-bold">{profile.stats.followers_count}</p>
                                    <p className="text-white/50 text-sm">{t.profile.followers}</p>
                                </div>
                                <div className="w-px h-12 bg-white/10" />
                                <div className="text-center">
                                    <p className="text-white text-2xl font-bold">{profile.stats.following_count}</p>
                                    <p className="text-white/50 text-sm">{t.profile.following}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="lg:border-l lg:border-r border-white/10 lg:px-6">
                                {profile.description ? (
                                    <p className="text-white/70 text-sm leading-relaxed">{profile.description}</p>
                                ) : (
                                    <p className="text-white/40 text-sm italic">{t.profile.noDescription}</p>
                                )}
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-3 justify-center lg:justify-end flex-wrap">
                                {hasSocialLinks && (
                                    <>
                                        {websiteUrl && (
                                            <a
                                                href={websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                                                title={t.profile.website}
                                            >
                                                <LinkIcon className="w-5 h-5" />
                                            </a>
                                        )}
                                        {instagramUrl && (
                                            <a
                                                href={instagramUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 rounded-xl bg-white/5 text-white/60 hover:text-pink-400 hover:bg-pink-500/10 transition-colors"
                                                title={t.profile.instagram}
                                            >
                                                <InstagramIcon className="w-5 h-5" />
                                            </a>
                                        )}
                                        {twitterUrl && (
                                            <a
                                                href={twitterUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 rounded-xl bg-white/5 text-white/60 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                                                title={t.profile.twitter}
                                            >
                                                <TwitterIcon className="w-5 h-5" />
                                            </a>
                                        )}
                                        {youtubeUrl && (
                                            <a
                                                href={youtubeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 rounded-xl bg-white/5 text-white/60 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                                title={t.profile.youtube}
                                            >
                                                <YoutubeIcon className="w-5 h-5" />
                                            </a>
                                        )}
                                        {tiktokUrl && (
                                            <a
                                                href={tiktokUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                                                title={t.profile.tiktok}
                                            >
                                                <TiktokIcon className="w-5 h-5" />
                                            </a>
                                        )}
                                        {twitchUrl && (
                                            <a
                                                href={twitchUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 rounded-xl bg-white/5 text-white/60 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
                                                title={t.profile.twitch}
                                            >
                                                <Twitch className="w-5 h-5" />
                                            </a>
                                        )}
                                    </>
                                )}
                                <div className="text-white/40 text-xs ml-2">
                                    {t.profile.memberSince} {profile.created_at}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="px-8">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleTabChange(tab.key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                                    activeTab === tab.key
                                        ? 'bg-primary text-white'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    activeTab === tab.key ? 'bg-white/20' : 'bg-white/10'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="px-8 pb-8">
                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        <div>
                            {isLoadingProjects ? (
                                <TabSkeleton />
                            ) : projects.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {projects.map((project) => (
                                            <Link
                                                key={project.id}
                                                href={`/projects/${project.slug}`}
                                                className="group bg-secondary border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all"
                                            >
                                                <div className="aspect-4/3 relative overflow-hidden">
                                                    <ImageWithFallback
                                                        src={project.image}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                                                    <div className="absolute top-3 right-3">
                                                        <span className={`px-2 py-1 rounded-lg text-xs border ${
                                                            project.status === 'completed'
                                                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                                                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                                        }`}>
                                                            {project.status === 'completed' ? t.profile.completed : t.profile.inProgress}
                                                        </span>
                                                    </div>
                                                    <div className="absolute bottom-3 left-3 right-3">
                                                        <h3 className="text-white font-semibold text-lg truncate">{project.title}</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    {projectsMeta && (
                                        <Pagination
                                            meta={projectsMeta}
                                            onPageChange={setProjectsPage}
                                            isLoading={isLoadingProjects}
                                        />
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-16 bg-secondary border border-white/10 rounded-2xl">
                                    <Folder className="w-16 h-16 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/40 text-lg">{t.profile.noPublicProjects}</p>
                                    <p className="text-white/30 text-sm mt-1">{t.profile.noProjectsMessage}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Photoshoots Tab */}
                    {activeTab === 'photoshoots' && (
                        <div>
                            {isLoadingPhotoshoots ? (
                                <TabSkeleton />
                            ) : photoshoots.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {photoshoots.map((shoot) => (
                                            <div
                                                key={shoot.id}
                                                className="group bg-secondary border border-white/10 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all cursor-pointer"
                                                onClick={() => openPhotoshootGallery(shoot.id)}
                                            >
                                                <div className="aspect-4/3 relative overflow-hidden">
                                                    <ImageWithFallback
                                                        src={shoot.cover_image || shoot.images[0]?.image_url}
                                                        alt={shoot.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                                                    <div className="absolute top-3 right-3">
                                                        <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs border border-green-500/30">
                                                            {shoot.images_count} photos
                                                        </span>
                                                    </div>
                                                    <div className="absolute bottom-3 left-3 right-3">
                                                        <h3 className="text-white font-semibold text-lg truncate">{shoot.title}</h3>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            {shoot.location && (
                                                                <div className="flex items-center gap-1 text-white/60 text-sm">
                                                                    <MapPin className="w-3.5 h-3.5" />
                                                                    <span className="truncate max-w-40">{shoot.location}</span>
                                                                </div>
                                                            )}
                                                            {shoot.shoot_date && (
                                                                <div className="flex items-center gap-1 text-white/60 text-sm">
                                                                    <Calendar className="w-3.5 h-3.5" />
                                                                    <span>{shoot.shoot_date}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {photoshootsMeta && (
                                        <Pagination
                                            meta={photoshootsMeta}
                                            onPageChange={setPhotoshootsPage}
                                            isLoading={isLoadingPhotoshoots}
                                        />
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-16 bg-secondary border border-white/10 rounded-2xl">
                                    <Camera className="w-16 h-16 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/40 text-lg">{t.profile.noPhotoshoots}</p>
                                    <p className="text-white/30 text-sm mt-1">{t.profile.noPhotoshootsMessage}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Events Tab */}
                    {activeTab === 'events' && (
                        <div>
                            {isLoadingEvents ? (
                                <TabSkeleton count={4} />
                            ) : events.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {events.map((event) => (
                                            <div
                                                key={event.id}
                                                className="group bg-secondary border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all"
                                            >
                                                <div className="flex">
                                                    <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 relative overflow-hidden">
                                                        <ImageWithFallback
                                                            src={event.image_url}
                                                            alt={event.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    <div className="flex-1 p-4 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                                <h3 className="text-white font-semibold text-lg line-clamp-2">{event.name}</h3>
                                                                <span className={`shrink-0 px-2 py-1 rounded-lg text-xs border ${getEventStatusColor(event.status)}`}>
                                                                    {getEventStatusLabel(event.status)}
                                                                </span>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-1 text-white/60 text-sm">
                                                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                                                    <span className="truncate">{event.city}, {event.country}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-white/60 text-sm">
                                                                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                                                                    <span>
                                                                        {event.start_date}
                                                                        {event.end_date && event.end_date !== event.start_date && (
                                                                            <> - {event.end_date}</>
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-white/60 text-sm">
                                                                    <Users className="w-3.5 h-3.5 shrink-0" />
                                                                    <span>{event.attendees_count} participants</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {event.website_url && (
                                                            <a
                                                                href={event.website_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-primary text-sm hover:underline mt-2"
                                                            >
                                                                <ExternalLink className="w-3.5 h-3.5" />
                                                                {t.profile.website}
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {eventsMeta && (
                                        <Pagination
                                            meta={eventsMeta}
                                            onPageChange={setEventsPage}
                                            isLoading={isLoadingEvents}
                                        />
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-16 bg-secondary border border-white/10 rounded-2xl">
                                    <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/40 text-lg">{t.profile.noEvents}</p>
                                    <p className="text-white/30 text-sm mt-1">{t.profile.noEventsMessage}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Photoshoot Gallery Modal */}
            {selectedPhotoIndex !== null && selectedPhotoshootId !== null && (() => {
                const currentShoot = photoshoots.find(s => s.id === selectedPhotoshootId);
                if (!currentShoot) return null;

                const images = currentShoot.images;
                const currentImage = images[selectedPhotoIndex];
                if (!currentImage) return null;

                return (
                    <div
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={closeGallery}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeGallery}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Album title and photo counter */}
                        <div className="absolute top-4 left-4 flex items-center gap-3">
                            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                                <span className="text-white text-sm font-medium">{currentShoot.title}</span>
                            </div>
                            <div className="px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                                <span className="text-white/70 text-sm">
                                    {selectedPhotoIndex + 1} / {images.length}
                                </span>
                            </div>
                        </div>

                        {/* Previous button */}
                        {images.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevious();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <ChevronLeft className="w-8 h-8 text-white" />
                            </button>
                        )}

                        {/* Main image */}
                        <div
                            className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ImageWithFallback
                                src={currentImage.image_url}
                                alt={currentShoot.title}
                                className="max-w-full max-h-[85vh] object-contain rounded-lg"
                            />
                        </div>

                        {/* Next button */}
                        {images.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <ChevronRight className="w-8 h-8 text-white" />
                            </button>
                        )}

                        {/* Thumbnail strip */}
                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm max-w-[90vw] overflow-x-auto">
                                {images.map((img, index) => (
                                    <button
                                        key={img.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPhotoIndex(index);
                                        }}
                                        className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                                            index === selectedPhotoIndex
                                                ? 'ring-2 ring-primary scale-110'
                                                : 'opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <ImageWithFallback
                                            src={img.image_thumb_url || img.image_url}
                                            alt="Thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })()}
        </div>
    );
}


'use client';

import { Header } from './header';
import { Heart, Camera, Share2, Calendar, Image as ImageIcon, X, ChevronLeft, ChevronRight, Clock, DollarSign } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../lib/auth-context';
import { apiService } from '../lib/api';
import { ProjectDetail } from '../lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';

interface ProjectDetailViewProps {
    slug: string;
}

export function ProjectDetailView({ slug }: ProjectDetailViewProps) {
    const { isLoggedIn, handleLoginRequired } = useAuth();
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [showCopied, setShowCopied] = useState(false);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
    const [slideshowType, setSlideshowType] = useState<'photos' | 'references' | 'photoshoots'>('photos');
    const [selectedPhotoshootId, setSelectedPhotoshootId] = useState<number | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await apiService.getProject(slug);
                setProject(response.data);
                setIsLiked(response.data.is_liked_by_user || false);
            } catch (err) {
                setError('Erreur lors du chargement du projet');
                console.error('Error fetching project:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [slug]);

    const handleLike = () => {
        if (!isLoggedIn) {
            handleLoginRequired();
            return;
        }
        setIsLiked(!isLiked);
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

    const handleFollow = () => {
        if (!isLoggedIn) {
            handleLoginRequired();
            return;
        }
        // Logic for following
    };

    const openSlideshow = (index: number, type: 'photos' | 'references' | 'photoshoots' = 'photos', photoshootId?: number) => {
        setSelectedPhotoIndex(index);
        setSlideshowType(type);
        if (type === 'photoshoots' && photoshootId !== undefined) {
            setSelectedPhotoshootId(photoshootId);
        }
        document.body.style.overflow = 'hidden';
    };

    const closeSlideshow = useCallback(() => {
        setSelectedPhotoIndex(null);
        setSelectedPhotoshootId(null);
        document.body.style.overflow = 'auto';
    }, []);

    const goToPrevious = useCallback(() => {
        if (selectedPhotoIndex === null || !project) return;
        let items;
        if (slideshowType === 'photos') {
            items = project.photos;
        } else if (slideshowType === 'references') {
            items = project.photoReferences;
        } else {
            const shoot = project.photoshoots.find(s => s.id === selectedPhotoshootId);
            items = shoot?.images || [];
        }
        setSelectedPhotoIndex(
            selectedPhotoIndex === 0 ? items.length - 1 : selectedPhotoIndex - 1
        );
    }, [selectedPhotoIndex, project, slideshowType, selectedPhotoshootId]);

    const goToNext = useCallback(() => {
        if (selectedPhotoIndex === null || !project) return;
        let items;
        if (slideshowType === 'photos') {
            items = project.photos;
        } else if (slideshowType === 'references') {
            items = project.photoReferences;
        } else {
            const shoot = project.photoshoots.find(s => s.id === selectedPhotoshootId);
            items = shoot?.images || [];
        }
        setSelectedPhotoIndex(
            selectedPhotoIndex === items.length - 1 ? 0 : selectedPhotoIndex + 1
        );
    }, [selectedPhotoIndex, project, slideshowType, selectedPhotoshootId]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedPhotoIndex === null) return;
            if (e.key === 'Escape') closeSlideshow();
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPhotoIndex, closeSlideshow, goToPrevious, goToNext]);

    if (isLoading) {
        return (
            <div className="flex-1">
                <Header title="Chargement..." showSearch={false} />
                <div className="p-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-96 bg-white/5 rounded-2xl"></div>
                        <div className="h-8 bg-white/5 rounded w-1/2"></div>
                        <div className="h-4 bg-white/5 rounded w-1/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex-1">
                <Header title="Erreur" showSearch={false} />
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
            <Header title={project.title} showSearch={false} />

            <div className="p-8 space-y-6">
                {/* Project Header - Compact Layout */}
                <div className="bg-secondary border border-white/10 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                        {/* Cover Image - Left */}
                        <div className="relative aspect-square lg:aspect-auto overflow-hidden">
                            <ImageWithFallback
                                src={project.image_url}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-secondary/80 hidden lg:block" />
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent lg:hidden" />
                        </div>

                        {/* Project Info - Center */}
                        <div className="p-6 flex flex-col justify-between">
                            <div>
                                <h1 className="text-white text-2xl font-bold mb-3">{project.title}</h1>
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/20 text-primary text-sm border border-primary/30">
                                        {project.fandom?.name || '-'}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-white/10 text-white text-xs">
                                        {project.category.name}
                                    </span>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs ${
                                        project.status === 'completed' 
                                            ? 'bg-green-500/20 text-green-400' 
                                            : 'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                        {project.status}
                                    </span>
                                </div>

                                {/* Creator Info */}
                                <Link href={`/profile/${project.user.profile.slug}`} className="flex items-center gap-3 mb-4 hover:bg-white/5 rounded-lg p-2 -ml-2 transition-colors">
                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                        <ImageWithFallback
                                            src={project.user.profile.avatar}
                                            alt={project.user.profile.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm">@{project.user.profile.name}</p>
                                        <p className="text-white/50 text-xs">Créateur</p>
                                    </div>
                                </Link>

                                {/* Description */}
                                {project.description && (
                                    <p className="text-white/60 text-sm line-clamp-3 mb-4">{project.description}</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                                        isLiked
                                            ? 'bg-red-500 text-white border-red-500'
                                            : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                                    }`}
                                >
                                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                    <span>{project.likes_count}</span>
                                </button>
                                <button
                                    onClick={handleShare}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                                        showCopied
                                            ? 'bg-green-500 text-white border-green-500'
                                            : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                                    }`}
                                >
                                    <Share2 className="w-4 h-4" />
                                    <span>{showCopied ? 'Copié !' : 'Partager'}</span>
                                </button>
                                <button
                                    onClick={handleFollow}
                                    className="px-4 py-1.5 rounded-lg bg-primary text-white text-sm hover:bg-primary/90 transition-colors"
                                >
                                    Suivre
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid - Right */}
                        <div className="p-6 bg-white/5 grid grid-cols-2 gap-3 content-start">
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <Camera className="w-4 h-4 text-primary" />
                                    <span className="text-white/50 text-xs">Photos</span>
                                </div>
                                <p className="text-white text-lg font-bold">{project.photos.length}</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <ImageIcon className="w-4 h-4 text-tertiary" />
                                    <span className="text-white/50 text-xs">Références</span>
                                </div>
                                <p className="text-white text-lg font-bold">{project.photoReferences.length}</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <Heart className="w-4 h-4 text-red-500" />
                                    <span className="text-white/50 text-xs">Likes</span>
                                </div>
                                <p className="text-white text-lg font-bold">{project.likes_count}</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                                        <span className="text-[8px] text-green-500">%</span>
                                    </div>
                                    <span className="text-white/50 text-xs">Progression</span>
                                </div>
                                <p className="text-white text-lg font-bold">{project.progression}%</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="w-4 h-4 text-orange-400" />
                                    <span className="text-white/50 text-xs">Temps</span>
                                </div>
                                <p className="text-white text-sm font-medium">{project.total_project_working_time || '-'}</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <DollarSign className="w-4 h-4 text-emerald-400" />
                                    <span className="text-white/50 text-xs">Budget</span>
                                </div>
                                <p className="text-white text-sm font-medium">{project.project_estimated_price}$</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <Calendar className="w-4 h-4 text-blue-400" />
                                    <span className="text-white/50 text-xs">Créé</span>
                                </div>
                                <p className="text-white text-xs font-medium">{project.created_at}</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <Calendar className="w-4 h-4 text-purple-400" />
                                    <span className="text-white/50 text-xs">Mis à jour</span>
                                </div>
                                <p className="text-white text-xs font-medium">{project.updated_at}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Photo Gallery */}
                <div className="bg-secondary border border-white/10 rounded-2xl p-8">
                    <h2 className="text-white text-2xl font-bold mb-6">Galerie</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Photos Column */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Camera className="w-5 h-5 text-primary" />
                                <h3 className="text-white font-semibold">Photos ({project.photos.length})</h3>
                            </div>
                            {project.photos.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {project.photos.map((photoItem, index) => {
                                        const photo = photoItem.photo[0];
                                        if (!photo) return null;
                                        return (
                                            <div
                                                key={photoItem.id}
                                                className="group relative aspect-square rounded-lg overflow-hidden bg-white/5 cursor-pointer"
                                                onClick={() => openSlideshow(index, 'photos')}
                                            >
                                                <ImageWithFallback
                                                    src={photo.original_url}
                                                    alt={photo.name}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                                                {(photoItem.likes_count ?? 0) > 0 && (
                                                    <div className="absolute bottom-1 right-1 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">
                                                        <Heart className="w-2.5 h-2.5 text-red-500 fill-current" />
                                                        <span className="text-white text-[10px]">{photoItem.likes_count}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-white/5 rounded-xl">
                                    <ImageIcon className="w-10 h-10 text-white/20 mx-auto mb-2" />
                                    <p className="text-white/40 text-sm">Aucune photo</p>
                                </div>
                            )}
                        </div>

                        {/* References Column */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <ImageIcon className="w-5 h-5 text-tertiary" />
                                <h3 className="text-white font-semibold">Références ({project.photoReferences.length})</h3>
                            </div>
                            {project.photoReferences.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {project.photoReferences.map((refItem, index) => {
                                        const photo = refItem.photo[0];
                                        if (!photo) return null;
                                        return (
                                            <div
                                                key={refItem.id}
                                                className="group relative aspect-square rounded-lg overflow-hidden bg-white/5 cursor-pointer"
                                                onClick={() => openSlideshow(index, 'references')}
                                            >
                                                <ImageWithFallback
                                                    src={photo.original_url}
                                                    alt={photo.name}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-white/5 rounded-xl">
                                    <ImageIcon className="w-10 h-10 text-white/20 mx-auto mb-2" />
                                    <p className="text-white/40 text-sm">Aucune référence</p>
                                </div>
                            )}
                        </div>

                        {/* Photoshoots Column */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Camera className="w-5 h-5 text-green-500" />
                                <h3 className="text-white font-semibold">Photoshoots ({project.photoshoots.length})</h3>
                            </div>
                            {project.photoshoots.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {project.photoshoots.map((shoot) => (
                                        <div
                                            key={shoot.id}
                                            className="group relative aspect-square rounded-lg overflow-hidden bg-white/5 cursor-pointer"
                                            onClick={() => openSlideshow(0, 'photoshoots', shoot.id)}
                                        >
                                            <ImageWithFallback
                                                src={shoot.cover_image || shoot.images[0]?.image_thumb_url || shoot.images[0]?.image_url}
                                                alt={shoot.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                            <div className="absolute bottom-0 left-0 right-0 p-2">
                                                <p className="text-white text-xs font-medium truncate">{shoot.title}</p>
                                                <p className="text-white/60 text-[10px]">{shoot.images_count} photos</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-white/5 rounded-xl">
                                    <Camera className="w-10 h-10 text-white/20 mx-auto mb-2" />
                                    <p className="text-white/40 text-sm">Aucun photoshoot</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Photo Slideshow Modal */}
                {selectedPhotoIndex !== null && (() => {
                    // Pour les photoshoots, on utilise l'album sélectionné
                    if (slideshowType === 'photoshoots') {
                        const currentShoot = project.photoshoots.find(s => s.id === selectedPhotoshootId);
                        if (!currentShoot) return null;

                        const images = currentShoot.images;
                        const currentImage = images[selectedPhotoIndex];
                        if (!currentImage) return null;

                        return (
                            <div
                                className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                                onClick={closeSlideshow}
                            >
                                {/* Close button */}
                                <button
                                    onClick={closeSlideshow}
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
                    }

                    // Pour photos et references
                    const items = slideshowType === 'photos' ? project.photos : project.photoReferences;
                    const currentItem = items[selectedPhotoIndex];
                    if (!currentItem) return null;

                    const currentPhoto = currentItem.photo?.[0];
                    if (!currentPhoto) return null;

                    return (
                        <div
                            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                            onClick={closeSlideshow}
                        >
                            {/* Close button */}
                            <button
                                onClick={closeSlideshow}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>

                            {/* Photo counter */}
                            <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                                <span className="text-white text-sm">
                                    {selectedPhotoIndex + 1} / {items.length}
                                </span>
                            </div>

                            {/* Previous button */}
                            {items.length > 1 && (
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
                                    src={currentPhoto.original_url}
                                    alt={currentPhoto.name || 'Photo'}
                                    className="max-w-full max-h-[85vh] object-contain rounded-lg"
                                />
                            </div>

                            {/* Next button */}
                            {items.length > 1 && (
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

                            {/* Bottom bar with actions */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm">
                                {slideshowType === 'photos' && 'likes_count' in currentItem && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!isLoggedIn) {
                                                    handleLoginRequired();
                                                    return;
                                                }
                                                // Handle like
                                            }}
                                            className="flex items-center gap-2 text-white hover:text-red-400 transition-colors"
                                        >
                                            <Heart className={`w-5 h-5 ${'is_liked_by_user' in currentItem && currentItem.is_liked_by_user ? 'text-red-500 fill-current' : ''}`} />
                                            <span>{(currentItem as { likes_count?: number }).likes_count ?? 0}</span>
                                        </button>
                                        <div className="w-px h-6 bg-white/20" />
                                    </>
                                )}
                                <span className="text-white/60 text-sm">
                                    {currentItem.created_at}
                                </span>
                            </div>

                            {/* Thumbnail strip */}
                            {items.length > 1 && (
                                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm max-w-[90vw] overflow-x-auto">
                                    {items.map((item, index) => (
                                        <button
                                            key={item.id}
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
                                                src={item.photo[0]?.preview_url || item.photo[0]?.original_url || ''}
                                                alt={item.photo[0]?.name || 'Thumbnail'}
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
        </div>
    );
}

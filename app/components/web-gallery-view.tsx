'use client';

import { Header } from './header';
import { Heart, Camera, Eye, SlidersHorizontal } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function WebGalleryView() {
    const filters = ['Tous', 'Anime/Manga', 'Gaming', 'Comics', 'Original'];

    const galleries = [
        {
            id: 1,
            title: 'Japan Touch Lyon 2025',
            author: 'Ely Dbae',
            photos: 24,
            views: 1234,
            likes: 156,
            image: 'https://images.unsplash.com/photo-1762270242162-b04c34ac21ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbiUyMGZlc3RpdmFsJTIwY29zcGxheXxlbnwxfHx8fDE3NjcxMTc1OTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
            id: 2,
            title: 'Japan Expo 2025',
            author: 'mermaid Fenicia',
            photos: 32,
            views: 2156,
            likes: 203,
            image: 'https://images.unsplash.com/photo-1690645724861-08033a9b435b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNvbnZlbnRpb24lMjBwZW9wbGV8ZW58MXx8fHwxNzY3MTE3NTk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
            id: 3,
            title: 'Kigurumi Meet Belgium',
            author: 'mermaid Fenicia',
            photos: 18,
            views: 987,
            likes: 142,
            image: 'https://images.unsplash.com/photo-1633290416241-f8d3343766ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXJtYWlkJTIwY29zdHVtZXxlbnwxfHx8fDE3NjcxMTc2MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
            id: 4,
            title: 'UK Meet 2025',
            author: 'mermaid Fenicia',
            photos: 15,
            views: 756,
            likes: 98,
            image: 'https://images.unsplash.com/photo-1766066015545-ab45d53dcf22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NwbGF5JTIwZXZlbnQlMjBncm91cHxlbnwxfHx8fDE3NjcxMTc1OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
            id: 5,
            title: 'Garden Shoot 2025',
            author: 'mermaid Fenicia',
            photos: 28,
            views: 1543,
            likes: 187,
            image: 'https://images.unsplash.com/photo-1763625642174-94594365cb9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBwaG90b3Nob290JTIwZXZlbnR8ZW58MXx8fHwxNzY3MTE3NjAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
            id: 6,
            title: 'Anime Collection',
            author: 'Various Artists',
            photos: 45,
            views: 3210,
            likes: 298,
            image: 'https://images.unsplash.com/photo-1649779777797-66491227b1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMGNvc3R1bWV8ZW58MXx8fHwxNzY3MTE3NjAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
            id: 7,
            title: 'Cosplay Convention 2025',
            author: 'Creative Team',
            photos: 36,
            views: 1876,
            likes: 215,
            image: 'https://images.unsplash.com/photo-1735720519574-b8f3ae156532?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NwbGF5JTIwY29udmVudGlvbiUyMGV2ZW50fGVufDF8fHx8MTc2NzExNzc4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
            id: 8,
            title: 'Studio Sessions',
            author: 'Pro Photographers',
            photos: 22,
            views: 1432,
            likes: 167,
            image: 'https://images.unsplash.com/photo-1612150672144-9f07b4d0fdb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMHN0dWRpbyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzA5MzQxNnww&ixlib=rb-4.1.0&q=80&w=1080',
        },
    ];

    return (
        <div className="flex-1">
            <Header title="Galerie Publique" />

            <div className="p-8 space-y-6">
                {/* Filters */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {filters.map((filter, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 rounded-lg transition-all ${
                                    index === 0
                                        ? 'bg-primary text-white'
                                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <button className="flex items-center gap-2 bg-white/5 text-white px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Filtres</span>
                    </button>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-4 gap-6">
                    {galleries.map((gallery) => (
                        <div
                            key={gallery.id}
                            className="group relative bg-secondary border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
                        >
                            <div className="aspect-[3/4] relative overflow-hidden">
                                <ImageWithFallback
                                    src={gallery.image}
                                    alt={gallery.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                <button className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100">
                                    <Heart className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <h3 className="text-white mb-1">{gallery.title}</h3>
                                <p className="text-white/70 text-sm mb-3">{gallery.author}</p>
                                <div className="flex items-center gap-4 text-white/60 text-sm">
                  <span className="flex items-center gap-1">
                    <Camera className="w-4 h-4" />
                      {gallery.photos}
                  </span>
                                    <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                                        {gallery.views}
                  </span>
                                    <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                                        {gallery.likes}
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
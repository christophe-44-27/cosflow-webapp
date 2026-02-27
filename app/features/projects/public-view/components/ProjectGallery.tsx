'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useLocale } from '@/app/lib/locale-context';
import { SectionEmptyState } from './SectionEmptyState';
import type { PhotoReference } from '@/app/types/models';

function GalleryIllustration() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      {/* Back polaroid (rotated -9°) */}
      <g transform="rotate(-9 18 26)">
        <rect x="3" y="8" width="30" height="34" rx="2.5" fill="rgba(98,89,202,0.06)" stroke="#9690C4" strokeWidth="1.3" />
        {/* Bottom caption strip */}
        <rect x="3" y="34" width="30" height="8" rx="0 0 2.5 2.5" fill="rgba(150,144,196,0.08)" />
      </g>
      {/* Front polaroid (main) */}
      <rect x="20" y="11" width="30" height="34" rx="2.5" fill="rgba(30,26,64,0.7)" stroke="#6259CA" strokeWidth="1.5" />
      {/* Bottom caption strip */}
      <rect x="20" y="36" width="30" height="9" rx="0 0 2.5 2.5" fill="rgba(98,89,202,0.15)" />
      {/* Mountain landscape inside polaroid */}
      <path d="M22 36 L27 26 L31 31 L37 21 L49 36Z" fill="rgba(150,144,196,0.28)" />
      {/* Sun */}
      <circle cx="43" cy="17" r="2.8" stroke="#9690C4" strokeWidth="1.1" fill="rgba(150,144,196,0.1)" />
      {/* Star sparkle bottom-left */}
      <path d="M7 41 L7.5 42.8 L9.3 42.8 L7.8 44 L8.3 45.8 L7 44.6 L5.7 45.8 L6.2 44 L4.7 42.8 L6.5 42.8 Z" fill="#9690C4" opacity="0.45" />
      {/* Small dot top-right */}
      <circle cx="48" cy="9" r="1.5" fill="#9690C4" opacity="0.3" />
      {/* Tiny dot */}
      <circle cx="6" cy="14" r="1" fill="#6259CA" opacity="0.25" />
    </svg>
  );
}

interface ProjectGalleryProps {
  photoReferences: PhotoReference[];
}

export function ProjectGallery({ photoReferences }: ProjectGalleryProps) {
  const { t } = useLocale();
  const [zoomedSrc, setZoomedSrc] = useState<string | null>(null);

  const close = useCallback(() => setZoomedSrc(null), []);

  useEffect(() => {
    if (!zoomedSrc) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [zoomedSrc, close]);

  return (
    <>
      <section>
        {/* Section header */}
        <div className="flex items-center gap-3 mb-4">
          <h2
            className="font-bold text-white"
            style={{ fontSize: '1.1rem', letterSpacing: '-0.025em' }}
          >
            {t.project.gallery.sectionTitle}
          </h2>
          {photoReferences.length > 0 && (
            <span className="font-mono text-[#9690C4]" style={{ fontSize: '0.68rem' }}>
              {photoReferences.length}
            </span>
          )}
        </div>

        {/* Empty state */}
        {photoReferences.length === 0 && (
          <SectionEmptyState
            illustration={<GalleryIllustration />}
            message={t.project.gallery.empty}
          />
        )}

        {/* Gallery grid */}
        {photoReferences.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {photoReferences.map((ref) => {
              const preview = ref.photo[0]?.preview_url;
              const original = ref.photo[0]?.original_url ?? preview;
              if (!preview) return null;

              return (
                <button
                  key={ref.id}
                  onClick={() => setZoomedSrc(original ?? null)}
                  className="group relative aspect-[4/3] rounded-[10px] overflow-hidden cursor-zoom-in"
                >
                  <Image
                    src={preview}
                    alt=""
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.07]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
                  />
                  <div className="absolute inset-0 bg-[#1E1A40]/0 group-hover:bg-[#1E1A40]/35 transition-colors duration-200 flex items-center justify-center">
                    <span
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white font-mono bg-white/10 backdrop-blur-sm px-2 py-1 rounded-[6px]"
                      style={{ fontSize: '0.75rem' }}
                    >
                      zoom
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {zoomedSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
        >
          {/* Bouton fermer */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>

          {/* Image plein format — stoppe la propagation pour éviter fermeture au clic sur l'image */}
          <img
            src={zoomedSrc}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-[10px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

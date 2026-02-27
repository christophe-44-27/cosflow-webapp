'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useLocale } from '@/app/lib/locale-context';
import type { PhotoReference } from '@/app/types/models';

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

  if (photoReferences.length === 0) return null;

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
          <span className="font-mono text-[#9690C4]" style={{ fontSize: '0.68rem' }}>
            {photoReferences.length}
          </span>
        </div>

        {/* Gallery grid */}
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

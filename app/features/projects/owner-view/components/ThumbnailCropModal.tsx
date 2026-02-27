'use client';

import { useState, useCallback, useRef, useLayoutEffect } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { X, Check, Loader2, Monitor, Smartphone } from 'lucide-react';

const THUMBNAIL_ASPECT = 3 / 4; // Portrait mobile
// Inset du carré 1:1 centré dans la zone 3:4 :
// marge = (hauteur_3:4 - largeur) / 2 = (4 - 3) / (2 × 4) = 12.5 %
const SQUARE_INSET_PCT = ((1 - THUMBNAIL_ASPECT) / 2) * 100; // 12.5

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.src = imageSrc;
  });

  // 1. Dessiner l'image entière à sa taille naturelle
  const fullCanvas = document.createElement('canvas');
  fullCanvas.width = image.naturalWidth;
  fullCanvas.height = image.naturalHeight;
  fullCanvas.getContext('2d')!.drawImage(image, 0, 0);

  // 2. Extraire la région croppée par coordonnées exactes
  const x = Math.round(pixelCrop.x);
  const y = Math.round(pixelCrop.y);
  const w = Math.round(pixelCrop.width);
  const h = Math.round(pixelCrop.height);
  const imageData = fullCanvas.getContext('2d')!.getImageData(x, y, w, h);

  // 3. Coller dans un canvas final aux dimensions du crop
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = w;
  croppedCanvas.height = h;
  croppedCanvas.getContext('2d')!.putImageData(imageData, 0, 0);

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => { if (blob) resolve(blob); else reject(new Error('toBlob null')); },
      'image/jpeg',
      0.9,
    );
  });
}

interface ThumbnailCropModalProps {
  imageSrc: string;
  onConfirm: (blob: Blob) => Promise<void>;
  onCancel: () => void;
}

export function ThumbnailCropModal({ imageSrc, onConfirm, onCancel }: ThumbnailCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Dimensions exactes de la crop area calculées depuis le conteneur
  const containerRef = useRef<HTMLDivElement>(null);
  const [cropAreaRect, setCropAreaRect] = useState<{ w: number; h: number; x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      // Même formule que react-easy-crop en interne
      let w: number, h: number;
      if (W / H > THUMBNAIL_ASPECT) {
        h = H; w = H * THUMBNAIL_ASPECT;
      } else {
        w = W; h = W / THUMBNAIL_ASPECT;
      }
      setCropAreaRect({ w, h, x: (W - w) / 2, y: (H - h) / 2 });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setIsUploading(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      await onConfirm(blob);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
        <div>
          <h2 className="text-white font-semibold text-sm">Recadrer la miniature</h2>
          <p className="text-white/40 text-xs mt-0.5">
            Positionnez le sujet dans les deux zones
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Zone de crop */}
      <div ref={containerRef} className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={THUMBNAIL_ASPECT}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          showGrid={false}
          style={{
            containerStyle: { background: '#0a0914' },
            cropAreaStyle: { border: 'none' },
          }}
        />

        {/* ── Guides superposés ─────────────────────────────────────── */}
        {cropAreaRect && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: cropAreaRect.x,
              top: cropAreaRect.y,
              width: cropAreaRect.w,
              height: cropAreaRect.h,
            }}
          >
            {/* Zones sombres hors du carré (= zones mobile-only) */}
            <div
              className="absolute inset-x-0 top-0 flex items-center justify-center"
              style={{ height: `${SQUARE_INSET_PCT}%`, background: 'rgba(0,0,0,0.72)' }}
            >
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#2BD1C7]/80">
                <Smartphone className="w-3 h-3" /> Mobile uniquement
              </span>
            </div>
            <div
              className="absolute inset-x-0 bottom-0 flex items-center justify-center"
              style={{ height: `${SQUARE_INSET_PCT}%`, background: 'rgba(0,0,0,0.72)' }}
            >
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#2BD1C7]/80">
                <Smartphone className="w-3 h-3" /> Mobile uniquement
              </span>
            </div>

            {/* Zone Web (carré 1:1) — bord épais + ombre pour la visibilité */}
            <div
              className="absolute inset-x-0"
              style={{
                top: `${SQUARE_INSET_PCT}%`,
                bottom: `${SQUARE_INSET_PCT}%`,
                border: '3px solid #6259CA',
                boxShadow: '0 0 0 1px rgba(98,89,202,0.5), inset 0 0 0 1px rgba(98,89,202,0.3)',
              }}
            >
              <span className="absolute top-2 left-2 flex items-center gap-1 text-[11px] font-bold bg-[#6259CA] text-white px-2 py-0.5 rounded">
                <Monitor className="w-3 h-3" /> Web
              </span>
              <span className="absolute bottom-2 right-2 text-[10px] text-white/50">
                Gardez le sujet ici
              </span>
            </div>

            {/* Bordure Mobile (3:4) */}
            <div className="absolute inset-0 border border-white/20" />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10 flex-shrink-0 space-y-3">
        {/* Légende */}
        <div className="flex items-center gap-5 text-[11px] text-white/50">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-5 border-t-2 border-[#6259CA]" />
            <Monitor className="w-3 h-3" /> Web (carré)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-5 border-t-2 border-white/30" />
            <Smartphone className="w-3 h-3" /> Mobile (portrait)
          </span>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs w-8">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-[#6259CA]"
          />
          <span className="text-white/40 text-xs w-10 text-right">{zoom.toFixed(1)}×</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={isUploading || !croppedAreaPixels}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#6259CA] hover:bg-[#6259CA]/90 text-white rounded-xl text-sm transition-colors disabled:opacity-60"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {isUploading ? 'Envoi en cours…' : 'Appliquer'}
          </button>
        </div>
      </div>
    </div>
  );
}

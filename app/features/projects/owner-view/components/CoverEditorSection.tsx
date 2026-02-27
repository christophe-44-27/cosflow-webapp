'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { Camera, X, Check, Loader2, ImageOff } from 'lucide-react';

// ── Ratio de la zone de couverture (h-[50vh] × 100vw ≈ 16:5 sur desktop) ──
const COVER_ASPECT = 16 / 5;

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.92));
}

interface CoverEditorSectionProps {
  coverUrl: string | null;
  projectTitle: string;
  onCoverUpload: (blob: Blob) => Promise<void>;
}

export function CoverEditorSection({ coverUrl, projectTitle, onCoverUpload }: CoverEditorSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crop modal state
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setRawImageSrc(reader.result as string);
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleConfirmCrop = async () => {
    if (!rawImageSrc || !croppedAreaPixels) return;
    setIsUploading(true);
    try {
      const blob = await getCroppedImg(rawImageSrc, croppedAreaPixels);
      await onCoverUpload(blob);
      setRawImageSrc(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelCrop = () => {
    setRawImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <>
      {/* ── Zone de couverture cliquable ── */}
      <div
        className="relative h-[40vh] md:h-[45vh] lg:h-[50vh] w-full overflow-hidden group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        role="button"
        aria-label="Modifier l'image de couverture"
      >
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`Couverture — ${projectTitle}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#6259CA] to-[#2BD1C7]" />
        )}

        {/* Overlay dégradé bas → haut */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A40] via-[#1E1A40]/40 to-transparent" />

        {/* Overlay d'édition au hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white">
            <Camera className="w-5 h-5" />
            <span className="font-medium text-sm">
              {coverUrl ? 'Changer la couverture' : 'Ajouter une couverture'}
            </span>
          </div>
          {!coverUrl && (
            <p className="text-white/50 text-xs">
              Format recommandé : large panoramique (16:5)
            </p>
          )}
        </div>

        {/* Badge état — coin bas gauche */}
        {!coverUrl && (
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-sm rounded-lg">
            <ImageOff className="w-3.5 h-3.5 text-white/50" />
            <span className="text-white/50 text-xs">Aucune couverture</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ── Modal de crop ── */}
      {rawImageSrc && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
            <div>
              <h2 className="text-white font-semibold text-sm">Recadrer l'image de couverture</h2>
              <p className="text-white/40 text-xs mt-0.5">Faites glisser et zoomez pour ajuster</p>
            </div>
            <button
              onClick={handleCancelCrop}
              className="p-2 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Zone de crop */}
          <div className="relative flex-1">
            <Cropper
              image={rawImageSrc}
              crop={crop}
              zoom={zoom}
              aspect={COVER_ASPECT}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid
              style={{
                containerStyle: { background: '#0a0914' },
                cropAreaStyle: { border: '2px solid #6259CA' },
              }}
            />
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/10 flex-shrink-0 space-y-3">
            {/* Zoom slider */}
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
                onClick={handleCancelCrop}
                className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmCrop}
                disabled={isUploading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#6259CA] hover:bg-[#6259CA]/90 text-white rounded-xl text-sm transition-colors disabled:opacity-60"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {isUploading ? 'Envoi en cours…' : 'Appliquer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

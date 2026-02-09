'use client';

import { useRef } from 'react';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '../hooks/use-image-upload';
import { useTranslations } from '@/app/lib/locale-context';
import Image from 'next/image';

interface CoverUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCover?: string;
  hasCover?: boolean;
}

export function CoverUploadModal({
  isOpen,
  onClose,
  currentCover,
  hasCover,
}: CoverUploadModalProps) {
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isUploading,
    previewUrl,
    selectedFile,
    handleFileSelect,
    uploadImage,
    cancelUpload,
  } = useImageUpload({
    type: 'cover',
    onSuccess: onClose,
  });

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleUpload = async () => {
    const success = await uploadImage();
    if (success) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancel = () => {
    cancelUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const displayImage = previewUrl || (hasCover ? currentCover : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative bg-secondary border border-white/10 rounded-2xl w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg transition-colors"
          disabled={isUploading}
        >
          <X className="w-5 h-5 text-white/60" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-white mb-2">
            {t.account.profile.coverUpload.title}
          </h2>
          <p className="text-white/60">
            {t.account.profile.coverUpload.subtitle}
          </p>
        </div>

        {/* Image Preview */}
        <div className="mb-6">
          <div className="relative w-full aspect-[2.6/1] rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-tertiary/20">
            {displayImage ? (
              <Image
                src={displayImage}
                alt="Cover preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-white/40" />
              </div>
            )}
            {previewUrl && (
              <div className="absolute top-4 right-4">
                <div className="bg-emerald-500 text-white rounded-full px-3 py-1 text-xs font-medium">
                  Nouveau
                </div>
              </div>
            )}
          </div>
        </div>

        {/* File Input */}
        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full bg-white/5 hover:bg-white/10 disabled:bg-white/5 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 border border-white/10"
          >
            <Upload className="w-5 h-5" />
            {selectedFile
              ? t.account.profile.coverUpload.changeImage
              : t.account.profile.coverUpload.selectImage}
          </button>
          {selectedFile && (
            <p className="text-white/60 text-sm mt-2 text-center">
              {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Requirements */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-white/60 text-sm mb-2">
            {t.account.profile.coverUpload.requirements}
          </p>
          <ul className="text-white/40 text-xs space-y-1">
            <li>• {t.account.profile.coverUpload.formatRequirement}</li>
            <li>• {t.account.profile.coverUpload.sizeRequirement}</li>
            <li>• {t.account.profile.coverUpload.dimensionRequirement}</li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isUploading}
            className="flex-1 bg-white/5 hover:bg-white/10 disabled:bg-white/5 text-white py-3 rounded-lg transition-colors"
          >
            {t.account.profile.coverUpload.cancel}
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.account.profile.coverUpload.uploading}
              </>
            ) : (
              t.account.profile.coverUpload.upload
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

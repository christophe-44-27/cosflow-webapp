import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/app/features/auth';
import { handleApiError } from '@/app/lib/api-error-handler';

interface UseImageUploadOptions {
  type: 'avatar' | 'cover';
  maxSizeMB?: number;
  allowedTypes?: string[];
  onSuccess?: () => void;
}

interface ValidationError {
  message: string;
}

const DEFAULT_MAX_SIZE_MB = 2;
const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];

/**
 * Hook for handling image uploads (avatar or cover) with validation and preview
 */
export function useImageUpload({
  type,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  allowedTypes = DEFAULT_ALLOWED_TYPES,
  onSuccess,
}: UseImageUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { refreshUser } = useAuth();

  /**
   * Validate file before upload
   */
  const validateFile = useCallback(
    (file: File): ValidationError | null => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        return {
          message: `Le fichier doit être une image (${allowedTypes.map(t => t.split('/')[1]).join(', ')})`,
        };
      }

      // Check file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return {
          message: `Le fichier ne doit pas dépasser ${maxSizeMB} MB`,
        };
      }

      return null;
    },
    [allowedTypes, maxSizeMB]
  );

  /**
   * Handle file selection and create preview
   */
  const handleFileSelect = useCallback(
    (file: File | null) => {
      if (!file) {
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      // Validate file
      const error = validateFile(file);
      if (error) {
        toast.error(error.message);
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);
    },
    [validateFile]
  );

  /**
   * Upload the selected file
   */
  const uploadImage = useCallback(async () => {
    if (!selectedFile) {
      toast.error('Aucun fichier sélectionné');
      return false;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      const fieldName = type === 'avatar' ? 'image' : 'cover';
      formData.append(fieldName, selectedFile);

      const response = await fetch('/api/user-profile-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Refresh user data in context
        await refreshUser();

        toast.success(
          type === 'avatar'
            ? 'Avatar mis à jour avec succès'
            : 'Couverture mise à jour avec succès'
        );

        // Clear preview and file
        setPreviewUrl(null);
        setSelectedFile(null);

        onSuccess?.();
        return true;
      } else {
        await handleApiError(response, {
          errorMessages: {
            unauthorized: 'Votre session a expiré. Veuillez vous reconnecter.',
            serverError: `Impossible de mettre à jour ${type === 'avatar' ? 'l\'avatar' : 'la couverture'}. Veuillez réessayer.`,
          },
        });
        return false;
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Une erreur est survenue lors de l\'upload');
      return false;
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, type, refreshUser, onSuccess]);

  /**
   * Cancel upload and clear preview
   */
  const cancelUpload = useCallback(() => {
    setPreviewUrl(null);
    setSelectedFile(null);
  }, []);

  return {
    isUploading,
    previewUrl,
    selectedFile,
    handleFileSelect,
    uploadImage,
    cancelUpload,
  };
}

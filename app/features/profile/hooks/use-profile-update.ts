import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/app/features/auth';
import { handleApiError } from '@/app/lib/api-error-handler';

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  currency_id?: number;
  country_id?: number;
  locale?: string;
}

interface UseProfileUpdateOptions {
  onSuccess?: () => void;
}

/**
 * Hook for handling profile updates (name, email, currency, country, locale)
 */
export function useProfileUpdate({ onSuccess }: UseProfileUpdateOptions = {}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { refreshUser } = useAuth();

  /**
   * Update profile with the provided data
   */
  const updateProfile = useCallback(
    async (data: ProfileUpdateData) => {
      // Filter out undefined values (only send fields that are provided)
      const payload = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key as keyof ProfileUpdateData] = value;
        }
        return acc;
      }, {} as ProfileUpdateData);

      // Check if there's anything to update
      if (Object.keys(payload).length === 0) {
        toast.error('Aucune modification à enregistrer');
        return false;
      }

      setIsUpdating(true);

      try {

        const response = await fetch('/api/user/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          // Refresh user data in context
          await refreshUser();

          toast.success('Profil mis à jour avec succès');

          onSuccess?.();
          return true;
        } else {
          await handleApiError(response, {
            errorMessages: {
              unauthorized: 'Votre session a expiré. Veuillez vous reconnecter.',
              serverError: 'Impossible de mettre à jour le profil. Veuillez réessayer.',
            },
          });
          return false;
        }
      } catch (error) {
        console.error('Profile update error:', error);
        toast.error('Une erreur est survenue lors de la mise à jour');
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [refreshUser, onSuccess]
  );

  return {
    isUpdating,
    updateProfile,
  };
}

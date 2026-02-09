'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTranslations } from '@/app/lib/locale-context';
import { toast } from 'sonner';
import { handleApiError } from '@/app/lib/api-error-handler';

const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'currentPasswordRequired'),
  password: z.string().min(8, 'passwordMinLength'),
  password_confirmation: z.string().min(1, 'passwordRequired'),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'passwordsMatch',
  path: ['password_confirmation'],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ChangePasswordModal({ isOpen, onClose, onSuccess }: ChangePasswordModalProps) {
  const t = useTranslations();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const getValidationMessage = (key: string): string => {
    const messages: Record<string, string> = {
      currentPasswordRequired: t.account.security.changePasswordModal.validation.currentPasswordRequired,
      passwordRequired: t.account.security.changePasswordModal.validation.passwordRequired,
      passwordMinLength: t.account.security.changePasswordModal.validation.passwordMinLength,
      passwordsMatch: t.account.security.changePasswordModal.validation.passwordsMatch,
    };
    return messages[key] || key;
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/password/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(t.account.security.changePasswordModal.success.title, {
          description: t.account.security.changePasswordModal.success.message,
        });
        reset();
        onSuccess?.();
        onClose();
      } else {
        await handleApiError(response, {
          setError,
          errorMessages: {
            unauthorized: t.account.security.changePasswordModal.errors.unauthorized,
            serverError: t.account.security.changePasswordModal.errors.serverError,
          },
          fieldErrorMapper: (errors, setError) => {
            // Custom mapping for old_password to show user-friendly message
            if (errors.old_password) {
              setError('old_password', {
                message: t.account.security.changePasswordModal.errors.incorrectPassword,
              });
            }
            // Map other errors with default messages
            if (errors.password) {
              setError('password', {
                message: errors.password[0],
              });
            }
            if (errors.password_confirmation) {
              setError('password_confirmation', {
                message: errors.password_confirmation[0],
              });
            }
          },
          onUnauthorized: () => onClose(),
        });
      }
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(t.account.security.changePasswordModal.errors.serverError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-secondary border border-white/10 rounded-2xl w-full max-w-md p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-white mb-2">
            {t.account.security.changePasswordModal.title}
          </h2>
          <p className="text-white/60">
            {t.account.security.changePasswordModal.subtitle}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current password field */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">
              {t.account.security.changePasswordModal.currentPassword}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type={showOldPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('old_password')}
                className={`w-full bg-white/5 text-white placeholder:text-white/40 rounded-lg py-3 pl-11 pr-11 border focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.old_password
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/10 focus:border-primary'
                }`}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded transition-colors"
              >
                {showOldPassword ? (
                  <EyeOff className="w-5 h-5 text-white/40" />
                ) : (
                  <Eye className="w-5 h-5 text-white/40" />
                )}
              </button>
            </div>
            {errors.old_password && (
              <p className="text-red-400 text-sm mt-1">
                {typeof errors.old_password.message === 'string'
                  ? getValidationMessage(errors.old_password.message)
                  : errors.old_password.message}
              </p>
            )}
          </div>

          {/* New password field */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">
              {t.account.security.changePasswordModal.newPassword}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className={`w-full bg-white/5 text-white placeholder:text-white/40 rounded-lg py-3 pl-11 pr-11 border focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.password
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/10 focus:border-primary'
                }`}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5 text-white/40" />
                ) : (
                  <Eye className="w-5 h-5 text-white/40" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {typeof errors.password.message === 'string'
                  ? getValidationMessage(errors.password.message)
                  : errors.password.message}
              </p>
            )}
            <p className="text-white/40 text-xs mt-1">
              {t.account.security.changePasswordModal.passwordRequirements}
            </p>
          </div>

          {/* Confirm new password field */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">
              {t.account.security.changePasswordModal.confirmNewPassword}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password_confirmation')}
                className={`w-full bg-white/5 text-white placeholder:text-white/40 rounded-lg py-3 pl-11 pr-11 border focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.password_confirmation
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/10 focus:border-primary'
                }`}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-white/40" />
                ) : (
                  <Eye className="w-5 h-5 text-white/40" />
                )}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="text-red-400 text-sm mt-1">
                {typeof errors.password_confirmation.message === 'string'
                  ? getValidationMessage(errors.password_confirmation.message)
                  : errors.password_confirmation.message}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-white/5 hover:bg-white/10 disabled:bg-white/5 text-white py-3 rounded-lg transition-colors"
            >
              {t.account.security.changePasswordModal.cancelButton}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.account.security.changePasswordModal.updatingButton}
                </>
              ) : (
                t.account.security.changePasswordModal.submitButton
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

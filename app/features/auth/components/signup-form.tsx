'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTranslations } from '@/app/lib/locale-context';

const signupSchema = z.object({
  name: z.string().min(2, 'nameMinLength'),
  email: z.string().min(1, 'emailRequired').email('emailInvalid'),
  password: z.string().min(8, 'passwordMinLength'),
  password_confirmation: z.string().min(1, 'passwordRequired'),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'passwordsMatch',
  path: ['password_confirmation'],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const t = useTranslations();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const getValidationMessage = (key: string): string => {
    const messages: Record<string, string> = {
      emailRequired: t.auth.validation.emailRequired,
      emailInvalid: t.auth.validation.emailInvalid,
      passwordRequired: t.auth.validation.passwordRequired,
      passwordMinLength: t.auth.validation.passwordMinLength,
      nameRequired: t.auth.validation.nameRequired,
      nameMinLength: t.auth.validation.nameMinLength,
      passwordsMatch: t.auth.validation.passwordsMatch,
    };
    return messages[key] || key;
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Implement signup API call when available
      // For now, just show a message
      console.log('Signup data:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(t.auth.errors.serverError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Name field */}
      <div>
        <label className="text-white/60 text-sm mb-2 block">{t.auth.fullName}</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="John Doe"
            {...register('name')}
            className={`w-full bg-white/5 text-white placeholder:text-white/40 rounded-lg py-3 pl-11 pr-4 border focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              errors.name
                ? 'border-red-500/50 focus:border-red-500'
                : 'border-white/10 focus:border-primary'
            }`}
            disabled={isSubmitting}
          />
        </div>
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">
            {getValidationMessage(errors.name.message || '')}
          </p>
        )}
      </div>

      {/* Email field */}
      <div>
        <label className="text-white/60 text-sm mb-2 block">{t.auth.email}</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="email"
            placeholder="exemple@email.com"
            {...register('email')}
            className={`w-full bg-white/5 text-white placeholder:text-white/40 rounded-lg py-3 pl-11 pr-4 border focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              errors.email
                ? 'border-red-500/50 focus:border-red-500'
                : 'border-white/10 focus:border-primary'
            }`}
            disabled={isSubmitting}
          />
        </div>
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">
            {getValidationMessage(errors.email.message || '')}
          </p>
        )}
      </div>

      {/* Password field */}
      <div>
        <label className="text-white/60 text-sm mb-2 block">{t.auth.password}</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type={showPassword ? 'text' : 'password'}
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
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-white/40" />
            ) : (
              <Eye className="w-5 h-5 text-white/40" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">
            {getValidationMessage(errors.password.message || '')}
          </p>
        )}
      </div>

      {/* Confirm Password field */}
      <div>
        <label className="text-white/60 text-sm mb-2 block">{t.auth.confirmPassword}</label>
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
            {getValidationMessage(errors.password_confirmation.message || '')}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t.auth.signingUp}
          </>
        ) : (
          t.auth.signupButton
        )}
      </button>

      {/* Switch to login */}
      {onSwitchToLogin && (
        <div className="text-center">
          <p className="text-white/60 text-sm">
            {t.auth.hasAccount}{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              {t.auth.loginButton}
            </button>
          </p>
        </div>
      )}
    </form>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTranslations } from '@/app/lib/locale-context';
import { useAuth } from '../context/auth-context';

const loginSchema = z.object({
  email: z.string().min(1, 'emailRequired').email('emailInvalid'),
  password: z.string().min(1, 'passwordRequired'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const t = useTranslations();
  const { login, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const getValidationMessage = (key: string): string => {
    const messages: Record<string, string> = {
      emailRequired: t.auth.validation.emailRequired,
      emailInvalid: t.auth.validation.emailInvalid,
      passwordRequired: t.auth.validation.passwordRequired,
    };
    return messages[key] || key;
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const success = await login(data);
      if (success && onSuccess) {
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Error message */}
      {authError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
          {authError}
        </div>
      )}

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

      {/* Forgot password */}
      <div className="flex justify-end">
        <button
          type="button"
          className="text-primary hover:text-primary/80 text-sm transition-colors"
        >
          {t.auth.forgotPassword}
        </button>
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
            {t.auth.loggingIn}
          </>
        ) : (
          t.auth.loginButton
        )}
      </button>

      {/* Switch to signup */}
      {onSwitchToSignup && (
        <div className="text-center">
          <p className="text-white/60 text-sm">
            {t.auth.noAccount}{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              {t.auth.signupButton}
            </button>
          </p>
        </div>
      )}
    </form>
  );
}

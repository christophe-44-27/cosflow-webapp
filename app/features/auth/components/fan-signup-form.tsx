'use client';

import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLocale } from '@/app/lib/locale-context';
import type { AuthUser } from '@/app/types/models';

interface FanSignupFormProps {
  onSuccess: (user: AuthUser) => void;
  onSwitchToLogin: () => void;
}

export function FanSignupForm({ onSuccess, onSwitchToLogin }: FanSignupFormProps) {
  const { t } = useLocale();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consentError, setConsentError] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);
    setNameError(null);
    setConsentError(false);

    if (name.trim().length < 2) {
      setNameError(t.auth.validation.nameMinLength);
      return;
    }

    if (!consentGiven) {
      setConsentError(true);
      return;
    }

    if (!email || !password) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name.trim(), consent_given: true, type: 'fan' }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setEmailError(t.auth.errors.emailExists);
        } else {
          setError(data.error || t.auth.errors.serverError);
        }
        return;
      }

      onSuccess(data.user);
    } catch {
      setError(t.auth.errors.serverError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="text-white/60 text-sm mb-2 block">{t.auth.fullName}</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ton pseudo"
            required
            disabled={isSubmitting}
            className={`w-full bg-white/5 text-white placeholder:text-white/40 rounded-lg py-3 pl-11 pr-4 border focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              nameError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary'
            }`}
          />
        </div>
        {nameError && <p className="text-red-400 text-sm mt-1">{nameError}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="text-white/60 text-sm mb-2 block">{t.auth.email}</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="exemple@email.com"
            required
            disabled={isSubmitting}
            className={`w-full bg-white/5 text-white placeholder:text-white/40 rounded-lg py-3 pl-11 pr-4 border focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              emailError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary'
            }`}
          />
        </div>
        {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="text-white/60 text-sm mb-2 block">{t.auth.password}</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={8}
            disabled={isSubmitting}
            className="w-full bg-white/5 text-white placeholder:text-white/40 rounded-lg py-3 pl-11 pr-11 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5 text-white/40" /> : <Eye className="w-5 h-5 text-white/40" />}
          </button>
        </div>
        <p className="text-white/40 text-xs mt-1">{t.auth.validation.passwordMinLength}</p>
      </div>

      {/* RGPD Consent */}
      <div>
        <label className={`flex items-start gap-3 cursor-pointer group ${consentError ? 'text-red-400' : ''}`}>
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={e => { setConsentGiven(e.target.checked); setConsentError(false); }}
            disabled={isSubmitting}
            className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 accent-primary cursor-pointer flex-shrink-0"
          />
          <span className={`text-sm leading-relaxed ${consentError ? 'text-red-400' : 'text-white/70'}`}>
            {t.auth.fan.consentLabel}{' '}
            <span className="text-primary">{t.auth.fan.consentRequired}</span>
          </span>
        </label>
        {consentError && (
          <p className="text-red-400 text-sm mt-1 pl-7">{t.auth.fan.consentError}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[44px]"
      >
        {isSubmitting ? (
          <><Loader2 className="w-5 h-5 animate-spin" />{t.auth.fan.signingUp}</>
        ) : (
          t.auth.fan.signupButton
        )}
      </button>

      {/* Switch to login */}
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
    </form>
  );
}

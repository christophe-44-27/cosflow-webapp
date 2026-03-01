'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NextImage from 'next/image';
import { Mail, Lock, User, Eye, EyeOff, Loader2, ChevronLeft } from 'lucide-react';
import { useTranslations } from '@/app/lib/locale-context';
import { useAuth } from '@/app/features/auth';
import { LanguageSwitcher } from '@/app/components/language-switcher';
import type { AuthUser } from '@/app/types/models';

type ProfileType = 'maker' | 'fan';
type Step = 'select' | 'form';

export function SignupPageView() {
  const t = useTranslations();
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [step, setStep] = useState<Step>('select');
  const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>(null);

  const handleSelectProfile = (profile: ProfileType) => {
    setSelectedProfile(profile);
    setStep('form');
  };

  const handleSuccess = async (user: AuthUser | null, email?: string) => {
    const destination = selectedProfile === 'maker' ? '/studio/projects' : '/fan/onboarding';
    if (selectedProfile === 'maker') {
      localStorage.setItem('cosflow_new_maker', '1');
    }
    const emailParam = email ? `&email=${encodeURIComponent(email)}` : '';
    router.push(`/verify-email?next=${encodeURIComponent(destination)}${emailParam}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden">
            <NextImage src="/logo.png" alt="Cosflow" width={36} height={36} className="w-full h-full object-contain" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight group-hover:text-primary transition-colors">
            Cosflow
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher variant="compact" />
          <p className="text-white/50 text-sm hidden sm:block">
            {t.signup.alreadyAccount}{' '}
            <Link href="/?authRequired=true" className="text-primary hover:text-primary/80 transition-colors font-medium">
              {t.signup.signIn}
            </Link>
          </p>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-0.5 bg-white/5">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: step === 'select' ? '50%' : '100%' }}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {step === 'select' ? (
          <ProfileSelectorStep
            onSelect={handleSelectProfile}
            t={t}
          />
        ) : selectedProfile === 'maker' ? (
          <MakerFormStep
            onSuccess={handleSuccess}
            onBack={() => setStep('select')}
            t={t}
          />
        ) : (
          <FanFormStep
            onSuccess={handleSuccess}
            onBack={() => setStep('select')}
            t={t}
          />
        )}
      </main>
    </div>
  );
}

// ─── Step 1: Profile selector ───────────────────────────────────────────────

interface ProfileSelectorStepProps {
  onSelect: (profile: ProfileType) => void;
  t: ReturnType<typeof useTranslations>;
}

function ProfileSelectorStep({ onSelect, t }: ProfileSelectorStepProps) {
  return (
    <div className="w-full max-w-4xl">
      <div className="text-center mb-10">
        <p className="text-white/50 text-sm mb-3">{t.signup.stepIndicator.replace('{current}', '1').replace('{total}', '2')}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{t.signup.pageTitle}</h1>
        <p className="text-white/60 text-lg">{t.signup.pageSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Maker card */}
        <ProfileCard
          icon="🔨"
          name={t.signup.maker.name}
          tagline={t.signup.maker.tagline}
          description={t.signup.maker.description}
          features={t.signup.maker.features}
          cta={t.signup.maker.cta}
          accentColor="border-primary"
          ctaColor="bg-primary hover:bg-primary/90"
          onClick={() => onSelect('maker')}
        />

        {/* Fan card */}
        <ProfileCard
          icon="⭐"
          name={t.signup.fan.name}
          tagline={t.signup.fan.tagline}
          description={t.signup.fan.description}
          features={t.signup.fan.features}
          cta={t.signup.fan.cta}
          accentColor="border-[#2BD1C7]"
          ctaColor="bg-[#2BD1C7] hover:bg-[#2BD1C7]/90 text-[#0f0d1f]"
          onClick={() => onSelect('fan')}
        />

        {/* Photographer card (coming soon) */}
        <ProfileCardDisabled
          icon="📸"
          name={t.signup.photographer.name}
          tagline={t.signup.photographer.tagline}
          description={t.signup.photographer.description}
          features={t.signup.photographer.features}
          comingSoon={t.signup.photographer.comingSoon}
        />
      </div>
    </div>
  );
}

interface ProfileCardProps {
  icon: string;
  name: string;
  tagline: string;
  description: string;
  features: readonly string[];
  cta: string;
  accentColor: string;
  ctaColor: string;
  onClick: () => void;
}

function ProfileCard({ icon, name, tagline, description, features, cta, accentColor, ctaColor, onClick }: ProfileCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col text-left p-6 bg-secondary rounded-2xl border-2 border-white/10 hover:${accentColor} hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 hover:-translate-y-0.5`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <div className="mb-3">
        <h2 className="text-xl font-bold text-white">{name}</h2>
        <p className="text-white/60 text-sm mt-0.5">{tagline}</p>
      </div>
      <p className="text-white/50 text-sm leading-relaxed mb-4">{description}</p>
      <ul className="space-y-1.5 mb-6 flex-1">
        {features.map((f, i) => (
          <li key={i} className="text-white/70 text-sm">{f}</li>
        ))}
      </ul>
      <span className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white text-center transition-colors ${ctaColor}`}>
        {cta}
      </span>
    </button>
  );
}

interface ProfileCardDisabledProps {
  icon: string;
  name: string;
  tagline: string;
  description: string;
  features: readonly string[];
  comingSoon: string;
}

function ProfileCardDisabled({ icon, name, tagline, description, features, comingSoon }: ProfileCardDisabledProps) {
  return (
    <div className="relative flex flex-col text-left p-6 bg-secondary/60 rounded-2xl border-2 border-white/5 opacity-60 cursor-not-allowed">
      <div className="text-4xl mb-4 grayscale">{icon}</div>
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white/60">{name}</h2>
          <span className="px-2 py-0.5 bg-white/10 text-white/50 text-xs rounded-full font-medium">{comingSoon}</span>
        </div>
        <p className="text-white/40 text-sm mt-0.5">{tagline}</p>
      </div>
      <p className="text-white/30 text-sm leading-relaxed mb-4">{description}</p>
      <ul className="space-y-1.5 flex-1">
        {features.map((f, i) => (
          <li key={i} className="text-white/30 text-sm">{f}</li>
        ))}
      </ul>
    </div>
  );
}

// ─── Step 2a: Maker form ─────────────────────────────────────────────────────

interface FormStepProps {
  onSuccess: (user: AuthUser | null, email?: string) => void;
  onBack: () => void;
  t: ReturnType<typeof useTranslations>;
}

function MakerFormStep({ onSuccess, onBack, t }: FormStepProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);
    setNameError(null);
    setPasswordError(null);

    if (name.trim().length < 2) {
      setNameError(t.auth.validation.nameMinLength);
      return;
    }
    if (password.length < 8) {
      setPasswordError(t.auth.validation.passwordMinLength);
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError(t.auth.validation.passwordsMatch);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name.trim(), type: 'maker', consent_given: true }),
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

      onSuccess(data.user ?? null, email);
    } catch {
      setError(t.auth.errors.serverError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        {t.signup.backToSelector}
      </button>

      <div className="mb-8">
        <p className="text-white/50 text-sm mb-2">{t.signup.stepIndicator.replace('{current}', '2').replace('{total}', '2')}</p>
        <h1 className="text-2xl font-bold text-white">{t.signup.maker.formTitle}</h1>
        <p className="text-white/60 mt-1">{t.signup.maker.tagline}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="text-white/60 text-sm mb-2 block">{t.signup.maker.nameLabel}</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t.signup.maker.namePlaceholder}
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
              disabled={isSubmitting}
              className={`w-full bg-white/5 text-white placeholder:text-white/40 rounded-lg py-3 pl-11 pr-11 border focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                passwordError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5 text-white/40" /> : <Eye className="w-5 h-5 text-white/40" />}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label className="text-white/60 text-sm mb-2 block">{t.auth.confirmPassword}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              className={`w-full bg-white/5 text-white placeholder:text-white/40 rounded-lg py-3 pl-11 pr-11 border focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                passwordError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded transition-colors"
            >
              {showConfirm ? <EyeOff className="w-5 h-5 text-white/40" /> : <Eye className="w-5 h-5 text-white/40" />}
            </button>
          </div>
          {passwordError && <p className="text-red-400 text-sm mt-1">{passwordError}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px]"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" />{t.auth.signingUp}</>
          ) : (
            t.signup.maker.formTitle
          )}
        </button>

        <p className="text-center text-white/40 text-xs">
          {t.auth.hasAccount}{' '}
          <Link href="/?authRequired=true" className="text-primary hover:text-primary/80 transition-colors">
            {t.auth.loginButton}
          </Link>
        </p>
      </form>
    </div>
  );
}

// ─── Step 2b: Fan form ───────────────────────────────────────────────────────

function FanFormStep({ onSuccess, onBack, t }: FormStepProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [consentError, setConsentError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNameError(null);
    setEmailError(null);
    setConsentError(false);

    if (name.trim().length < 2) {
      setNameError(t.auth.validation.nameMinLength);
      return;
    }

    if (!consentGiven) {
      setConsentError(true);
      return;
    }

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

      onSuccess(data.user ?? null, email);
    } catch {
      setError(t.auth.errors.serverError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        {t.signup.backToSelector}
      </button>

      <div className="mb-8">
        <p className="text-white/50 text-sm mb-2">{t.signup.stepIndicator.replace('{current}', '2').replace('{total}', '2')}</p>
        <h1 className="text-2xl font-bold text-white">{t.signup.fan.formTitle}</h1>
        <p className="text-white/60 mt-1">{t.signup.fan.tagline}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="text-white/60 text-sm mb-2 block">{t.signup.maker.nameLabel}</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t.signup.maker.namePlaceholder}
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

        {/* RGPD */}
        <div>
          <label className={`flex items-start gap-3 cursor-pointer ${consentError ? 'text-red-400' : ''}`}>
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
          {consentError && <p className="text-red-400 text-sm mt-1 pl-7">{t.auth.fan.consentError}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2BD1C7] hover:bg-[#2BD1C7]/90 disabled:bg-[#2BD1C7]/50 text-[#0f0d1f] py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px]"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" />{t.auth.fan.signingUp}</>
          ) : (
            t.signup.fan.formTitle
          )}
        </button>

        <p className="text-center text-white/40 text-xs">
          {t.auth.hasAccount}{' '}
          <Link href="/?authRequired=true" className="text-primary hover:text-primary/80 transition-colors">
            {t.auth.loginButton}
          </Link>
        </p>
      </form>
    </div>
  );
}

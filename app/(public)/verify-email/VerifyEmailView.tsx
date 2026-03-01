'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NextImage from 'next/image';
import { Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import { useTranslations } from '@/app/lib/locale-context';
import { useAuth } from '@/app/features/auth';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export function VerifyEmailView() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();

  const next = searchParams.get('next') ?? '/';
  const emailParam = searchParams.get('email') ?? '';

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  const [resentMessage, setResentMessage] = useState(false);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // If already verified, redirect immediately
  useEffect(() => {
    if (user?.is_verified) {
      router.replace(next);
    }
  }, [user, next, router]);

  const startCooldown = useCallback(() => {
    setCooldown(RESEND_COOLDOWN);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => { if (cooldownRef.current) clearInterval(cooldownRef.current); }, []);

  // ── OTP input handlers ─────────────────────────────────────────────────────

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    // Accept only digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError(null);

    if (digit && index < CODE_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        focusInput(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = Array(CODE_LENGTH).fill('');
    pasted.split('').forEach((char, i) => { next[i] = char; });
    setDigits(next);
    focusInput(Math.min(pasted.length, CODE_LENGTH - 1));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const code = digits.join('');
  const isComplete = code.length === CODE_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const email = user?.email ?? emailParam;
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = res.status === 429
          ? t.verifyEmail.errors.tooMany
          : t.verifyEmail.errors.invalid;
        setError(data.error || msg);
        setDigits(Array(CODE_LENGTH).fill(''));
        focusInput(0);
        return;
      }

      setSuccess(true);
      await refreshUser();
      setTimeout(() => router.replace(next), 800);

    } catch {
      setError(t.verifyEmail.errors.serverError);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Resend ─────────────────────────────────────────────────────────────────

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResentMessage(false);
    setError(null);

    const email = user?.email ?? emailParam;
    try {
      const res = await fetch('/api/auth/verify-email/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setResentMessage(true);
        startCooldown();
        setTimeout(() => setResentMessage(false), 3000);
      }
    } catch {
      // fail silently
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Email vérifié !</h1>
          <p className="text-white/60">Redirection en cours…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="flex items-center px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden">
            <NextImage src="/logo.png" alt="Cosflow" width={36} height={36} className="w-full h-full object-contain" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight group-hover:text-primary transition-colors">
            Cosflow
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Icon */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/20 border border-primary/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">📬</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{t.verifyEmail.title}</h1>
            {(user?.email ?? emailParam) && (
              <p className="text-white/60 text-sm">
                {t.verifyEmail.subtitle}{' '}
                <span className="text-white font-medium">{user?.email ?? emailParam}</span>
              </p>
            )}
            <p className="text-white/50 text-sm mt-1">{t.verifyEmail.instructions}</p>
          </div>

          {/* OTP form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 6 digit inputs */}
            <div
              className="flex items-center justify-center gap-3"
              onPaste={handlePaste}
            >
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  disabled={isSubmitting}
                  className={`w-12 h-14 text-center text-2xl font-bold text-white rounded-xl border-2 bg-white/5 focus:outline-none transition-all ${
                    error
                      ? 'border-red-500/60 bg-red-500/10'
                      : digit
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 focus:border-primary focus:bg-white/10'
                  }`}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            {/* Resent confirmation */}
            {resentMessage && (
              <p className="text-green-400 text-sm text-center">{t.verifyEmail.codeResent}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!isComplete || isSubmitting}
              className="w-full py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/30 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" />{t.verifyEmail.verifying}</>
              ) : (
                t.verifyEmail.submitButton
              )}
            </button>

            {/* Resend */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0}
                className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {cooldown > 0
                  ? t.verifyEmail.resendCooldown.replace('{seconds}', String(cooldown))
                  : t.verifyEmail.resendButton}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

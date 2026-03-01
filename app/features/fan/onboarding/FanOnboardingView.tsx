'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/app/lib/locale-context';
import { ProfileLikeButton } from '@/app/features/profile/public-view/components/ProfileLikeButton';
import type { User } from '@/app/types/models';

interface FanOnboardingViewProps {
  makers: User[];
}

const FANDOMS = [
  { id: 'anime', emoji: '⛩️', label: 'Anime & Manga', examples: 'Naruto, Demon Slayer, JJK' },
  { id: 'gaming', emoji: '🎮', label: 'Jeux vidéo', examples: 'Final Fantasy, Genshin, LoL' },
  { id: 'movies', emoji: '🎬', label: 'Cinéma & Séries', examples: 'Marvel, DC, Star Wars' },
  { id: 'fantasy', emoji: '🐉', label: 'Fantasy', examples: 'Tolkien, D&D, Critical Role' },
  { id: 'kpop', emoji: '🎤', label: 'K-pop & Idols', examples: 'BTS, Kpop generals' },
  { id: 'original', emoji: '✨', label: 'Original', examples: 'OC, design original' },
];

export function FanOnboardingView({ makers }: FanOnboardingViewProps) {
  const t = useTranslations();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedFandoms, setSelectedFandoms] = useState<Set<string>>(new Set());

  const toggleFandom = (id: string) => {
    setSelectedFandoms(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>
        <span className="text-white/40 text-xs shrink-0">
          {t.fanOnboarding.step1Title && `${step}/2`}
        </span>
      </div>

      {step === 1 ? (
        <FandomPickerStep
          t={t}
          selectedFandoms={selectedFandoms}
          onToggle={toggleFandom}
          onContinue={() => setStep(2)}
          onSkip={() => setStep(2)}
        />
      ) : (
        <MakerSuggestionsStep
          t={t}
          makers={makers}
        />
      )}
    </div>
  );
}

// ─── Step 1: Fandom picker ───────────────────────────────────────────────────

interface FandomPickerStepProps {
  t: ReturnType<typeof useTranslations>;
  selectedFandoms: Set<string>;
  onToggle: (id: string) => void;
  onContinue: () => void;
  onSkip: () => void;
}

function FandomPickerStep({ t, selectedFandoms, onToggle, onContinue, onSkip }: FandomPickerStepProps) {
  const hasSelection = selectedFandoms.size > 0;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.fanOnboarding.step1Title}</h1>
        <p className="text-white/60">{t.fanOnboarding.step1Subtitle}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {FANDOMS.map(fandom => {
          const selected = selectedFandoms.has(fandom.id);
          return (
            <button
              key={fandom.id}
              type="button"
              onClick={() => onToggle(fandom.id)}
              className={`relative flex flex-col items-start p-4 rounded-2xl border-2 text-left transition-all duration-150 ${
                selected
                  ? 'border-primary bg-primary/15 shadow-lg shadow-primary/10 scale-[1.02]'
                  : 'border-white/10 bg-secondary hover:border-white/20 hover:bg-white/5'
              }`}
            >
              {selected && (
                <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                  ✓
                </span>
              )}
              <span className="text-3xl mb-2">{fandom.emoji}</span>
              <span className="text-white font-semibold text-sm leading-snug">{fandom.label}</span>
              <span className="text-white/40 text-xs mt-0.5 line-clamp-1">{fandom.examples}</span>
            </button>
          );
        })}
      </div>

      {selectedFandoms.size > 0 && selectedFandoms.size < 3 && (
        <p className="text-center text-white/40 text-xs mb-4">{t.fanOnboarding.minTagsHint}</p>
      )}

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onContinue}
          disabled={!hasSelection}
          className="w-full max-w-xs py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/30 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
        >
          {t.fanOnboarding.continueButton}
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="text-white/40 hover:text-white/60 text-sm transition-colors"
        >
          {t.fanOnboarding.skipStep}
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Maker suggestions ───────────────────────────────────────────────

interface MakerSuggestionsStepProps {
  t: ReturnType<typeof useTranslations>;
  makers: User[];
}

function MakerSuggestionsStep({ t, makers }: MakerSuggestionsStepProps) {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.fanOnboarding.step2Title}</h1>
        <p className="text-white/60">{t.fanOnboarding.step2Subtitle}</p>
      </div>

      {makers.length > 0 && (
        <div className="space-y-3 mb-8">
          {makers.map((maker) => (
            <div
              key={maker.id}
              className="flex items-center gap-4 bg-secondary border border-white/10 rounded-2xl p-4 hover:border-primary/30 transition-colors"
            >
              <Link href={`/profile/${maker.slug}`} target="_blank" rel="noopener" className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/20 overflow-hidden">
                  {maker.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={maker.avatar} alt={maker.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-bold text-lg">
                      {maker.name?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/profile/${maker.slug}`} target="_blank" rel="noopener">
                  <p className="text-white font-medium truncate hover:text-primary transition-colors text-sm">
                    {maker.name}
                  </p>
                </Link>
                {maker.description && (
                  <p className="text-white/50 text-xs line-clamp-1 mt-0.5">{maker.description}</p>
                )}
              </div>

              <div className="flex-shrink-0">
                <ProfileLikeButton slug={maker.slug} initialCount={0} initialLiked={null} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        <Link
          href="/discovery"
          className="w-full max-w-xs py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors text-center"
        >
          {t.fanOnboarding.exploreButtonFinal}
        </Link>
        <Link
          href="/discovery"
          className="text-white/40 hover:text-white/60 text-sm transition-colors"
        >
          {t.fanOnboarding.skip}
        </Link>
      </div>
    </div>
  );
}

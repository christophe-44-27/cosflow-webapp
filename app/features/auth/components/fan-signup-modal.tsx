'use client';

import { X, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/app/lib/locale-context';
import { useAuth } from '@/app/features/auth';
import { FanSignupForm } from './fan-signup-form';
import type { AuthUser } from '@/app/types/models';

interface FanSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FanSignupModal({ isOpen, onClose }: FanSignupModalProps) {
  const { t } = useLocale();
  const { refreshUser, setShowAuthModal, setShowFanSignupModal } = useAuth();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSuccess = async (user: AuthUser) => {
    onClose();
    await refreshUser();
    router.push('/fan/onboarding');
  };

  const handleSwitchToLogin = () => {
    onClose();
    setShowAuthModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-secondary border border-white/10 rounded-2xl w-full max-w-md p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 border border-primary/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-white mb-2">{t.auth.fan.modalTitle}</h2>
          <p className="text-white/60 text-sm">{t.auth.fan.modalSubtitle}</p>
        </div>

        <FanSignupForm onSuccess={handleSuccess} onSwitchToLogin={handleSwitchToLogin} />
      </div>
    </div>
  );
}

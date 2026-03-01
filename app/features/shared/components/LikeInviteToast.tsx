'use client';

import { useLocale } from '@/app/lib/locale-context';
import { useAuth } from '@/app/features/auth';
import { X } from 'lucide-react';

interface LikeInviteToastProps {
  visible: boolean;
  onClose: () => void;
}

export function LikeInviteToast({ visible, onClose }: LikeInviteToastProps) {
  const { t } = useLocale();
  const { setShowAuthModal, setShowFanSignupModal } = useAuth();

  const handleLogin = () => {
    onClose();
    setShowAuthModal(true);
  };

  const handleFanSignup = () => {
    onClose();
    setShowFanSignupModal(true);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-[#1E1A40]/95 border border-[#6259CA]/30 rounded-[14px] shadow-xl backdrop-blur-sm transition-all duration-300 ${
        visible
          ? '-translate-x-1/2 translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-x-1/2 translate-y-4 opacity-0 pointer-events-none'
      }`}
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      <span className="text-lg select-none shrink-0">❤️</span>
      <span className="text-white/90 shrink-0" style={{ fontSize: '0.875rem' }}>
        {t.engagement.likeToastMessage}
      </span>
      <button
        onClick={handleFanSignup}
        className="shrink-0 px-3 py-1.5 bg-[#6259CA] hover:bg-[#6259CA]/90 text-white rounded-[8px] font-medium transition-colors"
        style={{ fontSize: '0.78rem' }}
      >
        {t.engagement.likeToastCtaFan}
      </button>
      <button
        onClick={handleLogin}
        className="shrink-0 px-2 py-1.5 text-white/60 hover:text-white/90 transition-colors"
        style={{ fontSize: '0.78rem' }}
      >
        {t.engagement.likeToastCta}
      </button>
      <button
        onClick={onClose}
        className="shrink-0 p-1 text-white/40 hover:text-white/80 transition-colors rounded-md"
        aria-label="Fermer"
      >
        <X size={14} />
      </button>
    </div>
  );
}

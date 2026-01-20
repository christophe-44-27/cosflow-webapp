'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { AuthModal } from '@/app/features/auth/components/auth-modal';
import { MobileBanner } from '@/app/components/mobile-banner';
import { useAuth } from '@/app/features/auth';

export function AppLayout({ children }: { children: ReactNode }) {
  const { isLoggedIn, showAuthModal, handleLoginRequired, setShowAuthModal } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        isLoggedIn={isLoggedIn}
        onLoginRequired={handleLoginRequired}
      />
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <MobileBanner />
        {children}
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

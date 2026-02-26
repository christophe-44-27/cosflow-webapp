'use client';

import { ReactNode } from 'react';
import { Navbar } from './navbar';
import { AuthModal } from '@/app/features/auth/components/auth-modal';
import { MobileBanner } from '@/app/components/mobile-banner';
import { useAuth } from '@/app/features/auth';

export function AppLayout({ children }: { children: ReactNode }) {
  const { isLoggedIn, showAuthModal, handleLoginRequired, setShowAuthModal } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLoginRequired={handleLoginRequired}
      />
      <main className="pt-16">
        <MobileBanner />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

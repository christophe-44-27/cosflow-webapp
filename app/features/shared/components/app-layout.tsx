'use client';

import { ReactNode } from 'react';
import { Navbar } from './navbar';
import { AuthModal } from '@/app/features/auth/components/auth-modal';
import { MobileBanner } from '@/app/components/mobile-banner';
import { useAuth } from '@/app/features/auth';
import { LikeToastProvider } from '../context/like-toast-context';

interface AppLayoutProps {
  children: ReactNode;
  /** Supprime le container max-w-7xl pour les pages full-width (ex: page projet D1) */
  noContainer?: boolean;
}

export function AppLayout({ children, noContainer = false }: AppLayoutProps) {
  const { isLoggedIn, showAuthModal, handleLoginRequired, setShowAuthModal } = useAuth();

  return (
    <LikeToastProvider>
      <div className="min-h-screen bg-background">
        <Navbar
          isLoggedIn={isLoggedIn}
          onLoginRequired={handleLoginRequired}
        />
        <main className="pt-16">
          <MobileBanner />
          {noContainer ? children : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          )}
        </main>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </LikeToastProvider>
  );
}

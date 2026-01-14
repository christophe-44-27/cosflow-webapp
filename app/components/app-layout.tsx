'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { AuthModal } from './auth-modal';
import { MobileBanner } from './mobile-banner';
import { useAuth } from '../lib/auth-context';

export function AppLayout({ children }: { children: ReactNode }) {
  const { isLoggedIn, showAuthModal, handleLogin, handleLogout, handleLoginRequired, setShowAuthModal } = useAuth();

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
        onLogin={handleLogin}
      />
    </div>
  );
}

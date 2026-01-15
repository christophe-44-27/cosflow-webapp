'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { AuthModal } from './auth-modal';
import { MobileBanner } from './mobile-banner';
import { LandingView } from './landing-view';
import { DiscoveryView } from './discovery-view';
import { WebGalleryView } from './web-gallery-view';
import { WebProjectsView } from './web-projects-view';
import { WebAccountView } from './web-account-view';

export function AppClientWrapper() {
  const [activeView, setActiveView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveView('home');
  };

  const handleLoginRequired = () => {
    setShowAuthModal(true);
  };

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <LandingView />;
      case 'discovery':
        return <DiscoveryView />;
      case 'gallery':
        return <WebGalleryView />;
      case 'projects':
        return <WebProjectsView />;
      case 'account':
        return <WebAccountView />;
      case 'events':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-white mb-2">Événements</h2>
              <p className="text-white/60">Cette section est en développement</p>
            </div>
          </div>
        );
      case 'forge':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-white mb-2">Forge</h2>
              <p className="text-white/60">Cette section est en développement</p>
            </div>
          </div>
        );
      default:
        return <LandingView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        isLoggedIn={isLoggedIn}
        onLoginRequired={handleLoginRequired}
      />
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <MobileBanner />
        {renderView()}
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

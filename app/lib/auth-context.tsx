'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  showAuthModal: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setShowAuthModal: (value: boolean) => void;
  handleLogin: () => void;
  handleLogout: () => void;
  handleLoginRequired: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLoginRequired = () => {
    setShowAuthModal(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        showAuthModal,
        setIsLoggedIn,
        setShowAuthModal,
        handleLogin,
        handleLogout,
        handleLoginRequired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

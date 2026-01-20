'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { AuthUser, LoginCredentials, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const isLoggedIn = !!user;

  // Fetch current user on mount
  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      console.log('Fetch user response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched user data:', data);
        setUser(data.user);
      } else if (response.status === 401) {
        // Try to refresh the token
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
        });

        if (refreshResponse.ok) {
          // Retry fetching user after refresh
          const retryResponse = await fetch('/api/auth/me');
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            setUser(data.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check for authRequired param on mount
  useEffect(() => {
    const authRequired = searchParams.get('authRequired');
    if (authRequired === 'true') {
      setShowAuthModal(true);
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('authRequired');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return false;
      }

      // If user data is returned, use it; otherwise fetch it
      if (data.user) {
        console.log('Setting user from login response:', data.user);
        setUser(data.user);
      } else {
        console.log('No user in response, fetching user data...');
        // Fetch user data after successful login
        await fetchUser();
      }

      setShowAuthModal(false);

      // Check if there's a returnTo URL
      const returnTo = searchParams.get('returnTo');
      if (returnTo) {
        router.push(returnTo);
        // Clean up the URL
        const url = new URL(window.location.href);
        url.searchParams.delete('returnTo');
        window.history.replaceState({}, '', url.toString());
      }

      setIsLoading(false);
      return true;

    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      router.push('/');
    }
  };

  const refreshUser = async (): Promise<void> => {
    await fetchUser();
  };

  const handleLoginRequired = () => {
    setShowAuthModal(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn,
        error,
        showAuthModal,
        setShowAuthModal,
        login,
        logout,
        refreshUser,
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

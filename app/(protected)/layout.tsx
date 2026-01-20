'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/app/features/auth';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading, handleLoginRequired } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and not logged in, show auth modal
    if (!isLoading && !isLoggedIn) {
      handleLoginRequired();
      router.push('/');
    }
  }, [isLoading, isLoggedIn, handleLoginRequired, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If not logged in, don't render children (redirect will happen)
  if (!isLoggedIn) {
    return null;
  }

  return children;
}

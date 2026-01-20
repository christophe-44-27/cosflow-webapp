'use client';

import { Suspense, ReactNode } from 'react';
import { AuthProvider } from '../context/auth-context';

function AuthProviderInner({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

export function AuthProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </Suspense>
  );
}

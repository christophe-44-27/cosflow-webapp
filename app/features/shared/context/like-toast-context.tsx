'use client';

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { LikeInviteToast } from '../components/LikeInviteToast';

interface LikeToastContextValue {
  showLikeToast: () => void;
}

const LikeToastContext = createContext<LikeToastContextValue>({ showLikeToast: () => {} });

export function useLikeToast() {
  return useContext(LikeToastContext);
}

export function LikeToastProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showLikeToast = useCallback(() => {
    // Deduplication: reset timer if already visible
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(true);
    timerRef.current = setTimeout(() => setVisible(false), 3000);
  }, []);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  return (
    <LikeToastContext.Provider value={{ showLikeToast }}>
      {children}
      <LikeInviteToast visible={visible} onClose={hide} />
    </LikeToastContext.Provider>
  );
}

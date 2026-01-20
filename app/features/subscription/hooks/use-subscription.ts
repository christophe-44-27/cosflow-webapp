'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/app/features/auth';
import type { PriceType, CheckoutSessionResponse, PortalSessionResponse } from '../types';

export function useSubscription() {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPremium = user?.is_premium ?? false;
  const subscriptionStatus = user?.subscription_status ?? null;

  const createCheckoutSession = useCallback(async (priceType: PriceType) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceType }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const data: CheckoutSessionResponse = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openCustomerPortal = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create portal session');
      }

      const data: PortalSessionResponse = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Portal error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await refreshUser();
  }, [refreshUser]);

  return {
    isPremium,
    subscriptionStatus,
    isLoading,
    error,
    createCheckoutSession,
    openCustomerPortal,
    refresh,
  };
}

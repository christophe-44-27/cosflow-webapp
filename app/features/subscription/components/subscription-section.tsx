'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Crown, CreditCard, Sparkles, Check, Loader2 } from 'lucide-react';
import { useTranslations } from '@/app/lib/locale-context';
import { useSubscription } from '../hooks/use-subscription';
import { SubscriptionStatusBadge } from './subscription-status-badge';
import { PricingModal } from './pricing-modal';

export function SubscriptionSection() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const {
    isPremium,
    subscriptionStatus,
    isLoading,
    error,
    createCheckoutSession,
    openCustomerPortal,
    refresh,
  } = useSubscription();

  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check for subscription success/cancel in URL params
  useEffect(() => {
    const subscriptionParam = searchParams.get('subscription');
    if (subscriptionParam === 'success') {
      setShowSuccessMessage(true);
      refresh();
      // Remove the query param from URL without reload
      window.history.replaceState({}, '', '/account');
      // Hide success message after 5 seconds
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, refresh]);

  const premiumFeatures = [
    t.subscription.features.unlimitedProjects,
    t.subscription.features.prioritySupport,
    t.subscription.features.advancedAnalytics,
    t.subscription.features.customBranding,
  ];

  return (
    <>
      <div className="bg-secondary border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            {t.subscription.title}
          </h3>
          <SubscriptionStatusBadge isPremium={isPremium} status={subscriptionStatus} />
        </div>

        {/* Success message */}
        {showSuccessMessage && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm flex items-center gap-2">
            <Check className="w-4 h-4" />
            {t.subscription.successMessage}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {isPremium ? (
          // Premium user view
          <div className="space-y-4">
            <p className="text-white/60 text-sm">
              {t.subscription.premiumActive}
            </p>
            <button
              onClick={openCustomerPortal}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  {t.subscription.manageBilling.title}
                </>
              )}
            </button>
            <p className="text-white/40 text-xs text-center">
              {t.subscription.manageBilling.description}
            </p>
          </div>
        ) : (
          // Free user view
          <div className="space-y-4">
            <p className="text-white/60 text-sm">
              {t.subscription.upgrade.description}
            </p>
            <ul className="space-y-2">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-white/80 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowPricingModal(true)}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Crown className="w-4 h-4" />
                  {t.subscription.upgrade.button}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        onSelectPlan={createCheckoutSession}
        isLoading={isLoading}
      />
    </>
  );
}

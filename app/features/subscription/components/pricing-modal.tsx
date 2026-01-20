'use client';

import { X, Check, Loader2 } from 'lucide-react';
import { useTranslations } from '@/app/lib/locale-context';
import type { PriceType } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (priceType: PriceType) => void;
  isLoading: boolean;
}

export function PricingModal({ isOpen, onClose, onSelectPlan, isLoading }: PricingModalProps) {
  const t = useTranslations();

  if (!isOpen) return null;

  const features = [
    t.subscription.features.unlimitedProjects,
    t.subscription.features.prioritySupport,
    t.subscription.features.advancedAnalytics,
    t.subscription.features.customBranding,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl mx-4 bg-secondary border border-white/10 rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">
            {t.subscription.pricing.title}
          </h2>
          <p className="text-white/60">
            {t.subscription.pricing.subtitle}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Monthly */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
            <h3 className="text-lg font-semibold text-white mb-2">
              {t.subscription.pricing.monthly.title}
            </h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-white">
                {t.subscription.pricing.monthly.price}
              </span>
              <span className="text-white/60 ml-1">
                /{t.subscription.pricing.monthly.period}
              </span>
            </div>
            <ul className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-white/80 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onSelectPlan('monthly')}
              disabled={isLoading}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t.subscription.pricing.selectPlan
              )}
            </button>
          </div>

          {/* Yearly */}
          <div className="bg-gradient-to-br from-primary/20 to-tertiary/20 border border-primary/30 rounded-xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
              {t.subscription.pricing.yearly.savings}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {t.subscription.pricing.yearly.title}
            </h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-white">
                {t.subscription.pricing.yearly.price}
              </span>
              <span className="text-white/60 ml-1">
                /{t.subscription.pricing.yearly.period}
              </span>
            </div>
            <ul className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-white/80 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onSelectPlan('yearly')}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t.subscription.pricing.selectPlan
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-sm">
          {t.subscription.pricing.footer}
        </p>
      </div>
    </div>
  );
}

'use client';

import { Crown } from 'lucide-react';
import { useTranslations } from '@/app/lib/locale-context';
import type { SubscriptionStatus } from '../types';

interface SubscriptionStatusBadgeProps {
  isPremium: boolean;
  status: string | null;
}

export function SubscriptionStatusBadge({ isPremium, status }: SubscriptionStatusBadgeProps) {
  const t = useTranslations();

  const getStatusConfig = () => {
    if (!isPremium || !status) {
      return {
        label: t.subscription.status.free,
        className: 'bg-white/10 text-white/60',
        icon: false,
      };
    }

    switch (status as SubscriptionStatus) {
      case 'active':
        return {
          label: t.subscription.status.active,
          className: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
          icon: true,
        };
      case 'trialing':
        return {
          label: t.subscription.status.trial,
          className: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
          icon: true,
        };
      case 'past_due':
        return {
          label: t.subscription.status.pastDue,
          className: 'bg-red-500/20 text-red-400',
          icon: true,
        };
      case 'canceled':
        return {
          label: t.subscription.status.canceled,
          className: 'bg-white/10 text-white/60',
          icon: false,
        };
      default:
        return {
          label: t.subscription.status.premium,
          className: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
          icon: true,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.className}`}
    >
      {config.icon && <Crown className="w-4 h-4" />}
      {config.label}
    </span>
  );
}

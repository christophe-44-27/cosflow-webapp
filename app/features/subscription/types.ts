export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused';

export type PriceType = 'monthly' | 'yearly';

export interface SubscriptionInfo {
  isPremium: boolean;
  status: SubscriptionStatus | null;
  customerId: string | null;
  subscriptionId: string | null;
  currentPeriodEnd: Date | null;
}

export interface CheckoutSessionResponse {
  url: string;
}

export interface PortalSessionResponse {
  url: string;
}

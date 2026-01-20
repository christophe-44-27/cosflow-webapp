import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backwards compatibility
export const stripe = {
  get customers() { return getStripe().customers; },
  get subscriptions() { return getStripe().subscriptions; },
  get checkout() { return getStripe().checkout; },
  get billingPortal() { return getStripe().billingPortal; },
  get webhooks() { return getStripe().webhooks; },
};

export const STRIPE_CONFIG = {
  prices: {
    monthly: process.env.STRIPE_PRICE_ID_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_ID_YEARLY || '',
  },
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://cosflow.app',
};

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  TRIALING: 'trialing',
  PAST_DUE: 'past_due',
  CANCELED: 'canceled',
  UNPAID: 'unpaid',
  INCOMPLETE: 'incomplete',
  INCOMPLETE_EXPIRED: 'incomplete_expired',
  PAUSED: 'paused',
} as const;

export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];

import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/app/lib/stripe';
import Stripe from 'stripe';
import { SERVER_CONFIG } from '@/app/lib/server-config';

// Sync subscription status to Laravel backend
async function syncSubscriptionToBackend(data: {
  user_id: string;
  customer_id: string;
  subscription_id: string;
  status: string;
  is_premium: boolean;
  current_period_end: number;
}) {
  try {
    const response = await fetch(
      `${SERVER_CONFIG.api.baseUrl}/api/webhooks/stripe/subscription`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      console.error('Failed to sync subscription to backend:', await response.text());
    }
  } catch (error) {
    console.error('Error syncing subscription to backend:', error);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  if (!STRIPE_CONFIG.webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONFIG.webhookSecret
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          ) as unknown as { id: string; status: string; metadata: Record<string, string>; customer: string; items: { data: Array<{ current_period_end: number }> } };

          const userId = session.metadata?.user_id || subscription.metadata?.user_id;
          const currentPeriodEnd = subscription.items?.data?.[0]?.current_period_end || Math.floor(Date.now() / 1000);

          if (userId) {
            await syncSubscriptionToBackend({
              user_id: userId,
              customer_id: session.customer as string,
              subscription_id: subscription.id,
              status: subscription.status,
              is_premium: subscription.status === 'active' || subscription.status === 'trialing',
              current_period_end: currentPeriodEnd,
            });
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscriptionData = event.data.object as unknown as {
          id: string;
          status: string;
          metadata: Record<string, string>;
          customer: string;
          items: { data: Array<{ current_period_end: number }> };
        };
        const userId = subscriptionData.metadata?.user_id;
        const currentPeriodEnd = subscriptionData.items?.data?.[0]?.current_period_end || Math.floor(Date.now() / 1000);

        if (userId) {
          await syncSubscriptionToBackend({
            user_id: userId,
            customer_id: subscriptionData.customer as string,
            subscription_id: subscriptionData.id,
            status: subscriptionData.status,
            is_premium: subscriptionData.status === 'active' || subscriptionData.status === 'trialing',
            current_period_end: currentPeriodEnd,
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscriptionData = event.data.object as unknown as {
          id: string;
          status: string;
          metadata: Record<string, string>;
          customer: string;
          items: { data: Array<{ current_period_end: number }> };
        };
        const userId = subscriptionData.metadata?.user_id;
        const currentPeriodEnd = subscriptionData.items?.data?.[0]?.current_period_end || Math.floor(Date.now() / 1000);

        if (userId) {
          await syncSubscriptionToBackend({
            user_id: userId,
            customer_id: subscriptionData.customer as string,
            subscription_id: subscriptionData.id,
            status: 'canceled',
            is_premium: false,
            current_period_end: currentPeriodEnd,
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as unknown as { subscription: string; customer: string };
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as unknown as {
            id: string;
            status: string;
            metadata: Record<string, string>;
            customer: string;
            items: { data: Array<{ current_period_end: number }> };
          };
          const userId = subscription.metadata?.user_id;
          const currentPeriodEnd = subscription.items?.data?.[0]?.current_period_end || Math.floor(Date.now() / 1000);

          if (userId) {
            await syncSubscriptionToBackend({
              user_id: userId,
              customer_id: invoice.customer as string,
              subscription_id: subscriptionId,
              status: 'past_due',
              is_premium: false,
              current_period_end: currentPeriodEnd,
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

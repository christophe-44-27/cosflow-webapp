import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { stripe, STRIPE_CONFIG } from '@/app/lib/stripe';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(SERVER_CONFIG.cookies.accessToken)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { priceType } = body;

    if (!priceType || !['monthly', 'yearly'].includes(priceType)) {
      return NextResponse.json(
        { error: 'Invalid price type. Must be "monthly" or "yearly"' },
        { status: 400 }
      );
    }

    const priceId = priceType === 'monthly'
      ? STRIPE_CONFIG.prices.monthly
      : STRIPE_CONFIG.prices.yearly;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price configuration not found' },
        { status: 500 }
      );
    }

    // Fetch user from Laravel API
    const userResponse = await fetch(apiUrl(SERVER_CONFIG.auth.userEndpoint), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user information' },
        { status: 401 }
      );
    }

    const userData = await userResponse.json();
    const user = userData.data;

    // Check if user already has a Stripe customer ID
    let customerId = user.stripe_customer_id;

    if (!customerId) {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.profile?.name || user.email,
        metadata: {
          user_id: user.id.toString(),
        },
      });
      customerId = customer.id;

      // Optionally sync customer ID back to Laravel
      // This could be done via a separate endpoint
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${STRIPE_CONFIG.appUrl}/account?subscription=success`,
      cancel_url: `${STRIPE_CONFIG.appUrl}/account?subscription=canceled`,
      metadata: {
        user_id: user.id.toString(),
      },
      subscription_data: {
        metadata: {
          user_id: user.id.toString(),
        },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

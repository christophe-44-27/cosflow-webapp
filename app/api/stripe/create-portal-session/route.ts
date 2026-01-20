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

    const customerId = user.customer_id;

    if (!customerId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      );
    }

    // Create Stripe Customer Portal Session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${STRIPE_CONFIG.appUrl}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}

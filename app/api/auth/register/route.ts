import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, consent_given, name, type = 'fan' } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!consent_given && type === 'fan') {
      return NextResponse.json(
        { error: 'RGPD consent is required' },
        { status: 400 }
      );
    }

    const { api, auth, cookies: cookieConfig } = SERVER_CONFIG;

    if (!api.clientId || !api.clientSecret) {
      console.error('Missing API_CLIENT_ID or API_CLIENT_SECRET');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 1. Create fan account on Laravel
    const registerResponse = await fetch(apiUrl(auth.registerEndpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password, consent_given, name, type }),
    });

    if (!registerResponse.ok) {
      const errorData = await registerResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Registration failed' },
        { status: registerResponse.status }
      );
    }

    // 2. Auto-login via OAuth to get httpOnly tokens
    const tokenResponse = await fetch(apiUrl(auth.loginEndpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });

    if (!tokenResponse.ok) {
      // Account created but login failed — shouldn't happen normally
      return NextResponse.json(
        { error: 'Account created but login failed. Please sign in manually.' },
        { status: 500 }
      );
    }

    const tokenData: TokenResponse = await tokenResponse.json();

    // 3. Set httpOnly cookies
    const cookieStore = await cookies();

    cookieStore.set(cookieConfig.accessToken, tokenData.access_token, {
      httpOnly: true,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      maxAge: tokenData.expires_in,
      path: '/',
    });

    cookieStore.set(cookieConfig.refreshToken, tokenData.refresh_token, {
      httpOnly: true,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      maxAge: cookieConfig.refreshTokenMaxAge,
      path: '/',
    });

    // 4. Fetch user profile
    const userResponse = await fetch(apiUrl(auth.userEndpoint), {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json',
      },
    });

    if (!userResponse.ok) {
      // Account requires email verification — return email so frontend can pass it along
      return NextResponse.json({ success: true, email_not_verified: true, email }, { status: 200 });
    }

    const userData = await userResponse.json();
    const user = userData.data || userData;

    // If user exists but not verified yet
    if (user && user.is_verified === false) {
      return NextResponse.json({ success: true, email_not_verified: true, email, user }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { api, auth, cookies: cookieConfig } = SERVER_CONFIG;

    // Validate server configuration
    if (!api.clientId || !api.clientSecret) {
      console.error('Missing API_CLIENT_ID or API_CLIENT_SECRET environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Call Laravel Passport token endpoint
    const tokenResponse = await fetch(apiUrl(auth.tokenEndpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'password',
        client_id: api.clientId,
        client_secret: api.clientSecret,
        username: email,
        password: password,
        scope: '',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Invalid credentials' },
        { status: tokenResponse.status }
      );
    }

    const tokenData: TokenResponse = await tokenResponse.json();

    // Set cookies with HttpOnly for security
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

    // Fetch user info after successful login
    console.log('Fetching user from:', apiUrl(auth.userEndpoint));
    const userResponse = await fetch(apiUrl(auth.userEndpoint), {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json',
      },
    });

    console.log('User fetch status:', userResponse.status);

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('Failed to fetch user:', errorText);
      // Still return success since login worked, but without user data
      return NextResponse.json(
        { success: true, message: 'Logged in successfully' },
        { status: 200 }
      );
    }

    const userData = await userResponse.json();
    console.log('User data received:', userData);

    return NextResponse.json({
      success: true,
      user: userData.data || userData,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

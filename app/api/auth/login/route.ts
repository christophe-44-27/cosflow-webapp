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

    const { auth, cookies: cookieConfig } = SERVER_CONFIG;

    // Call login proxy endpoint
    const tokenResponse = await fetch(apiUrl(auth.loginEndpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username: email, password }),
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
    const userResponse = await fetch(apiUrl(auth.userEndpoint), {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json',
      },
    });

    if (!userResponse.ok) {
      // Any 403 on /me after a successful login = email not yet verified
      if (userResponse.status === 403) {
        return NextResponse.json(
          { success: true, email_not_verified: true, email },
          { status: 200 }
        );
      }
      // Other errors: still return success since the token was issued
      return NextResponse.json(
        { success: true, message: 'Logged in successfully' },
        { status: 200 }
      );
    }

    const userData = await userResponse.json();

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

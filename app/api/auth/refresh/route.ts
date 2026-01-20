import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const { api, auth, cookies: cookieConfig } = SERVER_CONFIG;

    if (!api.clientId || !api.clientSecret) {
      console.error('Missing API_CLIENT_ID or API_CLIENT_SECRET environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const refreshToken = cookieStore.get(cookieConfig.refreshToken)?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token' },
        { status: 401 }
      );
    }

    const tokenResponse = await fetch(apiUrl(auth.tokenEndpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: api.clientId,
        client_secret: api.clientSecret,
        refresh_token: refreshToken,
        scope: '',
      }),
    });

    if (!tokenResponse.ok) {
      cookieStore.delete(cookieConfig.accessToken);
      cookieStore.delete(cookieConfig.refreshToken);

      return NextResponse.json(
        { error: 'Refresh token expired' },
        { status: 401 }
      );
    }

    const tokenData: TokenResponse = await tokenResponse.json();

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

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

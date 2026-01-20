import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const { auth, cookies: cookieConfig } = SERVER_CONFIG;
    const accessToken = cookieStore.get(cookieConfig.accessToken)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const response = await fetch(apiUrl(auth.userEndpoint), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Token expired', needsRefresh: true },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: response.status }
      );
    }

    const userData = await response.json();

    return NextResponse.json({
      user: userData.data || userData,
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

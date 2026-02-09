import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';

export async function PUT(request: NextRequest) {
  try {
    // Extract access token from HttpOnly cookie
    const cookieStore = await cookies();
    const { cookies: cookieConfig } = SERVER_CONFIG;
    const accessToken = cookieStore.get(cookieConfig.accessToken)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { old_password, password, password_confirmation } = body;

    // Validate required fields
    if (!old_password || !password || !password_confirmation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call Laravel backend
    const response = await fetch(apiUrl('/password/update'), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        old_password,
        password,
        password_confirmation,
      }),
    });

    // Handle success
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    // Handle validation errors (422)
    if (response.status === 422) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: 422 });
    }

    // Handle unauthorized (401) - token expired
    if (response.status === 401) {
      return NextResponse.json(
        { error: 'Token expired', needsRefresh: true },
        { status: 401 }
      );
    }

    // Handle other errors
    const errorData = await response.json().catch(() => ({ error: 'Server error' }));
    return NextResponse.json(
      errorData,
      { status: response.status }
    );

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating password' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';

interface ProfileUpdateData {
  name?: string;
  email?: string;
  currency_id?: number;
  country_id?: number;
  locale?: string;
}

export async function POST(request: NextRequest) {
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

    // Get the JSON data from the request
    const data: ProfileUpdateData = await request.json();

    // Debug: Log what we're sending
    console.log('📤 Updating profile:', {
      endpoint: apiUrl('/user'),
      fields: Object.keys(data),
    });

    // Call Laravel backend (POST with JSON)
    const response = await fetch(apiUrl('/user'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('📥 Laravel response:', response.status);

    // Handle success
    if (response.ok) {
      const responseData = await response.json();
      return NextResponse.json(responseData);
    }

    // Handle validation errors (422)
    if (response.status === 422) {
      const errorData = await response.json();
      console.log('❌ Validation errors:', errorData);
      return NextResponse.json(errorData, { status: 422 });
    }

    // Handle unauthorized (401)
    if (response.status === 401) {
      return NextResponse.json(
        { error: 'Token expired', needsRefresh: true },
        { status: 401 }
      );
    }

    // Handle other errors
    const errorData = await response.json().catch(() => ({ error: 'Server error' }));
    console.log('❌ Server error:', errorData);
    return NextResponse.json(errorData, { status: response.status });

  } catch (error) {
    console.error('❌ Profile update error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating profile' },
      { status: 500 }
    );
  }
}

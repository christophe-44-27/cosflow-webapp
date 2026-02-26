import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';

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

    // Get the FormData from the request
    const formData = await request.formData();

    // Call Laravel backend (POST with multipart/form-data)
    const response = await fetch(apiUrl('/user'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        // Do NOT set Content-Type - browser handles it for multipart/form-data
      },
      body: formData,
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

    // Handle unauthorized (401)
    if (response.status === 401) {
      return NextResponse.json(
        { error: 'Token expired', needsRefresh: true },
        { status: 401 }
      );
    }

    // Handle other errors
    const errorData = await response.json().catch(() => ({ error: 'Server error' }));
    return NextResponse.json(errorData, { status: response.status });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating profile' },
      { status: 500 }
    );
  }
}

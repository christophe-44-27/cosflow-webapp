import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';

async function getAuthToken() {
  const cookieStore = await cookies();
  const { cookies: cookieConfig } = SERVER_CONFIG;
  return cookieStore.get(cookieConfig.accessToken)?.value;
}

// Upload project image
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const accessToken = await getAuthToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const finalUrl = apiUrl(`/api/v2/projects/${slug}/images`);

    console.log('Uploading project image:', finalUrl);

    const response = await fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Token expired', needsRefresh: true },
          { status: 401 }
        );
      }
      if (response.status === 422) {
        const errors = await response.json();
        return NextResponse.json(errors, { status: 422 });
      }
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Upload project image error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

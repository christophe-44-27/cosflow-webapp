import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';
import { API_ENDPOINTS } from '@/app/lib/api-endpoints';

async function getAuthToken() {
  const cookieStore = await cookies();
  const { cookies: cookieConfig } = SERVER_CONFIG;
  return cookieStore.get(cookieConfig.accessToken)?.value;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const accessToken = await getAuthToken();

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const incomingFormData = await request.formData();
    const coverFile = incomingFormData.get('cover');

    if (!coverFile) {
      return NextResponse.json({ error: 'No cover file provided' }, { status: 400 });
    }

    const formData = new FormData();
    formData.append('cover', coverFile);

    const finalUrl = apiUrl(API_ENDPOINTS.projects.update(slug));

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
        return NextResponse.json({ error: 'Token expired', needsRefresh: true }, { status: 401 });
      }
      const errorBody = await response.text();
      console.error('Cover upload error from Laravel:', response.status, errorBody);
      return NextResponse.json({ error: 'Failed to upload cover' }, { status: response.status });
    }

    const data = await response.json();
    revalidatePath('/projects/' + slug);
    return NextResponse.json(data);

  } catch (error) {
    console.error('Cover upload error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

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

export async function GET(
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

    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'fr';

    const finalUrl = apiUrl(API_ENDPOINTS.projects.detail(slug));


    const response = await fetch(finalUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Accept-Language': locale,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Token expired', needsRefresh: true },
          { status: 401 }
        );
      }
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch project' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

// Update project (POST with _method=PUT for Laravel)
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

    const finalUrl = apiUrl(API_ENDPOINTS.projects.update(slug));
    const contentType = request.headers.get('content-type') || '';

    let formData: FormData;

    if (contentType.includes('multipart/form-data')) {
      formData = await request.formData();
    } else {
      // JSON → convertir en FormData pour que Laravel accepte le method spoofing
      const body = await request.json();
      formData = new FormData();
      for (const [key, value] of Object.entries(body)) {
        if (key !== '_method' && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }
    }

    // Laravel attend un POST direct (pas de method spoofing sur cette route)
    formData.delete('_method');

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
      if (response.status === 403) {
        return NextResponse.json(
          { error: 'Forbidden - You are not the owner of this project' },
          { status: 403 }
        );
      }
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: response.status }
      );
    }

    const data = await response.json();
    revalidatePath('/projects/' + slug);
    return NextResponse.json(data);

  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

// Delete project
export async function DELETE(
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

    const finalUrl = apiUrl(API_ENDPOINTS.projects.delete(slug));


    const response = await fetch(finalUrl, {
      method: 'DELETE',
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
        { error: 'Failed to delete project' },
        { status: response.status }
      );
    }

    revalidatePath('/projects/' + slug);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

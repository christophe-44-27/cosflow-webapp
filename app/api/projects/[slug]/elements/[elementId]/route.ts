import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';

async function getAuthToken() {
  const cookieStore = await cookies();
  const { cookies: cookieConfig } = SERVER_CONFIG;
  return cookieStore.get(cookieConfig.accessToken)?.value;
}

// PATCH - Modifier un élément
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; elementId: string }> }
) {
  try {
    const { slug, elementId } = await params;
    const accessToken = await getAuthToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(apiUrl(`/api/v2/projects/${slug}/elements/${elementId}`), {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 422) {
        return NextResponse.json(await response.json(), { status: 422 });
      }
      return NextResponse.json({ error: 'Failed to update element' }, { status: response.status });
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Update element error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

// DELETE - Supprimer un élément
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; elementId: string }> }
) {
  try {
    const { slug, elementId } = await params;
    const accessToken = await getAuthToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const response = await fetch(apiUrl(`/api/v2/projects/${slug}/elements/${elementId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to delete element' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete element error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

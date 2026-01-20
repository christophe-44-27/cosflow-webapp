import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';

async function getAuthToken() {
  const cookieStore = await cookies();
  const { cookies: cookieConfig } = SERVER_CONFIG;
  return cookieStore.get(cookieConfig.accessToken)?.value;
}

// PUT - Modifier une entrée
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> }
) {
  try {
    const { entryId } = await params;
    const accessToken = await getAuthToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(apiUrl(`/api/v2/timesheets/${entryId}`), {
      method: 'PUT',
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
      return NextResponse.json({ error: 'Failed to update time entry' }, { status: response.status });
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Update time entry error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

// DELETE - Supprimer une entrée
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> }
) {
  try {
    const { entryId } = await params;
    const accessToken = await getAuthToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const response = await fetch(apiUrl(`/api/v2/timesheets/${entryId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to delete time entry' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete time entry error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

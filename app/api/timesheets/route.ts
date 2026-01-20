import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';

async function getAuthToken() {
  const cookieStore = await cookies();
  const { cookies: cookieConfig } = SERVER_CONFIG;
  return cookieStore.get(cookieConfig.accessToken)?.value;
}

// POST - Ajouter du temps
export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAuthToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(apiUrl('/api/v2/timesheets'), {
      method: 'POST',
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
      return NextResponse.json({ error: 'Failed to create time entry' }, { status: response.status });
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Create time entry error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';

async function getAuthToken() {
  const cookieStore = await cookies();
  const { cookies: cookieConfig } = SERVER_CONFIG;
  return cookieStore.get(cookieConfig.accessToken)?.value;
}

// GET - Entries d'un projet
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const accessToken = await getAuthToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const response = await fetch(apiUrl(`/api/v2/timesheets/projects/${slug}`), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch time entries' }, { status: response.status });
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Get time entries error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

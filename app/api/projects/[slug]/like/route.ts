import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';
import { API_ENDPOINTS } from '@/app/lib/api-endpoints';

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SERVER_CONFIG.cookies.accessToken)?.value;
}

// GET — statut like de l'utilisateur connecté
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const accessToken = await getAuthToken();
  if (!accessToken) {
    return NextResponse.json({ liked: false }, { status: 200 });
  }

  const { slug } = await params;
  const response = await fetch(apiUrl(API_ENDPOINTS.projects.detail(slug)), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    return NextResponse.json({ liked: false }, { status: 200 });
  }

  const raw = await response.json().catch(() => ({}));
  const project = raw.data ?? raw;
  return NextResponse.json({ liked: project.is_liked_by_user ?? false });
}

// POST — liker un projet
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const accessToken = await getAuthToken();
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { slug } = await params;
  const response = await fetch(apiUrl(API_ENDPOINTS.projects.like(slug)), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

// DELETE — unliker un projet
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const accessToken = await getAuthToken();
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { slug } = await params;
  const response = await fetch(apiUrl(API_ENDPOINTS.projects.like(slug)), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

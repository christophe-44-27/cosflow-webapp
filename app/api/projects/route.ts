import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const { cookies: cookieConfig } = SERVER_CONFIG;
    const accessToken = cookieStore.get(cookieConfig.accessToken)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '20';
    const sort = searchParams.get('sort') || '-id';

    // Build query string parts
    const queryParts: string[] = [
      `page=${page}`,
      `per_page=${perPage}`,
      `sort=${encodeURIComponent(sort)}`,
    ];

    // Pass through all filter parameters (keep brackets unencoded for Laravel)
    // Allowed filters from API: name, description, category_id, is_private, user_id,
    // completed, in_progress, my_projects, public_projects, recent, search, user_name,
    // category_name, created_after, created_before, updated_after, updated_before,
    // has_elements, min_elements, max_elements
    const filterKeys = [
      'filter[name]',
      'filter[description]',
      'filter[search]',
      'filter[category_id]',
      'filter[is_private]',
      'filter[user_id]',
      'filter[completed]',
      'filter[in_progress]',
      'filter[my_projects]',
      'filter[public_projects]',
      'filter[recent]',
      'filter[user_name]',
      'filter[category_name]',
      'filter[has_elements]',
      'filter[min_elements]',
      'filter[max_elements]',
      'filter[created_after]',
      'filter[created_before]',
      'filter[updated_after]',
      'filter[updated_before]',
    ];

    filterKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        // Keep brackets as-is for Laravel query string parsing
        queryParts.push(`${key}=${encodeURIComponent(value)}`);
      }
    });

    // Include relations if specified
    const include = searchParams.get('include');
    if (include) {
      queryParts.push(`include=${encodeURIComponent(include)}`);
    }

    const queryString = queryParts.join('&');
    const finalUrl = apiUrl(`/api/v2/projects?${queryString}`);

    console.log('Fetching projects from:', finalUrl);

    const response = await fetch(finalUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Accept-Language': searchParams.get('locale') || 'fr',
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
        { error: 'Failed to fetch projects' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

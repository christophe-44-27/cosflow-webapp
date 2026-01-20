import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';

async function getAuthToken() {
    const cookieStore = await cookies();
    const { cookies: cookieConfig } = SERVER_CONFIG;
    return cookieStore.get(cookieConfig.accessToken)?.value;
}

export async function GET(request: NextRequest) {
    try {
        const accessToken = await getAuthToken();

        if (!accessToken) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const locale = searchParams.get('locale') || 'fr';

        const finalUrl = apiUrl('/api/v2/project-elements/categories?show_all=true');

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
            return NextResponse.json(
                { error: 'Failed to fetch categories' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Get categories error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}

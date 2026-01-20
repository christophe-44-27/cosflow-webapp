import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SERVER_CONFIG, apiUrl } from '@/app/lib/server-config';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const { auth, cookies: cookieConfig } = SERVER_CONFIG;
    const accessToken = cookieStore.get(cookieConfig.accessToken)?.value;

    // Optionally revoke token on the API side
    if (accessToken) {
      try {
        await fetch(apiUrl(auth.logoutEndpoint), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        });
      } catch {
        // Ignore errors when revoking - we'll clear cookies anyway
      }
    }

    // Clear all auth cookies
    cookieStore.delete(cookieConfig.accessToken);
    cookieStore.delete(cookieConfig.refreshToken);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Logout error:', error);

    // Still try to clear cookies even if there's an error
    const cookieStore = await cookies();
    const { cookies: cookieConfig } = SERVER_CONFIG;
    cookieStore.delete(cookieConfig.accessToken);
    cookieStore.delete(cookieConfig.refreshToken);

    return NextResponse.json({ success: true });
  }
}

// Server-side only configuration (not exposed to client)
// These values are only available in API routes and server components

export const SERVER_CONFIG = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.cosflow.co',
    clientId: process.env.NEXT_PUBLIC_API_CLIENT_ID || '',
    clientSecret: process.env.NEXT_PUBLIC_API_CLIENT_SECRET || '',
  },
  auth: {
    tokenEndpoint: '/oauth/token',
    userEndpoint: '/api/v2/users/me',
    logoutEndpoint: '/api/v2/logout',
  },
  cookies: {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    refreshTokenMaxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

// Helper to build full API URLs
export function apiUrl(path: string): string {
  return `${SERVER_CONFIG.api.baseUrl}${path}`;
}

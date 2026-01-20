/**
 * Public API endpoints
 * Ces endpoints sont accessibles sans authentification
 */
export const API_PUBLIC_ENDPOINTS = {
  projects: {
    list: '/api/v2/public/projects',
    detail: (slugOrId: string | number) => `/api/v2/public/projects/${slugOrId}`,
  },
  users: {
    list: '/api/v2/public/users',
    detail: (slug: string) => `/api/v2/public/users/${slug}`,
    projects: (slug: string) => `/api/v2/public/users/${slug}/projects`,
    events: (slug: string) => `/api/v2/public/users/${slug}/events`,
    photoshoots: (slug: string) => `/api/v2/public/users/${slug}/photoshoots`,
  },
} as const;


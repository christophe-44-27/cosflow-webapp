/**
 * API Endpoints privés (nécessitent authentification)
 */
export const API_ENDPOINTS = {
    projects: {
        list: '/api/v2/projects',
        detail: (slug: string) => `/api/v2/projects/${slug}`,
        update: (slug: string) => `/api/v2/projects/${slug}`,
        delete: (slug: string) => `/api/v2/projects/${slug}`,
        images: (slug: string) => `/api/v2/projects/${slug}/images`,
        elements: {
            list: (slug: string) => `/api/v2/projects/${slug}/elements`,
            detail: (slug: string, elementId: string) => `/api/v2/projects/${slug}/elements/${elementId}`,
        },
    },
    users: {
        list: '/api/v2/users',
        me: '/api/v2/users/me',
        detail: (slug: string) => `/api/v2/users/${slug}`,
    },
    projectElements: {
        categories: '/api/v2/project-elements/categories',
    },
    timesheets: {
        list: '/api/v2/timesheets',
        detail: (entryId: string) => `/api/v2/timesheets/${entryId}`,
        byProject: (slug: string) => `/api/v2/timesheets/projects/${slug}`,
    },
    auth: {
        login: '/oauth/token',
        logout: '/api/v2/logout',
        me: '/api/v2/users/me',
        refresh: '/oauth/token',
    },
}


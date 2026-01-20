// API Client for making authenticated requests
// Uses the access token from HttpOnly cookies via Next.js API routes

const API_ROUTES = {
  me: '/api/auth/me',
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  refresh: '/api/auth/refresh',
};

interface ApiClientOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private async request<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      // Check if we need to refresh the token
      if (response.status === 401) {
        const data = await response.json().catch(() => ({}));
        if (data.needsRefresh) {
          // Try to refresh the token
          const refreshResponse = await fetch(API_ROUTES.refresh, {
            method: 'POST',
            credentials: 'include',
          });

          if (refreshResponse.ok) {
            // Retry the original request
            return this.request<T>(endpoint, options);
          }
        }
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async getCurrentUser() {
    return this.request<{ user: unknown }>(API_ROUTES.me);
  }

  async login(email: string, password: string) {
    return this.request<{ success: boolean; user?: unknown }>(API_ROUTES.login, {
      method: 'POST',
      body: { email, password },
    });
  }

  async logout() {
    return this.request<{ success: boolean }>(API_ROUTES.logout, {
      method: 'POST',
    });
  }

  async refreshToken() {
    return this.request<{ success: boolean }>(API_ROUTES.refresh, {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient();

import { API_CONFIG } from '../config';

/**
 * Options pour les requêtes API
 */
interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Client API générique pour les appels HTTP
 * Gère la configuration de base, les headers, et la gestion des erreurs
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_CONFIG.baseUrl;
  }

  /**
   * Récupère la locale courante depuis le localStorage
   */
  private getLocale(): string {
    if (typeof window === 'undefined') {
      return 'fr';
    }
    return localStorage.getItem('cosflow-locale') || 'fr';
  }

  /**
   * Construit l'URL complète avec les query params
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Effectue une requête HTTP
   */
  async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);
    const locale = this.getLocale();

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': locale,
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const errorMessage = `API Error: ${response.status} ${response.statusText}`;
      console.error(errorMessage, { url, endpoint });
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Méthode GET
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  /**
   * Méthode POST
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Méthode PUT
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Méthode DELETE
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Méthode PATCH
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

/**
 * Instance par défaut du client API
 */
export const apiClient = new ApiClient();


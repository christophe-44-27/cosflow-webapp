import { API_CONFIG } from './config';
import { User, Project, ProjectDetail, ApiResponse, UserProfile, UserProfileProject, Event, Photoshoot } from './types';

export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get the current locale from localStorage (same key used by LocaleContext)
    const locale = typeof window !== 'undefined'
      ? localStorage.getItem('cosflow-locale') || 'fr'
      : 'fr';

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': locale,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUsers(params?: {
    page?: number;
    per_page?: number;
    sort?: string;
  }): Promise<ApiResponse<User[]>> {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.per_page) {
      queryParams.append('per_page', params.per_page.toString());
    }
    if (params?.sort) {
      queryParams.append('sort', params.sort);
    }

    const query = queryParams.toString();
    const endpoint = `/api/v2/public/users${query ? `?${query}` : ''}`;

    return this.request<ApiResponse<User[]>>(endpoint);
  }

  async getProjects(params?: {
    page?: number;
    per_page?: number;
    sort?: string;
  }): Promise<ApiResponse<Project[]>> {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.per_page) {
      queryParams.append('per_page', params.per_page.toString());
    }
    if (params?.sort) {
      queryParams.append('sort', params.sort);
    }

    const query = queryParams.toString();
    const endpoint = `/api/v2/public/projects${query ? `?${query}` : ''}`;

    return this.request<ApiResponse<Project[]>>(endpoint);
  }

  async getProject(slugOrId: string | number): Promise<{ data: ProjectDetail }> {
    const endpoint = `/api/v2/public/projects/${slugOrId}`;
    console.log('Fetching project from:', `${this.baseUrl}${endpoint}`);
    return this.request<{ data: ProjectDetail }>(endpoint);
  }

  async getUserProfile(slug: string): Promise<{ data: UserProfile }> {
    const endpoint = `/api/v2/public/users/${slug}`;
    console.log('Fetching user profile from:', `${this.baseUrl}${endpoint}`);
    return this.request<{ data: UserProfile }>(endpoint);
  }

  async getUserProjects(slug: string, params?: {
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<UserProfileProject[]>> {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.per_page) {
      queryParams.append('per_page', params.per_page.toString());
    }

    const query = queryParams.toString();
    const endpoint = `/api/v2/public/users/${slug}/projects${query ? `?${query}` : ''}`;

    return this.request<ApiResponse<UserProfileProject[]>>(endpoint);
  }

  async getUserEvents(slug: string, params?: {
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<Event[]>> {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.per_page) {
      queryParams.append('per_page', params.per_page.toString());
    }

    const query = queryParams.toString();
    const endpoint = `/api/v2/public/users/${slug}/events${query ? `?${query}` : ''}`;

    return this.request<ApiResponse<Event[]>>(endpoint);
  }

  async getUserPhotoshoots(slug: string, params?: {
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<Photoshoot[]>> {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.per_page) {
      queryParams.append('per_page', params.per_page.toString());
    }

    const query = queryParams.toString();
    const endpoint = `/api/v2/public/users/${slug}/photoshoots${query ? `?${query}` : ''}`;

    return this.request<ApiResponse<Photoshoot[]>>(endpoint);
  }
}

export const apiService = new ApiService();

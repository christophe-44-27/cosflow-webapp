import { apiClient } from './api-client';
import { API_PUBLIC_ENDPOINTS } from '../api-public-endpoints';
import type {
  User,
  ApiResponse,
  UserProfile,
  UserProfileProject,
  Event,
  Photoshoot,
  PaginationParams,
} from '@/app/types/models';

export class UserService {
  async getUsers(params?: PaginationParams): Promise<ApiResponse<User[]>> {
    return apiClient.get<ApiResponse<User[]>>(
      API_PUBLIC_ENDPOINTS.users.list,
      params as Record<string, string | number | boolean | undefined>
    );
  }

  async getUserProfile(slug: string): Promise<{ data: UserProfile }> {
    return apiClient.get<{ data: UserProfile }>(API_PUBLIC_ENDPOINTS.users.detail(slug));
  }

  async getUserProjects(
    slug: string,
    params?: Pick<PaginationParams, 'page' | 'per_page'>
  ): Promise<ApiResponse<UserProfileProject[]>> {
    return apiClient.get<ApiResponse<UserProfileProject[]>>(
      API_PUBLIC_ENDPOINTS.users.projects(slug),
      params as Record<string, string | number | boolean | undefined>
    );
  }

  async getUserEvents(
    slug: string,
    params?: Pick<PaginationParams, 'page' | 'per_page'>
  ): Promise<ApiResponse<Event[]>> {
    return apiClient.get<ApiResponse<Event[]>>(
      API_PUBLIC_ENDPOINTS.users.events(slug),
      params as Record<string, string | number | boolean | undefined>
    );
  }

  async getUserPhotoshoots(
    slug: string,
    params?: Pick<PaginationParams, 'page' | 'per_page'>
  ): Promise<ApiResponse<Photoshoot[]>> {
    return apiClient.get<ApiResponse<Photoshoot[]>>(
      API_PUBLIC_ENDPOINTS.users.photoshoots(slug),
      params as Record<string, string | number | boolean | undefined>
    );
  }
}

export const userService = new UserService();

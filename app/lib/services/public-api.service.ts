import { apiClient } from './api-client';
import { API_PUBLIC_ENDPOINTS } from '../api-public-endpoints';
import type {
  User,
  Project,
  ProjectDetail,
  ApiResponse,
  UserProfile,
  UserProfileProject,
  Event,
  Photoshoot,
} from '../types';

/**
 * Paramètres de pagination standards
 */
interface PaginationParams {
  page?: number;
  per_page?: number;
  sort?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Service pour les endpoints publics de l'API
 * Tous ces endpoints sont accessibles sans authentification
 */
export class PublicApiService {
  /**
   * Liste des utilisateurs
   */
  async getUsers(params?: PaginationParams): Promise<ApiResponse<User[]>> {
    return apiClient.get<ApiResponse<User[]>>(
      API_PUBLIC_ENDPOINTS.users.list,
      params as Record<string, string | number | boolean | undefined>
    );
  }

  /**
   * Profil d'un utilisateur par slug
   */
  async getUserProfile(slug: string): Promise<{ data: UserProfile }> {
    const endpoint = API_PUBLIC_ENDPOINTS.users.detail(slug);
    console.log('Fetching user profile from:', endpoint);
    return apiClient.get<{ data: UserProfile }>(endpoint);
  }

  /**
   * Projets d'un utilisateur
   */
  async getUserProjects(
    slug: string,
    params?: Pick<PaginationParams, 'page' | 'per_page'>
  ): Promise<ApiResponse<UserProfileProject[]>> {
    return apiClient.get<ApiResponse<UserProfileProject[]>>(
      API_PUBLIC_ENDPOINTS.users.projects(slug),
      params as Record<string, string | number | boolean | undefined>
    );
  }

  /**
   * Événements d'un utilisateur
   */
  async getUserEvents(
    slug: string,
    params?: Pick<PaginationParams, 'page' | 'per_page'>
  ): Promise<ApiResponse<Event[]>> {
    return apiClient.get<ApiResponse<Event[]>>(
      API_PUBLIC_ENDPOINTS.users.events(slug),
      params as Record<string, string | number | boolean | undefined>
    );
  }

  /**
   * Photoshoots d'un utilisateur
   */
  async getUserPhotoshoots(
    slug: string,
    params?: Pick<PaginationParams, 'page' | 'per_page'>
  ): Promise<ApiResponse<Photoshoot[]>> {
    return apiClient.get<ApiResponse<Photoshoot[]>>(
      API_PUBLIC_ENDPOINTS.users.photoshoots(slug),
      params as Record<string, string | number | boolean | undefined>
    );
  }

  /**
   * Liste des projets
   */
  async getProjects(params?: PaginationParams): Promise<ApiResponse<Project[]>> {
    return apiClient.get<ApiResponse<Project[]>>(
      API_PUBLIC_ENDPOINTS.projects.list,
      params as Record<string, string | number | boolean | undefined>
    );
  }

  /**
   * Détail d'un projet par slug ou ID
   */
  async getProject(slugOrId: string | number): Promise<{ data: ProjectDetail }> {
    const endpoint = API_PUBLIC_ENDPOINTS.projects.detail(slugOrId);
    console.log('Fetching project from:', endpoint);
    return apiClient.get<{ data: ProjectDetail }>(endpoint);
  }
}

/**
 * Instance par défaut du service API public
 */
export const publicApiService = new PublicApiService();



import { apiClient } from './api-client';
import { API_PUBLIC_ENDPOINTS } from '../api-public-endpoints';
import type {
  Project,
  ProjectDetail,
  ApiResponse,
  PaginationParams,
} from '@/app/types/models';

export class ProjectService {
  async getProjects(params?: PaginationParams): Promise<ApiResponse<Project[]>> {
    return apiClient.get<ApiResponse<Project[]>>(
      API_PUBLIC_ENDPOINTS.projects.list,
      params as Record<string, string | number | boolean | undefined>
    );
  }

  async getProject(slugOrId: string | number): Promise<{ data: ProjectDetail }> {
    return apiClient.get<{ data: ProjectDetail }>(
      API_PUBLIC_ENDPOINTS.projects.detail(slugOrId)
    );
  }
}

export const projectService = new ProjectService();

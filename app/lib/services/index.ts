/**
 * Point d'entrée central pour tous les services API
 */

// Client API de base
export { ApiClient, apiClient } from './api-client';

// Service API public
export { PublicApiService, publicApiService } from './public-api.service';

// Types
export type { ApiResponse, User, Project, ProjectDetail, UserProfile, UserProfileProject, Event, Photoshoot } from '../types';




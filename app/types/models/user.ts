import type { Currency, Country } from './common';

export interface User {
  id: number;
  name: string;
  slug: string;
  avatar: string;
  cover: string;
  has_avatar: boolean;
  locale: string;
  description: string | null;
  country: string | null;
  stats: {
    public_projects_count: number;
    followers_count: number;
  };
}

export interface UserPreferences {
  user_id: string;
  account_preferences: Record<string, string>;
}

export interface VerificationCriteria {
  has_photoshoot_albums: boolean;
  photoshoot_albums_count: number;
  has_completed_projects: boolean;
  completed_projects_count: number;
}

export interface VerificationStatus {
  is_verified: boolean;
  meets_criteria: boolean;
  criteria: VerificationCriteria;
}

export interface ProjectUserProfile {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  description: string | null;
  locale: string;
  avatar: string;
  cover: string;
  currency: Currency | null;
  has_avatar: boolean;
  has_cover: boolean;
  is_complete: boolean;
  completion_percentage: number;
  missing_fields: string[];
  required_fields: string[];
  is_verified: boolean;
  verification_status: VerificationStatus;
  login_streak: number;
  last_login_at: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectUser {
  id: number;
  email: string;
  customer_id: string | null;
  email_verified_at: string;
  is_admin: boolean;
  is_premium: boolean;
  terms_of_use: boolean;
  is_hidden: boolean;
  last_login_at: string;
  created_at: string;
  updated_at: string;
  account_status: string;
  subscription_status: string;
  is_verified?: boolean;
  global_project_limit: number;
  profile: ProjectUserProfile;
  user_preferences: UserPreferences;
}


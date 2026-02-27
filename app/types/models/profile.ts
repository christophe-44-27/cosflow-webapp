import type { Photoshoot } from './media';
import type { Country } from './common';

export interface SocialLink {
  id: number;
  user_id: number;
  platform: 'instagram' | 'tiktok' | 'twitch' | 'twitter' | 'website' | 'youtube';
  url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  location: string;
  city: string;
  country: string;
  start_date: string;
  end_date: string;
  image_url: string;
  website_url: string | null;
  status: 'upcoming' | 'ongoing' | 'past';
  attendees_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfileProject {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  image: string;
  status: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  // Epic 3 — stats for ProjectCard
  total_project_working_time?: string | null;
  project_estimated_price?: string | null;
  elements_count?: number;
}

export interface ProfileStats {
  public_projects_count: number;
  events_count: number;
  followers_count: number;
  following_count: number;
  photoshoots_count?: number;
}

export interface PersonalRecords {
  total_hours: number;
  total_budget: number;
  most_complex_project: {
    title: string;
    slug: string;
    elements_count: number;
  } | null;
}

export interface UserProfile {
  id: number;
  name: string;
  slug: string;
  avatar: string;
  cover: string;
  has_avatar: boolean;
  has_cover: boolean;
  description: string | null;
  locale: string;
  country: Country | null;
  user_level: string | null;
  social_links: SocialLink[];
  projects: UserProfileProject[];
  events: Event[];
  photoshoots?: Photoshoot[];
  stats: ProfileStats;
  profile_complete: boolean;
  profile_completion_percentage: number;
  created_at: string;
  is_following?: boolean;
  // Epic 3 — new fields
  open_to_commission?: boolean;
  ko_fi_url?: string | null;
  patreon_url?: string | null;
  personal_records?: PersonalRecords | null;
  // Epic 4 — likes
  likes_count?: number;
  is_liked_by_user?: boolean | null;
}

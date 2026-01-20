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

export interface Project {
  id: number;
  title: string;
  slug: string;
  fandom: string;
  avatar: string;
  username: string;
  image: string;
  photos_count: string;
  created_at: string;
  updated_at: string;
}

// Project returned by authenticated /api/v2/projects endpoint
export interface MyProject {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  status: string;
  priority: string;
  duration: string | null;
  progression: number;
  is_private: boolean;
  category_id: string;
  fandom_id: string | null;
  origin_id: string | null;
  user_id: number;
  estimated_end_date: string | null;
  project_estimated_price: string | null;
  total_project_working_time: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  photos: ProjectPhoto[];
  photoshoots: Photoshoot[];
  photoReferences: PhotoReference[];
  likes_count: number;
  is_liked_by_user: boolean;
  category: {
    id: number;
    name: string;
  };
  fandom: {
    id: number;
    name: string;
    category1: string | null;
    category2: string | null;
    status: string;
    created_at: string;
    updated_at: string;
  } | null;
  origin: {
    id: number;
    name: string;
    category1: string | null;
    category2: string | null;
    status: string;
    created_at: string;
    updated_at: string;
  } | null;
  user: {
    id: number;
    email: string;
    customer_id: string | null;
    is_admin: boolean;
    is_premium: boolean;
    account_status: string;
    subscription_status: string;
    profile: {
      id: number;
      user_id: number;
      name: string;
      slug: string;
      description: string | null;
      locale: string;
      avatar: string;
      cover: string;
      has_avatar: boolean;
      has_cover: boolean;
    };
  };
  elements: Array<{
    id: number;
    title: string;
    type: string;
    price: string | number | null;
    is_done: boolean;
    to_make: boolean;
    project_id: number;
    category_id: number | null;
    parent_id: number | null;
    total_working_time: string;
  }>;
}

export interface PhotoMedia {
  id: string;
  name: string;
  model_id: string;
  preview_url: string;
  original_url: string;
  extension: string;
  size: string;
}

export interface ProjectPhoto {
  id: number;
  project_id: number;
  photo: PhotoMedia[];
  created_at: string;
  likes_count?: number;
  is_liked_by_user?: boolean | null;
}

export interface PhotoReference {
  id: number;
  project_id: number;
  photo: PhotoMedia[];
  created_at: string;
}

export interface PhotoshootImage {
  id: number;
  image_url: string;
  image_preview_url: string;
  image_thumb_url: string;
}

export interface Photoshoot {
  id: number;
  title: string;
  location: string;
  shoot_date: string;
  participant_name: string;
  visibility: string;
  cover_image: string;
  images: PhotoshootImage[];
  images_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectDetail {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  status: string;
  priority: string;
  duration: string | null;
  progression: number;
  is_private: boolean;
  category_id: string;
  fandom_id: string;
  origin_id: string | null;
  user_id: number;
  estimated_end_date: string | null;
  project_estimated_price: string;
  total_project_working_time: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  photos: ProjectPhoto[];
  photoshoots: Photoshoot[];
  photoReferences: PhotoReference[];
  likes_count: number;
  is_liked_by_user: boolean | null;
  category: {
    id: number;
    name: string;
  };
  fandom: {
    id: number;
    name: string;
    category1: string | null;
    category2: string | null;
    status: string;
    created_at: string;
    updated_at: string;
  };
  origin: any | null;
  user: {
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
    is_verified: boolean;
    global_project_limit: number;
    profile: {
      id: number;
      user_id: number;
      name: string;
      slug: string;
      description: string | null;
      locale: string;
      avatar: string;
      cover: string;
      has_avatar: boolean;
      has_cover: boolean;
      is_complete: boolean;
      completion_percentage: number;
      missing_fields: string[];
      required_fields: string[];
      created_at: string;
      updated_at: string;
    };
    user_preferences: {
      user_id: string;
      account_preferences: Record<string, string>;
    };
  };
  elements: any[];
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

export interface SocialLink {
  id: number;
  user_id: number;
  platform: 'instagram' | 'tiktok' | 'twitch' | 'twitter' | 'website' | 'youtube';
  url: string;
  display_order: number;
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
  country: {
    id: number;
    name: string;
  } | null;
  user_level: string | null;
  social_links: SocialLink[];
  projects: UserProfileProject[];
  events: Event[];
  photoshoots?: Photoshoot[];
  stats: {
    public_projects_count: number;
    events_count: number;
    followers_count: number;
    following_count: number;
    photoshoots_count?: number;
  };
  profile_complete: boolean;
  profile_completion_percentage: number;
  created_at: string;
  is_following?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

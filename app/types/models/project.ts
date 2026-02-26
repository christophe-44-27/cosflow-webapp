import type { ProjectPhoto, Photoshoot, PhotoReference } from './media';
import type { ProjectElement } from './project-element';
import type { Category } from './common';
import type { ProjectUser } from './user';
import type { ProjectNote } from './project-note';
import type { Fandom } from './fandom';
import type { Origin } from './origin';

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

export interface ProjectDetail {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  notes: ProjectNote[];
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
  is_liked_by_user: boolean | null;
  category: Category;
  fandom: Fandom | null;
  origin: Origin | null;
  user: ProjectUser;
  elements: ProjectElement[];
}

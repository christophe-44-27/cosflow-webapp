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

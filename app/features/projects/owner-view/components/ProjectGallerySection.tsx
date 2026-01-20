'use client';

import { Camera, Image as ImageIcon } from 'lucide-react';
import { ProjectDetail } from '@/app/lib/types';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface ProjectGallerySectionProps {
  project: ProjectDetail;
}

export function ProjectGallerySection({ project }: ProjectGallerySectionProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="text-white/60 text-sm mb-2 flex items-center gap-2">
          <Camera className="w-4 h-4" /> Photos ({project.photos.length})
        </p>
        <div className="grid grid-cols-2 gap-2">
          {project.photos.slice(0, 4).map(photo => (
            <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-white/5">
              <ImageWithFallback
                src={photo.photo[0]?.preview_url || photo.photo[0]?.original_url}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-white/60 text-sm mb-2 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Références ({project.photoReferences.length})
        </p>
        <div className="grid grid-cols-2 gap-2">
          {project.photoReferences.slice(0, 4).map(ref => (
            <div key={ref.id} className="aspect-square rounded-lg overflow-hidden bg-white/5">
              <ImageWithFallback
                src={ref.photo[0]?.preview_url || ref.photo[0]?.original_url}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-white/60 text-sm mb-2 flex items-center gap-2">
          <Camera className="w-4 h-4" /> Photoshoots ({project.photoshoots.length})
        </p>
        <div className="grid grid-cols-2 gap-2">
          {project.photoshoots.slice(0, 4).map(shoot => (
            <div key={shoot.id} className="aspect-square rounded-lg overflow-hidden bg-white/5">
              <ImageWithFallback
                src={shoot.cover_image || shoot.images[0]?.image_thumb_url}
                alt={shoot.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


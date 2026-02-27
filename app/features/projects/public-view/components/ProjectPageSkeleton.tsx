import { Skeleton } from '@/app/components/ui/skeleton';

export function ProjectPageSkeleton() {
  return (
    <div className="px-4 md:px-6 py-8 space-y-4">
      {/* Cover image 16:9 */}
      <Skeleton className="w-full h-72 rounded-xl" />

      {/* Stats bar — 3 colonnes (Direction B: fond primary) */}
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
      </div>

      {/* Actions row */}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>

      {/* Section header Éléments */}
      <Skeleton className="h-5 w-36 rounded mt-2" />

      {/* Éléments cards */}
      <div className="space-y-2">
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
      </div>

      {/* Section header Galerie */}
      <Skeleton className="h-5 w-24 rounded mt-2" />

      {/* Galerie grid 2 colonnes */}
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="aspect-square rounded-lg" />
        <Skeleton className="aspect-square rounded-lg" />
        <Skeleton className="aspect-square rounded-lg" />
        <Skeleton className="aspect-square rounded-lg" />
      </div>
    </div>
  );
}

import { Skeleton } from '@/app/components/ui/skeleton';

/**
 * Skeleton Direction D1 — Split Editorial
 * Reflète la structure : hero → stats bar → split 65/35
 */
export function ProjectPageSkeleton() {
  return (
    <div>
      {/* Hero — full-width h-[50vh] */}
      <Skeleton className="w-full h-[50vh] rounded-none" />

      {/* Stats bar — violet bg, 3 colonnes */}
      <div className="w-full bg-[#6259CA]/30">
        <div className="grid grid-cols-3 max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 h-20 gap-4 items-center">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </div>

      {/* Split layout */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-8 items-start">
        {/* Colonne principale — 65% */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-36" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
          <Skeleton className="h-6 w-28 mt-4" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="aspect-square" />
            <Skeleton className="aspect-square" />
            <Skeleton className="aspect-square" />
          </div>
        </div>

        {/* Sidebar — 35% */}
        <div className="space-y-4 lg:sticky lg:top-20">
          <Skeleton className="h-28" />
          <Skeleton className="h-16" />
          <Skeleton className="h-10" />
          <Skeleton className="h-40" />
        </div>
      </div>
    </div>
  );
}

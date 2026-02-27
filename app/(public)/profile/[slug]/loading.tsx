import { AppLayout } from '@/app/features/shared/components/app-layout';

export default function ProfileLoading() {
  return (
    <AppLayout>
      <div className="animate-pulse space-y-6 py-4">
        {/* Cover */}
        <div className="h-48 md:h-64 bg-white/[0.04] -mx-4 sm:-mx-6 lg:-mx-8 rounded-none" />
        {/* Stats bar */}
        <div className="px-8">
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-6 justify-center">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="h-8 w-12 bg-white/[0.06] rounded" />
                    <div className="h-3 w-16 bg-white/[0.04] rounded" />
                  </div>
                ))}
              </div>
              <div className="lg:border-l lg:border-r border-white/10 lg:px-6 space-y-2">
                <div className="h-3 bg-white/[0.04] rounded w-full" />
                <div className="h-3 bg-white/[0.04] rounded w-4/5" />
                <div className="h-3 bg-white/[0.04] rounded w-3/5" />
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-end">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 bg-white/[0.04] rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Personal records */}
        <div className="px-8">
          <div className="h-5 bg-white/[0.04] rounded w-40 mb-3" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white/[0.04] border border-white/[0.07] rounded-[12px]" />
            ))}
          </div>
        </div>
        {/* Tabs + project grid */}
        <div className="px-8 space-y-6">
          <div className="flex gap-2">
            <div className="h-10 w-28 bg-white/[0.06] rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/[0.04] border border-white/[0.07] rounded-[14px] overflow-hidden">
                <div className="aspect-[4/3] bg-white/[0.05]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-white/[0.05] rounded w-3/4" />
                  <div className="h-3 bg-white/[0.05] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

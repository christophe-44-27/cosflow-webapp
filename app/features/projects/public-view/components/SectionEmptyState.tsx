import type { ReactNode } from 'react';

interface SectionEmptyStateProps {
  illustration: ReactNode;
  message: string;
}

export function SectionEmptyState({ illustration, message }: SectionEmptyStateProps) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-dashed border-white/[0.08] flex flex-col items-center gap-4 py-14 px-6">
      <div className="w-24 h-24 rounded-2xl bg-[#6259CA]/10 ring-1 ring-[#6259CA]/20 flex items-center justify-center">
        {illustration}
      </div>
      <p className="text-sm text-white/35 text-center">{message}</p>
    </div>
  );
}

'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { ProjectDetail } from '@/app/lib/types';
import { formatBudget } from '@/app/lib/budget-utils';

interface ProjectStatsBarProps {
  project: ProjectDetail;
  locale: string;
  actualBudget: number;
  estimatedBudget: number | null;
  budgetDifference: number | null;
  withinBudget: boolean;
  budgetPercentage: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}

export function ProjectStatsBar({
  project,
  locale,
  actualBudget,
  estimatedBudget,
  budgetDifference,
  withinBudget,
  budgetPercentage,
  t,
}: ProjectStatsBarProps) {
  return (
    <div className="grid grid-cols-5 gap-4 pt-4 border-t border-white/10">
      <div className="text-center">
        <p className="text-white/50 text-xs">{t.projectInfo.progression}</p>
        <p className="text-white text-lg font-bold">{project.progression}%</p>
      </div>
      <div className="text-center">
        <p className="text-white/50 text-xs">{t.projectInfo.total_time}</p>
        <p className="text-white text-lg font-bold">{project.total_project_working_time || '0min'}</p>
      </div>
      <div className="text-center">
        <p className="text-white/50 text-xs">{t.projectInfo.estimated_end_date}</p>
        <p className="text-white text-lg font-bold">
          {project.estimated_end_date
            ? new Date(project.estimated_end_date).toLocaleDateString(locale, {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })
            : t.projectInfo.no_end_date
          }
        </p>
      </div>
      <div className="text-center">
        <p className="text-white/50 text-xs">{t.projectInfo.actual_budget}</p>
        <p className={`text-lg font-bold ${withinBudget ? 'text-green-400' : 'text-red-400'}`}>
          ${formatBudget(actualBudget)}
        </p>
        {estimatedBudget !== null && (
          <div className="flex items-center justify-center gap-1 mt-1">
            {withinBudget ? (
              <TrendingDown className="w-3 h-3 text-green-400" />
            ) : (
              <TrendingUp className="w-3 h-3 text-red-400" />
            )}
            <span className={`text-xs ${withinBudget ? 'text-green-400' : 'text-red-400'}`}>
              {budgetDifference !== null && budgetDifference >= 0
                ? `-$${formatBudget(Math.abs(budgetDifference))}`
                : `+$${formatBudget(Math.abs(budgetDifference || 0))}`
              }
            </span>
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="text-white/50 text-xs">{t.projectInfo.estimated_budget}</p>
        <p className="text-white text-lg font-bold">
          {estimatedBudget !== null ? `$${formatBudget(estimatedBudget)}` : t.common.loading}
        </p>
        {budgetPercentage !== null && (
          <p className={`text-xs mt-1 ${budgetPercentage <= 100 ? 'text-white/60' : 'text-red-400'}`}>
            {budgetPercentage.toFixed(0)}% utilisé
          </p>
        )}
      </div>
    </div>
  );
}


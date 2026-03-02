'use client';

import { useMemo } from 'react';
import { ProjectDetail, ProjectStats } from '@/app/types/models';

export function useProjectBudget(project: ProjectDetail | null, projectStats: ProjectStats | null) {
  const progression = useMemo(() => {
    if (projectStats) return Math.round(projectStats.progression_percentage);
    return project?.progression ?? 0;
  }, [projectStats, project?.progression]);

  const actualBudget = useMemo(() => {
    return projectStats?.budget.spent ?? 0;
  }, [projectStats]);

  const estimatedBudget = useMemo(() => {
    if (projectStats) return projectStats.budget.estimated;
    if (!project?.project_estimated_price) return null;
    return parseFloat(project.project_estimated_price);
  }, [projectStats, project?.project_estimated_price]);

  const budgetDifference = useMemo(() => {
    if (projectStats) return projectStats.budget.remaining;
    return null;
  }, [projectStats]);

  const withinBudget = useMemo(() => {
    if (projectStats) return !projectStats.budget.is_over_budget;
    return true;
  }, [projectStats]);

  const budgetPercentage = useMemo(() => {
    if (!estimatedBudget || estimatedBudget === 0) return null;
    return (actualBudget / estimatedBudget) * 100;
  }, [actualBudget, estimatedBudget]);

  return {
    progression,
    actualBudget,
    estimatedBudget,
    budgetDifference,
    withinBudget,
    budgetPercentage,
  };
}

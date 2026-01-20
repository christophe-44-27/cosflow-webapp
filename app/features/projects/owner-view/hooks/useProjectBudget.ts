'use client';

import { useMemo } from 'react';
import { ProjectElement } from '../types';
import { ProjectDetail } from '@/app/lib/types';
import {
  calculateProjectActualBudget,
  calculateBudgetDifference,
  isWithinBudget,
  calculateBudgetPercentage,
} from '@/app/lib/budget-utils';

export function useProjectBudget(project: ProjectDetail | null, elements: ProjectElement[]) {
  // Calcul du budget réel basé sur les éléments
  const actualBudget = useMemo(() => {
    return calculateProjectActualBudget(elements);
  }, [elements]);

  // Budget estimé par l'utilisateur
  const estimatedBudget = useMemo(() => {
    if (!project?.project_estimated_price) return null;
    return parseFloat(project.project_estimated_price);
  }, [project?.project_estimated_price]);

  // Différence entre budget estimé et réel
  const budgetDifference = useMemo(() => {
    return calculateBudgetDifference(estimatedBudget, actualBudget);
  }, [estimatedBudget, actualBudget]);

  // Vérifier si dans le budget
  const withinBudget = useMemo(() => {
    return isWithinBudget(estimatedBudget, actualBudget);
  }, [estimatedBudget, actualBudget]);

  // Pourcentage du budget utilisé
  const budgetPercentage = useMemo(() => {
    return calculateBudgetPercentage(estimatedBudget, actualBudget);
  }, [estimatedBudget, actualBudget]);

  return {
    actualBudget,
    estimatedBudget,
    budgetDifference,
    withinBudget,
    budgetPercentage,
  };
}


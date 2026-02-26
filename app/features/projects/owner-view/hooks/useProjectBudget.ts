'use client';

import { useMemo } from 'react';
import { ProjectElement } from '../types';
import { ProjectDetail } from '@/app/types/models';
import {
  calculateProjectActualBudget,
  calculateBudgetDifference,
  isWithinBudget,
  calculateBudgetPercentage,
} from '@/app/lib/budget-utils';

export function useProjectBudget(project: ProjectDetail | null, elements: ProjectElement[]) {
  // Calcul de la progression basée uniquement sur les éléments feuilles (sans enfants)
  const progression = useMemo(() => {
    if (elements.length === 0) return project?.progression ?? 0;
    const parentIds = new Set(
      elements.filter(el => el.parent_id !== null).map(el => el.parent_id!)
    );
    const leafElements = elements.filter(el => !parentIds.has(el.id));
    if (leafElements.length === 0) return project?.progression ?? 0;
    const done = leafElements.filter(el => el.is_done).length;
    return Math.round((done / leafElements.length) * 100);
  }, [elements, project?.progression]);

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
    progression,
    actualBudget,
    estimatedBudget,
    budgetDifference,
    withinBudget,
    budgetPercentage,
  };
}


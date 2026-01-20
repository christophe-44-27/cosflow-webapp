'use client';

import { useState, useEffect } from 'react';
import { ProjectDetail } from '@/app/lib/types';
import { ProjectElement, TimeEntry, ElementCategory } from '../types';

export function useProjectData(slug: string, locale: string) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [elements, setElements] = useState<ProjectElement[]>([]);
  const [categories, setCategories] = useState<ElementCategory[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/project_element_categories?locale=${locale}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/projects/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch project');
      const response = await res.json();
      setProject(response.data);
      setElements(response.data.elements || []);

      // Fetch time entries
      const timeRes = await fetch(`/api/timesheets/projects/${slug}`);
      if (timeRes.ok) {
        const timeData = await timeRes.json();
        setTimeEntries(timeData.data || []);
      }
    } catch (err) {
      setError('Erreur lors du chargement du projet');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, locale]);

  return {
    project,
    elements,
    categories,
    timeEntries,
    isLoading,
    error,
    refetch: fetchProject,
    setElements,
    setTimeEntries,
  };
}


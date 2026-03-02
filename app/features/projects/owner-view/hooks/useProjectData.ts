'use client';

import { useState, useEffect } from 'react';
import { ProjectDetail, ProjectStats } from '@/app/types/models';
import { ProjectElement, TimeEntry, ElementCategory } from '../types';

export function useProjectData(slug: string, locale: string) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [elements, setElements] = useState<ProjectElement[]>([]);
  const [categories, setCategories] = useState<ElementCategory[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

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
      const [res, elemRes, statsRes] = await Promise.all([
        fetch(`/api/projects/${slug}`),
        fetch(`/api/projects/${slug}/elements`),
        fetch(`/api/projects/${slug}/stats?locale=${locale}`),
      ]);
      if (!res.ok) {
        setStatusCode(res.status);
        throw new Error(`HTTP ${res.status}`);
      }
      const response = await res.json();
      setProject(response.data);

      // Use dedicated elements endpoint (has `position`), flatten if nested
      let rawElements: ProjectElement[] = response.data.elements || [];
      if (elemRes.ok) {
        const elemData = await elemRes.json();
        const list: ProjectElement[] = elemData.data || [];
        // Flatten nested structure if API returns children embedded in parents
        const flat: ProjectElement[] = [];
        for (const el of list) {
          const { children, ...rest } = el as ProjectElement & { children?: ProjectElement[] };
          flat.push(rest);
          if (children?.length) flat.push(...children);
        }
        if (flat.length > 0) rawElements = flat;
      }
      setElements(rawElements.map((el: ProjectElement, i: number) =>
        el.position != null ? el : { ...el, position: i }
      ));

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setProjectStats(statsData.data || null);
      }

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
    projectStats,
    elements,
    categories,
    timeEntries,
    isLoading,
    error,
    statusCode,
    refetch: fetchProject,
    setElements,
    setTimeEntries,
    setCategories,
  };
}


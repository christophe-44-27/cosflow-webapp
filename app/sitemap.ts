import { MetadataRoute } from 'next';
import { projectService, userService } from './lib/services';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cosflow.co';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/discovery`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Fetch public projects
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const response = await projectService.getProjects({ per_page: 100, 'filter[public_projects]': true });
    projectRoutes = (response.data ?? []).map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.updated_at ?? Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    // API indisponible — sitemap dégradé, on continue sans les projets
  }

  // Fetch public maker profiles
  let profileRoutes: MetadataRoute.Sitemap = [];
  try {
    const response = await userService.getUsers({ per_page: 100 });
    profileRoutes = (response.data ?? []).map((user) => ({
      url: `${baseUrl}/profile/${user.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch {
    // API indisponible — sitemap dégradé, on continue sans les profils
  }

  return [...staticRoutes, ...projectRoutes, ...profileRoutes];
}

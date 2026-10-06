import type { MetadataRoute } from 'next';
import { WORKSTATION_PROJECTS } from '@/data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tommasoruella.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/archive',
    '/films',
    '/shootings',
    '/statement',
    '/contact',
    '/reel',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = WORKSTATION_PROJECTS.map(
    (project) => ({
      url: `${baseUrl}/films/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })
  );

  return [...staticRoutes, ...projectRoutes];
}

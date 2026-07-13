import type { MetadataRoute } from "next";

import { getProjects } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL ?? "http://localhost:3000";
  const projects = await getProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/experience`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/education`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/activities`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/projects/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}

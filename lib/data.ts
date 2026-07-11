import { cache } from "react";

import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import TechStackItem, {
  TECH_CATEGORIES,
  type TechCategory,
} from "@/models/TechStackItem";
import SiteContent from "@/models/SiteContent";
import {
  serialize,
  type ProjectDTO,
  type ExperienceDTO,
  type TechStackItemDTO,
} from "@/lib/serialize";

/**
 * Read-side data access for public pages. Every function goes through the
 * cached Mongoose connection, fetches with `.lean()`, and returns serialized
 * plain objects. `cache()` dedupes calls within a single render pass (e.g.
 * the footer and the page both reading site content).
 */

export const getSiteContent = cache(
  async (): Promise<Record<string, string>> => {
    await dbConnect();
    const docs = await SiteContent.find().lean();
    return Object.fromEntries(docs.map((doc) => [doc.key, doc.value]));
  }
);

export const getProjects = cache(async (): Promise<ProjectDTO[]> => {
  await dbConnect();
  const docs = await Project.find()
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
  return serialize<ProjectDTO[]>(docs);
});

export const getFeaturedProjects = cache(async (): Promise<ProjectDTO[]> => {
  await dbConnect();
  const docs = await Project.find({ featured: true })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
  return serialize<ProjectDTO[]>(docs);
});

export const getProjectBySlug = cache(
  async (slug: string): Promise<ProjectDTO | null> => {
    await dbConnect();
    const doc = await Project.findOne({ slug }).lean();
    return doc ? serialize<ProjectDTO>(doc) : null;
  }
);

export const getExperiences = cache(async (): Promise<ExperienceDTO[]> => {
  await dbConnect();
  const docs = await Experience.find()
    .sort({ sortOrder: 1, startDate: -1 })
    .lean();
  return serialize<ExperienceDTO[]>(docs);
});

export type TechByCategory = Array<{
  category: TechCategory;
  items: TechStackItemDTO[];
}>;

export const getTechByCategory = cache(async (): Promise<TechByCategory> => {
  await dbConnect();
  const docs = serialize<TechStackItemDTO[]>(
    await TechStackItem.find().sort({ sortOrder: 1, name: 1 }).lean()
  );
  return TECH_CATEGORIES.map((category) => ({
    category,
    items: docs.filter((doc) => doc.category === category),
  })).filter((group) => group.items.length > 0);
});

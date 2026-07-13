import { cache } from "react";

import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Education from "@/models/Education";
import Activity from "@/models/Activity";
import TechStackItem from "@/models/TechStackItem";
import { TECH_CATEGORIES, type TechCategory } from "@/lib/constants";
import SiteContent from "@/models/SiteContent";
import {
  serialize,
  type ProjectDTO,
  type ExperienceDTO,
  type EducationDTO,
  type ActivityDTO,
  type TechStackItemDTO,
  type SiteContentDTO,
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

/**
 * Public queries match `published: { $ne: false }` (not `true`) so documents
 * created before the field existed remain visible without a migration.
 */
const PUBLISHED = { published: { $ne: false } };

export const getProjects = cache(async (): Promise<ProjectDTO[]> => {
  await dbConnect();
  const docs = await Project.find(PUBLISHED)
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
  return serialize<ProjectDTO[]>(docs);
});

export const getFeaturedProjects = cache(async (): Promise<ProjectDTO[]> => {
  await dbConnect();
  const docs = await Project.find({ featured: true, ...PUBLISHED })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
  return serialize<ProjectDTO[]>(docs);
});

export const getProjectBySlug = cache(
  async (slug: string): Promise<ProjectDTO | null> => {
    await dbConnect();
    const doc = await Project.findOne({ slug, ...PUBLISHED }).lean();
    return doc ? serialize<ProjectDTO>(doc) : null;
  }
);

/** Admin list — includes drafts. */
export const getAllProjects = cache(async (): Promise<ProjectDTO[]> => {
  await dbConnect();
  const docs = await Project.find()
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
  return serialize<ProjectDTO[]>(docs);
});

export const getExperiences = cache(async (): Promise<ExperienceDTO[]> => {
  await dbConnect();
  const docs = await Experience.find()
    .sort({ sortOrder: 1, startDate: -1 })
    .lean();
  return serialize<ExperienceDTO[]>(docs);
});

export const getEducation = cache(async (): Promise<EducationDTO[]> => {
  await dbConnect();
  const docs = await Education.find()
    .sort({ sortOrder: 1, endDate: -1 })
    .lean();
  return serialize<EducationDTO[]>(docs);
});

export const getActivities = cache(async (): Promise<ActivityDTO[]> => {
  await dbConnect();
  const docs = await Activity.find()
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean();
  return serialize<ActivityDTO[]>(docs);
});

export const getTechItems = cache(async (): Promise<TechStackItemDTO[]> => {
  await dbConnect();
  const docs = await TechStackItem.find()
    .sort({ category: 1, sortOrder: 1, name: 1 })
    .lean();
  return serialize<TechStackItemDTO[]>(docs);
});

export type TechByCategory = Array<{
  category: TechCategory;
  items: TechStackItemDTO[];
}>;

export const getTechByCategory = cache(async (): Promise<TechByCategory> => {
  const docs = await getTechItems();
  return TECH_CATEGORIES.map((category) => ({
    category,
    items: docs.filter((doc) => doc.category === category),
  })).filter((group) => group.items.length > 0);
});

/** Full site-content documents (admin editor needs keys AND values). */
export const getSiteContentDocs = cache(async (): Promise<SiteContentDTO[]> => {
  await dbConnect();
  const docs = await SiteContent.find().sort({ key: 1 }).lean();
  return serialize<SiteContentDTO[]>(docs);
});

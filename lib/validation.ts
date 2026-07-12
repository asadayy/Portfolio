import { z } from "zod";

import { TECH_CATEGORIES } from "@/lib/constants";

/** Zod schemas shared by all mutating admin route handlers. */

const optionalUrl = z
  .union([
    z.literal(""),
    z.string().trim().url("Must be a valid URL (or empty)"),
  ])
  .default("");

/** Uploaded image path (/uploads/…) or an absolute URL, or empty. */
const imageRef = z
  .union([
    z.literal(""),
    z.string().trim().url("Must be a valid URL"),
    z
      .string()
      .trim()
      .regex(/^\/uploads\/[\w.-]+$/, "Must be an uploaded image path"),
  ])
  .default("");

const isoDay = /^\d{4}-\d{2}-\d{2}/;

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be kebab-case (letters, numbers, hyphens)"
    ),
  shortDescription: z
    .string()
    .trim()
    .min(1, "Short description is required")
    .max(300),
  longDescription: z.string().trim().min(1, "Long description is required"),
  techStack: z.array(z.string().trim().min(1)).default([]),
  liveUrl: optionalUrl,
  githubUrl: optionalUrl,
  imageUrl: imageRef,
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const experienceSchema = z
  .object({
    role: z.string().trim().min(1, "Role is required").max(120),
    organization: z.string().trim().min(1, "Organization is required").max(160),
    location: z.string().trim().min(1, "Location is required").max(120),
    startDate: z
      .string()
      .regex(isoDay, "Start date must be a valid date (YYYY-MM-DD)"),
    endDate: z
      .union([
        z.null(),
        z.literal(""),
        z.string().regex(isoDay, "End date must be a valid date (YYYY-MM-DD)"),
      ])
      .transform((value) => (value ? value : null)),
    description: z.string().trim().min(1, "Description is required"),
    techUsed: z.array(z.string().trim().min(1)).default([]),
    sortOrder: z.coerce.number().int().min(0).default(0),
  })
  .refine(
    (data) => !data.endDate || data.endDate >= data.startDate,
    { message: "End date cannot be before the start date", path: ["endDate"] }
  );

export const techItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  category: z.enum(TECH_CATEGORIES, {
    errorMap: () => ({
      message: "Category must be one of: " + TECH_CATEGORIES.join(", "),
    }),
  }),
  iconUrl: imageRef,
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const siteContentSchema = z.object({
  items: z
    .array(
      z.object({
        key: z
          .string()
          .trim()
          .min(1)
          .regex(
            /^[a-z0-9_]+$/,
            "Keys must be snake_case (lowercase letters, numbers, underscores)"
          ),
        value: z.string(),
      })
    )
    .min(1, "Nothing to save"),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type TechItemInput = z.infer<typeof techItemSchema>;
export type SiteContentInput = z.infer<typeof siteContentSchema>;

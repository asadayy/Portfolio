/**
 * Shared constants safe to import from BOTH client and server code.
 * (Keep mongoose imports out of this file — client components import it.)
 */

export const TECH_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "AI/ML",
  "Tools",
] as const;

export type TechCategory = (typeof TECH_CATEGORIES)[number];

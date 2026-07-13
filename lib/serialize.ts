/**
 * Serialization helpers for the server/client boundary.
 *
 * Raw Mongoose documents (ObjectIds, Dates, prototypes) must never be passed
 * to client components or returned from route handlers. Fetch with `.lean()`
 * and run the result through `serialize<T>()`: the JSON round-trip converts
 * ObjectId → string and Date → ISO string, leaving a plain object matching
 * the DTO types below.
 */

export function serialize<T>(data: unknown): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

export interface MediaItemDTO {
  type: "image" | "video";
  url: string;
  publicId?: string;
  /** Intrinsic pixel dimensions — used to pick the gallery tile ratio. */
  width?: number;
  height?: number;
}

export interface ProjectDTO {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  /** Undefined on documents created before the media gallery existed. */
  media?: MediaItemDTO[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceDTO {
  _id: string;
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  techUsed: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface EducationDTO {
  _id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate: string | null;
  grade?: string;
  description?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityDTO {
  _id: string;
  title: string;
  description: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateDTO {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string | null;
  credentialId?: string;
  credentialUrl?: string;
  fileUrl?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TechStackItemDTO {
  _id: string;
  name: string;
  category: string;
  iconUrl?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteContentDTO {
  _id: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

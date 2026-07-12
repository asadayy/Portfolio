import { Schema, model, models, type Model } from "mongoose";

export interface IProject {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  featured: boolean;
  /** Drafts (false) are hidden from all public pages but editable in admin. */
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title must be 120 characters or fewer"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be kebab-case (letters, numbers, hyphens)",
      ],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: [300, "Short description must be 300 characters or fewer"],
    },
    longDescription: {
      type: String,
      required: [true, "Long description is required"],
    },
    techStack: { type: [String], default: [] },
    liveUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  (models.Project as Model<IProject>) ?? model<IProject>("Project", ProjectSchema);

export default Project;

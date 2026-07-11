import { Schema, model, models, type Model } from "mongoose";

/**
 * Key-value store for editable page copy, e.g. `hero_headline`,
 * `hero_subtext`, `about_text`, `contact_email`, `github_url`,
 * `linkedin_url`, `resume_url`.
 */
export interface ISiteContent {
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    key: {
      type: String,
      required: [true, "Key is required"],
      unique: true,
      trim: true,
      match: [
        /^[a-z0-9_]+$/,
        "Key must be snake_case (lowercase letters, numbers, underscores)",
      ],
    },
    value: { type: String, default: "" },
  },
  { timestamps: true }
);

const SiteContent: Model<ISiteContent> =
  (models.SiteContent as Model<ISiteContent>) ??
  model<ISiteContent>("SiteContent", SiteContentSchema);

export default SiteContent;

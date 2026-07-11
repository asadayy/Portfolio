import { Schema, model, models, type Model } from "mongoose";

export interface IExperience {
  role: string;
  organization: string;
  location: string;
  startDate: Date;
  /** null means the role is current ("Present") */
  endDate: Date | null;
  description: string;
  techUsed: string[];
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      maxlength: [120, "Role must be 120 characters or fewer"],
    },
    organization: {
      type: String,
      required: [true, "Organization is required"],
      trim: true,
      maxlength: [160, "Organization must be 160 characters or fewer"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [120, "Location must be 120 characters or fewer"],
    },
    startDate: { type: Date, required: [true, "Start date is required"] },
    endDate: { type: Date, default: null },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    techUsed: { type: [String], default: [] },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Experience: Model<IExperience> =
  (models.Experience as Model<IExperience>) ??
  model<IExperience>("Experience", ExperienceSchema);

export default Experience;

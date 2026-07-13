import { Schema, model, models, type Model } from "mongoose";

export interface IEducation {
  degree: string;
  institution: string;
  location?: string;
  startDate: Date;
  /** null means in progress ("Present") */
  endDate: Date | null;
  /** e.g. "CGPA: 3.2 / 4.00" */
  grade?: string;
  description?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema = new Schema<IEducation>(
  {
    degree: {
      type: String,
      required: [true, "Degree is required"],
      trim: true,
      maxlength: [160, "Degree must be 160 characters or fewer"],
    },
    institution: {
      type: String,
      required: [true, "Institution is required"],
      trim: true,
      maxlength: [200, "Institution must be 200 characters or fewer"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [120, "Location must be 120 characters or fewer"],
    },
    startDate: { type: Date, required: [true, "Start date is required"] },
    endDate: { type: Date, default: null },
    grade: {
      type: String,
      trim: true,
      maxlength: [120, "Grade must be 120 characters or fewer"],
    },
    description: { type: String },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Education: Model<IEducation> =
  (models.Education as Model<IEducation>) ??
  model<IEducation>("Education", EducationSchema);

export default Education;

import { Schema, model, models, type Model } from "mongoose";

export interface IActivity {
  title: string;
  description: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title must be 120 characters or fewer"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Activity: Model<IActivity> =
  (models.Activity as Model<IActivity>) ??
  model<IActivity>("Activity", ActivitySchema);

export default Activity;

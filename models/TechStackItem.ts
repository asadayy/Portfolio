import { Schema, model, models, type Model } from "mongoose";

import { TECH_CATEGORIES, type TechCategory } from "@/lib/constants";

export { TECH_CATEGORIES, type TechCategory };

export interface ITechStackItem {
  name: string;
  category: TechCategory;
  iconUrl?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const TechStackItemSchema = new Schema<ITechStackItem>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
      maxlength: [60, "Name must be 60 characters or fewer"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: TECH_CATEGORIES as unknown as string[],
        message: "Category must be one of: " + TECH_CATEGORIES.join(", "),
      },
    },
    iconUrl: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const TechStackItem: Model<ITechStackItem> =
  (models.TechStackItem as Model<ITechStackItem>) ??
  model<ITechStackItem>("TechStackItem", TechStackItemSchema);

export default TechStackItem;

import { Schema, model, models, type Model } from "mongoose";

export interface ICertificate {
  title: string;
  issuer: string;
  /** null when the user didn't set a date */
  issueDate: Date | null;
  credentialId?: string;
  /** External verification link (issuer's site). */
  credentialUrl?: string;
  /** Uploaded certificate file (Cloudinary image or PDF). */
  fileUrl?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [160, "Title must be 160 characters or fewer"],
    },
    issuer: {
      type: String,
      required: [true, "Issuer is required"],
      trim: true,
      maxlength: [160, "Issuer must be 160 characters or fewer"],
    },
    issueDate: { type: Date, default: null },
    credentialId: {
      type: String,
      trim: true,
      maxlength: [120, "Credential ID must be 120 characters or fewer"],
    },
    credentialUrl: { type: String, trim: true },
    fileUrl: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Certificate: Model<ICertificate> =
  (models.Certificate as Model<ICertificate>) ??
  model<ICertificate>("Certificate", CertificateSchema);

export default Certificate;

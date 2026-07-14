import { Schema, model, models, type Model } from "mongoose";

/**
 * Admin login credentials, stored in MongoDB (single admin in practice, but
 * the collection supports more). The password is kept only as a bcrypt hash;
 * the plaintext is never stored. Create/reset via `npm run create-admin`.
 */
export interface IAdminUser {
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [80, "Username must be 80 characters or fewer"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
  },
  { timestamps: true }
);

const AdminUser: Model<IAdminUser> =
  (models.AdminUser as Model<IAdminUser>) ??
  model<IAdminUser>("AdminUser", AdminUserSchema);

export default AdminUser;

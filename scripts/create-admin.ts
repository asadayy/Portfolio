/**
 * Create or reset the admin login stored in MongoDB.
 *
 * Usage: npm run create-admin -- <username> <password>
 *
 * Writes to the AdminUser collection in whatever database MONGODB_URI points
 * at (your Atlas cluster), so the same credential works in local dev and on
 * Vercel — no admin env vars needed anywhere. Re-running with an existing
 * username resets that admin's password.
 */
import { config } from "dotenv";

config();

import bcrypt from "bcryptjs";

import dbConnect from "../lib/db";
import AdminUser from "../models/AdminUser";

async function main() {
  const username = process.argv[2]?.trim().toLowerCase();
  const password = process.argv[3];

  if (!username || !password) {
    console.error('Usage: npm run create-admin -- "<username>" "<password>"');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  await dbConnect();

  const existing = await AdminUser.findOne({ username });
  const passwordHash = bcrypt.hashSync(password, 12);
  await AdminUser.findOneAndUpdate(
    { username },
    { username, passwordHash },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(
    existing
      ? `Password reset for admin "${username}".`
      : `Admin "${username}" created.`
  );
  console.log(`Total admins in database: ${await AdminUser.countDocuments()}`);
  process.exit(0);
}

main().catch((error) => {
  console.error("create-admin failed:", error);
  process.exit(1);
});

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import {
  clearLoginFailures,
  lockoutRemainingMs,
  recordLoginFailure,
} from "@/lib/rate-limit";

/**
 * Single-admin credential auth backed by MongoDB. The username and bcrypt
 * password hash live in the AdminUser collection (create/reset them with
 * `npm run create-admin`). JWT session strategy, so no database adapter is
 * needed for sessions — only the credential lookup hits Mongo.
 */

// Lazily-built bcrypt hash used only to keep the password comparison
// constant-time when the username doesn't exist, so response timing can't be
// used to tell whether a username is valid. Computed once per runtime.
let timingGuardHash: string | null = null;
function getTimingGuardHash(): string {
  if (!timingGuardHash) {
    timingGuardHash = bcrypt.hashSync("timing-guard-not-a-real-password", 12);
  }
  return timingGuardHash;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const forwardedFor = req?.headers?.["x-forwarded-for"];
        const clientKey =
          (typeof forwardedFor === "string"
            ? forwardedFor.split(",")[0]?.trim()
            : undefined) || "local";

        const lockedMs = lockoutRemainingMs(clientKey);
        if (lockedMs > 0) {
          throw new Error(
            `Too many failed attempts. Try again in ${Math.ceil(
              lockedMs / 60000
            )} minute(s).`
          );
        }

        if (!credentials?.username || !credentials.password) {
          return null;
        }

        await dbConnect();
        const username = credentials.username.trim().toLowerCase();
        const admin = await AdminUser.findOne({ username }).lean();

        // Always run a bcrypt comparison (against a dummy hash when the user
        // isn't found) so response timing doesn't reveal whether the username
        // exists.
        const passwordOk = await bcrypt.compare(
          credentials.password,
          admin?.passwordHash ?? getTimingGuardHash()
        );

        if (admin && passwordOk) {
          clearLoginFailures(clientKey);
          return { id: String(admin._id), name: admin.username };
        }
        recordLoginFailure(clientKey);
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24h
  },
  pages: {
    signIn: "/admin/login",
  },
};

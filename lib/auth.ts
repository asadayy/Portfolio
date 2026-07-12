import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import {
  clearLoginFailures,
  lockoutRemainingMs,
  recordLoginFailure,
} from "@/lib/rate-limit";

/**
 * Single-admin credential auth. The username and bcrypt password hash live in
 * env vars (ADMIN_USERNAME / ADMIN_PASSWORD_HASH) — no user collection.
 * JWT session strategy, so no database adapter is required.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        if (!adminUsername || !adminPasswordHash) {
          throw new Error(
            "ADMIN_USERNAME / ADMIN_PASSWORD_HASH are not configured"
          );
        }

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

        // Always run the bcrypt comparison (even for a wrong username) so
        // response timing doesn't reveal which field was incorrect.
        const passwordOk = await bcrypt.compare(
          credentials.password,
          adminPasswordHash
        );
        const usernameOk = credentials.username === adminUsername;

        if (usernameOk && passwordOk) {
          clearLoginFailures(clientKey);
          return { id: "admin", name: adminUsername };
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

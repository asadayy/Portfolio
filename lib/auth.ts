import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

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
      async authorize(credentials) {
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        if (!adminUsername || !adminPasswordHash) {
          throw new Error(
            "ADMIN_USERNAME / ADMIN_PASSWORD_HASH are not configured"
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
          return { id: "admin", name: adminUsername };
        }
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

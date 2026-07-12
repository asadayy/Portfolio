import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import { authOptions } from "@/lib/auth";

/**
 * Shared plumbing for admin route handlers. Middleware already gates
 * /api/admin/**, but every handler re-checks the session (defense in depth).
 */

export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function validationError(error: ZodError): NextResponse {
  const message = error.issues
    .map((issue) =>
      issue.path.length ? `${issue.path.join(".")}: ${issue.message}` : issue.message
    )
    .join("; ");
  return NextResponse.json({ error: message }, { status: 400 });
}

/** Mongo duplicate-key error → friendly 409, anything else → rethrow. */
export function conflictFromDuplicateKey(
  error: unknown,
  message: string
): NextResponse {
  if (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: number }).code === 11000
  ) {
    return NextResponse.json({ error: message }, { status: 409 });
  }
  throw error;
}

/**
 * Public pages read straight from MongoDB, so after any mutation we
 * invalidate the whole statically-cached route tree (cheap at this scale)
 * plus the sitemap. Content changes appear immediately without a rebuild.
 */
export function revalidateSite(): void {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}

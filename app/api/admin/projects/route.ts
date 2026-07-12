import { NextResponse, type NextRequest } from "next/server";

import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { projectSchema } from "@/lib/validation";
import {
  conflictFromDuplicateKey,
  requireAdmin,
  revalidateSite,
  validationError,
} from "@/lib/api-helpers";
import { serialize, type ProjectDTO } from "@/lib/serialize";

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = projectSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return validationError(parsed.error);

  await dbConnect();
  try {
    const created = await Project.create(parsed.data);
    revalidateSite();
    return NextResponse.json(serialize<ProjectDTO>(created.toObject()), {
      status: 201,
    });
  } catch (error) {
    return conflictFromDuplicateKey(
      error,
      `A project with slug "${parsed.data.slug}" already exists.`
    );
  }
}

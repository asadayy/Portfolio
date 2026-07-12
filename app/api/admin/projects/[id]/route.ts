import { isValidObjectId } from "mongoose";
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

interface Params {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isValidObjectId(params.id)) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const parsed = projectSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return validationError(parsed.error);

  await dbConnect();
  try {
    const updated = await Project.findByIdAndUpdate(params.id, parsed.data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    revalidateSite();
    return NextResponse.json(serialize<ProjectDTO>(updated));
  } catch (error) {
    return conflictFromDuplicateKey(
      error,
      `A project with slug "${parsed.data.slug}" already exists.`
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isValidObjectId(params.id)) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  await dbConnect();
  const deleted = await Project.findByIdAndDelete(params.id).lean();
  if (!deleted) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  revalidateSite();
  return NextResponse.json({ success: true });
}

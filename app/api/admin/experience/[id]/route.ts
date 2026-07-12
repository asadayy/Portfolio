import { isValidObjectId } from "mongoose";
import { NextResponse, type NextRequest } from "next/server";

import dbConnect from "@/lib/db";
import Experience from "@/models/Experience";
import { experienceSchema } from "@/lib/validation";
import {
  requireAdmin,
  revalidateSite,
  validationError,
} from "@/lib/api-helpers";
import { serialize, type ExperienceDTO } from "@/lib/serialize";

interface Params {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isValidObjectId(params.id)) {
    return NextResponse.json(
      { error: "Invalid experience id" },
      { status: 400 }
    );
  }

  const parsed = experienceSchema.safeParse(
    await request.json().catch(() => ({}))
  );
  if (!parsed.success) return validationError(parsed.error);

  await dbConnect();
  const updated = await Experience.findByIdAndUpdate(
    params.id,
    {
      ...parsed.data,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    },
    { new: true, runValidators: true }
  ).lean();
  if (!updated) {
    return NextResponse.json(
      { error: "Experience entry not found" },
      { status: 404 }
    );
  }
  revalidateSite();
  return NextResponse.json(serialize<ExperienceDTO>(updated));
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isValidObjectId(params.id)) {
    return NextResponse.json(
      { error: "Invalid experience id" },
      { status: 400 }
    );
  }

  await dbConnect();
  const deleted = await Experience.findByIdAndDelete(params.id).lean();
  if (!deleted) {
    return NextResponse.json(
      { error: "Experience entry not found" },
      { status: 404 }
    );
  }
  revalidateSite();
  return NextResponse.json({ success: true });
}

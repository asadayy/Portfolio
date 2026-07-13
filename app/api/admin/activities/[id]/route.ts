import { isValidObjectId } from "mongoose";
import { NextResponse, type NextRequest } from "next/server";

import dbConnect from "@/lib/db";
import Activity from "@/models/Activity";
import { activitySchema } from "@/lib/validation";
import {
  requireAdmin,
  revalidateSite,
  validationError,
} from "@/lib/api-helpers";
import { serialize, type ActivityDTO } from "@/lib/serialize";

interface Params {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isValidObjectId(params.id)) {
    return NextResponse.json({ error: "Invalid activity id" }, { status: 400 });
  }

  const parsed = activitySchema.safeParse(
    await request.json().catch(() => ({}))
  );
  if (!parsed.success) return validationError(parsed.error);

  await dbConnect();
  const updated = await Activity.findByIdAndUpdate(params.id, parsed.data, {
    new: true,
    runValidators: true,
  }).lean();
  if (!updated) {
    return NextResponse.json(
      { error: "Activity not found" },
      { status: 404 }
    );
  }
  revalidateSite();
  return NextResponse.json(serialize<ActivityDTO>(updated));
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isValidObjectId(params.id)) {
    return NextResponse.json({ error: "Invalid activity id" }, { status: 400 });
  }

  await dbConnect();
  const deleted = await Activity.findByIdAndDelete(params.id).lean();
  if (!deleted) {
    return NextResponse.json(
      { error: "Activity not found" },
      { status: 404 }
    );
  }
  revalidateSite();
  return NextResponse.json({ success: true });
}

import { isValidObjectId } from "mongoose";
import { NextResponse, type NextRequest } from "next/server";

import dbConnect from "@/lib/db";
import TechStackItem from "@/models/TechStackItem";
import { techItemSchema } from "@/lib/validation";
import {
  conflictFromDuplicateKey,
  requireAdmin,
  revalidateSite,
  validationError,
} from "@/lib/api-helpers";
import { serialize, type TechStackItemDTO } from "@/lib/serialize";

interface Params {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isValidObjectId(params.id)) {
    return NextResponse.json(
      { error: "Invalid tech item id" },
      { status: 400 }
    );
  }

  const parsed = techItemSchema.safeParse(
    await request.json().catch(() => ({}))
  );
  if (!parsed.success) return validationError(parsed.error);

  await dbConnect();
  try {
    const updated = await TechStackItem.findByIdAndUpdate(
      params.id,
      parsed.data,
      { new: true, runValidators: true }
    ).lean();
    if (!updated) {
      return NextResponse.json(
        { error: "Tech item not found" },
        { status: 404 }
      );
    }
    revalidateSite();
    return NextResponse.json(serialize<TechStackItemDTO>(updated));
  } catch (error) {
    return conflictFromDuplicateKey(
      error,
      `A tech item named "${parsed.data.name}" already exists.`
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isValidObjectId(params.id)) {
    return NextResponse.json(
      { error: "Invalid tech item id" },
      { status: 400 }
    );
  }

  await dbConnect();
  const deleted = await TechStackItem.findByIdAndDelete(params.id).lean();
  if (!deleted) {
    return NextResponse.json({ error: "Tech item not found" }, { status: 404 });
  }
  revalidateSite();
  return NextResponse.json({ success: true });
}

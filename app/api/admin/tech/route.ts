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

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = techItemSchema.safeParse(
    await request.json().catch(() => ({}))
  );
  if (!parsed.success) return validationError(parsed.error);

  await dbConnect();
  try {
    const created = await TechStackItem.create(parsed.data);
    revalidateSite();
    return NextResponse.json(serialize<TechStackItemDTO>(created.toObject()), {
      status: 201,
    });
  } catch (error) {
    return conflictFromDuplicateKey(
      error,
      `A tech item named "${parsed.data.name}" already exists.`
    );
  }
}

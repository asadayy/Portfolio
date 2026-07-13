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

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = activitySchema.safeParse(
    await request.json().catch(() => ({}))
  );
  if (!parsed.success) return validationError(parsed.error);

  await dbConnect();
  const created = await Activity.create(parsed.data);
  revalidateSite();
  return NextResponse.json(serialize<ActivityDTO>(created.toObject()), {
    status: 201,
  });
}

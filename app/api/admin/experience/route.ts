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

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = experienceSchema.safeParse(
    await request.json().catch(() => ({}))
  );
  if (!parsed.success) return validationError(parsed.error);

  await dbConnect();
  const created = await Experience.create({
    ...parsed.data,
    startDate: new Date(parsed.data.startDate),
    endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
  });
  revalidateSite();
  return NextResponse.json(serialize<ExperienceDTO>(created.toObject()), {
    status: 201,
  });
}

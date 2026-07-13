import { NextResponse, type NextRequest } from "next/server";

import dbConnect from "@/lib/db";
import Certificate from "@/models/Certificate";
import { certificateSchema } from "@/lib/validation";
import {
  requireAdmin,
  revalidateSite,
  validationError,
} from "@/lib/api-helpers";
import { serialize, type CertificateDTO } from "@/lib/serialize";

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = certificateSchema.safeParse(
    await request.json().catch(() => ({}))
  );
  if (!parsed.success) return validationError(parsed.error);

  await dbConnect();
  const created = await Certificate.create({
    ...parsed.data,
    issueDate: parsed.data.issueDate ? new Date(parsed.data.issueDate) : null,
  });
  revalidateSite();
  return NextResponse.json(serialize<CertificateDTO>(created.toObject()), {
    status: 201,
  });
}

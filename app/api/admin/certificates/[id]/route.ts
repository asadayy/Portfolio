import { isValidObjectId } from "mongoose";
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

interface Params {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isValidObjectId(params.id)) {
    return NextResponse.json(
      { error: "Invalid certificate id" },
      { status: 400 }
    );
  }

  const parsed = certificateSchema.safeParse(
    await request.json().catch(() => ({}))
  );
  if (!parsed.success) return validationError(parsed.error);

  await dbConnect();
  const updated = await Certificate.findByIdAndUpdate(
    params.id,
    {
      ...parsed.data,
      issueDate: parsed.data.issueDate ? new Date(parsed.data.issueDate) : null,
    },
    { new: true, runValidators: true }
  ).lean();
  if (!updated) {
    return NextResponse.json(
      { error: "Certificate not found" },
      { status: 404 }
    );
  }
  revalidateSite();
  return NextResponse.json(serialize<CertificateDTO>(updated));
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isValidObjectId(params.id)) {
    return NextResponse.json(
      { error: "Invalid certificate id" },
      { status: 400 }
    );
  }

  await dbConnect();
  const deleted = await Certificate.findByIdAndDelete(params.id).lean();
  if (!deleted) {
    return NextResponse.json(
      { error: "Certificate not found" },
      { status: 404 }
    );
  }
  revalidateSite();
  return NextResponse.json({ success: true });
}

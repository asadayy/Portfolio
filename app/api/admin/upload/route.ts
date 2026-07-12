import { NextResponse, type NextRequest } from "next/server";

import { saveUpload } from "@/lib/storage";
import { requireAdmin } from "@/lib/api-helpers";

export const runtime = "nodejs";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No file provided (expected form field 'file')" },
      { status: 400 }
    );
  }

  const extension = ALLOWED[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Only JPG, PNG, or WebP images are allowed" },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be 2 MB or smaller" },
      { status: 400 }
    );
  }

  const baseName =
    file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "image";
  const filename = `${Date.now().toString(36)}-${baseName}.${extension}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await saveUpload(buffer, filename);

  return NextResponse.json({ url }, { status: 201 });
}

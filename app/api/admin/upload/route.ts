import { NextResponse, type NextRequest } from "next/server";

import { saveUpload, type UploadResourceType } from "@/lib/storage";
import { requireAdmin } from "@/lib/api-helpers";

export const runtime = "nodejs";

const ONE_MB = 1024 * 1024;
// Kept under Vercel's serverless request-body limit (~4.5 MB) so uploads work
// the same in production. Larger media would need a direct browser→Cloudinary
// upload (see README → "Media storage").
const MAX_BYTES = 4 * ONE_MB;

type AllowedType = {
  ext: string;
  resourceType: UploadResourceType;
};

const ALLOWED: Record<string, AllowedType> = {
  "image/jpeg": { ext: "jpg", resourceType: "image" },
  "image/png": { ext: "png", resourceType: "image" },
  "image/webp": { ext: "webp", resourceType: "image" },
  "image/gif": { ext: "gif", resourceType: "image" },
  "application/pdf": { ext: "pdf", resourceType: "image" },
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

  const allowed = ALLOWED[file.type];
  if (!allowed) {
    return NextResponse.json(
      { error: "Allowed file types: JPG, PNG, WebP, GIF, or PDF" },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File must be 4 MB or smaller" },
      { status: 400 }
    );
  }

  const baseName =
    file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "file";
  const publicId = `${baseName}-${Date.now().toString(36)}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const url = await saveUpload(buffer, `${publicId}.${allowed.ext}`, {
      resourceType: allowed.resourceType,
      publicId,
    });
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed — storage is not configured or unavailable" },
      { status: 502 }
    );
  }
}

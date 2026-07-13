import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/api-helpers";
import { getCloudinaryPublicConfig, signUploadParams } from "@/lib/storage";

export const runtime = "nodejs";

const FOLDER = "portfolio";

/**
 * Returns a short-lived signature so the admin's browser can upload a file
 * (image or video) straight to Cloudinary. Admin-only; the API secret stays
 * on the server. The signed params must exactly match what the client sends
 * (folder + timestamp) — see ProjectMediaField.
 */
export async function POST() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = signUploadParams({ folder: FOLDER, timestamp });
    const { cloudName, apiKey } = getCloudinaryPublicConfig();
    return NextResponse.json({
      cloudName,
      apiKey,
      timestamp,
      signature,
      folder: FOLDER,
    });
  } catch (error) {
    console.error("Signature failed:", error);
    return NextResponse.json(
      { error: "Storage is not configured" },
      { status: 502 }
    );
  }
}

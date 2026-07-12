import { NextResponse, type NextRequest } from "next/server";

import dbConnect from "@/lib/db";
import SiteContent from "@/models/SiteContent";
import { siteContentSchema } from "@/lib/validation";
import {
  requireAdmin,
  revalidateSite,
  validationError,
} from "@/lib/api-helpers";

/** Bulk "Save All" for the site-content editor. Upserts every key. */
export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = siteContentSchema.safeParse(
    await request.json().catch(() => ({}))
  );
  if (!parsed.success) return validationError(parsed.error);

  await dbConnect();
  await SiteContent.bulkWrite(
    parsed.data.items.map((item) => ({
      updateOne: {
        filter: { key: item.key },
        update: { $set: { value: item.value } },
        upsert: true,
      },
    }))
  );
  revalidateSite();
  return NextResponse.json({ success: true, saved: parsed.data.items.length });
}

import { isValidObjectId } from "mongoose";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import type { Model } from "mongoose";

import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Education from "@/models/Education";
import Activity from "@/models/Activity";
import Certificate from "@/models/Certificate";
import TechStackItem from "@/models/TechStackItem";
import {
  requireAdmin,
  revalidateSite,
  validationError,
} from "@/lib/api-helpers";

const reorderSchema = z.object({
  type: z.enum([
    "projects",
    "experience",
    "education",
    "activities",
    "certificates",
    "tech",
  ]),
  ids: z
    .array(z.string().refine(isValidObjectId, "Invalid id"))
    .min(1, "Nothing to reorder"),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MODELS: Record<string, Model<any>> = {
  projects: Project,
  experience: Experience,
  education: Education,
  activities: Activity,
  certificates: Certificate,
  tech: TechStackItem,
};

/** Persists a drag-and-drop ordering: sortOrder = position in `ids` (1-based). */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = reorderSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return validationError(parsed.error);

  await dbConnect();
  await MODELS[parsed.data.type].bulkWrite(
    parsed.data.ids.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { sortOrder: index + 1 } },
      },
    }))
  );
  revalidateSite();
  return NextResponse.json({ success: true, count: parsed.data.ids.length });
}

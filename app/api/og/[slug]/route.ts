import { NextResponse, type NextRequest } from "next/server";

import { getProjectBySlug } from "@/lib/data";

/**
 * Public, read-only project fields for the OG image generator. The
 * opengraph-image route runs on the edge runtime (the Node build of
 * @vercel/og is broken on Windows), and edge can't use Mongoose — so it
 * fetches the few fields it needs from this Node route instead.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const project = await getProjectBySlug(params.slug);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    title: project.title,
    shortDescription: project.shortDescription,
    techStack: project.techStack,
  });
}

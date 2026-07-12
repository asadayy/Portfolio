import { ImageResponse } from "next/og";

// Edge runtime: the Node build of @vercel/og fails to load its bundled font
// on Windows (ERR_INVALID_URL), and edge is also faster on Vercel. Edge
// can't run Mongoose, so project data comes from /api/og/[slug] over HTTP.
export const runtime = "edge";
export const alt = "Project case study — Asad Khan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface OgData {
  title: string;
  shortDescription: string;
  techStack: string[];
}

function baseUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export default async function OpengraphImage({
  params,
}: {
  params: { slug: string };
}) {
  let data: OgData | null = null;
  try {
    const response = await fetch(`${baseUrl()}/api/og/${params.slug}`);
    if (response.ok) data = (await response.json()) as OgData;
  } catch {
    // fall through to the branded fallback card
  }

  const title = data?.title ?? "Asad Khan";
  const description =
    data?.shortDescription.slice(0, 140) ??
    "Full-Stack Developer — AI-Integrated Web Applications";
  const tech = data?.techStack.slice(0, 5) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          backgroundColor: "#0b0f19",
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(99,102,241,0.35), transparent 55%), radial-gradient(circle at 90% 100%, rgba(34,211,238,0.22), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#22d3ee",
            letterSpacing: 5,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Asad Khan — Full-Stack Developer
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 24 ? 64 : 84,
            fontWeight: 800,
            color: "#f8fafc",
            marginTop: 20,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#94a3b8",
            marginTop: 18,
            lineHeight: 1.4,
            maxWidth: "980px",
          }}
        >
          {description}
        </div>
        {tech.length > 0 && (
          <div style={{ display: "flex", gap: 14, marginTop: 40 }}>
            {tech.map((name) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  fontSize: 24,
                  color: "#c7d2fe",
                  backgroundColor: "rgba(99,102,241,0.18)",
                  border: "2px solid rgba(99,102,241,0.5)",
                  borderRadius: 999,
                  padding: "10px 26px",
                }}
              >
                {name}
              </div>
            ))}
          </div>
        )}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "1200px",
            height: "12px",
            backgroundImage: "linear-gradient(90deg, #6366f1, #22d3ee)",
          }}
        />
      </div>
    ),
    size
  );
}

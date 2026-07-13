import type { Metadata } from "next";

import { getEducation } from "@/lib/data";
import { formatDateRange } from "@/lib/format";
import Markdown from "@/components/Markdown";
import "@/styles/education.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Education",
  description:
    "Education of Asad E Bukhari — B.Sc. Software Engineering at Bahria School of Engineering & Applied Sciences.",
  openGraph: {
    title: "Education — Asad E Bukhari",
    description:
      "Academic background of Asad E Bukhari — B.Sc. Software Engineering at Bahria School of Engineering & Applied Sciences.",
    images: ["/og-default.png"],
  },
};

export default async function EducationPage() {
  const education = await getEducation();

  return (
    <main className="container py-5 education-page">
      <header className="education-header">
        <span className="eyebrow">Background</span>
        <h1 className="fw-bold">Education</h1>
        <p className="text-secondary education-intro">
          My academic background and qualifications.
        </p>
      </header>

      {education.length > 0 ? (
        <div className="education-list">
          {education.map((entry) => (
            <article className="card education-card" key={entry._id}>
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2">
                  <h2 className="h5 fw-bold mb-0">{entry.degree}</h2>
                  <span className="education-dates">
                    {formatDateRange(entry.startDate, entry.endDate)}
                  </span>
                </div>
                <p className="education-inst mb-0">
                  {entry.institution}
                  {entry.location ? ` · ${entry.location}` : ""}
                </p>
                {entry.grade && (
                  <p className="education-grade mb-0 mt-2">{entry.grade}</p>
                )}
                {entry.description && (
                  <div className="education-body mt-2">
                    <Markdown>{entry.description}</Markdown>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-secondary mt-4">No education entries yet.</p>
      )}
    </main>
  );
}

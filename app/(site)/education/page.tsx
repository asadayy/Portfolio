import type { Metadata } from "next";

import { getEducation } from "@/lib/data";
import { formatDateRange } from "@/lib/format";
import Markdown from "@/components/Markdown";
import "@/styles/education.css";
import "@/styles/timeline.css";

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
        <ol className="timeline list-unstyled mt-4">
          {education.map((entry) => (
            <li className="timeline-item" key={entry._id}>
              <span className="timeline-marker" aria-hidden />
              <article className="card timeline-card">
                <div className="card-body">
                  <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2">
                    <h2 className="h5 fw-bold mb-0">{entry.degree}</h2>
                    <span className="timeline-dates">
                      {formatDateRange(entry.startDate, entry.endDate)}
                    </span>
                  </div>
                  <p className="timeline-org mb-3">
                    {entry.institution}
                    {entry.location ? ` · ${entry.location}` : ""}
                  </p>
                  {entry.description && (
                    <Markdown>{entry.description}</Markdown>
                  )}
                  {entry.grade && (
                    <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0 mt-3">
                      <li>
                        <span className="badge badge-tech">{entry.grade}</span>
                      </li>
                    </ul>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-secondary mt-4">No education entries yet.</p>
      )}
    </main>
  );
}

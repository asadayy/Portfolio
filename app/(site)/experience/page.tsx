import type { Metadata } from "next";

import { getExperiences } from "@/lib/data";
import { formatDateRange } from "@/lib/format";
import Markdown from "@/components/Markdown";
import "@/styles/experience.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Work experience of Asad Khan: full-stack development at NEPRA (Pakistan's national power regulator) and PMAS Arid Agriculture University.",
  openGraph: {
    title: "Experience — Asad Khan",
    description:
      "Work experience of Asad Khan: full-stack development at NEPRA and PMAS Arid Agriculture University.",
    images: ["/og-default.png"],
  },
};

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <main className="container py-5 experience-page">
      <header className="experience-header">
        <span className="eyebrow">Career</span>
        <h1 className="fw-bold">Experience</h1>
        <p className="text-secondary experience-intro">
          Where I&apos;ve worked and what I shipped there.
        </p>
      </header>

      {experiences.length > 0 ? (
        <ol className="timeline list-unstyled mt-4">
          {experiences.map((experience) => (
            <li className="timeline-item" key={experience._id}>
              <span className="timeline-marker" aria-hidden />
              <article className="card timeline-card">
                <div className="card-body">
                  <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2">
                    <h2 className="h5 fw-bold mb-0">{experience.role}</h2>
                    <span className="timeline-dates">
                      {formatDateRange(
                        experience.startDate,
                        experience.endDate
                      )}
                    </span>
                  </div>
                  <p className="timeline-org mb-3">
                    {experience.organization} · {experience.location}
                  </p>
                  <Markdown>{experience.description}</Markdown>
                  {experience.techUsed.length > 0 && (
                    <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0 mt-3">
                      {experience.techUsed.map((tech) => (
                        <li key={tech}>
                          <span className="badge badge-tech">{tech}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-secondary mt-4">No experience entries yet.</p>
      )}
    </main>
  );
}

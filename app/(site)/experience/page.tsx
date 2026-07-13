import type { Metadata } from "next";

import { getExperiences, getEducation, getActivities } from "@/lib/data";
import { formatDateRange } from "@/lib/format";
import Markdown from "@/components/Markdown";
import "@/styles/experience.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Experience, education, and activities of Asad E Bukhari: full-stack development at Ardent Thrive, NEPRA (Pakistan's national power regulator), and PMAS Arid Agriculture University.",
  openGraph: {
    title: "Experience — Asad E Bukhari",
    description:
      "Work experience, education, and leadership activities of Asad E Bukhari.",
    images: ["/og-default.png"],
  },
};

export default async function ExperiencePage() {
  const [experiences, education, activities] = await Promise.all([
    getExperiences(),
    getEducation(),
    getActivities(),
  ]);

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

      {education.length > 0 && (
        <section className="exp-section" aria-labelledby="education-heading">
          <header className="exp-section-head">
            <span className="eyebrow">Education</span>
            <h2 id="education-heading" className="fw-bold h3 mb-0">
              Education
            </h2>
          </header>
          <ol className="timeline list-unstyled mt-4">
            {education.map((entry) => (
              <li className="timeline-item" key={entry._id}>
                <span className="timeline-marker" aria-hidden />
                <article className="card timeline-card">
                  <div className="card-body">
                    <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2">
                      <h3 className="h5 fw-bold mb-0">{entry.degree}</h3>
                      <span className="timeline-dates">
                        {formatDateRange(entry.startDate, entry.endDate)}
                      </span>
                    </div>
                    <p className="timeline-org mb-2">
                      {entry.institution}
                      {entry.location ? ` · ${entry.location}` : ""}
                    </p>
                    {entry.grade && (
                      <p className="edu-grade mb-2">{entry.grade}</p>
                    )}
                    {entry.description && (
                      <Markdown>{entry.description}</Markdown>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </section>
      )}

      {activities.length > 0 && (
        <section className="exp-section" aria-labelledby="activities-heading">
          <header className="exp-section-head">
            <span className="eyebrow">Beyond work</span>
            <h2 id="activities-heading" className="fw-bold h3 mb-0">
              Leadership &amp; Activities
            </h2>
          </header>
          <div className="activities-grid mt-4">
            {activities.map((entry) => (
              <article className="card activity-card" key={entry._id}>
                <div className="card-body">
                  <h3 className="h6 fw-bold activity-title">{entry.title}</h3>
                  <div className="activity-body">
                    <Markdown>{entry.description}</Markdown>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

import type { Metadata } from "next";

import { getActivities } from "@/lib/data";
import Markdown from "@/components/Markdown";
import "@/styles/activities.css";
import "@/styles/timeline.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Activities",
  description:
    "Leadership and extracurricular activities of Asad E Bukhari — athletics, event coordination, and public speaking.",
  openGraph: {
    title: "Activities — Asad E Bukhari",
    description:
      "Leadership and extracurricular activities of Asad E Bukhari — athletics, event coordination, and public speaking.",
    images: ["/og-default.png"],
  },
};

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <main className="container py-5 activities-page">
      <header className="activities-header">
        <span className="eyebrow">Beyond work</span>
        <h1 className="fw-bold">Leadership &amp; Activities</h1>
        <p className="text-secondary activities-intro">
          Sports, event coordination, and public speaking outside of code.
        </p>
      </header>

      {activities.length > 0 ? (
        <ol className="timeline list-unstyled mt-4">
          {activities.map((entry) => (
            <li className="timeline-item" key={entry._id}>
              <span className="timeline-marker" aria-hidden />
              <article className="card timeline-card">
                <div className="card-body">
                  <h2 className="h5 fw-bold mb-2">{entry.title}</h2>
                  <Markdown>{entry.description}</Markdown>
                </div>
              </article>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-secondary mt-4">No activities yet.</p>
      )}
    </main>
  );
}

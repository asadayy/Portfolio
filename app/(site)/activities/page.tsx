import type { Metadata } from "next";

import { getActivities } from "@/lib/data";
import Markdown from "@/components/Markdown";
import "@/styles/activities.css";

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
        <div className="activities-grid">
          {activities.map((entry) => (
            <article className="card activity-card" key={entry._id}>
              <div className="card-body">
                <h2 className="h6 fw-bold activity-title">{entry.title}</h2>
                <div className="activity-body">
                  <Markdown>{entry.description}</Markdown>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-secondary mt-4">No activities yet.</p>
      )}
    </main>
  );
}

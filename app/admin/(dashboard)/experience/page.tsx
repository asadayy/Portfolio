import type { Metadata } from "next";

import { getExperiences } from "@/lib/data";
import ExperienceManager from "@/components/admin/ExperienceManager";

export const metadata: Metadata = {
  title: "Manage experience",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const experiences = await getExperiences();
  return (
    <main className="admin-page">
      <ExperienceManager experiences={experiences} />
    </main>
  );
}

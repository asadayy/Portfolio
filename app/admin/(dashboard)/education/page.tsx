import type { Metadata } from "next";

import { getEducation } from "@/lib/data";
import EducationManager from "@/components/admin/EducationManager";

export const metadata: Metadata = {
  title: "Manage education",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const education = await getEducation();
  return (
    <main className="admin-page">
      <EducationManager education={education} />
    </main>
  );
}

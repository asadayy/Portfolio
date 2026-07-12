import type { Metadata } from "next";

import { getProjects } from "@/lib/data";
import ProjectsManager from "@/components/admin/ProjectsManager";

export const metadata: Metadata = {
  title: "Manage projects",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return (
    <main className="admin-page">
      <ProjectsManager projects={projects} />
    </main>
  );
}

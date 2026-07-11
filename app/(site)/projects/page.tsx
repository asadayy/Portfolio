import type { Metadata } from "next";

import { getProjects } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";
import "@/styles/projects.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Full project archive: AI-integrated platforms, enterprise systems, e-commerce, and NLP tools built by Asad Khan.",
  openGraph: {
    title: "Projects — Asad Khan",
    description:
      "Full project archive: AI-integrated platforms, enterprise systems, e-commerce, and NLP tools built by Asad Khan.",
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="container py-5 projects-page">
      <header className="projects-header">
        <span className="eyebrow">Portfolio</span>
        <h1 className="fw-bold">Projects</h1>
        <p className="text-secondary projects-intro">
          From AI-powered planning tools to enterprise licensing systems — a
          selection of things I&apos;ve designed, built, and shipped.
        </p>
      </header>

      {projects.length > 0 ? (
        <div className="row g-4 mt-1">
          {projects.map((project) => (
            <div className="col-12 col-md-6 col-lg-4" key={project._id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-secondary mt-4">
          No projects published yet — check back soon.
        </p>
      )}
    </main>
  );
}

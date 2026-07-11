import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getProjectBySlug, getProjects } from "@/lib/data";
import Markdown from "@/components/Markdown";
import { ExternalLinkIcon, GitHubIcon } from "@/components/icons";
import "@/styles/project-detail.css";

export const revalidate = 3600;

interface Params {
  params: { slug: string };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) {
    return { title: "Project not found" };
  }
  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} — Asad Khan`,
      description: project.shortDescription,
      type: "article",
      ...(project.imageUrl ? { images: [{ url: project.imageUrl }] } : {}),
    },
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const project = await getProjectBySlug(params.slug);
  if (!project) {
    notFound();
  }

  return (
    <main className="container py-5 project-detail">
      <nav aria-label="Breadcrumb" className="mb-4">
        <Link href="/projects" className="detail-back">
          ← All projects
        </Link>
      </nav>

      <header className="detail-header">
        <h1 className="fw-bold">{project.title}</h1>
        <p className="lead text-secondary detail-lead">
          {project.shortDescription}
        </p>
        <ul className="list-unstyled d-flex flex-wrap gap-2 mt-3 mb-0">
          {project.techStack.map((tech) => (
            <li key={tech}>
              <span className="badge badge-tech">{tech}</span>
            </li>
          ))}
        </ul>
        {(project.liveUrl || project.githubUrl) && (
          <div className="d-flex flex-wrap gap-3 mt-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary d-inline-flex align-items-center gap-2"
              >
                <ExternalLinkIcon size={15} /> Live demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
              >
                <GitHubIcon size={16} /> View code
              </a>
            )}
          </div>
        )}
      </header>

      {project.imageUrl && (
        <div className="detail-image ratio ratio-16x9 my-4">
          <Image
            src={project.imageUrl}
            alt={`${project.title} screenshot`}
            fill
            sizes="(max-width: 991px) 100vw, 860px"
            className="detail-img"
            priority
          />
        </div>
      )}

      <article className="detail-body">
        <Markdown>{project.longDescription}</Markdown>
      </article>
    </main>
  );
}

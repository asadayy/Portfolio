import Link from "next/link";
import Image from "next/image";

import type { ProjectDTO } from "@/lib/serialize";
import { ArrowRightIcon, ExternalLinkIcon, GitHubIcon } from "@/components/icons";
import "@/styles/project-card.css";

const MAX_BADGES = 4;

export default function ProjectCard({ project }: { project: ProjectDTO }) {
  const shownTech = project.techStack.slice(0, MAX_BADGES);
  const extraCount = project.techStack.length - shownTech.length;
  const detailHref = `/projects/${project.slug}`;

  return (
    <article className="card h-100 project-card">
      <Link
        href={detailHref}
        className="project-card-media ratio ratio-16x9"
        aria-hidden
        tabIndex={-1}
      >
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
            className="project-card-img"
          />
        ) : (
          <span className="project-card-placeholder">
            {project.title.charAt(0)}
          </span>
        )}
      </Link>
      <div className="card-body d-flex flex-column">
        <h3 className="h5 card-title mb-2">
          <Link href={detailHref} className="project-card-title-link">
            {project.title}
          </Link>
        </h3>
        <p className="card-text text-secondary flex-grow-1">
          {project.shortDescription}
        </p>
        <ul className="list-unstyled d-flex flex-wrap gap-2 mb-3">
          {shownTech.map((tech) => (
            <li key={tech}>
              <span className="badge badge-tech">{tech}</span>
            </li>
          ))}
          {extraCount > 0 && (
            <li>
              <span className="badge badge-tech">+{extraCount}</span>
            </li>
          )}
        </ul>
        <div className="d-flex align-items-center gap-3 project-card-actions">
          <Link href={detailHref} className="project-card-more">
            Case study <ArrowRightIcon size={14} className="ms-1" />
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card-ext"
              aria-label={`${project.title} live demo`}
            >
              <ExternalLinkIcon size={15} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card-ext"
              aria-label={`${project.title} source code on GitHub`}
            >
              <GitHubIcon size={16} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

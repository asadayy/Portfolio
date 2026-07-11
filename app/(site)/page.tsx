import Link from "next/link";
import type { Metadata } from "next";

import {
  getFeaturedProjects,
  getSiteContent,
  getTechByCategory,
} from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";
import TechGrid from "@/components/TechGrid";
import {
  ArrowRightIcon,
  FileIcon,
  GitHubIcon,
  LinkedInIcon,
} from "@/components/icons";
import "@/styles/home.css";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const description =
    content.hero_subtext ??
    "Portfolio of Asad Khan, full-stack developer building AI-integrated web applications.";
  return {
    title: { absolute: "Asad Khan — Full-Stack Developer" },
    description,
    openGraph: {
      title: "Asad Khan — Full-Stack Developer",
      description,
      type: "website",
    },
  };
}

export default async function HomePage() {
  const [content, featured, techGroups] = await Promise.all([
    getSiteContent(),
    getFeaturedProjects(),
    getTechByCategory(),
  ]);

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" aria-hidden />
        <div className="container position-relative">
          <span className="eyebrow">Hi, I&apos;m Asad Khan</span>
          <h1 className="hero-title display-4 fw-bold">
            {content.hero_headline ?? "Full-Stack Developer"}
          </h1>
          {content.hero_subtext && (
            <p className="hero-subtext lead text-secondary">
              {content.hero_subtext}
            </p>
          )}
          <div className="d-flex flex-wrap gap-3 mt-4">
            {content.resume_url && (
              <a
                href={content.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2"
              >
                <FileIcon size={16} /> Resume
              </a>
            )}
            {content.github_url && (
              <a
                href={content.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-lg d-inline-flex align-items-center gap-2"
              >
                <GitHubIcon size={17} /> GitHub
              </a>
            )}
            {content.linkedin_url && (
              <a
                href={content.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-lg d-inline-flex align-items-center gap-2"
              >
                <LinkedInIcon size={16} /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      {content.about_text && (
        <section className="container home-section" aria-labelledby="about-heading">
          <span className="eyebrow">About</span>
          <h2 id="about-heading" className="section-title">
            A bit about me
          </h2>
          <p className="about-text text-secondary">{content.about_text}</p>
        </section>
      )}

      {/* Featured projects */}
      <section className="container home-section" aria-labelledby="featured-heading">
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-4">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2 id="featured-heading" className="section-title mb-0">
              Featured projects
            </h2>
          </div>
          <Link href="/projects" className="section-link">
            View all projects <ArrowRightIcon size={14} className="ms-1" />
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="row g-4">
            {featured.map((project) => (
              <div className="col-12 col-md-6 col-lg-4" key={project._id}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary">Featured projects coming soon.</p>
        )}
      </section>

      {/* Tech stack */}
      <section className="container home-section" aria-labelledby="tech-heading">
        <span className="eyebrow">Toolbox</span>
        <h2 id="tech-heading" className="section-title">
          Tech I work with
        </h2>
        <TechGrid groups={techGroups} />
      </section>

      {/* CTA */}
      <section className="container home-section pb-5">
        <div className="cta-band text-center">
          <h2 className="h3 fw-bold mb-2">Want the full story?</h2>
          <p className="text-secondary mb-4">
            Browse the complete project archive, or get in touch — I&apos;m open
            to interesting problems.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link href="/projects" className="btn btn-primary">
              Explore projects
            </Link>
            <Link href="/contact" className="btn btn-outline-primary">
              Contact me
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

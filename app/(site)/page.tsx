import Link from "next/link";
import Image from "next/image";
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
  DownloadIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
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
      images: ["/og-default.png"],
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
          <div className="row align-items-center g-5">
            <div className="col-lg-7 hero-copy">
              <span className="eyebrow">Hi, I&apos;m</span>
              <h1 className="hero-title">
                {content.hero_name ?? "Asad Khan"}
              </h1>
              {content.hero_headline && (
                <p className="hero-role">
                  <mark>{content.hero_headline}</mark>
                </p>
              )}
              {content.hero_subtext && (
                <p className="hero-subtext text-secondary">
                  {content.hero_subtext}
                </p>
              )}

              <ul className="hero-socials list-unstyled" aria-label="Social links">
                {content.linkedin_url && (
                  <li>
                    <a
                      href={content.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hero-social"
                      aria-label="LinkedIn"
                    >
                      <LinkedInIcon size={20} />
                    </a>
                  </li>
                )}
                {content.github_url && (
                  <li>
                    <a
                      href={content.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hero-social"
                      aria-label="GitHub"
                    >
                      <GitHubIcon size={20} />
                    </a>
                  </li>
                )}
                {content.contact_email && (
                  <li>
                    <a
                      href={`mailto:${content.contact_email}`}
                      className="hero-social"
                      aria-label="Email"
                    >
                      <MailIcon size={20} />
                    </a>
                  </li>
                )}
              </ul>

              {content.resume_url && (
                <a
                  href={content.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg hero-resume d-inline-flex align-items-center gap-2"
                >
                  <DownloadIcon size={16} /> Download Resume
                </a>
              )}
            </div>

            <div className="col-lg-5 hero-media">
              <div className="hero-portrait">
                <div className="hero-portrait-inner">
                  {content.hero_image ? (
                    <Image
                      src={content.hero_image}
                      alt={content.hero_name ?? "Asad Khan"}
                      fill
                      priority
                      sizes="(max-width: 991px) 80vw, 420px"
                      className="hero-portrait-img"
                    />
                  ) : (
                    <span className="hero-portrait-placeholder" aria-hidden>
                      {(content.hero_name ?? "AK").charAt(0)}
                    </span>
                  )}
                </div>
              </div>
            </div>
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
            {featured.map((project, index) => (
              <div className="col-12 col-md-6 col-lg-4" key={project._id}>
                <ProjectCard project={project} index={index} />
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

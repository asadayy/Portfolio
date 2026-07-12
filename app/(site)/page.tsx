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
    "Portfolio of Asad E Bukhari, full-stack developer building AI-integrated web applications.";
  return {
    title: { absolute: "Asad E Bukhari — Full-Stack Developer" },
    description,
    openGraph: {
      title: "Asad E Bukhari — Full-Stack Developer",
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
        <div className="container">
          <div className="row align-items-center justify-content-center g-4 g-lg-5">
            <div className="col-11 col-sm-8 col-md-6 col-lg-5 hero-photo-col">
              <div className="hero-photo">
                {content.hero_image ? (
                  <Image
                    src={content.hero_image}
                    alt={content.hero_name ?? "Asad E Bukhari"}
                    fill
                    priority
                    sizes="(max-width: 991px) 70vw, 380px"
                    className="hero-photo-img"
                  />
                ) : (
                  <span className="hero-photo-placeholder" aria-hidden>
                    {(content.hero_name ?? "AB").charAt(0)}
                  </span>
                )}
              </div>
            </div>

            <div className="col-12 col-lg-6 hero-copy text-center">
              <span className="hero-eyebrow">Hello, I&apos;m</span>
              <h1 className="hero-title">{content.hero_name ?? "Asad E Bukhari"}</h1>
              {content.hero_headline && (
                <p className="hero-role">{content.hero_headline}</p>
              )}
              {content.hero_subtext && (
                <p className="hero-subtext">{content.hero_subtext}</p>
              )}

              <div className="hero-actions">
                {content.resume_url && (
                  <a
                    href={content.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary hero-btn d-inline-flex align-items-center gap-2"
                  >
                    <DownloadIcon size={15} /> Download CV
                  </a>
                )}
                <Link
                  href="/contact"
                  className="btn btn-primary hero-btn d-inline-flex align-items-center gap-2"
                >
                  <MailIcon size={15} /> Contact Info
                </Link>
              </div>

              <ul
                className="hero-socials list-unstyled"
                aria-label="Social links"
              >
                {content.linkedin_url && (
                  <li>
                    <a
                      href={content.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hero-social"
                      aria-label="LinkedIn"
                    >
                      <LinkedInIcon size={18} />
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
                      <GitHubIcon size={18} />
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
                      <MailIcon size={18} />
                    </a>
                  </li>
                )}
              </ul>
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

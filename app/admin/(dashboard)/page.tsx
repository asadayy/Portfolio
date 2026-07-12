import Link from "next/link";
import type { Metadata } from "next";

import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import TechStackItem from "@/models/TechStackItem";
import SiteContent from "@/models/SiteContent";
import {
  ContentIcon,
  ExperienceIcon,
  ExternalIcon,
  PlusIcon,
  ProjectsIcon,
  TechIcon,
} from "@/components/admin/admin-icons";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await dbConnect();
  const [projects, featured, drafts, experiences, techItems, contentKeys] =
    await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
      Project.countDocuments({ published: false }),
      Experience.countDocuments(),
      TechStackItem.countDocuments(),
      SiteContent.countDocuments(),
    ]);

  const cards = [
    {
      href: "/admin/projects",
      label: "Projects",
      count: projects,
      hint:
        drafts > 0
          ? `${featured} featured · ${drafts} draft${drafts === 1 ? "" : "s"}`
          : `${featured} featured`,
      Icon: ProjectsIcon,
      tone: "indigo",
    },
    {
      href: "/admin/experience",
      label: "Experience",
      count: experiences,
      hint: "timeline entries",
      Icon: ExperienceIcon,
      tone: "cyan",
    },
    {
      href: "/admin/tech",
      label: "Tech stack",
      count: techItems,
      hint: "across 5 categories",
      Icon: TechIcon,
      tone: "violet",
    },
    {
      href: "/admin/content",
      label: "Site content",
      count: contentKeys,
      hint: "editable copy keys",
      Icon: ContentIcon,
      tone: "teal",
    },
  ];

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <span className="admin-eyebrow">Overview</span>
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-lead">
          Everything on the public site is editable from here — changes go live
          immediately.
        </p>
      </header>

      <div className="row g-3 g-lg-4 admin-stats">
        {cards.map(({ href, label, count, hint, Icon, tone }) => (
          <div className="col-12 col-sm-6 col-xl-3" key={href}>
            <Link
              href={href}
              className={`admin-stat-card admin-stat-card--${tone}`}
            >
              <div className="admin-stat-top">
                <span className="admin-stat-icon" aria-hidden>
                  <Icon size={20} />
                </span>
                <span className="admin-stat-arrow" aria-hidden>
                  →
                </span>
              </div>
              <span className="admin-stat-count">{count}</span>
              <span className="admin-stat-label">{label}</span>
              <span className="admin-stat-hint">{hint}</span>
            </Link>
          </div>
        ))}
      </div>

      <section className="admin-quick" aria-labelledby="quick-links">
        <h2 id="quick-links" className="admin-quick-title">
          Quick actions
        </h2>
        <div className="admin-quick-grid">
          <Link href="/admin/projects" className="admin-quick-card">
            <span className="admin-quick-icon" aria-hidden>
              <PlusIcon size={18} />
            </span>
            <span className="admin-quick-meta">
              <span className="admin-quick-label">Add a project</span>
              <span className="admin-quick-sub">
                Create a new case study
              </span>
            </span>
          </Link>
          <Link href="/admin/content" className="admin-quick-card">
            <span className="admin-quick-icon" aria-hidden>
              <ContentIcon size={18} />
            </span>
            <span className="admin-quick-meta">
              <span className="admin-quick-label">Edit homepage copy</span>
              <span className="admin-quick-sub">Hero, about &amp; links</span>
            </span>
          </Link>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-quick-card"
          >
            <span className="admin-quick-icon" aria-hidden>
              <ExternalIcon size={18} />
            </span>
            <span className="admin-quick-meta">
              <span className="admin-quick-label">Open public site</span>
              <span className="admin-quick-sub">See it as visitors do</span>
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}

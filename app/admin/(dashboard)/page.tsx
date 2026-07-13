import Link from "next/link";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Education from "@/models/Education";
import Activity from "@/models/Activity";
import TechStackItem from "@/models/TechStackItem";
import SiteContent from "@/models/SiteContent";
import {
  ActivitiesIcon,
  ContentIcon,
  DashboardIcon,
  EducationIcon,
  ExperienceIcon,
  ExternalIcon,
  PlusIcon,
  ProjectsIcon,
  TechIcon,
  TrendUpIcon,
} from "@/components/admin/admin-icons";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function greeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function AdminDashboardPage() {
  await dbConnect();
  const [
    session,
    projects,
    featured,
    drafts,
    experiences,
    education,
    activities,
    techItems,
    contentKeys,
  ] = await Promise.all([
    getServerSession(authOptions),
    Project.countDocuments(),
    Project.countDocuments({ featured: true }),
    Project.countDocuments({ published: false }),
    Experience.countDocuments(),
    Education.countDocuments(),
    Activity.countDocuments(),
    TechStackItem.countDocuments(),
    SiteContent.countDocuments(),
  ]);

  const now = new Date();
  const today = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

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
      tone: "blue",
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
      href: "/admin/education",
      label: "Education",
      count: education,
      hint: "qualifications",
      Icon: EducationIcon,
      tone: "emerald",
    },
    {
      href: "/admin/activities",
      label: "Activities",
      count: activities,
      hint: "leadership & extracurriculars",
      Icon: ActivitiesIcon,
      tone: "pink",
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
      tone: "amber",
    },
  ];

  return (
    <main className="admin-page">
      <header className="admin-dash-header">
        <span className="admin-dash-header-icon" aria-hidden>
          <DashboardIcon size={26} />
        </span>
        <div>
          <h1 className="admin-page-title mb-1">Dashboard</h1>
          <p className="admin-page-lead mb-0">
            {greeting(now.getHours())},{" "}
            <strong>{session?.user?.name ?? "Admin"}</strong> — {today}
          </p>
        </div>
      </header>

      <div className="row g-3 g-lg-4 admin-stats">
        {cards.map(({ href, label, count, hint, Icon, tone }) => (
          <div className="col-12 col-sm-6 col-xl-3" key={href}>
            <Link
              href={href}
              className={`admin-stat-card admin-stat-card--${tone}`}
            >
              <span className="admin-stat-watermark" aria-hidden>
                <Icon size={116} />
              </span>
              <div className="admin-stat-top">
                <span className="admin-stat-icon" aria-hidden>
                  <Icon size={20} />
                </span>
                <span className="admin-stat-trend" aria-hidden>
                  <TrendUpIcon size={15} />
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
              <span className="admin-quick-sub">Create a new case study</span>
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

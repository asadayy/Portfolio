import Link from "next/link";
import type { Metadata } from "next";

import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import TechStackItem from "@/models/TechStackItem";
import SiteContent from "@/models/SiteContent";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await dbConnect();
  const [projects, featured, experiences, techItems, contentKeys] =
    await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
      Experience.countDocuments(),
      TechStackItem.countDocuments(),
      SiteContent.countDocuments(),
    ]);

  const cards = [
    {
      href: "/admin/projects",
      label: "Projects",
      count: projects,
      hint: `${featured} featured`,
    },
    {
      href: "/admin/experience",
      label: "Experience entries",
      count: experiences,
      hint: "timeline items",
    },
    {
      href: "/admin/tech",
      label: "Tech stack items",
      count: techItems,
      hint: "across 5 categories",
    },
    {
      href: "/admin/content",
      label: "Site content keys",
      count: contentKeys,
      hint: "editable copy",
    },
  ];

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <h1 className="h3 fw-bold mb-1">Dashboard</h1>
        <p className="text-secondary mb-0">
          Everything on the public site is editable from here — changes go
          live immediately.
        </p>
      </header>

      <div className="row g-3 mt-1">
        {cards.map((card) => (
          <div className="col-12 col-sm-6 col-xl-3" key={card.href}>
            <Link href={card.href} className="card admin-stat-card h-100">
              <div className="card-body">
                <p className="admin-stat-count mb-0">{card.count}</p>
                <p className="fw-semibold mb-0">{card.label}</p>
                <p className="small text-secondary mb-0">{card.hint}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <section className="mt-4" aria-labelledby="quick-links">
        <h2 id="quick-links" className="h6 text-uppercase text-secondary">
          Quick links
        </h2>
        <div className="d-flex flex-wrap gap-2">
          <Link href="/admin/projects" className="btn btn-primary btn-sm">
            Add a project
          </Link>
          <Link href="/admin/content" className="btn btn-outline-primary btn-sm">
            Edit homepage copy
          </Link>
          <Link href="/" target="_blank" className="btn btn-outline-primary btn-sm">
            Open public site ↗
          </Link>
        </div>
      </section>
    </main>
  );
}

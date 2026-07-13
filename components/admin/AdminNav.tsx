"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ActivitiesIcon,
  ContentIcon,
  DashboardIcon,
  EducationIcon,
  ExperienceIcon,
  ProjectsIcon,
  TechIcon,
} from "@/components/admin/admin-icons";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true, Icon: DashboardIcon },
  { href: "/admin/projects", label: "Projects", Icon: ProjectsIcon },
  { href: "/admin/experience", label: "Experience", Icon: ExperienceIcon },
  { href: "/admin/education", label: "Education", Icon: EducationIcon },
  { href: "/admin/activities", label: "Activities", Icon: ActivitiesIcon },
  { href: "/admin/tech", label: "Tech stack", Icon: TechIcon },
  { href: "/admin/content", label: "Site content", Icon: ContentIcon },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <ul className="nav flex-md-column admin-nav" aria-label="Admin sections">
      {LINKS.map(({ href, label, exact, Icon }) => {
        const active = exact
          ? pathname === href
          : pathname.startsWith(href);
        return (
          <li className="nav-item" key={href}>
            <Link
              href={href}
              className={`nav-link admin-nav-link${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className="admin-nav-icon" aria-hidden>
                <Icon size={18} />
              </span>
              <span className="admin-nav-label">{label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

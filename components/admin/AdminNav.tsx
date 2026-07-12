"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/tech", label: "Tech stack" },
  { href: "/admin/content", label: "Site content" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <ul className="nav flex-md-column admin-nav" aria-label="Admin sections">
      {LINKS.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <li className="nav-item" key={link.href}>
            <Link
              href={link.href}
              className={`nav-link admin-nav-link${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "@/styles/navbar.css";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className="navbar navbar-expand-md sticky-top site-navbar"
      aria-label="Main navigation"
    >
      <div className="container">
        <Link
          href="/"
          className="navbar-brand fw-bold"
          onClick={() => setOpen(false)}
        >
          Asad E Bukhari<span className="brand-dot">.</span>
        </Link>
        <button
          type="button"
          className="navbar-toggler"
          aria-controls="site-nav"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div
          id="site-nav"
          className={`collapse navbar-collapse${open ? " show" : ""}`}
        >
          <ul className="navbar-nav ms-auto mb-2 mb-md-0">
            {LINKS.map((link) => (
              <li className="nav-item" key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link${isActive(link.href) ? " active" : ""}`}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

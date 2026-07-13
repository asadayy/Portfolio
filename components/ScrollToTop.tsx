"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Forces the viewport to the top on every route change (and initial load).
 * The global `html { scroll-behavior: smooth }` rule breaks the App Router's
 * built-in scroll reset; "instant" bypasses the CSS smoothness so navigation
 * lands at the top immediately. Hash-only jumps (e.g. the hero's #about cue)
 * don't change the pathname, so they keep their smooth scroll.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

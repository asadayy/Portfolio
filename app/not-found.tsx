import Link from "next/link";
import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/styles/not-found.css";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container not-found-page text-center">
        <p className="not-found-code text-gradient" aria-hidden>
          404
        </p>
        <h1 className="h3 fw-bold">This page doesn&apos;t exist</h1>
        <p className="text-secondary mb-4">
          The link may be outdated, or the page may have moved.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link href="/" className="btn btn-primary">
            Back to home
          </Link>
          <Link href="/projects" className="btn btn-outline-primary">
            Browse projects
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

import Link from "next/link";

import { getSiteContent } from "@/lib/data";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import "@/styles/footer.css";

export default async function Footer() {
  const content = await getSiteContent();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer mt-auto">
      <div className="container py-5">
        <div className="row gy-4">
          <div className="col-12 col-md-5">
            <p className="footer-brand fw-bold mb-2">
              Asad Khan<span className="brand-dot">.</span>
            </p>
            <p className="text-secondary mb-0 footer-tagline">
              Full-stack developer building AI-integrated web applications.
            </p>
          </div>
          <div className="col-6 col-md-3">
            <p className="footer-heading">Explore</p>
            <ul className="list-unstyled footer-links">
              <li>
                <Link href="/projects">Projects</Link>
              </li>
              <li>
                <Link href="/experience">Experience</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-4">
            <p className="footer-heading">Connect</p>
            <ul className="list-unstyled footer-links">
              {content.github_url && (
                <li>
                  <a
                    href={content.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitHubIcon size={16} className="me-2" />
                    GitHub
                  </a>
                </li>
              )}
              {content.linkedin_url && (
                <li>
                  <a
                    href={content.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedInIcon size={16} className="me-2" />
                    LinkedIn
                  </a>
                </li>
              )}
              {content.contact_email && (
                <li>
                  <a href={`mailto:${content.contact_email}`}>
                    <MailIcon size={16} className="me-2" />
                    {content.contact_email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="footer-bottom d-flex flex-wrap justify-content-between gap-2 pt-4 mt-4">
          <span className="text-secondary small">
            © {year} Asad Khan. All rights reserved.
          </span>
          <span className="text-secondary small">
            Built with Next.js, Bootstrap &amp; MongoDB
          </span>
        </div>
      </div>
    </footer>
  );
}

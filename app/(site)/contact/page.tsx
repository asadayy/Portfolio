import type { Metadata } from "next";

import { getSiteContent } from "@/lib/data";
import {
  ArrowRightIcon,
  FileIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/icons";
import "@/styles/contact.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Asad Khan — email, GitHub, and LinkedIn. Open to full-stack and AI-integration opportunities.",
  openGraph: {
    title: "Contact — Asad Khan",
    description:
      "Get in touch with Asad Khan — email, GitHub, and LinkedIn.",
  },
};

export default async function ContactPage() {
  const content = await getSiteContent();

  const channels = [
    content.contact_email && {
      href: `mailto:${content.contact_email}`,
      label: "Email",
      value: content.contact_email,
      external: false,
      icon: <MailIcon size={22} />,
    },
    content.github_url && {
      href: content.github_url,
      label: "GitHub",
      value: content.github_url.replace(/^https?:\/\//, ""),
      external: true,
      icon: <GitHubIcon size={22} />,
    },
    content.linkedin_url && {
      href: content.linkedin_url,
      label: "LinkedIn",
      value: content.linkedin_url.replace(/^https?:\/\//, ""),
      external: true,
      icon: <LinkedInIcon size={22} />,
    },
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    value: string;
    external: boolean;
    icon: React.ReactNode;
  }>;

  return (
    <main className="container py-5 contact-page">
      <header className="contact-header">
        <span className="eyebrow">Contact</span>
        <h1 className="fw-bold">Let&apos;s talk</h1>
        <p className="text-secondary contact-intro">
          My inbox is always open — whether it&apos;s a role, a project, or a
          question about something I&apos;ve built. I usually reply within a
          day.
        </p>
      </header>

      <div className="row g-4 mt-1">
        {channels.map((channel) => (
          <div className="col-12 col-md-6 col-lg-4" key={channel.label}>
            <a
              href={channel.href}
              className="card contact-card h-100"
              {...(channel.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <div className="card-body d-flex align-items-center gap-3">
                <span className="contact-icon" aria-hidden>
                  {channel.icon}
                </span>
                <span className="flex-grow-1 contact-text">
                  <span className="contact-label d-block">{channel.label}</span>
                  <span className="contact-value d-block">{channel.value}</span>
                </span>
                <ArrowRightIcon size={16} className="contact-arrow" />
              </div>
            </a>
          </div>
        ))}
      </div>

      {content.resume_url && (
        <div className="contact-resume mt-5">
          <p className="text-secondary mb-2">Prefer a one-pager?</p>
          <a
            href={content.resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
          >
            <FileIcon size={16} /> Download my resume
          </a>
        </div>
      )}
    </main>
  );
}

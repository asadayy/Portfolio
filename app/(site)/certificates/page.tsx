import Image from "next/image";
import type { Metadata } from "next";

import { getCertificates } from "@/lib/data";
import { formatMonthYear } from "@/lib/format";
import { ExternalLinkIcon, FileIcon } from "@/components/icons";
import "@/styles/certificates.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Certificates",
  description:
    "Certifications and credentials earned by Asad E Bukhari, full-stack developer.",
  openGraph: {
    title: "Certificates — Asad E Bukhari",
    description:
      "Certifications and credentials earned by Asad E Bukhari, full-stack developer.",
    images: ["/og-default.png"],
  },
};

function isImageUrl(url: string): boolean {
  return /\.(jpe?g|png|webp|gif)(\?.*)?$/i.test(url);
}

export default async function CertificatesPage() {
  const certificates = await getCertificates();

  return (
    <main className="container py-5 certificates-page">
      <header className="certificates-header">
        <span className="eyebrow">Credentials</span>
        <h1 className="fw-bold">Certificates</h1>
        <p className="text-secondary certificates-intro">
          Certifications and credentials I&apos;ve earned along the way.
        </p>
      </header>

      {certificates.length > 0 ? (
        <div className="row g-4 mt-1">
          {certificates.map((cert) => (
            <div className="col-12 col-md-6 col-lg-4" key={cert._id}>
              <article className="card cert-card h-100">
                {cert.fileUrl && isImageUrl(cert.fileUrl) ? (
                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-media"
                    aria-label={`View ${cert.title} certificate full size`}
                  >
                    <Image
                      src={cert.fileUrl}
                      alt={`${cert.title} certificate`}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                      className="cert-img"
                    />
                  </a>
                ) : (
                  <div
                    className="cert-media cert-media--placeholder"
                    aria-hidden
                  >
                    <FileIcon size={34} />
                  </div>
                )}
                <div className="card-body d-flex flex-column">
                  <h2 className="h6 fw-bold mb-1">{cert.title}</h2>
                  <p className="cert-issuer mb-2">
                    {cert.issuer}
                    {cert.issueDate
                      ? ` · ${formatMonthYear(cert.issueDate)}`
                      : ""}
                  </p>
                  {cert.credentialId && (
                    <p className="cert-id mb-0">ID: {cert.credentialId}</p>
                  )}
                  {(cert.fileUrl || cert.credentialUrl) && (
                    <div className="d-flex flex-wrap gap-3 mt-auto pt-3 cert-links">
                      {cert.fileUrl && !isImageUrl(cert.fileUrl) && (
                        <a
                          href={cert.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cert-link"
                        >
                          <FileIcon size={14} /> View certificate
                        </a>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cert-link"
                        >
                          <ExternalLinkIcon size={14} /> Verify
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-secondary mt-4">No certificates yet.</p>
      )}
    </main>
  );
}

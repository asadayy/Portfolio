"use client";

import { useState } from "react";

import type { CertificateDTO } from "@/lib/serialize";
import type { CertificateInput } from "@/lib/validation";
import FileUploadField from "@/components/admin/FileUploadField";

function toDateInput(iso: string | null | undefined): string {
  return iso ? iso.slice(0, 10) : "";
}

const CERT_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

interface CertificateFormProps {
  initial: CertificateDTO | null;
  busy: boolean;
  onSubmit: (input: CertificateInput) => void;
  onCancel: () => void;
}

export default function CertificateForm({
  initial,
  busy,
  onSubmit,
  onCancel,
}: CertificateFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [issuer, setIssuer] = useState(initial?.issuer ?? "");
  const [issueDate, setIssueDate] = useState(toDateInput(initial?.issueDate));
  const [credentialId, setCredentialId] = useState(
    initial?.credentialId ?? ""
  );
  const [credentialUrl, setCredentialUrl] = useState(
    initial?.credentialUrl ?? ""
  );
  const [fileUrl, setFileUrl] = useState(initial?.fileUrl ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);

  const canSubmit = title.trim() && issuer.trim() && !busy;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      title: title.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate || null,
      credentialId: credentialId.trim(),
      credentialUrl: credentialUrl.trim(),
      fileUrl,
      sortOrder,
    });
  }

  return (
    <form className="admin-editor" onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="cert-title" className="form-label">
            Title *
          </label>
          <input
            id="cert-title"
            type="text"
            className="form-control"
            maxLength={160}
            required
            placeholder="AWS Certified Cloud Practitioner"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="cert-issuer" className="form-label">
            Issuer *
          </label>
          <input
            id="cert-issuer"
            type="text"
            className="form-control"
            maxLength={160}
            required
            placeholder="Amazon Web Services"
            value={issuer}
            onChange={(event) => setIssuer(event.target.value)}
          />
        </div>
        <div className="col-md-4 col-6">
          <label htmlFor="cert-date" className="form-label">
            Issue date
          </label>
          <input
            id="cert-date"
            type="date"
            className="form-control"
            value={issueDate}
            onChange={(event) => setIssueDate(event.target.value)}
          />
        </div>
        <div className="col-md-4 col-6">
          <label htmlFor="cert-credential-id" className="form-label">
            Credential ID
          </label>
          <input
            id="cert-credential-id"
            type="text"
            className="form-control"
            maxLength={120}
            value={credentialId}
            onChange={(event) => setCredentialId(event.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="cert-credential-url" className="form-label">
            Verification URL
          </label>
          <input
            id="cert-credential-url"
            type="url"
            className="form-control"
            placeholder="https://…"
            value={credentialUrl}
            onChange={(event) => setCredentialUrl(event.target.value)}
          />
        </div>
        <div className="col-12">
          <FileUploadField
            id="cert-file"
            label="Certificate file"
            value={fileUrl}
            onChange={setFileUrl}
            allowedTypes={CERT_FILE_TYPES}
            accept="image/jpeg,image/png,image/webp,application/pdf"
            helpText="Certificate image (JPG, PNG, WebP) or PDF — max 4 MB. Images show as a preview on the public page."
          />
        </div>
        <div className="col-md-3 col-6">
          <label htmlFor="cert-sort" className="form-label">
            Sort order
          </label>
          <input
            id="cert-sort"
            type="number"
            className="form-control"
            min={0}
            value={sortOrder}
            onChange={(event) => setSortOrder(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="d-flex gap-2 mt-4">
        <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
          {busy ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden
              />
              Saving…
            </>
          ) : (
            "Save certificate"
          )}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

"use client";

import { useRef, useState } from "react";

const MAX_BYTES = 4 * 1024 * 1024;

interface FileUploadFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Comma-separated MIME allow-list, mirrored on the server. */
  allowedTypes?: string[];
  /** `accept` attribute for the file input. */
  accept?: string;
  helpText?: string;
}

/**
 * Uploads a document (e.g. the resume PDF) to /api/admin/upload and reports
 * back the hosted Cloudinary URL. Unlike ImageUploadField it shows a link to
 * the stored file rather than an image preview. Users can still paste an
 * external URL into the box instead of uploading.
 */
export default function FileUploadField({
  id,
  label,
  value,
  onChange,
  allowedTypes = ["application/pdf"],
  accept = "application/pdf,.pdf",
  helpText = "PDF — max 4 MB.",
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!allowedTypes.includes(file.type)) {
      setError("That file type isn't allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File must be 4 MB or smaller.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const json = await response.json().catch(() => null);
      if (!response.ok) {
        setError(
          (json as { error?: string } | null)?.error ?? "Upload failed."
        );
        return;
      }
      onChange((json as { url: string }).url);
    } catch {
      setError("Upload failed — network error.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      {value && (
        <div className="admin-file-current mb-2">
          <a href={value} target="_blank" rel="noopener noreferrer">
            View current file
          </a>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm ms-3"
            onClick={() => onChange("")}
          >
            Remove
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        className="form-control"
        accept={accept}
        onChange={handleFile}
        disabled={uploading}
        aria-describedby={`${id}-help`}
      />
      <div id={`${id}-help`} className="form-text">
        {helpText}
        {uploading && " Uploading…"}
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}

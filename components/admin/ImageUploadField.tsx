"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ImageUploadFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
}

/**
 * Uploads to /api/admin/upload and reports back the stored public URL.
 * Client-side type/size checks mirror the server's (which stays the
 * authority).
 */
export default function ImageUploadField({
  id,
  label,
  value,
  onChange,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, or WebP images are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be 2 MB or smaller.");
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
        <div className="admin-image-preview mb-2">
          <Image
            src={value}
            alt="Current image"
            width={240}
            height={135}
            className="admin-image-preview-img"
            unoptimized
          />
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
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        disabled={uploading}
        aria-describedby={`${id}-help`}
      />
      <div id={`${id}-help`} className="form-text">
        JPG, PNG, or WebP — max 2 MB.
        {uploading && " Uploading…"}
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import type { MediaItemDTO } from "@/lib/serialize";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB (Cloudinary free image limit)
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB (Cloudinary free video limit)

interface ProjectMediaFieldProps {
  media: MediaItemDTO[];
  /** The banner image URL (imageUrl). Must be an image, never a video. */
  primaryUrl: string;
  onChange: (media: MediaItemDTO[]) => void;
  onPrimaryChange: (url: string) => void;
}

interface SignatureResponse {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
}

/**
 * Uploads project images and videos straight to Cloudinary (signed, so large
 * videos bypass the serverless body limit). Any image can be promoted to the
 * banner shown on project cards; videos never can.
 */
export default function ProjectMediaField({
  media,
  primaryUrl,
  onChange,
  onPrimaryChange,
}: ProjectMediaFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function uploadOne(file: File): Promise<MediaItemDTO> {
    const kind: "image" | "video" = file.type.startsWith("video/")
      ? "video"
      : "image";

    const sigRes = await fetch("/api/admin/upload/signature", {
      method: "POST",
    });
    if (!sigRes.ok) throw new Error("Could not authorize the upload.");
    const sig = (await sigRes.json()) as SignatureResponse;

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sig.apiKey);
    form.append("timestamp", String(sig.timestamp));
    form.append("signature", sig.signature);
    form.append("folder", sig.folder);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/${kind}/upload`,
      { method: "POST", body: form }
    );
    const json = await uploadRes.json().catch(() => null);
    if (!uploadRes.ok || !json?.secure_url) {
      throw new Error(json?.error?.message ?? "Cloudinary upload failed.");
    }
    return {
      type: kind,
      url: json.secure_url,
      publicId: json.public_id,
      // Intrinsic dimensions drive the public gallery's tile aspect ratio.
      width: typeof json.width === "number" ? json.width : undefined,
      height: typeof json.height === "number" ? json.height : undefined,
    };
  }

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (inputRef.current) inputRef.current.value = "";
    if (files.length === 0) return;
    setError(null);

    const valid: File[] = [];
    for (const file of files) {
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      if (!isVideo && !isImage) {
        setError("Only image and video files are allowed.");
        continue;
      }
      const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
      if (file.size > limit) {
        setError(
          `${file.name} is too large (max ${isVideo ? "100 MB" : "10 MB"}).`
        );
        continue;
      }
      valid.push(file);
    }
    if (valid.length === 0) return;

    setUploadingCount((count) => count + valid.length);
    const results: MediaItemDTO[] = [];
    for (const file of valid) {
      try {
        results.push(await uploadOne(file));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        setUploadingCount((count) => count - 1);
      }
    }

    if (results.length === 0) return;
    const next = [...media, ...results];
    onChange(next);

    // If there's no banner yet, promote the first available image.
    if (!primaryUrl) {
      const firstImage = next.find((item) => item.type === "image");
      if (firstImage) onPrimaryChange(firstImage.url);
    }
  }

  function removeAt(index: number) {
    const removed = media[index];
    const next = media.filter((_, i) => i !== index);
    onChange(next);
    if (removed.url === primaryUrl) {
      const fallback = next.find((item) => item.type === "image");
      onPrimaryChange(fallback ? fallback.url : "");
    }
  }

  return (
    <div>
      <label htmlFor="project-media" className="form-label">
        Project media
      </label>

      {media.length > 0 && (
        <div className="admin-media-grid mb-3">
          {media.map((item, index) => {
            const isPrimary = item.type === "image" && item.url === primaryUrl;
            return (
              <div
                key={`${item.url}-${index}`}
                className={`admin-media-item${isPrimary ? " is-primary" : ""}`}
              >
                <div className="admin-media-thumb">
                  {item.type === "image" ? (
                    <Image
                      src={item.url}
                      alt=""
                      width={160}
                      height={100}
                      className="admin-media-img"
                      unoptimized
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="admin-media-video"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  )}
                  <span className="admin-media-type">
                    {item.type === "video" ? "Video" : "Image"}
                  </span>
                  {isPrimary && <span className="admin-media-badge">Banner</span>}
                </div>
                <div className="admin-media-actions">
                  {item.type === "image" &&
                    (isPrimary ? (
                      <span className="admin-media-primary-note">
                        Banner image
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => onPrimaryChange(item.url)}
                      >
                        Set as banner
                      </button>
                    ))}
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeAt(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <input
        ref={inputRef}
        id="project-media"
        type="file"
        className="form-control"
        accept="image/*,video/*"
        multiple
        onChange={handleFiles}
        disabled={uploadingCount > 0}
        aria-describedby="project-media-help"
      />
      <div id="project-media-help" className="form-text">
        Images (max 10 MB) and videos (max 100 MB). Uploaded to Cloudinary. Pick
        any image as the banner shown on project cards.
        {uploadingCount > 0 &&
          ` Uploading ${uploadingCount} file${uploadingCount === 1 ? "" : "s"}…`}
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}

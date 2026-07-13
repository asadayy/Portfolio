import { v2 as cloudinary } from "cloudinary";

/**
 * Media storage abstraction — Cloudinary.
 *
 * Every uploaded asset (project images, hero photo, resume PDF) is streamed
 * to Cloudinary and the hosted `secure_url` is returned and stored in Mongo.
 * This is the ONLY place that talks to the storage provider; swap the body of
 * `saveUpload` if you ever change providers.
 *
 * Requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
 */

let configured = false;

function ensureConfigured(): void {
  if (configured) return;

  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, " +
        "CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in your environment."
    );
  }

  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  configured = true;
}

export type UploadResourceType = "image" | "video" | "raw" | "auto";

export interface SaveUploadOptions {
  /** Cloudinary folder; assets are grouped under here. */
  folder?: string;
  /** How Cloudinary should treat the asset. "auto" lets it decide. */
  resourceType?: UploadResourceType;
  /** Readable id (no extension); a unique suffix is appended. */
  publicId?: string;
}

/**
 * Streams a buffer to Cloudinary and resolves to the delivered HTTPS URL.
 */
export async function saveUpload(
  buffer: Buffer,
  filename: string,
  options: SaveUploadOptions = {}
): Promise<string> {
  ensureConfigured();

  const {
    folder = "portfolio",
    resourceType = "auto",
    publicId = filename.replace(/\.[^.]+$/, ""),
  } = options;

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: publicId,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

/** Cloud name + api key are safe to expose to the browser (not the secret). */
export function getCloudinaryPublicConfig(): {
  cloudName: string;
  apiKey: string;
} {
  ensureConfigured();
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
  };
}

/**
 * Signs a set of upload params so the browser can upload large files (video)
 * directly to Cloudinary without proxying them through our serverless
 * function (which is capped at ~4.5 MB). The secret never leaves the server.
 */
export function signUploadParams(
  params: Record<string, string | number>
): string {
  ensureConfigured();
  return cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
  );
}

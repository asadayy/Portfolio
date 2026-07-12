import { mkdir, writeFile } from "fs/promises";
import path from "path";

/**
 * Image storage abstraction.
 *
 * Local/dev implementation writes to /public/uploads so Next can serve the
 * files directly. Vercel's filesystem is ephemeral and read-only at runtime,
 * so FOR PRODUCTION swap the body of `saveUpload` for Vercel Blob or
 * Cloudinary (return the hosted URL) — this file is the only place that
 * needs to change. See README → "Image storage in production".
 */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function saveUpload(
  buffer: Buffer,
  filename: string
): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/uploads/${filename}`;
}

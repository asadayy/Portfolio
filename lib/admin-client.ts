"use client";

/**
 * Tiny fetch wrapper for admin UI mutations: JSON in/out, normalized
 * `{ ok, data | error }` result, never throws.
 */

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function adminFetch<T = unknown>(
  input: string,
  init: RequestInit = {}
): Promise<ApiResult<T>> {
  const headers = new Headers(init.headers);
  if (init.body && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }
  try {
    const response = await fetch(input, { ...init, headers });
    const json = await response.json().catch(() => null);
    if (!response.ok) {
      const error =
        (json as { error?: string } | null)?.error ??
        `Request failed (${response.status})`;
      return { ok: false, error };
    }
    return { ok: true, data: json as T };
  } catch {
    return { ok: false, error: "Network error — please try again." };
  }
}

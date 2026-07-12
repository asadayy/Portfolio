/**
 * In-memory login rate limiter: 5 failed attempts per key (client IP) locks
 * the key out for 15 minutes. A successful login clears the counter.
 *
 * Serverless caveat: each warm lambda has its own memory, so on Vercel this
 * is best-effort (an attacker spread across cold starts gets extra tries).
 * It still kills naive brute-force loops. For hard guarantees, back this
 * with Upstash Redis or enable Vercel's WAF rate rules — only this file
 * would change.
 */

const MAX_FAILURES = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const MAX_TRACKED_KEYS = 1000;

interface AttemptEntry {
  failures: number;
  lockedUntil: number;
}

declare global {
  // eslint-disable-next-line no-var
  var loginAttempts: Map<string, AttemptEntry> | undefined;
}

const store: Map<string, AttemptEntry> =
  globalThis.loginAttempts ?? new Map();
globalThis.loginAttempts = store;

/** Milliseconds until the key may try again; 0 when not locked. */
export function lockoutRemainingMs(key: string): number {
  const entry = store.get(key);
  if (!entry || entry.lockedUntil === 0) return 0;
  const remaining = entry.lockedUntil - Date.now();
  if (remaining <= 0) {
    store.delete(key); // lock expired — start fresh
    return 0;
  }
  return remaining;
}

export function recordLoginFailure(key: string): void {
  // Cap memory: drop expired/oldest entries if the map grows unbounded.
  if (store.size >= MAX_TRACKED_KEYS) {
    const now = Date.now();
    store.forEach((entry, trackedKey) => {
      if (entry.lockedUntil !== 0 && entry.lockedUntil <= now) {
        store.delete(trackedKey);
      }
    });
    if (store.size >= MAX_TRACKED_KEYS) {
      store.delete(store.keys().next().value as string);
    }
  }

  const entry = store.get(key) ?? { failures: 0, lockedUntil: 0 };
  entry.failures += 1;
  if (entry.failures >= MAX_FAILURES) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
    entry.failures = 0;
  }
  store.set(key, entry);
}

export function clearLoginFailures(key: string): void {
  store.delete(key);
}

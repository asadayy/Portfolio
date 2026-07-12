"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      if (result?.error) {
        // NextAuth returns "CredentialsSignin" for a plain rejection; other
        // strings are messages thrown by authorize (e.g. lockout notice).
        setError(
          result.error === "CredentialsSignin"
            ? "Invalid username or password."
            : result.error
        );
        setSubmitting(false);
        return;
      }
      // Only allow internal redirect targets.
      const target = callbackUrl.startsWith("/") ? callbackUrl : "/admin";
      router.push(target);
      router.refresh();
    } catch {
      setError("Sign in failed. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          className="form-control"
          autoComplete="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="form-control"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={submitting || !username || !password}
      >
        {submitting ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              aria-hidden
            />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}

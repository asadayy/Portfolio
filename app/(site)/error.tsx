"use client";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container py-5 text-center" style={{ minHeight: "50vh" }}>
      <h1 className="h3 fw-bold mt-5">Something went wrong</h1>
      <p className="text-secondary">
        An unexpected error occurred while loading this page.
        {error.digest && (
          <span className="d-block small mt-1">Error ID: {error.digest}</span>
        )}
      </p>
      <button
        type="button"
        className="btn btn-primary mt-2"
        onClick={() => reset()}
      >
        Try again
      </button>
    </main>
  );
}

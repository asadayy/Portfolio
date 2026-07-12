"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="admin-page">
      <div className="alert alert-danger mt-4" role="alert">
        <h1 className="h5 fw-bold">Something went wrong in the admin</h1>
        <p className="mb-1">
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest && <p className="small mb-2">Error ID: {error.digest}</p>}
        <button
          type="button"
          className="btn btn-outline-light btn-sm"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </main>
  );
}

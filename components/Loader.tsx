import "@/styles/loader.css";

/**
 * Branded route-transition loader: the AB monogram inside two counter-
 * rotating rings (echoes the hero portrait's ring motif), with a tracked-out
 * label. Colors come from theme variables, so it adapts to the light public
 * site and the dark admin automatically.
 */
export default function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader-mark" aria-hidden>
        <span className="loader-ring loader-ring--dashed" />
        <span className="loader-ring loader-ring--outer" />
        <span className="loader-initials">AB</span>
      </div>
      <span className="loader-label" aria-hidden>
        {label}
        <span className="loader-dots" />
      </span>
      <span className="visually-hidden">Loading…</span>
    </div>
  );
}

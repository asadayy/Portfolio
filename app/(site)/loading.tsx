export default function SiteLoading() {
  return (
    <main
      className="container d-flex align-items-center justify-content-center"
      style={{ minHeight: "50vh" }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading…</span>
      </div>
    </main>
  );
}

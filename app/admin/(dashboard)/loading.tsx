export default function AdminLoading() {
  return (
    <main
      className="admin-page d-flex align-items-center justify-content-center"
      style={{ minHeight: "40vh" }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading…</span>
      </div>
    </main>
  );
}

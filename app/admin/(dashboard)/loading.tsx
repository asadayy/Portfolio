import Loader from "@/components/Loader";

export default function AdminLoading() {
  return (
    <main className="admin-page loader-screen" style={{ minHeight: "50vh" }}>
      <Loader />
    </main>
  );
}

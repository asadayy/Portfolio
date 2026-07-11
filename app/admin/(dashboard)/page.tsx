import { getServerSession } from "next-auth";
import type { Metadata } from "next";

import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="container py-5">
      <h1 className="h3 fw-bold">Admin dashboard</h1>
      <p className="text-secondary">
        Signed in as <strong>{session?.user?.name}</strong>. Managers arrive in
        Phase 4.
      </p>
    </main>
  );
}

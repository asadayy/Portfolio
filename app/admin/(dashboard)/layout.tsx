import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";
import "@/styles/admin.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <p className="admin-brand fw-bold mb-0">
            Admin<span className="brand-dot">.</span>
          </p>
          <p className="admin-user small text-secondary mb-3">
            {session?.user?.name}
          </p>
          <AdminNav />
        </div>
        <div className="admin-sidebar-bottom">
          <Link
            href="/"
            className="btn btn-outline-primary btn-sm w-100 mb-2"
            target="_blank"
          >
            View site ↗
          </Link>
          <LogoutButton />
        </div>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}

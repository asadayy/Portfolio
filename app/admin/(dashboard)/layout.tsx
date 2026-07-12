import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";
import { ExternalIcon } from "@/components/admin/admin-icons";
import "@/styles/admin.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const name = session?.user?.name ?? "admin";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="admin-shell" data-bs-theme="dark">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <Link href="/admin" className="admin-brand">
            <span className="admin-brand-mark" aria-hidden>
              AB
            </span>
            <span className="admin-brand-text">
              <span className="admin-brand-title">Studio</span>
              <span className="admin-brand-sub">Content admin</span>
            </span>
          </Link>

          <div className="admin-user">
            <span className="admin-user-avatar" aria-hidden>
              {initial}
            </span>
            <span className="admin-user-meta">
              <span className="admin-user-name">{name}</span>
              <span className="admin-user-role">Signed in</span>
            </span>
          </div>

          <AdminNav />
        </div>

        <div className="admin-sidebar-bottom">
          <Link
            href="/"
            className="admin-side-action"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalIcon size={16} />
            <span>View live site</span>
          </Link>
          <LogoutButton />
        </div>
      </aside>
      <div className="admin-main">
        <div className="admin-main-inner">{children}</div>
      </div>
    </div>
  );
}

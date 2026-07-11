import { Suspense } from "react";
import type { Metadata } from "next";

import LoginForm from "@/components/admin/LoginForm";
import "@/styles/admin-login.css";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="admin-login-page">
      <div className="admin-login-card card">
        <div className="card-body p-4 p-md-5">
          <p className="eyebrow mb-1">Asad Khan — Portfolio</p>
          <h1 className="h4 fw-bold mb-4">Admin sign in</h1>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

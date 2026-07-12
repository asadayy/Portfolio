"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LogoutButton() {
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      className="btn btn-outline-secondary btn-sm w-100"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        signOut({ callbackUrl: "/admin/login" });
      }}
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

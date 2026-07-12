"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

import { LogoutIcon } from "@/components/admin/admin-icons";

export default function LogoutButton() {
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      className="admin-side-action admin-side-action--logout"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        signOut({ callbackUrl: "/admin/login" });
      }}
    >
      <LogoutIcon size={16} />
      <span>{busy ? "Signing out…" : "Sign out"}</span>
    </button>
  );
}

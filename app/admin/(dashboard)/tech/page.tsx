import type { Metadata } from "next";

import { getTechItems } from "@/lib/data";
import TechManager from "@/components/admin/TechManager";

export const metadata: Metadata = {
  title: "Manage tech stack",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminTechPage() {
  const items = await getTechItems();
  return (
    <main className="admin-page">
      <TechManager items={items} />
    </main>
  );
}

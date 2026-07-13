import type { Metadata } from "next";

import { getActivities } from "@/lib/data";
import ActivityManager from "@/components/admin/ActivityManager";

export const metadata: Metadata = {
  title: "Manage activities",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage() {
  const activities = await getActivities();
  return (
    <main className="admin-page">
      <ActivityManager activities={activities} />
    </main>
  );
}

import type { Metadata } from "next";

import { getSiteContentDocs } from "@/lib/data";
import ContentEditor from "@/components/admin/ContentEditor";

export const metadata: Metadata = {
  title: "Edit site content",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const docs = await getSiteContentDocs();
  return (
    <main className="admin-page">
      <ContentEditor
        items={docs.map((doc) => ({ key: doc.key, value: doc.value }))}
      />
    </main>
  );
}

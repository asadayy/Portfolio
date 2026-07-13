import type { Metadata } from "next";

import { getCertificates } from "@/lib/data";
import CertificateManager from "@/components/admin/CertificateManager";

export const metadata: Metadata = {
  title: "Manage certificates",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const certificates = await getCertificates();
  return (
    <main className="admin-page">
      <CertificateManager certificates={certificates} />
    </main>
  );
}

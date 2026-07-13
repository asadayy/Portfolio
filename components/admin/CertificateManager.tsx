"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { CertificateDTO } from "@/lib/serialize";
import type { CertificateInput } from "@/lib/validation";
import { adminFetch } from "@/lib/admin-client";
import { formatMonthYear } from "@/lib/format";
import CertificateForm from "@/components/admin/CertificateForm";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Toast, { type ToastMessage } from "@/components/admin/Toast";
import { useDragReorder } from "@/components/admin/useDragReorder";
import { PlusIcon } from "@/components/admin/admin-icons";

export default function CertificateManager({
  certificates,
}: {
  certificates: CertificateDTO[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<CertificateDTO | "new" | null>(null);
  const [deleting, setDeleting] = useState<CertificateDTO | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { list, rowProps } = useDragReorder(
    certificates,
    "certificates",
    setToast
  );

  async function handleSave(input: CertificateInput) {
    setBusy(true);
    const isNew = editing === "new";
    const result = isNew
      ? await adminFetch("/api/admin/certificates", {
          method: "POST",
          body: JSON.stringify(input),
        })
      : await adminFetch(
          `/api/admin/certificates/${(editing as CertificateDTO)._id}`,
          { method: "PUT", body: JSON.stringify(input) }
        );
    setBusy(false);
    if (!result.ok) {
      setToast({ type: "danger", text: result.error });
      return;
    }
    setToast({
      type: "success",
      text: isNew ? "Certificate created." : "Certificate updated.",
    });
    setEditing(null);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleting) return;
    setBusy(true);
    const result = await adminFetch(
      `/api/admin/certificates/${deleting._id}`,
      { method: "DELETE" }
    );
    setBusy(false);
    if (!result.ok) {
      setToast({ type: "danger", text: result.error });
      return;
    }
    setToast({ type: "success", text: "Certificate deleted." });
    setDeleting(null);
    router.refresh();
  }

  if (editing) {
    return (
      <>
        <header className="admin-page-header">
          <span className="admin-eyebrow">Certificates</span>
          <h1 className="admin-page-title">
            {editing === "new"
              ? "Add certificate"
              : `Edit: ${editing.title}`}
          </h1>
        </header>
        <CertificateForm
          initial={editing === "new" ? null : editing}
          busy={busy}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
        />
        <Toast message={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  return (
    <>
      <header className="admin-page-header with-action">
        <div>
          <span className="admin-eyebrow">Content</span>
          <h1 className="admin-page-title">Certificates</h1>
          <p className="admin-page-lead">
            {certificates.length} certificate
            {certificates.length === 1 ? "" : "s"} — drag rows to reorder the
            /certificates page.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary d-inline-flex align-items-center gap-2"
          onClick={() => setEditing("new")}
        >
          <PlusIcon size={16} /> Add certificate
        </button>
      </header>

      <div className="admin-table-wrap">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col" aria-label="Drag to reorder" />
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Issuer</th>
              <th scope="col">Issued</th>
              <th scope="col">File</th>
              <th scope="col" className="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((cert, index) => (
              <tr key={cert._id} {...rowProps(index)}>
                <td className="drag-handle" title="Drag to reorder">
                  ⠿
                </td>
                <td>{index + 1}</td>
                <td className="fw-semibold">{cert.title}</td>
                <td>{cert.issuer}</td>
                <td className="text-secondary">
                  {cert.issueDate ? formatMonthYear(cert.issueDate) : "—"}
                </td>
                <td>
                  {cert.fileUrl ? (
                    <a
                      href={cert.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-secondary">—</span>
                  )}
                </td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => setEditing(cert)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => setDeleting(cert)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-secondary py-4">
                  No certificates yet — add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        show={deleting !== null}
        title="Delete certificate?"
        body={`"${deleting?.title}" will be removed permanently. This cannot be undone.`}
        busy={busy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </>
  );
}

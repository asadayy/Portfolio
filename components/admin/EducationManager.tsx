"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { EducationDTO } from "@/lib/serialize";
import type { EducationInput } from "@/lib/validation";
import { adminFetch } from "@/lib/admin-client";
import { formatDateRange } from "@/lib/format";
import EducationForm from "@/components/admin/EducationForm";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Toast, { type ToastMessage } from "@/components/admin/Toast";
import { useDragReorder } from "@/components/admin/useDragReorder";
import { PlusIcon } from "@/components/admin/admin-icons";

export default function EducationManager({
  education,
}: {
  education: EducationDTO[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<EducationDTO | "new" | null>(null);
  const [deleting, setDeleting] = useState<EducationDTO | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { list, rowProps } = useDragReorder(education, "education", setToast);

  async function handleSave(input: EducationInput) {
    setBusy(true);
    const isNew = editing === "new";
    const result = isNew
      ? await adminFetch("/api/admin/education", {
          method: "POST",
          body: JSON.stringify(input),
        })
      : await adminFetch(
          `/api/admin/education/${(editing as EducationDTO)._id}`,
          { method: "PUT", body: JSON.stringify(input) }
        );
    setBusy(false);
    if (!result.ok) {
      setToast({ type: "danger", text: result.error });
      return;
    }
    setToast({
      type: "success",
      text: isNew ? "Education entry created." : "Education entry updated.",
    });
    setEditing(null);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleting) return;
    setBusy(true);
    const result = await adminFetch(`/api/admin/education/${deleting._id}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (!result.ok) {
      setToast({ type: "danger", text: result.error });
      return;
    }
    setToast({ type: "success", text: "Education entry deleted." });
    setDeleting(null);
    router.refresh();
  }

  if (editing) {
    return (
      <>
        <header className="admin-page-header">
          <span className="admin-eyebrow">Education</span>
          <h1 className="admin-page-title">
            {editing === "new"
              ? "Add education"
              : `Edit: ${editing.degree}`}
          </h1>
        </header>
        <EducationForm
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
          <h1 className="admin-page-title">Education</h1>
          <p className="admin-page-lead">
            {education.length} entr{education.length === 1 ? "y" : "ies"} — drag
            rows to reorder the Education section.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary d-inline-flex align-items-center gap-2"
          onClick={() => setEditing("new")}
        >
          <PlusIcon size={16} /> Add education
        </button>
      </header>

      <div className="admin-table-wrap">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col" aria-label="Drag to reorder" />
              <th scope="col">#</th>
              <th scope="col">Degree</th>
              <th scope="col">Institution</th>
              <th scope="col">Period</th>
              <th scope="col" className="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((entry, index) => (
              <tr key={entry._id} {...rowProps(index)}>
                <td className="drag-handle" title="Drag to reorder">
                  ⠿
                </td>
                <td>{index + 1}</td>
                <td className="fw-semibold">{entry.degree}</td>
                <td>{entry.institution}</td>
                <td className="text-secondary">
                  {formatDateRange(entry.startDate, entry.endDate)}
                </td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => setEditing(entry)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => setDeleting(entry)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-secondary py-4">
                  No education entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        show={deleting !== null}
        title="Delete education entry?"
        body={`"${deleting?.degree}" will be removed permanently. This cannot be undone.`}
        busy={busy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </>
  );
}

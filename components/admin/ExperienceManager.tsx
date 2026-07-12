"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ExperienceDTO } from "@/lib/serialize";
import type { ExperienceInput } from "@/lib/validation";
import { adminFetch } from "@/lib/admin-client";
import { formatDateRange } from "@/lib/format";
import ExperienceForm from "@/components/admin/ExperienceForm";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Toast, { type ToastMessage } from "@/components/admin/Toast";
import { useDragReorder } from "@/components/admin/useDragReorder";
import { PlusIcon } from "@/components/admin/admin-icons";

export default function ExperienceManager({
  experiences,
}: {
  experiences: ExperienceDTO[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<ExperienceDTO | "new" | null>(null);
  const [deleting, setDeleting] = useState<ExperienceDTO | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { list, rowProps } = useDragReorder(experiences, "experience", setToast);

  async function handleSave(input: ExperienceInput) {
    setBusy(true);
    const isNew = editing === "new";
    const result = isNew
      ? await adminFetch("/api/admin/experience", {
          method: "POST",
          body: JSON.stringify(input),
        })
      : await adminFetch(
          `/api/admin/experience/${(editing as ExperienceDTO)._id}`,
          { method: "PUT", body: JSON.stringify(input) }
        );
    setBusy(false);
    if (!result.ok) {
      setToast({ type: "danger", text: result.error });
      return;
    }
    setToast({
      type: "success",
      text: isNew ? "Experience entry created." : "Experience entry updated.",
    });
    setEditing(null);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleting) return;
    setBusy(true);
    const result = await adminFetch(`/api/admin/experience/${deleting._id}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (!result.ok) {
      setToast({ type: "danger", text: result.error });
      return;
    }
    setToast({ type: "success", text: "Experience entry deleted." });
    setDeleting(null);
    router.refresh();
  }

  if (editing) {
    return (
      <>
        <header className="admin-page-header">
          <span className="admin-eyebrow">Experience</span>
          <h1 className="admin-page-title">
            {editing === "new"
              ? "Add experience"
              : `Edit: ${editing.role} — ${editing.organization}`}
          </h1>
        </header>
        <ExperienceForm
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
          <h1 className="admin-page-title">Experience</h1>
          <p className="admin-page-lead">
            {experiences.length} entr{experiences.length === 1 ? "y" : "ies"} —
            drag rows to reorder the /experience timeline.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary d-inline-flex align-items-center gap-2"
          onClick={() => setEditing("new")}
        >
          <PlusIcon size={16} /> Add experience
        </button>
      </header>

      <div className="admin-table-wrap">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col" aria-label="Drag to reorder" />
              <th scope="col">#</th>
              <th scope="col">Role</th>
              <th scope="col">Organization</th>
              <th scope="col">Period</th>
              <th scope="col" className="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((experience, index) => (
              <tr key={experience._id} {...rowProps(index)}>
                <td className="drag-handle" title="Drag to reorder">
                  ⠿
                </td>
                <td>{index + 1}</td>
                <td className="fw-semibold">{experience.role}</td>
                <td>{experience.organization}</td>
                <td className="text-secondary">
                  {formatDateRange(experience.startDate, experience.endDate)}
                </td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => setEditing(experience)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => setDeleting(experience)}
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
                  No experience entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        show={deleting !== null}
        title="Delete experience entry?"
        body={`"${deleting?.role} — ${deleting?.organization}" will be removed permanently. This cannot be undone.`}
        busy={busy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </>
  );
}

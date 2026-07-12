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
          <h1 className="h3 fw-bold mb-0">
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
      <header className="admin-page-header d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <h1 className="h3 fw-bold mb-1">Experience</h1>
          <p className="text-secondary mb-0">
            {experiences.length} entr{experiences.length === 1 ? "y" : "ies"} on
            the /experience timeline.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setEditing("new")}
        >
          + Add experience
        </button>
      </header>

      <div className="admin-table-wrap">
        <table className="table table-hover">
          <thead>
            <tr>
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
            {experiences.map((experience) => (
              <tr key={experience._id}>
                <td>{experience.sortOrder}</td>
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
            {experiences.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-secondary py-4">
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
